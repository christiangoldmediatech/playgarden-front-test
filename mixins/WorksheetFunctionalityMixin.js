import { mapActions } from 'vuex'
import { jsonCopy } from '@/utils/objectTools.js'
import { shuffle } from '@/utils/arrayTools.js'

export default {

  methods: {
    ...mapActions('children/lesson', ['saveWorksheetProgress']),

    waitAndLoad () {
      const interval = window.setInterval(() => {
        if (this.lesson) {
          this.getNextQuestion()
          window.clearInterval(interval)
        }
      }, 50)
    },

    saveProgress () {
      this.loading = true
      const promises = []

      const date = new Date().toISOString().substr(0, 19)
      this.children.forEach((child) => {
        this.saveWorksheetProgress({
          lessonId: this.lesson.id,
          childId: child.id,
          worksheet: {
            id: this.currentSheet.id,
            completed: true,
            date
          }
        })
      })

      Promise.all(promises).then(() => {
        this.$nuxt.$emit('dashboard-panel-update')
        this.loading = false
      })
    },

    getNextQuestion () {
      // Determine if first question
      if (this.step === 0) {
        if (this.id) {
          // Load requested question
          const index = this.worksheets.findIndex(({ id }) => this.id === id)
          this.setQuestion(index)
        } else {
          // Load first question
          this.setQuestion(0)
        }
      } else {
        // Save question
        if (!this.currentSheet.completed) {
          this.saveProgress()
        }
        // Find next question or complete
        if (this.lastQuestion) {
          this.completed = true
        } else {
          this.setQuestion(this.step)
        }
      }
    },

    reset () {
      this.selected = null
      this.answers = []
      this.items = []
      this.randomWord = null
      this.correct = false
    },

    getRandomWord () {
      const newItems = shuffle(jsonCopy(this.images))
      const remaining = newItems.filter(item => !this.answers.includes(item.word))
      if (remaining.length) {
        const max = remaining.length
        const index = (max > 1) ? Math.floor(Math.random() * max) : 0
        const word = remaining[index].word
        this.randomWord = word || null
      }
      this.items = newItems
    },

    setQuestion (index) {
      this.reset()
      this.step = index + 1

      // Handle different types of questions
      if (this.connectingPairs) {
        this.getRandomWord()
      } else if (this.tapCorrect) {
        this.items = shuffle(jsonCopy(this.images))
      }
    },

    nextStep () {
      if (this.correct) {
        if (this.connectingPairs) {
          if (this.lastWord) {
            this.getNextQuestion()
          } else {
            this.answers.push(this.selectedItem.word)
            this.getRandomWord()
          }
        } else if (this.tapCorrect) {
          this.getNextQuestion()
        }
      }
      this.selected = null
      this.dialog = false
    }
  }
}
