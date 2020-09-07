<template>
  <v-row class="flex-column flex-nowrap fill-height align-center justify-space-around" no-gutters>
    <v-col class="flex-shrink-1 flex-grow-0">
      <!-- Question -->
      <span class="d-block text-center font-weight-bold">
        {{ question }}
      </span>
    </v-col>

    <v-col class="flex-shrink-1 flex-grow-0">
      <v-row align="center" justify="center" no-gutters>
        <v-col
          v-for="item in items"
          :key="`images-${item.code}`"
          cols="5"
          sm="3"
        >
          <worksheet-image
            v-bind="{ item, selected: selected ? selected.code : null }"
            hoverable
            @click.stop="select(item)"
          >
            <span class="d-block font-weight-bold">
              {{ item.word }}
            </span>
          </worksheet-image>
        </v-col>
      </v-row>
    </v-col>

    <v-col class="d-flex align-center justify-center flex-shrink-0 flex-grow-1">
      <v-row justify="center">
        <v-col
          cols="12"
          sm="10"
          md="8"
          lg="6"
          xl="4"
        >
          <continue-button
            :disabled="!selected"
            @click.stop="check"
          />
        </v-col>
      </v-row>
    </v-col>

    <worksheet-message
      v-model="dialog"
      v-bind="{ correct, selected: selected || {} }"
    >
      <template v-slot:actions>
        <v-row justify="center">
          <v-col
            class="my-3"
            cols="12"
            sm="10"
            md="8"
            lg="6"
            xl="4"
          >
            <continue-button
              :disabled="!selected"
              :loading="loading"
              @click.stop="nextQuestion"
            >
              <v-icon v-if="!correct" left>
                mdi-less-than
              </v-icon>
              {{ `${correct ? buttonText : 'Go back'}` }}
              <v-icon v-if="correct" right>
                mdi-greater-than
              </v-icon>
            </continue-button>
          </v-col>
        </v-row>
      </template>
    </worksheet-message>
  </v-row>
</template>

<script>
import { shuffle } from '@/utils/arrayTools'
// import WorksheetImage from './WorksheetImage.vue'
import WorksheetMessage from './WorksheetMessage.vue'
import ContinueButton from './ContinueButton.vue'

export default {
  name: 'TapCorrect',

  components: {
    // WorksheetImage,
    WorksheetMessage,
    ContinueButton
  },

  props: {
    images: {
      type: Array,
      required: true
    },

    loading: {
      type: Boolean,
      required: true
    },

    question: {
      type: String,
      required: true
    }
  },

  data: () => {
    return {
      dialog: false,
      selected: null,
      correct: false
    }
  },

  computed: {
    items () {
      return shuffle(this.images)
    },

    buttonText () {
      if (this.$attrs.lastQuestion) {
        return 'Complete worksheet'
      }
      return 'Next question'
    }
  },

  methods: {
    select (item) {
      if (this.selected && this.selected.code === item.code) {
        this.selected = null
      } else {
        this.selected = item
      }
    },

    check () {
      this.correct = this.selected && this.selected.is_correct
      this.dialog = true
    },

    nextQuestion () {
      if (this.correct) {
        this.$emit('next')
      }
      this.dialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.info-column {
  min-width: 300px !important;
}
</style>
