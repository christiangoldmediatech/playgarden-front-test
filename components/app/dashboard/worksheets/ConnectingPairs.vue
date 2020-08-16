<template>
  <v-row class="my-8" justify="center">
    <v-col cols="12">
      <span class="d-block text-center text-h4 font-weight-bold">
        {{ randomWord }}
      </span>
    </v-col>

    <worksheet-image
      v-for="item in items"
      :key="`images-${item.code}`"
      v-bind="{ item, selected: selected ? selected.code : null }"
      hoverable
      @click.stop="select(item)"
    />

    <v-col
      class="mt-10"
      cols="12"
      sm="10"
      md="8"
      lg="6"
      xl="4"
    >
      <continue-button
        :disabled="!selected"
        @click.stop="showResult"
      />
    </v-col>

    <worksheet-message
      v-model="dialog"
      v-bind="{ correct, selected: selected || {} }"
    >
      <template v-if="selected">
        <span class="d-block mt-2 text-h6 font-weight-bold">
          {{ randomWord }}
        </span>

        <p>
          <template v-if="correct">
            is the correct answer!
          </template>
          <template v-else>
            is not a {{ randomWord }}
          </template>
        </p>
      </template>

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
import WorksheetImage from './WorksheetImage.vue'
import WorksheetMessage from './WorksheetMessage.vue'
import ContinueButton from './ContinueButton.vue'

export default {
  name: 'ConnectingPairs',

  components: {
    WorksheetImage,
    WorksheetMessage,
    ContinueButton
  },

  props: {
    images: {
      type: Array,
      required: true
    }
  },

  data: () => {
    return {
      selected: null,
      dialog: false,
      answers: [],
      items: [],
      randomWord: null
    }
  },

  computed: {
    correct () {
      if (this.selected && this.selected.word === this.randomWord) {
        return true
      }
      return false
    },

    buttonText () {
      if (this.answers.length === (this.items.length - 1)) {
        if (this.$attrs.lastQuestion) {
          return 'Complete worksheet'
        }
        return 'Next question'
      }
      return 'Next word'
    }
  },

  created () {
    this.getRandomWord()
  },

  methods: {
    select (item) {
      if (this.selected && this.selected && this.selected.code === item.code) {
        this.selected = null
      } else {
        this.selected = item
      }
    },

    getRandomWord () {
      this.items = shuffle(this.images)
      const remaining = this.items.filter(item => !this.answers.includes(item.word))
      if (remaining.length) {
        const max = remaining.length
        const index = (max > 1) ? Math.floor(Math.random() * max) : 0
        this.randomWord = remaining[index].word || null
      }
    },

    showResult () {
      this.dialog = true
    },

    nextQuestion () {
      if (this.correct) {
        this.answers.push(this.selected.word)
        this.getRandomWord()
        if (this.answers.length === this.items.length) {
          this.$emit('next')
        }
      }
      this.selected = null
      this.dialog = false
    }
  }
}
</script>
