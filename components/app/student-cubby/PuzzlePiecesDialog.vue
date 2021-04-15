<template>
  <pg-dialog
    content-class="no-overflow pos-relative"
    :value="actualValue"
    persistent
    max-width="1264px"
  >
    <v-btn
      class="pieces-close-btn"
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

<style lang="scss">
.no-overflow {
  overflow-y: visible !important;
}

.pieces-close-btn {
  position: absolute;
  top: -34px;
  right: -8px;
  z-index: 2500;
}
</style>
