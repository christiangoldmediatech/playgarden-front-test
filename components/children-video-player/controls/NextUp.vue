<template>
  <div class="control-container d-flex align-center justify-end">
    <v-sheet
      :class="['coming-up-next rounded-l pa-1', { 'shown': params.show }]"
      color="rgba(0, 0, 0, 0.74)"
      max-width="256"
      width="100%"
    >
      <v-list color="rgba(0,0,0,0)" dense>
        <v-list-item>
          <v-list-item-avatar tile>
            <v-img :src="params.image" :aspect-ratio="1" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              {{ params.title }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ params.description }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-sheet>
  </div>
</template>

<script>
export default {
  name: 'NextUp',

  props: {
    params: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.coming-up-next {
  transition: transform 1s;
  transform: translate(100%);
}

.shown {
  transform: translate(0%);
}
</style>
