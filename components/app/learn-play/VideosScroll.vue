<template>
  <v-row>
    <v-col cols="1">
      flecha1
    </v-col>
    <v-col cols="10">
      <v-row>
        <div v-for="n in 5" :key="n">
          <v-avatar class="mx-3" tile size="80">
            <img src="@/assets/png/preview.png">
          </v-avatar>
        </div>
      </v-row>
    </v-col>
    <v-col cols="1">
      fecha2
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
