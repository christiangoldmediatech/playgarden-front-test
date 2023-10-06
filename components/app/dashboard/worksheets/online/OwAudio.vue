<template>
  <div>
    <div class="ow-tap-cqt-question">
      {{ question.description }}
    </div>

    <ow-audio-player :audio="question.worksheetTable.audio" />

    <div class="ow-tap-cqt-answers">
      <ow-image
        v-for="image in images"
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
        {{ $t('commonWords.continue') }}
        <v-icon right small>
          mdi-greater-than
        </v-icon>
      </template>
    </ow-message>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { jsonCopy } from '@/utils/objectTools'
import { shuffle } from '@/utils/arrayTools.js'
import isEqual from 'lodash/isEqual'

import OwImage from './OwImage.vue'
import OwCtnBtn from './OwCtnBtn.vue'
import OwMessage from './OwMessage.vue'
import OwAudioPlayer from './OwAudioPlayer.vue'

export default {
  name: 'OwAudio',

  components: {
    OwImage,
    OwCtnBtn,
    OwMessage,
    OwAudioPlayer
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
      images: [],
      questionCopy: null
    }
  },

  computed: {
    ...mapGetters({ children: 'getCurrentChild' }),
    ...mapGetters('admin/curriculum', { lesson: 'getLesson' }),
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

  watch: {
    question: {
      immediate: true,
      handler (newQuestion, oldQuestion) {
        if (isEqual(newQuestion, oldQuestion)) {
          return
        }
        this.images = shuffle(jsonCopy(this.question.worksheetTable.images))
      }
    }
  },

  created () {
    this.$nuxt.$on('reset-question', () => {
      this.selected = null
      this.loading = false
    })

    this.questionCopy = {
      ...this.question,
      worksheetTable: {
        ...this.question.worksheetTable,
        audio: '/foghorn.mp3'
      }
    }
  },

  methods: {
    ...mapActions('admin/curriculum/worksheet', ['createWorksheetLog']),
    async select (code) {
      try {
        if (this.selected === code) {
          this.selected = null
          return
        }
        this.selected = code
        const status = (this.correct) ? 'COMPLETED' : 'ERROR'
        const dataWorksheetLog = { codeImage: this.selected, status }

        this.$nextTick(() => {
          this.openAnswerDialog()
        })
        await this.createWorksheetLog({ lessonId: this.lesson.id, worksheetId: this.question.id, childId: this.children[0].id, data: dataWorksheetLog })
      } catch (error) {}
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

<style scoped lang="scss">
.ow-tap-cqt {
  &-question {
    margin-top: 8px;
    text-align: center;
    font-weight: bold;
    font-size: 14px;
    line-height: 3rem;
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
