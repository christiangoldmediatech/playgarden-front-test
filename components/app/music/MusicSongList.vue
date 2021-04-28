<template>
  <div class="pa-4" v-bind="$attrs">
    <!-- Filters -->
    <v-row no-gutters>
      <!-- Child Selector -->
      <v-col v-if="!isPlayerShowing || mobile" cols="12" md="">
        <div class="child-selector mx-auto">
          <child-select v-model="selectedChildId" hide-details />
        </div>
      </v-col>

      <v-col
        cols="12"
        :md="isPlayerShowing ? 5 : 6"
        :lg="isPlayerShowing ? 6 : 7"
        xl="7"
      >
        <music-carousel-letter
          :value="selectedLetterId"
          :disabled-letters="disabledLetters"
          @select="selectLetter"
        />
      </v-col>

      <v-col cols="12" md="" class="d-flex justify-center">
        <v-btn
          large
          class="favorite-button white my-4 mt-md-2 mb-md-0"
          data-test-id="favorite-toggle"
          :class="{ 'selected': showOnlyFavorites }"
          :ripple="false"
          @click="$emit('showFavorites')"
        >
          <v-icon left class="pink--text text--lighten-2">
            mdi-heart
          </v-icon>
          Favorites
        </v-btn>
      </v-col>

      <v-col cols="12" md="">
        <v-row no-gutters justify="center" justify-md="start" align="center" class="fill-height pl-4 pl-md-0">
          <v-col cols="auto">
            <v-card
              tile
              width="110"
              class="py-2 filter text-center"
              :class="{ selected: selectedFilter === 'list' }"
              data-test-id="list-view-button"
              @click="selectedFilter = 'list'"
            >
              <v-icon :color="selectedFilter === 'list' ? 'white' : 'primary'">
                mdi-format-list-bulleted
              </v-icon>
              List
            </v-card>
          </v-col>
          <v-col cols="auto">
            <v-card
              tile
              width="110"
              class="py-2 filter text-center"
              :class="{ selected: selectedFilter === 'letter' }"
              data-test-id="letter-view-button"
              @click="selectedFilter = 'letter'"
            >
              <v-icon :color="selectedFilter === 'letter' ? 'white' : 'primary'">
                mdi-sort-alphabetical-ascending
              </v-icon>
              Letter
            </v-card>
          </v-col>
        </v-row>
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
    <!-- Songs -->
    <template v-if="selectedFilter === 'list'">
      <div data-test-id="song-card-list">
        <song-card
          v-for="(song, index) in filteredSongsByLetterId"
          :key="song.id"
          :thumbnail="song.thumbnail"
          :name="song.name"
          :description="song.description"
          :is-favorite="song.isFavorite"
          class="my-4"
          @add="addSongToPlayList(song)"
          @favorite="$emit('favorite', song)"
          @click="createPlayListFromIndex(index)"
        />
      </div>
    </template>
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
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import MusicCarouselLetter from '@/components/app/music/MusicLetterCarousel.vue'
import SongCard from '@/components/app/music/SongCard.vue'
import LetterSongs from '@/components/app/music/LetterSongs.vue'
import ChildSelect from '@/components/app/ChildSelect.vue'

import { jsonCopy } from '@/utils/objectTools.js'

export default {
  name: 'MusicSongList',

  components: {
    MusicCarouselLetter,
    SongCard,
    LetterSongs,
    ChildSelect
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

    isPlayerShowing: {
      type: Boolean,
      required: false,
      default: false
    },

    showOnlyFavorites: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      selectedFilter: 'list',
      selectedLetterId: null,
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
        return this.songsByCurriculumType
      } else {
        return this.songsByCurriculumType.filter(letter => letter.id === this.selectedLetterId)
      }
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

    selectLetter (letterId) {
      if (this.selectedLetterId === letterId) {
        // deselect
        this.selectedLetterId = null
      } else {
        // select
        this.selectedLetterId = letterId
      }
    },

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
.child-selector {
  max-width: 300px;
}

.favorite-button {
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15) !important;

  &.selected {
    box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25) !important;
  }
}
</style>
