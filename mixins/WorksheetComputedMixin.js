import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('admin/curriculum', { lesson: 'getLesson' }),

    worksheets () {
      if (this.lesson) {
        return this.lesson.worksheets.filter(({ type }) => type === 'ONLINE')
      }
      return []
    },

    stepCount () {
      return this.worksheets.length
    },

    lastQuestion () {
      return this.step === this.stepCount
    },

    progress () {
      if (this.stepCount) {
        return Math.round((this.step / this.stepCount) * 100)
      }
      return 0
    },

    currentSheet () {
      if (this.worksheets.length) {
        return this.worksheets[this.step - 1]
      }
      return null
    },

    worksheetTable () {
      if (this.currentSheet) {
        return this.currentSheet.worksheetTable
      }
      return null
    },

    question () {
      if (this.worksheetTable) {
        return this.worksheetTable.question
      }
      return null
    },

    connectingPairs () {
      if (this.worksheetTable) {
        return this.worksheetTable.type === 'CONNECTING_PAIRS'
      }
      return false
    },

    tapCorrect () {
      if (this.worksheetTable) {
        return this.worksheetTable.type === 'TAP_CORRECT'
      }
      return false
    },

    images () {
      if (this.worksheetTable) {
        return this.worksheetTable.images || []
      }
      return []
    },

    selectedItem () {
      if (this.images.length && this.selected) {
        return this.images.find(({ code }) => code === this.selected)
      }
      return null
    },

    lastWord () {
      return this.answers.length === (this.items.length - 1)
    }
  }
}
