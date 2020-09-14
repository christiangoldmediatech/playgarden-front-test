<template>
  <div class="control-container d-flex align-start justify-start">
    <p v-if="!$vuetify.breakpoint.mobile" class="mt-3 ml-6">
      Press CTRL + SHIFT + E to EXIT
    </p>
    <v-btn
      v-else
      class="ma-2"
      color="rgba(0, 0, 0, 0.74)"
      fab
      x-small
      @click.stop="$emit('quit')"
    >
      <v-icon color="white">
        mdi-close
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'ExitTip'
}
</script>
