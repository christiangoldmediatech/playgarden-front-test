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
      <div class="text-center">
        <v-btn
          small
          class="primary text-none text-caption font-weight-bold"
          data-test-id="patch-badge-row-btn"
          @click="goToVideos"
        >
          {{ patchUnlockText }}
        </v-btn>
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
    },
    activityTypeName: {
      type: String,
      default: ''
    },
    activityTypeId: {
      type: Number,
      default: 0
    },
    isMobile: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    total () {
      return (Math.floor(this.toUnlock / 5) + 1) * 5
    },
    progressPercentage () {
      return this.toUnlock / this.total * 100
    },
    patchUnlockText () {
      return this.isMobile ? this.$t('studentCubby.patches.unlockShort') : this.$t('studentCubby.patches.unlockLong')
    }
  },
  methods: {
    goToVideos () {
      this.$router.push({
        name: 'app-library-category-activityTypeId',
        params: { activityTypeId: this.activityTypeId }
      })
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
