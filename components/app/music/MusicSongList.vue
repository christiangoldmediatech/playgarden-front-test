<template>
  <div class="pa-4" v-bind="$attrs">
    <!-- Filters -->
    <v-row no-gutters>
      <v-col>
        <underlined-title
          v-if="!showOnlyFavorites"
          font-size="48px"
          font-size-mobile="32px"
          text="Song List"
        />

        <v-btn v-else class="accent--text text-none" x-large text @click="$emit('showFavorites')">
          <v-icon size="32" left>
            mdi-chevron-left
          </v-icon>
          Back
        </v-btn>
      </v-col>

      <v-spacer class="d-none d-md-flex" />

      <v-col cols="12" class="d-flex align-center justify-center mt-4 d-sm-none">
        <div class="music-letter-select">
          <music-carousel-letter
            :is-full-width="true"
            :value="selectedLetterId"
            :disabled-letters="disabledLetters"
            @select="$emit('select-letter', $event)"
          />
        </div>
      </v-col>

      <v-col cols="12" md="" class="d-flex justify-center justify-md-end">
        <v-btn
          large
          class="favorite-button white my-4 mt-md-2 mb-md-0"
          data-test-id="favorite-toggle"
          :class="{ 'selected': showOnlyFavorites }"
          :width="isMobile ? 250 : undefined"
          :ripple="false"
          @click="$emit('showFavorites')"
        >
          <v-icon left class="pink--text text--lighten-2">
            mdi-heart
          </v-icon>
          Favorites
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
            Favorites
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
        Add your favorite songs here, by clicking on their Heart icons.
      </div>
    </div>
    <!-- Songs -->
    <template v-else>
      <template v-if="selectedFilter === 'letter'">
        <div data-test-id="letter-songs-list">
          <letter-songs
            v-for="letter in filteredLettersByLetterId"
            :key="letter.id"
            :letter="letter"
            :songs="letter.musicLibrary"
            class="my-2 mt-md-4 mb-md-8"
            @add="addSongToPlayList"
            @favorite="$emit('favorite', $event)"
            @createPlayList="emitPlayList"
          />
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import LetterSongs from '@/components/app/music/LetterSongs.vue'
import MusicCarouselLetter from '@/components/app/music/MusicLetterCarousel.vue'

import { jsonCopy } from '@/utils/objectTools.js'

export default {
  name: 'MusicSongList',

  components: {
    LetterSongs,
    MusicCarouselLetter
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
  width: 250px;
}

.favorite-button {
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15) !important;

  &.selected {
    box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25) !important;
  }
}
</style>
