<template>
  <div class="px-4" v-bind="$attrs">
    <!-- Filters -->
    <v-row no-gutters>
      <v-col v-if="$vuetify.breakpoint.mdAndUp" class="pg-mb-5">
        <div v-if="!showOnlyFavorites" class="pg-flex pg-items-center pg-gap-7">
          <img
            class="pg-w-10 pg-h-auto pg-object-contain"
            :src="require('@/assets/svg/music-library-icon.svg')"
            alt="Music Library Icon"
          />
          <h2 class="pg-text-primary pg-text-4xl pg-font-bold pg-font-quick">
            {{ $t('music.songList.title') }}
          </h2>
        </div>

        <v-btn v-else class="accent--text text-none" x-large text @click="$emit('showFavorites')">
          <v-icon size="32" left>
            mdi-chevron-left
          </v-icon>
          {{ $t('commonWords.backButton') }}
        </v-btn>
      </v-col>

      <v-spacer class="d-none d-md-flex" />

      <v-col cols="12" md="" class="d-flex justify-center justify-md-end">
        <v-btn
          large
          class="favorite-button white my-4 mt-md-2 mb-md-0"
          data-test-id="favorite-toggle"
          :class="{ 'selected': showOnlyFavorites }"
          :width="isMobile ? 350 : undefined"
          :ripple="false"
          @click="$emit('showFavorites')"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 42 42"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="mr-2"
          >
            <circle
              cx="21"
              cy="21"
              r="20"
              fill="#FFF7E7"
              stroke="#F6B7D2"
              stroke-width="2"
            />
            <path d="M26.5914 12.121C30.2679 12.1396 33.2439 15.2315 33.2618 19.0513C33.2618 26.0495 21.0001 32.9799 21.0001 32.9799C21.0001 32.9799 8.73828 25.9476 8.73828 19.0513C8.73828 15.2238 11.7247 12.121 15.4087 12.121C17.6638 12.1027 19.7721 13.2812 21.0001 15.2464C22.2364 13.2907 24.3393 12.1153 26.5914 12.121H26.5914Z" fill="#F5737F" />
          </svg>
          <span class="pg-font-quick pg-text-pg-grey">
            {{ $t('music.songList.favorites') }}
          </span>
        </v-btn>
      </v-col>

      <v-col v-if="$vuetify.breakpoint.mdAndDown" class="pg-mb-5 pg-mt-10 !pg-px-5">
        <div v-if="!showOnlyFavorites" class="pg-flex pg-items-center pg-gap-7">
          <img
            class="pg-w-8 pg-h-auto pg-object-contain"
            :src="require('@/assets/svg/music-library-icon.svg')"
            alt="Music Library Icon"
          />
          <h2 class="pg-text-primary pg-text-3xl pg-font-bold pg-font-quick">
            {{ $t('music.songList.title') }}
          </h2>
        </div>

        <v-btn v-else class="accent--text text-none" x-large text @click="$emit('showFavorites')">
          <v-icon size="32" left>
            mdi-chevron-left
          </v-icon>
          {{ $t('commonWords.backButton') }}
        </v-btn>
      </v-col>
    </v-row>
    <!-- Favorites Title -->
    <v-expand-transition>
      <v-row v-if="showOnlyFavorites" no-gutters>
        <v-col cols="12" class="py-6">
          <underlined-title
            font-size="48px"
            font-size-mobile="32px"
            font-weight="bold"
            line-color="pink"
            line-padding-right="30%"
          >
            <img :height="mobile ? '24px' : '36px'" src="@/assets/svg/library/favorites.svg">
            {{ $t('music.songList.favorites') }}
          </underlined-title>
        </v-col>
      </v-row>
    </v-expand-transition>
    <!-- No Favorite Songs -->
    <div
      v-if="shouldShowNoFavoriteSongsAdded"
      class="d-flex align-center justify-center flex-column my-md-12"
    >
      <img src="@/assets/svg/library/favorites.svg" :width="mobile ? '72px' : '128px'">

      <div class="text-h6 text-md-h4 font-weight-medium text-center grey--text text--darken-2 mt-6">
        {{ $t('music.songList.placeholder') }}
      </div>
    </div>
    <!-- Songs -->
    <template v-else>
      <template v-if="selectedFilter === 'letter'">
        <div data-test-id="letter-songs-list">
          <div
            v-for="letter in filteredLettersByLetterId"
            :key="letter.id"
          >
            <v-lazy
              :options="{
                threshold: .5,
              }"
              min-height="400"
            >
              <letter-songs
                :letter="letter"
                :songs="letter.musicLibrary"
                class="my-2 mt-md-4 mb-md-8"
                @add="addSongToPlayList"
                @favorite="$emit('favorite', $event)"
                @createPlayList="emitPlayList"
              />
            </v-lazy>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import LetterSongs from '@/components/app/music/LetterSongs.vue'

import { jsonCopy } from '@/utils/objectTools'

export default {
  name: 'MusicSongList',

  components: {
    LetterSongs
  },

  emits: ['addSong', 'newPlayList'],

  props: {
    allSongs: {
      type: Array,
      required: false,
      default: () => []
    },

    songsByCurriculumType: {
      type: Array,
      required: false,
      default: () => []
    },

    mobile: {
      type: Boolean,
      required: false,
      default: false
    },

    showOnlyFavorites: {
      type: Boolean,
      default: false
    },

    selectedLetterId: {
      type: Number,
      default: null
    }
  },

  data () {
    return {
      selectedFilter: 'letter',
      selectedChildId: null
    }
  },

  computed: {
    ...mapGetters({ currentChild: 'getCurrentChild' }),
    ...mapGetters('admin/curriculum', { letters: 'types' }),

    id () {
      return this.$route.query.id ? parseInt(this.$route.query.id) : null
    },

    availableLettersWithSongsIds () {
      const availableIds = new Set()
      this.songsByCurriculumType.forEach(letter => availableIds.add(letter.id))

      return Array.from(availableIds)
    },

    disabledLetters () {
      return this.letters.filter((letter) => {
        return !this.availableLettersWithSongsIds.includes(letter.id)
      }).map(letter => letter.id)
    },

    filteredSongsByLetterId () {
      if (!this.selectedLetterId) {
        return this.allSongs
      }
      return this.allSongs.filter(letter => letter.curriculumTypeId === this.selectedLetterId)
    },

    filteredLettersByLetterId () {
      if (!this.selectedLetterId) {
        return this.songsByCurriculumType.filter((letter) => {
          // Don't show letters which don't have songs in it
          if (Array.isArray(letter.musicLibrary) && letter.musicLibrary.length) {
            return true
          }
          return false
        })
      } else {
        return this.songsByCurriculumType.filter(letter => letter.id === this.selectedLetterId)
      }
    },

    shouldShowNoFavoriteSongsAdded () {
      // when `showOnlyFavorites` = true, the favorite songs are filtered in the parent component
      if (this.showOnlyFavorites) {
        const hasSongs = this.filteredSongsByLetterId.length
        return !hasSongs
      }

      return false
    },

    isMobile () {
      return this.$vuetify.breakpoint.mobile
    }
  },

  watch: {
    selectedChildId (id) {
      if (id) {
        this.$router.push({ name: this.$route.name, query: { id } })
      }
    }
  },

  async created () {
    if (this.id) {
      this.selectedChildId = parseInt(this.id)
    } else if (this.currentChild.length) {
      this.selectedChildId = this.currentChild[0].id
    }
    await this.getLetters()
  },

  methods: {
    ...mapActions('admin/curriculum', {
      getLetters: 'getTypes'
    }),

    createPlayListFromIndex (index) {
      const playlist = jsonCopy(this.filteredSongsByLetterId.slice(index))
      this.$emit('newPlayList', playlist)
    },

    emitPlayList (playlist) {
      this.$emit('newPlayList', playlist)
    },

    addSongToPlayList (song) {
      this.$emit('addSong', song)
    }
  }
}
</script>

<style lang="scss" scoped>
.filter {
  &.selected {
    color: var(--v-white-base);;
    background-color: var(--v-accent-base);
    box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
}
.music-letter-select {
  width: 350px;
}

.favorite-button {
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15) !important;

  &.selected {
    box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25) !important;
  }
}
</style>
