<template>
  <v-row
    class="clickable pg-rounded-[7px]"
    :style="{ 'background': color }"
    no-gutters
    @click="$emit('click')"
  >
    <v-col cols="11" class="pa-5">
      <h1 class="title mb-2" :style="{ 'color': textColor }">
        {{ title }}
      </h1>
      <h2 class="subtitle" :style="{ 'color': textColor }">
        {{ subtitle }}
      </h2>
    </v-col>

    <v-col cols="1" class="d-flex align-center justify-center">
      <v-icon large :color="textColor">
        mdi-chevron-right
      </v-icon>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'MembershipBtn',
  props: {
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    textColor: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    }
  }
})

</script>

<style lang="scss" scoped>

.title {
  font-family: 'Quicksand' !important;
  font-weight: 700;
  font-size: 16px !important;
  line-height: 20px;
}

.subtitle {
  font-family: 'Poppins' !important;
  font-weight: 500;
  font-size: 12px !important;
  line-height: 18px;
}

</style>
