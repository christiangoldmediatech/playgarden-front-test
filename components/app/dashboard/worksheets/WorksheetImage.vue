<template>
  <v-hover v-slot="{ hover }">
    <div
      :class="classes(hover, item.code)"
      v-on="$listeners"
    >
      <v-responsive
        :class="['rounded-circle', { 'worksheet-selected': item.code === selected }]"
        :width="size"
        :height="size"
      >
        <v-img
          :src="item.image"
          aspect-ratio="1"
        />
      </v-responsive>
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
          'worksheet-item rounded-circle text-center mx-4',
          { clickable: this.$attrs.hoverable !== undefined },
          { 'worksheet-scaled': this.$attrs.hoverable !== undefined && (hover || this.selected === code) }
        ]
      }
    }
  }
}
</script>
