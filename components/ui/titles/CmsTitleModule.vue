<template>
  <div v-editable="blok">
    <div class="title underlined-title">
      <span>
        {{ blok.title }}
      </span>
    </div>
    <div class="description">
      {{ blok.description }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'CmsTitleModule',

  props: {
    blok: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang="scss" scoped>

.title {
  font-size: 50px;
  margin: 30px auto;
  margin-top: 80px;
  max-width: 800px;
  color: $pg-black;
  font-weight: bold;
  text-align: center;
}

.description {
  margin: 0 auto;
  text-align: center;
  max-width: 800px;
  margin-top: 25px;
  color: $pg-black;
}

.underlined-title {
  display: block;
  text-align: center;

  > * {
    display: inline;
    font-size: 50px;
    font-weight: bold;
    background: linear-gradient(to bottom, transparent 70%, $pg-main 70%);
    box-decoration-break: clone;
  }
}

</style>
