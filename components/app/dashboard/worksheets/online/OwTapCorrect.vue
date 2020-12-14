<template>
  <div>
    <div class="ow-tap-cqt-question">
      {{ question.description }}
    </div>

    <div class="ow-tap-cqt-answers">
      <ow-image
        v-for="image in question.worksheetTable.images"
        :key="`image-${image.code}`"
        clickable
        :word="image.word"
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
      <template v-if="correct" v-slot:button>
        Continue
        <v-icon right small>
          mdi-greater-than
        </v-icon>
      </template>
    </ow-message>
  </div>
</template>

<script>
import OwImage from './OwImage.vue'
import OwCtnBtn from './OwCtnBtn.vue'
import OwMessage from './OwMessage.vue'

export default {
  name: 'OwTapCorrect',

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
      loading: false
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
      return Boolean(this.selectedImage && this.selectedImage.is_correct)
    }
  },

  created () {
    this.$nuxt.$on('reset-question', () => {
      this.selected = null
      this.loading = false
    })
  },

  methods: {
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

    openAnswerDialog () {
      this.$nuxt.$emit('show-ow-message')
    },

    onNext () {
      this.loading = true
      this.$emit('next-question')
    }
  }
}
</script>

<style lang="scss">
.ow-tap-cqt {
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
  &-answers {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
}
</style>
