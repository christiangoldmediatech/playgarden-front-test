<template>
  <v-card
    class="worksheet-card"
    :class="{ 'd-flex': horizontalMode, 'worksheet-card-horizontal': horizontalMode }"
  >
    <div
      class="pt-0 pt-md-4 content-section-wrapper"
      :class="{ 'content-section-wrapper-horizontal': horizontalMode }"
    >
      <img
        class="pg-object-contain"
        :class="{ 'pg-object-cover': horizontalMode }"
        :src="thumbnail || require('@/assets/png/pdf-thumbnail-placeholder.png')"
        :height="imgHeight"
        width="100%"
      />
    </div>

    <div
      class="content-section-wrapper d-flex pa-2 align-center"
      :class="{ 'flex-column': horizontalMode, 'content-section-wrapper-horizontal': horizontalMode }"
    >
      <div class="worksheet-title pr-2 mr-auto mt-2 mt-md-0">
        {{ name }}
      </div>

      <div class="ml-auto" :class="{ 'mt-auto': horizontalMode }">
        <DownloadButtonLearnPlay
          @click.stop="$emit('click:download')"
        />
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'
import DownloadButtonLearnPlay from './DownloadButtonLearnPlay.vue'

export default defineComponent({
  name: 'WorksheetCard',
  components: { DownloadButtonLearnPlay },
  props: {
    thumbnail: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    horizontalMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click:download'],
  setup(props) {
    const imgHeight = computed(() => props.horizontalMode ? '100%' : '200px')

    return { imgHeight }
  }
})
</script>

<style lang="scss" scoped>
.worksheet-title {
  font-family: 'Poppins';
  font-weight: 700;
  line-height: 1.3;
  text-overflow: ellipsis;
  color: #606060;
  overflow: hidden;
}
.content-section-wrapper {
  width: 100% !important;
}

.content-section-wrapper-horizontal {
  width: 50%;
}

.worksheet-card{
  min-width: 250px;
  min-height: 280px !important;
  max-height: 280px !important;
}

.worksheet-card-horizontal {
  min-height: 160px !important;
  max-height: 160px !important;
}

.horizontal {
  display: flex;
}
</style>
