<template>
  <div class="pa-4" v-bind="$attrs">
    <!-- Filters -->
    <v-row no-gutters>
      <v-col cols="12" md="8">
        <music-carousel-letter
          :value="selectedLetterId"
          :disabled-letters="disabledLetters"
          @select="selectLetter"
        />
      </v-col>
      <v-col cols="12" md="">
        <v-row no-gutters justify="start" align="center" class="fill-height pl-4">
          <v-col cols="auto">
            <v-card
              tile
              width="110"
              class="py-2 filter text-center"
              :class="{ selected: selectedFilter === 'list' }"
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
    <!-- Songs -->
    <template v-if="selectedFilter === 'list'">
      <song-card
        v-for="(song, index) in filteredSongsByLetterId"
        :key="song.id"
        :thumbnail="song.thumbnail"
        :name="song.name"
        :description="song.description"
        class="my-4"
        @add="addSongToPlayList(song)"
        @click="createPlayListFromIndex(index)"
      />
    </template>
    <template v-if="selectedFilter === 'letter'">
      <letter-songs
        v-for="letter in filteredLettersByLetterId"
        :key="letter.id"
        :letter="letter"
        :songs="letter.musicLibrary"
        class="mt-4 mb-8"
        @createPlayList="emitPlayList"
      />
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import MusicCarouselLetter from '@/components/app/music/MusicLetterCarousel.vue'
import SongCard from '@/components/app/music/SongCard.vue'
import LetterSongs from '@/components/app/music/LetterSongs.vue'

import { jsonCopy } from '@/utils/objectTools.js'

export default {
  name: 'MusicSongList',

  components: {
    MusicCarouselLetter,
    SongCard,
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
    }
  },

  data () {
    return {
      selectedFilter: 'list',
      selectedLetterId: null
    }
  },

  computed: {
    ...mapGetters('admin/curriculum', { letters: 'types' }),

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

  async created () {
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
</style>
