<template>
  <div class="letter-lesson" @click="sendLetter">
    <recorded-letter
      v-bind="{ letter: item, small: smallLetter, disabled: !item.enabled }"
      list-mode
    />
  </div>
</template>

<script>
import RecordedLetter from '@/components/app/live-sessions/recorded/RecordedLetter.vue'
export default {
  name: 'Letter',

  components: {
    RecordedLetter
  },

  props: {
    item: {
      type: Object,
      required: true,
      default: () => []
    },
    index: {
      type: Number,
      required: true
    },
    smallLetter: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  computed: {},

  watch: {},

  created () {},

  methods: {
    sendLetter() {
      if (!this.item.disabled) {
        this.$nuxt.$emit('show-curriculum-progress', this.item.id)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.letter-lesson {
  cursor: pointer !important;
}
</style>
