<template>
  <div
    v-editable="blok"
    class="forum"
  >
    <!-- Header -->
    <div class="forum__header">
      <div class="pg-title--uppercase">
        {{ blok.title }}
      </div>
      <div class="forum__search-bar-container">
        <input
          ref="searchInput"
          placeholder="Search"
          type="text"
          class="forum__search-bar"
          @input="debouncedSearch"
        >
        <div
          :class="{'forum__search-bar--x': searchTerm !== ''}"
          class="forum__search-bar__loupe"
          @click="clearSearch"
        />
      </div>
    </div>
    <!-- Forum list container -->
    <div class="forum__list-container">
      <squared-card
        v-for="forum in showForumList"
        :key="forum.id"
        class="forum__card"
        :title="forum.title"
        :link="forum.link"
      />
    </div>

    <div class="text-center">
      <v-btn
        v-show="showLoadMore"
        width="400px"
        color="primary"
        @click="loadMore"
      >
        Load more
      </v-btn>
    </div>
  </div>
</template>

<script>
import { debounce, chain } from 'lodash'

const DEFAULT_SHOW = 6

export default {
  name: 'CmsForumList',

  props: {
    blok: {
      type: Object,
      default: () => ({})
    }
  },

  data () {
    return {
      searchTerm: '',
      forumList: [],
      currentShowing: DEFAULT_SHOW,
      itemsToLoad: 3,
      totalResults: 0,
      debouncedSearch: null
    }
  },

  computed: {
    showForumList () {
      return chain(this.forumList)
        .filter(forum => forum.title.toLowerCase().includes(this.searchTerm.toLowerCase()))
        .tap((arr) => {
          this.totalResults = arr.length
          this.currentShowing = DEFAULT_SHOW
        })
        .slice(0, this.currentShowing)
        .value()
    },
    showLoadMore () {
      return this.showForumList.length < this.totalResults
    }
  },

  created () {
    this.debouncedSearch = debounce((input) => {
      this.searchTerm = input.target.value
    }, 300)
  },

  async beforeMount () {
    const version = this.$storyapi.isDev ? 'draft' : 'published'

    const res = await this.$storyapi.get('cdn/stories/', {
      version,
      starts_with: 'app/parent-corner/forum'
    })

    this.forumList = res.data.stories.map(story => ({
      id: story.id,
      title: story.content.title,
      link: `/${story.full_slug}`
    }))

    this.currentShowing = parseInt(this.blok.itemsCount)
    this.itemsToLoad = this.blok.itemsToLoad || this.itemsToLoad
  },

  methods: {
    loadMore () {
      this.currentShowing += this.itemsToLoad
    },
    clearSearch () {
      const { searchInput } = this.$refs

      searchInput.value = ''
      this.searchTerm = ''
    }
  }
}
</script>

<style lang="scss" scoped>

.forum__header {
  margin: 30px 0;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
}

.forum__search-bar-container {
  position: relative;
  max-width: 380px;
  flex: 1 0 380px;
}

.forum__search-bar {
  padding: 15px 30px;
  border-radius: 3px;
  box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.16);
  background: white;
  color: var(--v-black-base);
  font-weight: 500;
  width: 100%;

  &::placeholder {
    font-size: 20px;
    color: #606060;
    opacity: 0.37;
  }
}

.forum__search-bar__loupe {
  @include squared-element(23px);
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  background-image: url('../../../assets/png/loupe.png');
  background-position: center center;
  background-size: cover;
}

.forum__search-bar--x {
  background-image: url('../../../assets/svg/x-mark.svg');
  filter: brightness(10%);
  cursor: pointer;
}

.forum__list-container {
  margin: 40px 0;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
}

.forum__card {
  margin-bottom: 20px;
}

</style>
