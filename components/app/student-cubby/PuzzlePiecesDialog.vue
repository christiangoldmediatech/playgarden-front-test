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
      data-test-id="puzzle-modal-close-button"
      @click.stop="close"
    >
      <v-icon>
        mdi-close
      </v-icon>
    </v-btn>

    <pieces v-if="actualShow" :puzzle="actualShow" data-test-id="puzzle-modal" />
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
      localToShow: null,
      actualShow: null
    }
  },

  computed: {
    actualValue () {
      if (this.value !== this.localValue) {
        return true
      }
      return this.value
    }
  },

  watch: {
    value (val) {
      if (!val) {
        this.close()
      }
    },

    toShow(val) {
      if (val) {
        this.actualShow = this.toShow
      }
    }
  },

  created () {
    this.$nuxt.$on('open-lesson-puzzle-dialog', (toShow) => {
      this.localToShow = toShow
      this.localValue = true
    })

    this.setActualShow()
  },

  methods: {
    close () {
      this.$emit('input', false)
      this.localValue = false
      this.localToShow = null
    },

    setActualShow() {
      if (this.localToShow) {
        this.actualShow = this.localToShow
      } else if (this.toShow) {
        this.actualShow = this.toShow
      }
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
