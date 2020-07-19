import { jsonCopy } from '@/utils/objectTools'

export default {
  data: () => ({
    autoReset: true,
    draft: {} // to be override in component
  }),

  created () {
    if (this.autoReset) {
      this.resetDraft()
    }
  },

  methods: {
    $jsonCopy: jsonCopy,

    getSubmittableData () {
      return jsonCopy({ ...this.draft })
    },

    onCancel (reset) {
      if (reset) {
        reset()
      }

      this.resetDraft()
      this.$emit('click:cancel')
    },

    onSubmit () {
      this.$emit('click:submit', this.getSubmittableData())
    },

    resetDraft () {
      // to be override in component
      this.draft = {}
    }
  }
}
