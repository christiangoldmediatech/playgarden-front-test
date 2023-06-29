<template>
  <div>
    <div class="ow-conn-pairs-question">
      {{ question.description }}
    </div>

    <div class="ow-conn-pairs-word">
      {{ randomWord }}
    </div>

    <div class="ow-conn-pairs-answers">
      <ow-image
        v-for="image in items"
        :key="`image-${image.code}`"
        clickable
        v-bind="{ image, selected }"
        @click="select(image.code)"
      />
    </div>

    <ow-ctn-btn
      :disabled="selected === null"
      v-bind="{ loading }"
      @click="openAnswerDialog"
    />

    <ow-message
      v-bind="{ correct, selectedImage }"
      @next="onNext"
    >
      <template v-if="selectedImage">
        <template v-if="correct">
          {{ selectedImage.word + ' ' + $t('dailyLessons.offlineWorksheet.correctAnswer') }}
        </template>
        <template v-else>
          {{ selectedImage.errorMessage }}
        </template>
      </template>

      <template v-if="correct" v-slot:button>
        <template v-if="!lastWord">
          {{ $t('dailyLessons.offlineWorksheet.nextWord') }}
        </template>
        <template v-else>
          {{ $t('commonWords.continue') }}
        </template>
        <v-icon right small>
          mdi-greater-than
        </v-icon>
      </template>
    </ow-message>
  </div>
</template>

<script>
import { jsonCopy } from '@/utils/objectTools'
import { shuffle } from '@/utils/arrayTools.js'

import OwImage from './OwImage.vue'
import OwCtnBtn from './OwCtnBtn.vue'
import OwMessage from './OwMessage.vue'

export default {
  name: 'OwConnectingPairs',

  components: {
    OwImage,
    OwCtnBtn,
    OwMessage
  },

  props: {
    question: {
      type: Object,
      required: true
    }
  },

  data: () => {
    return {
      selected: null,
      loading: false,
      answers: [],
      items: [],
      randomWord: null
    }
  },

  computed: {
    selectedImage () {
      if (this.selected) {
        return this.question.worksheetTable.images.find(({ code }) => code === this.selected)
      }
      return null
    },

    correct () {
      return Boolean(this.selectedImage && this.selectedImage.word === this.randomWord)
    },

    lastWord () {
      return this.answers.length === (this.items.length - 1)
    }
  },

  created () {
    this.$nuxt.$on('reset-question', this.reset)
    this.getRandomWord()
  },

  methods: {
    reset () {
      this.selected = null
      this.loading = false
      this.answers = []
      this.items = []
      this.randomWord = null
      this.getRandomWord()
    },

    select (code) {
      if (this.selected === code) {
        this.selected = null
        return
      }
      this.selected = code
      this.$nextTick(() => {
        this.openAnswerDialog()
      })
    },

    getRandomWord () {
      const newItems = shuffle(jsonCopy(this.question.worksheetTable.images))
      const remaining = newItems.filter(item => !this.answers.includes(item.word))
      if (remaining.length) {
        const max = remaining.length
        const index = (max > 1) ? Math.floor(Math.random() * max) : 0
        const word = remaining[index].word
        this.randomWord = word || null
      }
      this.selected = null
      this.items = newItems
    },

    openAnswerDialog (e) {
      this.$nuxt.$emit('show-ow-message')
    },

    onNext () {
      if (this.lastWord) {
        this.loading = true
        this.$emit('next-question')
      } else {
        this.answers.push(this.selectedImage.word)
        this.getRandomWord()
      }
    }
  }
}
</script>

<style lang="scss">
.ow-conn-pairs {
  &-question {
    margin-top: 16px;
    text-align: center;
    font-weight: bold;
    font-size: 14px;
    line-height: 2.57;
    padding: 0 8px;
    @media screen and (min-width: 600px) {
      font-size: 23px;
    }
    @media screen and (min-width: 1904px) {
      font-size: 32px;
    }
  }
  &-word {
    text-align: center;
    font-weight: bold;
    font-size: 14px;
    line-height: 2;
    padding: 0 8px;
    margin-bottom: 12px;
    @media screen and (min-width: 600px) {
      font-size: 23px;
    }
    @media screen and (min-width: 1904px) {
      font-size: 32px;
    }
  }
  &-answers {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
}
</style>
