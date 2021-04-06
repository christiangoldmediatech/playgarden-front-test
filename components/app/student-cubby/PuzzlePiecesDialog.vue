<template>
  <pg-dialog
    class="pos-relative"
    content-class="elevation-0 mt-10"
    :value="actualValue"
    persistent
    max-width="1264px"
  >
    <v-btn
      class="bg-black pos-absolute pos-right-0 pos-top-0 close-btn"
      color="white"
      icon
      @click.stop="close"
    >
      <v-icon>
        mdi-close
      </v-icon>
    </v-btn>
    <pieces v-if="actualShow" :puzzle="actualShow" />
  </pg-dialog>
</template>

<script>
import Pieces from '@/components/app/student-cubby/Pieces'

export default {
  name: 'PuzzlePiecesDialog',

  components: {
    Pieces
  },

  props: {
    value: {
      type: Boolean,
      required: false,
      default: false
    },

    toShow: {
      type: Object,
      validator: (val) => {
        return val === null || typeof val === 'object'
      },
      default: null
    }
  },

  data: () => {
    return {
      localValue: false,
      localToShow: null
    }
  },

  computed: {
    actualValue () {
      if (this.value !== this.localValue) {
        return true
      }
      return this.value
    },

    actualShow () {
      if (this.localToShow) {
        return this.localToShow
      } else if (this.toShow) {
        return this.toShow
      }
      return null
    }
  },

  watch: {
    value (val) {
      if (!val) {
        this.close()
      }
    }
  },

  created () {
    this.$nuxt.$on('open-lesson-puzzle-dialog', (toShow) => {
      this.localToShow = toShow
      this.localValue = true
    })
  },

  methods: {
    close () {
      this.$emit('input', false)
      this.localValue = false
      this.localToShow = null
    }
  }
}
</script>

<style lang="scss" scoped>
.close-btn {
  @media screen and (min-width: 1264px) {
    right: calc(((100vw - 1264px) / 2) - 16px);
  }
}
</style>
