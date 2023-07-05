<template>
  <component :is="tag" ref="uiMsg" />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'UiMsg',
  props: {
    tag: {
      type: String,
      default: 'div'
    },
    message: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const uiMsg = ref<HTMLElement | undefined>()

    onMounted(() => {
      if (uiMsg.value) {
        uiMsg.value.innerHTML = props.message
      }
    })

    return {
      uiMsg
    }
  }
})
</script>
