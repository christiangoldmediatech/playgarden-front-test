<template>
  <div
    :style="{ 'justify-content': blok.alignment }"
    class="cms-container"
  >
    <component
      :is="element.component"
      v-for="element in blok.elements"
      ref="components"
      :key="element._uid"
      :image="element.image"
      :title="element.title"
      :blok="element"
    />
  </div>
</template>

<script>
export default {
  name: 'CmsContainer',

  props: {
    blok: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang="scss" scoped>

.cms-container {
  display: flex;
  justify-content: center;
  flex-flow: row wrap;
  width: 100%;
}

</style>
