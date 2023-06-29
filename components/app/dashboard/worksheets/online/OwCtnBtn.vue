<template>
  <div class="ow-ctn-btn">
    <v-btn
      color="primary"
      block
      :large="$vuetify.breakpoint.smAndUp"
      v-bind="{ disabled, loading }"
      @click.stop="$emit('click')"
    >
      {{ $t('commonWords.continue') }}
      <v-icon right small>
        mdi-greater-than
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'OwCtnBtn',

  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },

    loading: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style lang="scss">
.ow-ctn-btn {
  width: 271px;
  margin: 32px auto;
}
</style>
