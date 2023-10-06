<template>
  <v-overlay :dark="false" :value="viewOverlay" z-index="4000">
    <div class="d-flex flex-column align-center">
      <img src="@/assets/svg/welcome.svg" class="pg-block pg-mx-auto pg-w-8/12" />
      <h2 class="overlay-title pg-text-lg md:pg-text-4xl pg-mb-2">
        {{ $t('welcome.overlay.title') }}
      </h2>
      <h2 class="overlay-subtitle pg-text-lg md:pg-text-2xl">
        {{ $t('welcome.overlay.subtitle1') }} <nuxt-link :to="{ name: 'app-account-index' }">
          {{ $t('welcome.overlay.subtitle2') }}
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
  color: #B2E68D;
}

.overlay-subtitle {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 700;
  text-align: center;
  color: #FFFFFF;

  a {
    color: #F89838 !important;
    text-decoration: underline !important;
  }
}
</style>
