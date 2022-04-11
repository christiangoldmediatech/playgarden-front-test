<template>
  <v-menu offset-y top :close-on-content-click="false" max-width="1000px" @input="handleMenuVisibility">
    <template #activator="{ on }">
      <v-btn class="white--text" icon data-test-id="music-queue-playlist-button" v-on="on">
        <v-icon size="32">
          mdi-playlist-music-outline
        </v-icon>
      </v-btn>
    </template>

    <v-card class="music-queue" data-test-id="music-queue-card">
      <v-card-title>
        <v-row>
          <v-col class="flex-grow-1 flex-shrink-0">
            <underlined-title
              text="Playlist"
              font-size-mobile="24px"
              line-color="#B2E68D"
            />
          </v-col>

          <v-col cols="auto" class="music-queue-total-songs">
            {{ songCountText }}
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-text class="music-queue-content">
        <template v-if="playlist.length > 0">
          <v-slide-x-reverse-transition group>
            <playlist-item
              v-for="(playlistItem, playlistItemIndex) in playlist"
              :key="playlistItem.id"
              :song="playlistItem"
              :is-playing="isCurrentSong(playlistItem.id)"
              class="my-3"
              @favorite="$emit('favorite', playlistItem)"
              @play="$emit('play', playlistItemIndex)"
              @remove-song="$emit('remove-song', playlistItemIndex)"
            />
          </v-slide-x-reverse-transition>
        </template>

        <template v-else>
          <div class="music-queue-empty-queue" data-test-id="music-queue-empty-queue">
            Empty queue
          </div>
        </template>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { useMusic, useVuetifyHelper } from '@/composables'
import { defineComponent, computed } from '@nuxtjs/composition-api'
import PlaylistItem from '@/components/app/music/PlaylistItem.vue'

export default defineComponent({
  components: {
    PlaylistItem
  },

  emits: ['favorite', 'play', 'remove-song'],

  setup () {
    const vuetify = useVuetifyHelper()
    const { playlist, currentSong, isCurrentSong } = useMusic()

    const songCountText = computed(() => playlist.value.length === 1 ? '1 song' : `${playlist.value.length} songs`)

    const handleMenuVisibility = (isShowing: boolean) => {
      if (!isShowing) {
        return
      }
      try {
        setTimeout(() => {
          vuetify.goTo(`#playlist-item-${currentSong.value?.id}`, {
            container: '.music-queue-content',
            offset: -53
          })
        }, 500)
      } catch (error) {}
    }

    return {
      playlist,
      songCountText,
      handleMenuVisibility,
      isCurrentSong
    }
  }
})
</script>

<style lang="scss" scoped>
.music-queue {
  width: 600px;

  &-content {
    height: 400px;
    overflow: auto;
  }

  &-empty-queue {
    margin: 16px 0px;
    color: #E2E2E2;
    font-size: 30px;
  }

  &-total-songs {
    color: #CFCFCF;
    font-size: 20px;
  }
}

@media (max-width: $breakpoint-xs) {
  .music-queue {
    width: 90vw;

    &-content {
      height: 10vh !important;
    }

    &-total-songs {
      font-size: 16px;
    }
  }
}
</style>
