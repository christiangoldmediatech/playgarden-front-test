<template>
  <div
    v-editable="blok"
    class="wrapper"
    :style="{'--card-shadow-color': bgColor}"
  >
    <a
      class="card"
      :href="innerLink"
      @click="emitEvent"
    >
      <img
        v-if="image !== ''"
        :src="image"
      >
    </a>
    <div class="card__title pg-title--uppercase">
      {{ title }}
    </div>
  </div>
</template>

<script>
import linkTarget from '@/utils/mixins/cms/linkTarget'

export default {
  name: 'CircularCard',

  mixins: [linkTarget],

  props: {
    blok: {
      type: Object,
      default: () => ({})
    },
    bgColor: {
      type: String,
      default: 'var(--v-primary-base)'
    },
    image: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: ''
    }
  },

  computed: {
    innerLink () {
      return `#${this.blok.link || this.link}`
    }
  },

  mounted () {
    this.$nuxt.$on(this.blok.emitEvent, () => {
    })
  },

  methods: {
    emitEvent () {
      if (!this.blok.emitEvent) { return }

      this.$nuxt.$emit(this.blok.emitEvent)
    }
  }
}
</script>

<style lang="scss" scoped>

$shadow-color:  rgba(0, 0, 0, 0.15);
$card-size: 80px;
$shadow-offset: 15px;

$bg-dark-green: var(--v-primary-base);

.wrapper {
  display: flex;
  align-items: center;
  flex-flow: column nowrap;
  margin: 30px 0;
  position: relative;
  z-index: 1;
}

.card {
  scroll-behavior: smooth;
  @include rounded-element($card-size);
  display: block;
  position: relative;
  background: white;
  cursor: pointer;
  box-shadow: 0 3px 12px 0 $shadow-color;

  &::before {
    content: '';
    @include absoluteCentered;
    @include rounded-element(114%);
    background: var(--v-secondary-base);
    z-index: -1;
    box-shadow: 0 2px 4px 0 $shadow-color;
  }

  &::after {
    @include rounded-element(130%);
    @include absoluteCentered;
    content: '';
    position: absolute;
    z-index: -2;
    background: var(--v-primary-base);
    box-shadow: 0 2px 4px 0 $shadow-color;
  }

  > img {
    @include rounded-element(100%);
    overflow: hidden;
    object-fit: cover;
    object-position: center center;
  }
}

.card__title {
  width: calc(#{$card-size} * 2.2);
  margin-top: 30px;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  line-height: 20px;
  color: #707070;
  letter-spacing: 3px;
}

@media (max-width: 600px) {
  .wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px;
    flex-flow: row nowrap;
    width: auto;
  }

  .card {
    @include rounded-element(60px);
  }

  .card__title {
    max-width: 300px;
    flex: 1 0;
    text-align: left;
    padding-left: 20px;
    margin-top: 0;
    display: none;
  }
}

</style>
