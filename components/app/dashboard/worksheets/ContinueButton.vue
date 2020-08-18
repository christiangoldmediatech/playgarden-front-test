<template>
  <v-btn
    color="primary"
    class="py-2"
    block
    large
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot>
      Continue
      <v-icon right>
        mdi-greater-than
      </v-icon>
    </slot>
  </v-btn>
</template>

<script>
export default {
  name: 'ContinueButton'
}
</script>
