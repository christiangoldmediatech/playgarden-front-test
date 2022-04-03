<template>
  <v-row>
    <v-col cols="1">
      <v-btn
        text
      >
        <v-img
          :src="require('@/assets/png/arrow-left.png')"
          max-width="15px"
        />
      </v-btn>
    </v-col>
    <v-col cols="10" class="ml-3">
      <v-row>
        <div v-for="n in 5" :key="n">
          <v-avatar class="mx-3" tile size="80">
            <img src="@/assets/png/preview.png">
          </v-avatar>
        </div>
      </v-row>
    </v-col>
    <v-col cols="1" class="ml-n8">
      <v-btn
        text
        class="ml-n6"
      >
        <v-img
          :src="require('@/assets/png/arrow-right.png')"
          max-width="15px"
        />
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'VideosScroll',
  props: {
    videoList: {
      type: Array,
      required: false,
      default: () => ([])
    }
  },
  data: () => {
    return {
      loading: false
    }
  }
}
</script>
