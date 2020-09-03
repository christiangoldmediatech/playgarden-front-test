<template>
  <div class="control-container d-flex align-start justify-end">
    <v-btn
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
  name: 'MobileExitBtn'
}
</script>
