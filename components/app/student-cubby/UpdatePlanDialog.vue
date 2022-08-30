import defineComponent from '../virtual-preschool/VirtualLearnAndPlay.vue';
<template>
  <v-dialog v-model="dialog"></v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'UpdatePlanDialog',

  setup() {
    const dialog = ref(false)

    return {
      dialog
    }
  }
})
</script>
