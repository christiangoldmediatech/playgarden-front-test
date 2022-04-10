<template>
  <pg-text-field
    v-model="searchText"
    class="search-text-field"
    rounded
    dense
    hide-details
    @keyup.enter="handleSubmit"
  >
    <template #append>
      <div class="search-button clickable" @click="handleSubmit">
        <v-icon color="white" x-large>
          mdi-magnify
        </v-icon>
      </div>
    </template>
  </pg-text-field>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'SearchTextField',
  setup(_, { emit }) {
    const searchText = ref('')

    function handleSubmit() {
      emit('search', searchText.value)
    }

    return {
      searchText,
      handleSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
.v-input.search-text-field::v-deep {
  .v-input__control {
    .v-input__slot {
      overflow: hidden;
      background-color: white;
      box-shadow: inset 1px 1px 19px rgba(0, 0, 0, 0.14) !important;
    }
  }

  .search-button {
    display: flex;
    align-items: center;
    position: relative;
    left: 24px;
    padding-left: 16px;
    padding-right: 16px;
    height: 60px;
    background-color: var(--v-accent-base);
  }
}
</style>
