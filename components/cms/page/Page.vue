
<template>
  <div v-editable="blok" class="page">
    <component
      :is="blokElement.component"
      v-for="blokElement in blok.body"
      :key="blokElement._uid"
      :blok="blokElement"
    />
  </div>
</template>

<script>
export default {
  name: 'Page',

  props: {
    blok: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
