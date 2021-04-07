<template>
  <div class="fill-height pa-4">
    <!-- Filters -->
    <v-row no-gutters>
      <v-col cols="12" md="8">
        <music-carousel-letter :value="null" />
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
        v-for="song in allSongs"
        :key="song.id"
        :thumbnail="song.thumbnail"
        :name="song.name"
        :description="song.description"
        class="my-4"
      />
    </template>
    <template v-if="selectedFilter === 'letter'">
      {{ songsByCurriculumType }}
    </template>
  </div>
</template>

<script>
import MusicCarouselLetter from '@/components/app/music/MusicLetterCarousel.vue'
import SongCard from '@/components/app/music/SongCard.vue'

export default {
  name: 'MusicSongList',

  components: {
    MusicCarouselLetter,
    SongCard
  },

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
      selectedFilter: 'list'
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
