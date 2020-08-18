<template>
  <v-col
    cols="12"
    sm="6"
    md="3"
  >
    <v-hover v-slot:default="{ hover }">
      <v-card
        :class="['activity-card', { 'scaled': hover }]"
        :elevation="(hover) ? 12 : 2"
      >
        <v-img
          class="clickable"
          :src="thumbnail"
          max-width="100%"
          :aspect-ratio="16/9"
          @click.stop="playVideo"
        >
          <v-container fill-height fluid>
            <v-row align="center" justify="center">
              <div
                v-if="hover"
                class="play-icon accent rounded-circle d-flex align-center justify-center"
              >
                <img
                  src="@/assets/svg/play-button.svg"
                  class="ml-1"
                  width="50%"
                >
              </div>
            </v-row>
          </v-container>
        </v-img>

        <v-card-actions>
          <img
            :src="icon"
            height="48px"
          >
          <div class="ml-2">
            <span>
              {{ categoryName }}
            </span>
            <br>
            <span class="font-weight-bold">
              {{ activity.name }}
            </span>
          </div>

          <v-spacer />

          <v-btn
            icon
            :loading="loading"
            @click.stop="setFavorite"
          >
            <v-icon color="#F5737F">
              <template v-if="favorite">
                mdi-heart
              </template>
              <template v-else>
                mdi-heart-outline
              </template>
            </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-hover>
  </v-col>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ActivityCard',

  props: {
    activityId: {
      type: Number,
      required: true
    },
    activity: {
      type: Object,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    categoryName: {
      type: String,
      required: true
    }
  },

  data: () => {
    return {
      loading: false,
      favorite: false,
      favoriteIds: []
    }
  },

  computed: {
    ...mapGetters({
      childrenData: 'getCurrentChild'
    }),

    children () {
      return (Array.isArray(this.childrenData)) ? this.childrenData : [this.childrenData]
    },

    thumbnail () {
      return this.activity.thumbnail || require('@/assets/jpg/abacus_counting_lesson.jpg')
    }
  },

  created () {
    this.loading = true
    const stack = []

    this.children.forEach(({ id }) => {
      stack.push(
        this.getFavorites({
          childrenId: id,
          params: {
            videoId: this.activity.id
          }
        }).then((data) => {
          if (data.length) {
            data.forEach((row) => {
              this.favoriteIds.push(row.id)
            })
            this.favorite = true
          }
        })
      )
    })

    Promise.all(stack).then(() => {
      this.loading = false
    })
  },

  methods: {
    ...mapActions('video', ['getFavorites', 'addFavorite', 'deleteFavorite']),

    playVideo () {
      this.$nuxt.$emit('play-activity', {
        title: this.activity.name,
        playlist: [
          {
            file: this.activity.videoUrl.HLS,
            image: this.thumbnail,
            activityId: this.activityId
          }
        ]
      })
    },

    setFavorite () {
      this.loading = true
      const stack = []

      if (this.favorite === false) {
        this.children.forEach(({ id }) => {
          stack.push(
            this.addFavorite({
              childrenId: id,
              videoId: this.activity.id
            }).then((data) => {
              this.favoriteIds.push(data.id)
            })
          )
        })
      } else {
        this.favoriteIds.forEach((id) => {
          stack.push(
            this.deleteFavorite(id)
          )
        })
        this.favoriteIds = []
      }

      Promise.all(stack).then(() => {
        this.favorite = !this.favorite
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.activity-card {
  transition: transform 250ms;
}

.scaled {
  transform: scale(1.25);
  z-index: 1;
}

.play-icon {
  width: 75px;
  height: 75px;
}
</style>
