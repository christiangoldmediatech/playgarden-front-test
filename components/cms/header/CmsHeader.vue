<template>
  <dir
    v-editable="blok"
    class="header-wrapper"
  >
    <div class="header pg-image--cover">
      <!-- Header outer titlte -->
      <div
        v-if="blok.displayTitle"
        class="header__title pg-title--uppercase"
      >
        <img
          v-if="blok.icon"
          class="header__title__icon"
          :src="blok.icon"
        >
        <div>
          {{ blok.title }}
        </div>
      </div>
      <!-- Header image -->
      <img :src="blok.image" :alt="blok.imageCaption">
      <!-- Header card -->
      <div class="header__card">
        <div class="header__card__title pg-title--uppercase">
          {{ blok.cardTitle }}
        </div>
        <p>
          {{ blok.cardDescription }}
        </p>
        <div class="header__card__button">
          <div
            v-for="button in blok.cardButtons"
            :key="button._uid"
            class="button__container"
          >
            <component
              :is="button.component"
              :key="button._uid"
              :blok="button"
            />
          </div>
        </div>
      </div>
    </div>
  </dir>
</template>

<script>
export default {
  // eslint-disable-next-line vue/match-component-file-name
  name: 'CmsHeader',

  props: {
    blok: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang="scss" scoped>
$inner-line-height: 140px;
$header-height: 400px;
$top-spacing: 70px;
$bottom-spacing: 70px;
$page-margin: 12px;

.header-wrapper {
  position: relative;
  z-index: 1;
}

.header {
  height: $header-height;
  position: relative;
  background: white;
  margin-bottom: $bottom-spacing;

  /* Background block */
  &::after {
    content: '';
    position: absolute;
    z-index: -1;
    top: 60%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--v-primary-base);
    width: 100vw;
    height: 40%;
  }
}

$header-title-margin: 10px;

.header__title {
  border-radius: 10px;
  position: absolute;
  left: 0;
  bottom: calc(100% + #{$header-title-margin});
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  background: white;
  display: flex;
  align-items: center;
  padding: 10px 40px;
  font-size: 28px;
}

.header__title__icon {
  margin-right: 20px;
  width: 35px;
}

.header__card {
  max-width: 750px;
  position: absolute;
  bottom: 0;
  right: 5%;
  transform: translateY(30px);
  padding: 30px 80px;
  background: white;
  box-shadow: 4px 3px 6px 0 rgba(0, 0, 0, 0.2);
  color: var(--v-black-base);
}

.header__card__button {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
}

.button__container {
  margin: 0 15px;

  &:first-child {
    margin-left: 0;
    margin-right: 15px;
  }

  &:last-child {
    margin-right: 0;
    margin-left: 15px;
  }
}

@media (max-width: 860px) {
  .header {
    @include flex();
    flex-flow: row wrap;
    height: auto;

    > img {
      height: 200px;
    }
  }

  .header__card {
    width: 80vw;
    margin-top: -70px;
    position: static;
    padding: 15px 20px;
  }

  .header__card__button {
    flex-flow: row wrap;
  }

  .button__container {
    display: flex;

    &,
    &:first-child,
    &:last-child {
      margin: 10px 0;
    }
  }

  .header__card__title {
    text-align: center;
    letter-spacing: 0.1em;
  }
}

@media (max-width: 700px) {
  .header__title {
    letter-spacing: 0.2em;
    font-size: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    padding: 10px 20px;
  }
}

</style>
