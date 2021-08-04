<template>
  <div>
    <v-card class="playlist-item">
      <v-row no-gutters @click="$emit('play', song)">
        <!-- THUMBNAIL -->
        <v-col cols="2" align-self="center">
          <v-img class="playlist-item-image" cover :src="song.thumbnail" />
        </v-col>

        <!-- SONG NAME -->
        <v-col cols="3" sm="4" align-self="center" class="playlist-item-description">
          {{ song.description }}
        </v-col>

        <!-- SONG AUTHOR -->
        <v-col cols="3" sm="4" align-self="center" class="playlist-item-name">
          {{ song.name }}
        </v-col>

        <v-col cols="auto" align-self="center">
          <!-- FAVORITE BUTTON -->
          <v-btn class="mr-n1 mr-md-0" :class="favoriteButtonClasses" icon @click.stop="$emit('favorite', song)">
            <v-icon>mdi-heart</v-icon>
          </v-btn>

          <!-- REMOVE BUTTON -->
          <v-btn class="ml-n1 ml-md-0 red--text text--lighten-1" icon @click.stop="$emit('remove-song', song)">
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts">
import { MusicLibrary } from '@/models'
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { computed } from '@vue/composition-api'

export default defineComponent({
  props: {
    song: {
      type: Object as PropType<MusicLibrary>
    }
  },

  emits: ['remove-song', 'favorite-toggle', 'play'],

  setup (props) {
    const favoriteButtonClasses = computed(() => props.song?.isFavorite ? 'pink--text text--lighten-2' : '')

    return {
      favoriteButtonClasses
    }
  }
})
</script>

<style lang="scss" scoped>
.playlist-item {
  background: #FFFFFF;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15) !important;
  border-radius: 8px;
  padding: 4px 0px 4px 8px;

  &-image {
    margin-left: 24px;
    border-radius: 8px;
    height: 50px;
    width: 50px;
  }

  &-description {
    margin-left: 6px;
    color: #606060;
    font-weight: bold;
    font-size: 20px;
  }

  &-name {
    color: #CFCFCF;
    font-size: 18px;
  }
}

@media (max-width: $breakpoint-xs) {
  .playlist-item {
    &-image {
      margin-left: 0px;
      height: 40px;
      width: 40px;
    }

    &-description {
      font-size: 14px;
    }

    &-name {
      font-size: 11px;
    }
  }
}
</style>
