<template>
  <dir
    v-editable="blok"
    class="header-wrapper"
  >
    <div class="header pg-image--cover">
      <!-- Header outer titlte -->
      <div class="header__title pg-title--uppercase">
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
        <div class="pg-title--uppercase">
          {{ blok.cardTitle }}
        </div>
        <p>
          {{ blok.cardDescription }}
        </p>
        <div class="header__card__button">
          <component
            :is="button.component"
            v-for="button in blok.cardButtons"
            :key="button._uid"
            :blok="button"
          />
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
$header-height: 500px;
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
  margin-top: $top-spacing;
  margin-bottom: $bottom-spacing;

  /* Background block */
  &::after {
    content: '';
    position: absolute;
    z-index: -1;
    top: -$top-spacing - $page-margin;
    left: 50%;
    transform: translateX(-50%);
    background: $pg-main;
    width: 100vw;
    height: $inner-line-height;
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
  padding: 30px 40px;
  background: white;
  box-shadow: 4px 3px 6px 0 rgba(0, 0, 0, 0.2);
  color: $pg-black;
}

.header__card__button {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;

  > * {
    flex: 1 1;
  }
}

</style>
