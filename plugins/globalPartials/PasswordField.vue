<template>
  <v-text-field
    v-model="input"
    v-bind="$attrs"
    :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
    :type="showPass ? 'text' : 'password'"
    @click:append="showPass = !showPass"
    v-on="$listeners"
  />
</template>

<script>
export default {
  name: 'PasswordField',

  props: {
    value: {
      type: [String, Number],
      default: ''
    }
  },

  data: () => ({
    showPass: false
  }),

  computed: {
    input: {
      get () {
        return this.value
      },
      set (input) {
        this.$emit('input', input)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  overflow: hidden;

  .progress-linear {
    transform: rotate(90deg);
    transform-origin: 0 0;
  }
}
</style>
