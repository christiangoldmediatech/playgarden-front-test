<template>
  <div
    v-editable="blok"
    class="section__wrapper"
  >
    <div
      :id="blok.sectionLink"
      class="link-helper"
    />
    <div class="section__title">
      {{ blok.title || title }}
    </div>
    <div class="section__subtitle">
      {{ blok.subtitle || subtitle }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'CmsSectionTitle',

  props: {
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    blok: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang="scss" scoped>

.section__wrapper {
  margin: 40px 0;
  position: relative;
}

.section__title {
  font-weight: 600;
  font-size: 32px;
  letter-spacing: 6.75px;
  line-height: 27px;
  color: $pg-black;
  text-transform: uppercase;
}

.section__subtitle {
  font-size: 19px;
  color: #707070
}

.link-helper {
  position: absolute;
  top: -10px;
}

@media (max-width: 600px) {
  .section__title {
    text-align: center;
    font-size: 28px;
  }

  .section__subtitle {
    font-size: 17px;
    text-align: center;
  }
}

</style>
