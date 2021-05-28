<template>
  <div class="letter-song-wrapper">
    <div class="letter-song-title-border" :class="{ vowel: isVowel }" />
    <div class="letter-song-title">
      <v-row no-gutters justify="center" align="center">
        <span class="letter-text">LETTER</span>
        <carousel-letter
          :name="letter.name"
          :picture="letter.picture"
          :scales-on-hover="false"
          :clickable="false"
        />
      </v-row>
    </div>
    <v-row no-gutters justify="center" justify-md="start">
      <v-col
        v-for="(song, index) in songs"
        :key="song.id"
        cols="auto"
      >
        <v-card :id="`song-card-${song.id}`" class="song-card ma-6 pb-4">
          <div class="song-wrapper">
            <v-icon
              size="120"
              class="play-btn"
              color="white"
              @click.stop="createPlayListFromIndex(index)"
            >
              mdi-play-circle-outline
            </v-icon>
            <figure class="song-image" :style="{ 'background-image': `url(${song.thumbnail})` }" />
            <v-icon
              class="favorite-btn"
              size="28"
              data-test-id="letter-song-favorite-button"
              :class="song.isFavorite? 'pink--text text--lighten-2' : 'grey--text text--lighten-2'"
              @click="$emit('favorite', song)"
            >
              mdi-heart
            </v-icon>
            <span v-if="isCurrentSong(song.id)" class="song-playing-tag">
              PLAYING
            </span>
          </div>
          <p class="song-description mb-0 pa-2 d-flex align-center">
            {{ song.description }}
          </p>
          <div class="d-flex justify-space-between song-name pa-2">
            <span>{{ song.name }}</span>
            <v-tooltip :top="!isMobile" :bottom="isMobile">
              <template #activator="{ on, attrs }">
                <v-icon
                  size="36"
                  class="mt-n2"
                  v-bind="attrs"
                  v-on="on"
                  @click.stop="handleSongAddition($event, song)"
                >
                  mdi-playlist-music-outline
                </v-icon>
              </template>
              {{ isMobile ? 'Added to queue' : 'Add to queue' }}
            </v-tooltip>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { useMusic } from '@/composables'
import CarouselLetter from '@/components/app/music/CarouselLetter.vue'

import { jsonCopy } from '@/utils/objectTools.js'

export default defineComponent({
  name: 'LetterSongs',

  components: {
    CarouselLetter
  },

  props: {
    letter: {
      type: Object,
      required: true
    },

    songs: {
      type: Array,
      required: true
    }
  },

  setup () {
    const { isCurrentSong } = useMusic()

    return { isCurrentSong }
  },

  data () {
    return {
      vowels: ['A', 'E', 'I', 'O', 'U']
    }
  },

  computed: {
    isVowel () {
      return this.vowels.includes(this.letter.name.substr(0, 1).toUpperCase())
    },

    isMobile () {
      return this.$vuetify.breakpoint.mobile
    }
  },

  methods: {
    createPlayListFromIndex (index) {
      const playlist = jsonCopy(this.songs.slice(index))
      this.$emit('createPlayList', playlist)
    },
    handleSongAddition ($event, song) {
      this.$emit('add', song)

      // blur element after 2 seg so the tooltip can go away
      if ($event && $event.target) {
        setTimeout(() => $event.target.blur(), 2000)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.letter-song {
  &-wrapper {
    position: relative;
    padding-top: 60px;
  }
  &-title {
    position: absolute;
    top: 0px;
    left: 20px;
    & .letter-text {
      color: #606060 !important;
      font-size: 32px;
      letter-spacing: 6px;
      font-weight: 700;
    }
    &-border {
      position: absolute;
      top: 36px;
      left: 0;
      width: 100%;
      height: 16px;
      background-color: #dce7b5;
      &.vowel {
        background-color: var(--v-accent-base);
      }
    }
  }
}
.song {
  &-card {
    box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15) !important;
    border-radius: 8px !important;
    width: 225px;
  }
  &-wrapper {
    position: relative;
    & .play-btn {
      position: absolute;
      top: 40px;
      left: 40px;
      color: transparent !important;
      &:hover {
        cursor: pointer;
        color: white !important;
      }
    }
    & .favorite-btn {
      position: absolute;
      top: 10px;
      right: 10px;
    }
  }
  &-image {
    height: 225px;
    width: 225px;
    background-size: cover;
    background-position: center center;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  &-description {
    font-size: 18px;
    font-weight: 700;
    color: #606060 !important;
    height: 60px;
  }
  &-name {
    font-size: 16px;
    color: var(--v-black-base);
  }
  &-playing-tag {
    position: absolute;
    bottom: 10px;
    left: 10px;
    background: white;
    color: black;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 1px;
    padding: 5px;
    width: 75px;
    text-align: center;
    margin-top: 5px;
    margin-bottom: 5px;
  }
}
.v-tooltip__content {
  background-color: var(--v-black-base) !important;
  font-weight: 500 !important;
  color: white !important;
}
.v-tooltip__content::after {
  content: "";
  position: absolute;
  border-color: transparent transparent transparent transparent;
}
</style>