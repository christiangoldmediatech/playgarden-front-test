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
    <v-row no-gutters>
      <v-col
        v-for="(song, index) in songs"
        :key="song.id"
        cols="12"
        md="auto"
      >
        <div class="song-wrapper mx-auto">
          <v-icon
            size="120"
            class="play-btn"
            color="white"
            @click.stop="createPlayListFromIndex(index)"
          >
            mdi-play-circle-outline
          </v-icon>
          <figure class="song-image" :style="{ 'background-image': `url(${song.thumbnail})` }" />
          <p class="song-description mb-0">
            {{ song.description }}
          </p>
          <p class="song-name mb-0">
            {{ song.name }}
          </p>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import CarouselLetter from '@/components/app/music/CarouselLetter.vue'

import { jsonCopy } from '@/utils/objectTools.js'

export default {
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

  data () {
    return {
      vowels: ['A', 'E', 'I', 'O', 'U']
    }
  },

  computed: {
    isVowel () {
      return this.vowels.includes(this.letter.name.substr(0, 1).toUpperCase())
    }
  },

  methods: {
    createPlayListFromIndex (index) {
      const playlist = jsonCopy(this.songs.slice(index))
      this.$emit('createPlayList', playlist)
    }
  }
}
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
  &-wrapper {
    position: relative;
    padding: 25px;
    height: 300px;
    width: 250px;
    & .play-btn {
      position: absolute;
      top: 65px;
      left: 65px;
      color: transparent !important;
      &:hover {
        cursor: pointer;
        color: white !important;
      }
    }
  }
  &-image {
    height: 200px;
    width: 200px;
    background-size: contain;
    background-position: center center;
  }
  &-description {
    font-size: 18px;
    font-weight: 700;
    color: #606060 !important;
  }
  &-name {
    font-size: 16px;
    color: var(--v-black-base);
  }
}
</style>
