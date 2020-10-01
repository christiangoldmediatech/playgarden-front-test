<template>
  <div
    v-editable="blok"
    class="card__wrapper"
  >
    <div class="card">
      <div
        v-if="blok.image || image"
        class="card__image"
      >
        <img :src="blok.image || image">
      </div>
      <div class="card__content">
        <div class="card__title">
          {{ blok.title || title }}
        </div>
        <div class="card__link">
          <a
            :target="linkTarget"
            :href="innerLink"
            class="underlined-link"
            @click="toLink"
          >
            Read here
          </a>
          <img
            :src="require('@/assets/png/player/right-arrow.svg')"
            class="arrow"
            width="20px"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import linkTarget from '@/utils/mixins/cms/linkTarget'

export default {
  name: 'SquaredCard',

  mixins: [linkTarget],

  props: {
    blok: {
      type: Object,
      default: () => ({})
    },
    image: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: 'Placeholder title'
    },
    link: {
      type: String,
      default: ''
    }
  },

  computed: {
    innerLink () {
      if (this.blok.link) { return this.blok.link.cached_url.replace('app/', '') }
      return this.link
    }
  }
}
</script>

<style lang="scss" scoped>
$border-height: 3px;

.card__wrapper {
  padding: 0 18px;
}

.card {
  width: 320px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  transition: transform 0.2s;
  transform: scale(1);

  &:hover {
    transform: scale(1.07);
  }
}

.card__image {
  height: 180px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.card__content {
  height: 125px;
  flex-grow: 1;
  padding: 15px 20px;
  background: white;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
}

.card__title {
  color: $pg-black;
  font-weight: 600;
  font-size: 18px;
  text-align: left;
}

.card__link {
  text-align: right;
}

.underlined-link {
  position: relative;
  font-size: 11px;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: $pg-black;
  z-index: 0;

  &::after {
    content: '';
    position: absolute;
    width: calc(120%);
    height: 5px;
    left: 50%;
    bottom: 2px;
    transform: translateX(-50%);
    border-radius: 30px;
    background: $pg-main;
    z-index: -1;
  }
}

.arrow {
  margin-left: 5px;
  margin-right: 10px;
}

</style>
