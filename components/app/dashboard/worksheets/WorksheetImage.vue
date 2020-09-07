<template>
  <v-hover v-slot="{ hover }">
    <div
      :class="classes(hover, item.code)"
      v-on="$listeners"
    >
      <!-- <v-responsive
        :class="['rounded-circle', { 'worksheet-selected': item.code === selected }]"
        :aspect-ratio="1"
      >
        <v-img
          :src="item.image"
          :aspect-ratio="1"
        />
      </v-responsive> -->
      <v-img
        :class="['rounded-circle', { 'worksheet-selected': item.code === selected }]"
        :src="item.image"
        :aspect-ratio="1"
      />
      <slot />
    </div>
  </v-hover>
</template>

<script>
export default {
  name: 'WorksheetImage',

  props: {
    item: {
      type: Object,
      required: true
    },

    selected: {
      type: [Number, String],
      required: false,
      default: null
    },

    size: {
      type: [Number, String],
      required: false,
      default: 198
    }
  },

  computed: {
    classes () {
      return (hover, code) => {
        return [
          'worksheet-item rounded-circle text-center mx-4 my-2',
          { clickable: this.$attrs.hoverable !== undefined },
          { 'worksheet-scaled': this.$attrs.hoverable !== undefined && (hover || this.selected === code) }
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.worksheet-item {
    transition: transform 250ms;
}

.worksheet-scaled {
    transform: scale(1.11);
    z-index: 1;
}

.worksheet-selected {
     ::after {
        border-radius: 50%;
        box-shadow: inset 0px 0px 0px 10px var(--v-primary-base);
        content: "";
        display: block;
        height: 100%;
        position: absolute;
        top: 0;
        width: 100%;
    }
}
</style>
