<template>
  <component
    :is="tag"
    class="lesson-item-status"
    :class="{
      'lesson-item-status-done': status.done,
      'lesson-item-status-started': status.started,
      'lesson-item-status-not-started': !status.started && !status.done
    }"
  >
    {{ status.text }}
  </component>
</template>

<script lang="ts">
import { Viewed } from '@/models'
import { defineComponent, PropType, computed } from '@nuxtjs/composition-api'
import dayjs from 'dayjs'

interface GenericItem {
  [key: string]: any,
  viewed?: Viewed
}

export default defineComponent({
  name: 'LessonItemStatus',

  props: {
    tag: {
      type: String,
      required: false,
      default: 'span'
    },

    item: {
      type: Object as PropType<GenericItem>,
      required: true
    }
  },

  setup ({ item }) {
    const status = computed(() => {
      const result = {
        started: item.viewed && !item.viewed.completed,
        done: item.viewed && item.viewed.completed,
        text: 'Not started'
      }

      if (item.viewed) {
        const date = dayjs(new Date(item.viewed.date))

        if (item.viewed.completed) {
          result.text = 'Done on '
        } else {
          result.text = 'Started on '
        }

        result.text += date.format('MMMM, DD YYYY - HH:mm')
      }

      return result
    })

    return {
      status
    }
  }
})
</script>

<style lang="scss" scoped>
.lesson-item-status {
  font-size: 12px;
  &-done {
    color: #68C453;
  }
  &-started {
    color: #D8B700
  }
  &-not-started {
    color: #D10007;
  }
}
</style>
