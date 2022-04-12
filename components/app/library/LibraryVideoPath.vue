<template>
  <v-container class="d-flex justify-center">
    <div id="svgContainer">
      <library-path-item
        v-for="(pathItem, index) in pathItems"
        :key="`library-path-item-${index}`"
        :background-color="lighterColor"
        :darker-color="color"
        :coordinates="findPathItemCoordinates(index)"
        v-bind="{ pathItem, index }"
      >
        <template #playicon>
          <img :src="playIcon">
        </template>
      </library-path-item>

      <!-- Red start arrow -->
      <img id="redStartArrow" src="@/assets/svg/library/video-path-arrow.svg">

      <!-- Library category icon for mobile -->
      <library-category-icon
        class="d-lg-none"
        :border-color="lighterColor"
        v-bind="{ icon }"
      />
    </div>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed, watch, onMounted } from '@nuxtjs/composition-api'
import { generatePath, mountPath, findPathItemCoordinates, generatePathItemPlayIcon } from '@/components/app/library/pathConstants'
import { PathItem, Video } from '@/models'
import LibraryPathItem from '@/components/app/library/LibraryPathItem.vue'
import LibraryCategoryIcon from '@/components/app/library/LibraryCategoryIcon.vue'

export default defineComponent({
  name: 'LibraryVideoPath',

  components: {
    LibraryPathItem,
    LibraryCategoryIcon
  },

  props: {
    videos: {
      type: Array as PropType<Video[]>,
      required: true
    },

    color: {
      type: String,
      required: true
    },

    lighterColor: {
      type: String,
      required: true
    },

    icon: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const pathItems = computed<PathItem[]>(() => {
      const items: PathItem[] = []

      props.videos.forEach((video, playlistIndex) => {
        items.push({
          video,
          patch: undefined,
          playlistIndex
        })

        if (video.patch) {
          items.push({
            video: undefined,
            patch: video.patch,
            playlistIndex: undefined
          })
        }
      })

      return items
    })

    const activityPathEl = ref<SVGSVGElement | null>(null)

    watch(pathItems, (val) => {
      if (val.length) {
        const activityPathSVG = generatePath({
          items: val,
          color: props.color,
          lighterColor: props.lighterColor
        })
        activityPathEl.value = activityPathSVG
        mountPath('svgContainer', activityPathSVG)
      }
    }, { immediate: true })

    onMounted(() => {
      if (activityPathEl.value) {
        // This is done only for the first time the path is mounted
        mountPath('svgContainer', activityPathEl.value)
      }
    })

    const playIcon = generatePathItemPlayIcon(props.color)

    return {
      pathItems,
      findPathItemCoordinates,
      playIcon
    }
  }
})
</script>

<style lang="scss" scoped>
#svgContainer {
  position: relative;
  width: 85%;
  max-width: 85%;
  @media screen and (min-width: 1264px) {
    width: 480px;
    max-width: 480px;
  }

  svg {
    max-width: 100%;
  }

  #redStartArrow {
    position: absolute;
    width: 15%;
    margin-left: 39%;
    margin-top: 2.25%;
    transform-origin: center center;
    transform: rotate(8deg);
  }
}
</style>
