<template>
  <div class="next-up-container">
    <v-sheet
      :class="['coming-up-next rounded-l pa-1', { 'shown': params.show }]"
      color="rgba(0, 0, 0, 0.74)"
      max-width="256"
      width="100%"
    >
      <v-list dark color="rgba(0,0,0,0)" dense>
        <v-list-item>
          <v-list-item-avatar tile>
            <v-img :src="params.image" :aspect-ratio="1" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold control-bar-text text-left">
              {{ params.title }}
            </v-list-item-title>
            <v-list-item-subtitle class="font-weight-medium">
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
.next-up-container {
  position: relative;
  left: 100%;
  bottom: 32px;
}

.coming-up-next {
  transition: transform ease 1s, opacity ease 1s;
  transform: translate(0%);
  opacity: 0;
}

.shown {
  transform: translate(-100%);
  opacity: 1;
}
</style>
