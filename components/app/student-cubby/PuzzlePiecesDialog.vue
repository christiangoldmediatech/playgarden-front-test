<template>
  <pg-dialog content-class="elevation-0" :value="actualValue" persistent>
    <v-container class="justify-center fill-height" fluid>
      <v-col class="px-3 px-lg-0" sm="12" lg="8" xl="10">
        <v-row justify="end" no-gutters>
          <v-btn
            class="bg-black mb-3 mt-3 mr-5"
            color="white"
            icon
            @click.stop="close"
          >
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </v-row>
        <pieces :puzzle="actualShow" />
      </v-col>
    </v-container>
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
      required: true
    },

    toShow: {
      type: Object,
      required: true
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
      }
      return this.toShow
    }
  },

  watch: {
    value (val) {
      if (val) {
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
