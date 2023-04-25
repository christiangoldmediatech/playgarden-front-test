<template>
  <v-overlay :dark="false" :value="viewOverlay" z-index="4000">
    <div class="d-flex flex-column align-center">
      <img src="@/assets/svg/welcome.svg" />
      <h1 class="overlay-title">
        Your free trial has officially begun!
      </h1>
      <h2 class="overlay-subtitle">
        *Cancel any time from your <nuxt-link :to="{ name: 'app-account-index' }">
          Account Settings
        </nuxt-link>
      </h2>
    </div>
  </v-overlay>
</template>

<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'WelcomeOverlay',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  emits: ['input'],
  setup(props, { emit }) {
    const viewOverlay = computed({
      get() {
        return props.value
      },
      set(val) {
        emit('input', val)
      }
    })

    return { viewOverlay }
  }
})

</script>

<style lang="scss" scoped>
.overlay-title {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 700;
  font-size: 54px;
  line-height: 80px;
  color: #B2E68D;
}

.overlay-subtitle {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 700;
  font-size: 30px;
  line-height: 50px;
  text-align: center;
  color: #FFFFFF;

  a {
    color: #F89838 !important;
    text-decoration: underline !important;
  }
}
</style>
