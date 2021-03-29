<template>
  <v-responsive
    class="rounded-circle position-relative"
    aspect-ratio="1"
    :max-width="maxWidth"
  >
    <v-img
      :class="{ 'dark-greyscale': !patch.unblocked }"
      :src="patch.image"
      aspect-ratio="1"
      @click.stop="$emit('display-badge')"
    />

    <div v-if="shouldShowProgress && !patch.unblocked" class="absolute-center">
      <v-progress-linear
        color="warning"
        height="10"
        rounded
        :value="progressPercentage"
        background-color="white"
      />
      <div class="font-weight-medium white--text text-center">
        {{ toUnlock }} / {{ total }}
      </div>
    </div>
  </v-responsive>
</template>

<script>
export default {
  name: 'Badge',

  props: {
    patch: {
      type: Object,
      required: true
    },
    maxWidth: {
      type: Number,
      default: undefined
    },
    toUnlock: {
      type: Number,
      default: 0
    },
    shouldShowProgress: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      total: 5
    }
  },

  computed: {
    progressPercentage () {
      return this.toUnlock * 20
    }
  }
}
</script>

<style lang="scss" scoped>
.position-relative {
  position: relative;
}

.absolute-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  margin-top: 10px;
}

.dark-greyscale {
  -webkit-filter: grayscale(100%) brightness(70%); /* Chrome, Safari, Opera */
  filter: grayscale(100%) brightness(70%);
}
</style>
