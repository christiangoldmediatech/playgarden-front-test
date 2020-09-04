<template>
  <div
    v-editable="blok"
    class="wrapper"
    :style="{'--card-shadow-color': bgColor}"
  >
    <a
      class="card"
      :href="blok.link || link"
    >
      <img
        v-if="image !== ''"
        :src="image"
      >
    </a>
    <div class="card__title">
      {{ title }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'CircularCard',

  props: {
    blok: {
      type: Object,
      default: () => ({})
    },
    bgColor: {
      type: String,
      default: '#c2daa5'
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
  }
}
</script>

<style lang="scss" scoped>

$shadow-color:  rgba(0, 0, 0, 0.25);
$card-size: 160px;
$shadow-offset: 15px;

.wrapper {
  margin: 10px 0;
  padding-left: 25px;
  padding-right: $shadow-offset + 25px;
  position: relative;
  z-index: 1;
}

.card {
  @include rounded-element($card-size);
  display: block;
  position: relative;
  background: white;
  cursor: pointer;
  box-shadow: 0 3px 12px 0 $shadow-color;

  &::before {
    @include rounded-element(100%);
    content: '';
    position: absolute;
    top: 10px;
    left: $shadow-offset;
    background: var(--card-shadow-color);
    z-index: -1;
    box-shadow: 0 3px 12px 0 $shadow-color;
  }

  > img {
    @include rounded-element($card-size);
    overflow: hidden;
    object-fit: cover;
  }
}

.card__title {
  max-width: $card-size;
  margin-top: 23px;
  font-weight: 600;
  font-size: 20px;
  text-align: center;
  color: #707070;
}

@media (max-width: 600px) {
  .wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
  }

  .card {
    &,
    & > img {
      @include rounded-element(56px);
    }

    &::before {
      left: 5px;
      top: 5px;
    }
  }

  .card__title {
    max-width: 300px;
    flex: 1 0;
    text-align: left;
    padding-left: 20px;
    margin-top: 0;
  }
}

</style>
