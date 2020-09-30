<template>
  <div v-editable="story.content" class="blog">
    <div
      class="back-btn"
      @click="toParentsCorner"
    >
      <v-img
        :src="require('@/assets/svg/chevron-left.svg')"
        max-width="38px"
      />
      <span class="orange-text">Back</span>
    </div>
    <div
      ref="title"
      class="blog__title"
    >
      <div
        v-for="line in title"
        :key="line"
        class="blog__title__line pg-text--underlined"
      >
        {{ line }}
      </div>
    </div>
    <!-- Image -->
    <div
      v-if="story.content.image"
      class="blog__main-image pg-image--cover"
    >
      <img :src="story.content.image">
      <div class="blog__icons--vertical">
        <a
          v-for="media in shareLinks"
          :key="media.media"
          :href="media.link"
        >
          <img
            class="pg-image--cover"
            :src="require('@/assets/svg/social-media/' + media.imageSrc)"
          >
        </a>
      </div>
    </div>
    <!-- Body -->
    <div class="blog__body" v-html="body" />
    <!-- Share -->
    <div class="blog__share">
      <div>
        SHARE
      </div>
      <div class="blog__icons">
        <a
          v-for="media in shareLinks"
          :key="media.media"
          :href="media.link"
        >
          <img :src="require('@/assets/svg/social-media/' + media.imageSrc)">
        </a>
      </div>
    </div>

    <cms-section-title
      title="You might also like"
    />
    <generic-carousel>
      <squared-card
        v-for="(forum, idx) in forumList"
        :key="idx"
        :title="forum.title"
        :link="forum.link"
        :image="forum.image"
      />
    </generic-carousel>
  </div>
</template>

<script>
import TextHandler from '@/utils/textHandlers'

export default {
  // eslint-disable-next-line vue/match-component-file-name
  name: 'Slug',

  asyncData (context) {
    // Load the JSON from the API
    const version = context.query._storyblok || context.isDev ? 'draft' : 'published'

    return context.app.$storyapi.get(`cdn/stories/app/parent-corner/forum/${context.params.slug}`, {
      version,
      cv: context.store.state.cacheVersion
    }).then((res) => {
      return res.data
    }).catch((res) => {
      context.error({ statusCode: res.response.status, message: res.response.data })
    })
  },

  data () {
    return {
      story: { content: { body: '' } },
      title: [],
      listenerFn: null,
      shareLinks: [],
      /* Forum  */
      forumList: []
    }
  },

  computed: {
    body () {
      return this.$storyapi.richTextResolver.render(this.story.content.body)
    }
  },

  mounted () {
    this.fetchForumStories()
    this.generateShareLinks()

    // Use the bridge to listen to events
    this.$storybridge.on(['input', 'published', 'change'], (event) => {
      if (event.action === 'input') {
        if (event.story.id === this.story.id) {
          this.story.content = event.story.content
        }
      } else {
        this.$nuxt.$router.go({
          path: this.$nuxt.$router.currentRoute,
          force: true
        })
      }
    })

    const assignTitle = () => {
      this.$nextTick(() => {
        this.title = TextHandler.breakTextIntoLines(this.$refs.title, this.story.content.title)
      })
    }

    assignTitle()
    this.listenerFn = assignTitle
    window.addEventListener('resize', assignTitle)
  },

  destroyed () {
    window.removeEventListener('resize', this.listenerFn)
  },

  methods: {
    generateShareLinks () {
      const mediaList = [
        'facebook',
        'linkedin',
        'twitter'
      ]

      this.shareLinks = mediaList.map((media) => {
        const linkData = {
          facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
          linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${this.story.content.title}&summary=&source=`,
          twitter: `https://twitter.com/intent/tweet?text=${this.story.content.title}%0A${encodeURIComponent(window.location.href)}`
        }

        return {
          media,
          link: linkData[media],
          imageSrc: `${media}.svg`
        }
      })
    },
    toParentsCorner () {
      this.$router.push('/app/parent-corner')
    },
    async fetchForumStories () {
      const version = this.$storyapi.isDev ? 'draft' : 'published'

      const res = await this.$storyapi.get('cdn/stories/', {
        version,
        starts_with: 'app/parent-corner/forum'
      })

      this.forumList = res.data.stories.map(story => ({
        id: story.id,
        title: story.content.title,
        link: `/${story.full_slug}`,
        image: story.content.image
      }))
    }
  }

}
</script>

<style lang="scss">

$title-font-size: 50px;

.blog {
  @include parent-stack-context;
  padding: 0 20px;
  width: 100%;

  .blog__main-image {
    position: relative;
    height: 550px;
    margin-bottom: 40px;
  }
}

.blog__title {
  margin: 0 auto;
  max-width: 800px;
  color: var(--v-black-base);
  font-weight: bold;
  text-align: center;
  position: relative;
  font-size: $title-font-size;
}

.blog__title__line {
  display: inline-block;
  white-space: nowrap;
  position: relative;
  font-size: $title-font-size;
}

.blog__body {
  max-width: 800px;
  line-height: 1.6;
  color: var(--v-black-base);
  font-size: 19px;
  padding-left: 80px;

  img {
    width: 100%;

    &:not(.blog__main-image) {
      margin: 20px 0;
    }
  }
}

.blog__share {
  color: var(--v-black-base);
  letter-spacing: 3px;
  padding-left: 80px;
  font-size: 24px;
  text-transform: uppercase;
}

$icon-size: 60px;

.blog__icons {
  img {
    @include rounded-element($icon-size);
    cursor: pointer;
    padding: 0 7px;
  }
}

.blog__icons--vertical {
  display: flex;
  flex-flow: column nowrap;
  position: absolute;
  left: calc(100% + 10px);
  bottom: 10%;

  img {
    @include rounded-element(35px);
  }
}

.back-btn {
  display: flex;
  cursor: pointer;
  align-items: center;
  font-size: 20px;
}

.orange-text {
  color: var(--v-accent-base);
}

$mobile-image-height: 300px;

@media (max-width: 1250px) {
  .blog__icons--vertical {
    display: none;
  }

  .blog {
    .blog__main-image {
      height: $mobile-image-height;
    }
  }
}

@media (max-width: 800px) {
  .blog__title {
    margin-bottom: 20px;
    line-height: 1;
  }

  .blog__title__line {
    font-size: 34px;
    line-height: 0.6;

    &::after {
      bottom: -10px;
    }
  }

  .blog__body {
    max-width: initial;
    font-size: 16px;
    padding-left: 0;

    img {
      height: $mobile-image-height;
      object-fit: cover;
    }
  }

  .blog__share {
    padding-left: 0;
  }
}

</style>
