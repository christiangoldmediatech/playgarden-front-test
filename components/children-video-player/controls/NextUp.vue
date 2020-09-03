<template>
  <div class="control-container d-flex align-center justify-end">
    <v-sheet
      :class="['coming-up-next', { 'shown': params.show }]"
      color="rgba(0, 0, 0, 0.74)"
      max-width="256"
      width="100%"
      rounded
    >
      Coming up Next
    </v-sheet>
  </div>
</template>

<script>
export default {
  name: 'NextUp',

  props: {
    params: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.coming-up-next {
  transition: transform 1s;
  transform: translate(100%);
}

.shown {
  transform: translate(0%);
}
</style>
