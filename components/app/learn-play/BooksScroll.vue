<template>
  <v-slide-group show-arrows="always">
    <template #prev>
      <v-btn icon>
        <v-img :src="require('@/assets/png/arrow-left.png')" max-width="12px" />
      </v-btn>
    </template>
    <v-slide-item
      v-for="(item, index) in bookLearnAndPlay"
      :key="`book-scroll-item-${index}`"
    >
      <BookScrollItem
        :play-and-learn-video="item"
        @click.native="currentVideo(item.video)"
      />
    </v-slide-item>
    <template #next>
      <v-btn icon>
        <v-img
          :src="require('@/assets/png/arrow-right.png')"
          max-width="12px"
        />
      </v-btn>
    </template>
  </v-slide-group>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  PropType
} from '@nuxtjs/composition-api'
import { useIconScale } from '@/composables'
import { Book, Video } from '@/models'
import BookScrollItem from './BookScrollItem.vue'

export default defineComponent({
  name: 'BooksScroll',

  components: {
    BookScrollItem
  },

  props: {
    learnPlay: {
      type: Array as PropType<Book[]>,
      required: true,
      default: () => ({})
    }
  },

  setup(props, { emit }) {
    const { scaleIcon, scaleUp, scaleDown } = useIconScale()
    const loading = ref(false)

    const bookLearnAndPlay = computed(() => {
      return props.learnPlay
        ? props.learnPlay
        : []
    })

    const currentVideo = (video: Video) => {
      emit('change-video-track', video)
    }

    return {
      loading,
      currentVideo,
      bookLearnAndPlay,
      scaleIcon,
      scaleUp,
      scaleDown
    }
  }
})
</script>

  <style lang="scss" scoped>
  .video-scroll {
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  </style>
