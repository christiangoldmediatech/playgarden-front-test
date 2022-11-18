<template>
  <v-btn color="#F89838" class="elevation-0" @click="$emit('click')">
    <v-img
      height="32px"
      width="32px"
      aspect-ratio="1"
      contain
      class="mr-2"
      :src="require(isDownloadBtn ? '@/assets/png/dashboard/white-download-icon.png' : '@/assets/png/dashboard/network-icon.png')"
    />
    <span class="section-btn-text">{{ text }}</span>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'SectionBtn',
  props: {
    text: {
      type: String,
      default: ''
    },
    isDownloadBtn: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click']
})
</script>

<style lang="scss" scoped>
.section-btn-text {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  color: #FFFFFF;
  text-transform: none;
}
</style>
