<template>
  <v-btn
    class="button"
    color="primary"
    :style="{ 'margin-top': `${blok.marginTop}px`}"
  >
    <a
      :target="linkTarget"
      :href="blok.link.url || link"
      @click="toLink"
    >{{ blok.text || text }}</a>
  </v-btn>
</template>

<script>
import linkTarget from '@/utils/mixins/cms/linkTarget'

export default {
  name: 'CmsButton',

  mixins: [linkTarget],

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
  display: inline-flex;

  a {
    color: white !important;

    &:visited {
      color: inherit;
    }
  }
}

</style>
