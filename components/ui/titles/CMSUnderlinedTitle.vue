<template>
  <div
    ref="title"
    class="title__wrapper"
  >
    <div
      class="title"
    >
      <div
        v-for="(line, idx) in titleElements"
        :key="idx"
        class="title__line pg-text--underlined"
      >
        {{ line }}
      </div>
    </div>
  </div>
</template>

<script>
import TextHandler from '@/utils/textHandlers'

export default {
  name: 'CMSUnderlinedTitle',

  props: {
    title: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      titleElements: [],
      listenerFn: null
    }
  },

  mounted () {
    const assignTitle = () => {
      this.$nextTick(() => {
        this.titleElements = TextHandler.breakTextIntoLines(window, this.title, this.$refs.title)
      })
    }

    assignTitle()
    this.listenerFn = assignTitle
    window.addEventListener('resize', assignTitle)
  },

  destroyed () {
    window.removeEventListener('resize', this.listenerFn)
  }
}
</script>

<style lang="scss" scoped>

$title-font-size: 50px;

.title__wrapper {
  @include parent-stack-context;
}

.title {
  margin: 0 auto;
  max-width: 800px;
  color: var(--v-black-base);
  text-align: center;
  position: relative;
  font-size: $title-font-size;
}

.title__line {
  font-weight: bold;
  font-size: $title-font-size;
  line-height: 63px;
  display: inline-block;
  white-space: nowrap;
  position: relative;
}

@media (max-width: 800px) {
  .title {
    margin-bottom: 20px;
    line-height: 1;
  }

  .title__line {
    font-size: 34px;
    line-height: 0.6;

    &::after {
      bottom: -10px;
    }
  }
}

</style>
