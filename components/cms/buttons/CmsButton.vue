<template>
  <v-btn
    class="px-13 button"
    color="primary"
  >
    <a :href="blok.link || link">{{ blok.text || text }}</a>
  </v-btn>
</template>

<script>
export default {
  name: 'CmsButton',

  props: {
    blok: {
      type: Object,
      default: () => ({})
    },
    text: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>

.button {
  margin: 0 15px;

  &:first-child {
    margin-left: 0;
    margin-right: 15px;
  }

  &:last-child {
    margin-right: 0;
    margin-left: 15px;
  }

  a {
    color: white !important;

    &:visited {
      color: inherit;
    }
  }
}

</style>
