<template>
  <div
    class="path-item-container"
    :class="{
      'path-item-container-scaled': isScaled,
      'clickable': pathItem.video || (pathItem.patch && pathItem.patch.unblocked)
    }"
    :style="{
      ...coordinates,
      '--path-item-background-color': backgroundColor
    }"
    @mouseenter="scaleUp"
    @mouseleave="scaleDown"
  >
    <template v-if="pathItem.video">
      <img v-lazyload :data-url="pathItem.video.thumbnail">
      <letter-video-card
        :media-object="videoToMediaObject(pathItem.video, 0, undefined)"
        :visible="isScaled"
        :color="backgroundColor"
        v-bind="{
          [pathItemPopupLocations[adjustedIndex][$vuetify.breakpoint.lgAndUp ? 'lg' : 'xs']]: true
        }"
        @play="handlePlay"
      >
        <template #playicon>
          <slot name="playicon" />
        </template>
      </letter-video-card>
    </template>
    <template v-else-if="pathItem.patch && pathItem.patch.unblocked">
      <img v-lazyload :data-url="pathItem.patch.image">
      <img
        class="patch-unlocked"
        :class="{ 'patch-unlocked-transparent': isScaled }"
        src="@/assets/svg/library/patch-unlocked.svg"
        @click="handlePatchClick"
      >
    </template>
    <template v-else-if="pathItem.patch && !pathItem.patch.unblocked">
      <img src="@/assets/svg/library/patch-locked.svg">
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed, useRouter } from '@nuxtjs/composition-api'
import { PathItem, PathItemCoordinates } from '@/models'
import { useLibraryHelpers, useNuxtHelper } from '@/composables'
import LetterVideoCard from '@/components/app/library/LetterVideoCard.vue'
import { pathItemPopupLocations } from '@/components/app/library/pathConstants'

export default defineComponent({
  name: 'LibraryPathItem',

  components: {
    LetterVideoCard
  },

  props: {
    pathItem: {
      type: Object as PropType<PathItem>,
      required: true
    },

    backgroundColor: {
      type: String,
      required: true
    },

    coordinates: {
      type: Object as PropType<PathItemCoordinates>,
      required: false,
      default: undefined
    },

    index: {
      type: Number,
      required: false,
      default: undefined
    }
  },

  setup(props) {
    const { videoToMediaObject } = useLibraryHelpers()
    const isScaled = ref(false)

    const adjustedIndex = computed(() => {
      const cycleLength = pathItemPopupLocations.length
      const cycle = Math.floor(props.index / cycleLength)
      return props.index - (cycle * cycleLength)
    })

    function scaleUp(): void {
      // If patch and unlocked, dont' scale
      if (props.pathItem.patch && !props.pathItem.patch.unblocked) {
        return
      }
      isScaled.value = true
    }

    function scaleDown(): void {
      isScaled.value = false
    }

    const router = useRouter()
    function handlePatchClick(): void {
      router.push({
        name: 'app-student-cubby-patches'
      })
    }

    const nuxt = useNuxtHelper()
    function handlePlay(): void {
      nuxt.$emit('videoPathPlayer-play-track', props.index)
    }

    return {
      isScaled,
      scaleUp,
      scaleDown,
      videoToMediaObject,
      adjustedIndex,
      pathItemPopupLocations,
      handlePatchClick,
      handlePlay
    }
  }
})
</script>

<style lang="scss" scoped>
.path-item-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 22%;
  aspect-ratio: 1;
  background-color: var(--path-item-background-color);
  border-radius: 50%;
  box-shadow: 6px 4px 24px rgba(0, 0, 0, 0.81);
  transition: transform 250ms ease-in-out;

  img {
    width: 90%;
    aspect-ratio: 1;
    border-radius: 50%;
    object-fit: cover;
    object-position: center center;
  }

  .patch-unlocked {
    position: absolute;
    left: 5%;
    top: 5%;
    width: 90%;
    aspect-ratio: 1;
    border-radius: 50%;
    object-fit: cover;
    object-position: center center;
    opacity: 1;
    transition: opacity 500ms ease-in-out;
    &.patch-unlocked-transparent {
      opacity: 0;
    }
  }

  &.path-item-container-scaled {
    transform: scale(1.15);
    z-index: 300;
    @media screen and (min-width: 1264px) {
      z-index: 1300;
    }
  }
}
</style>
