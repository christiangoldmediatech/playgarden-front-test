<template>
  <v-hover v-slot="{ hover }">
    <v-card class="recorded-card clickable" :class="{ 'recorded-card-scaled': hover }" @click="openLink">
      <img
        v-if="entry.inCollaborationWith"
        class="recorded-card-sponsor"
        :src="entry.inCollaborationWith"
      >

      <div class="recorded-card-header">
        <div class="recorded-card-icon">
          <img class="recorded-card-img" :src="entry.activityType.icon">
        </div>
        <div>
          <span class="recorded-card-type">
            {{ entry.activityType.name }}
          </span><br>
          <span class="recorded-card-title">
            {{ entry.title }}
          </span>
        </div>
      </div>

      <div class="recorded-card-description">
        {{ entry.description }}
      </div>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  name: 'RecordedCard',

  props: {
    entry: {
      type: Object,
      required: true
    }
  },

  methods: {
    openLink () {
      this.$nuxt.$emit('open-entry-dialog', this.entry)
    }
  }
}
</script>

<style lang="scss">
.recorded-card {
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 250ms;
  &.v-card.v-sheet {
    box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.301961);
  }
  &-header {
    display: flex;
    align-items: flex-end;
    padding-top: 31px;
    padding-left: 18px;
    padding-bottom: 8px;
  }
  &-icon {
    width: 80px;
    height: 80px;
    max-width: 80px;
    max-height: 80px;
  }
  &-img {
    max-width: 80px;
    max-height: 80px;
    object-fit: contain;
    object-position: center;
  }
  &-type {
    font-size: 23px;
    font-weight: 700;
    padding-bottom: 12px;
    line-height: 1.5;
  }
  &-title {
    font-size: 23px;
    font-weight: 500;
    line-height: 1.5;
  }
  &-description {
    font-size: 18px;
    font-weight: 400;
    line-height: 1.5;
    padding-left: 21px;
    padding-right: 21px;
    padding-bottom: 18px;
  }
  &-sponsor {
    position: absolute;
    top: 0;
    right: 0;
    max-width: 200px;
    max-height: 50px;
    object-fit: contain;
    object-position: top right;
  }
  &-scaled {
    transform: scale(1.10);
    z-index: 1;
  }
}
</style>
