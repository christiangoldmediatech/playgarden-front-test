<template>
  <v-col
    class="pa-4 py-0"
    cols="6"
    sm="3"
    xl="2"
  >
    <v-hover v-slot="{ hover }">
      <div
        :class="['text-center worksheet-item', { 'worksheet-item-scaled': hover || active }]"
      >
        <v-img
          class="mx-auto worksheet-item-shadow"
          :src="item.image"
          max-width="200"
          aspect-ratio="1"
        >
          <div :class="['worksheet-item-image', { 'clickable': clickable, 'worksheet-item-image-selected': active }]" @click.stop="setActive" />
        </v-img>
        <span v-if="showWord" class="worksheet-item-text">
          {{ item.word }}
        </span>
      </div>
    </v-hover>
  </v-col>
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
      required: true,
      validator: (val) => {
        if (['number', 'string'].includes(typeof val) || val === null) {
          return true
        }
        return false
      }
    },
    clickable: {
      type: Boolean,
      required: false,
      default: false
    },
    showWord: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  computed: {
    active () {
      return this.selected === this.item.code
    }
  },

  methods: {
    setActive () {
      if (this.clickable) {
        let value = this.item.code
        if (value === this.selected) {
          value = null
        }
        this.$emit('update:selected', value)
      }
    }
  }
}
</script>

<style lang="scss">
.worksheet {
  &-item {
    transition: transform 250ms;
    &-scaled {
      transform: scale(1.11);
    }
    &-shadow {
      box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.2);
    }
    &-image {
      width: 100%;
      height: 100%;
      &-selected {
        box-shadow: inset 0px 0px 0px 8px var(--v-primary-base);
      }
    }
    &-text {
      display: block;
      text-align: center;
      font-weight: bold;
      font-size: 18px;
      margin-top: 16px;
    }
  }
}
</style>
