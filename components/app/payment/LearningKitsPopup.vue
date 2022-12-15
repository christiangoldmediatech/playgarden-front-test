<template>
  <pg-dialog v-model="dialog" persistent transition="fade">
    <div v-if="$vuetify.breakpoint.smAndDown" class="pg-flex pg-justify-center">
      <div class="pg-relative pg-w-full pg-max-w-[600px]">
        <img
          class="pg-w-full"
          :src="require('@/assets/png/learning-kits-popup-mobile.png')"
          aria-hidden="true"
          alt="Learning Kits"
        />
        <v-btn
          class="close-btn"
          icon
          x-large
          color="#FAA938"
          title="Close"
          @click="dialog = false"
        >
          <v-icon x-large>
            mdi-close-circle
          </v-icon>
        </v-btn>
        <v-btn
          class="buy-btn v2-font"
          color="#BA89EB"
          outlined
          :x-large="$vuetify.breakpoint.smAndDown"
          width="min-content"
          href="https://playgardenonline.myshopify.com/products/learning-kit-monthly-subscription"
        >
          Buy Learning Kits
        </v-btn>
      </div>
    </div>

    <div v-else class="background">
      <v-btn
        class="close-btn"
        icon
        x-large
        color="#FAA938"
        title="Close"
        @click="dialog = false"
      >
        <v-icon x-large>
          mdi-close-circle
        </v-icon>
      </v-btn>
      <v-btn
        class="buy-btn v2-font"
        color="#BA89EB"
        outlined
        :x-large="$vuetify.breakpoint.lgAndUp"
        width="min-content"
        href="https://playgardenonline.myshopify.com/products/learning-kit-monthly-subscription"
      >
        Buy Learning Kits
      </v-btn>
    </div>
  </pg-dialog>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'LearningKitsPopup',
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  setup(props, { emit }) {
    const dialog = computed<boolean>({
      get() {
        return props.value
      },
      set(value) {
        emit('input', value)
      }
    })

    return { dialog }
  }
})
</script>

<style scoped lang="scss">
::v-deep .v-dialog {
  box-shadow: none;
}

.buy-btn {
  background-color: white;
  position: absolute;
  bottom: 90px;
  right: 160px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

  @media screen and (max-width: 1264px) {
    bottom: 70px;
    right: 105px;
  }

  @media screen and (max-width: 960px) {
    bottom: 5%;
    left: 50%;
    transform: translateX(-50%);
  }
}

.close-btn {
  position: absolute;
  top: 30px;
  right: 20px;

  @media screen and (max-width: 1264px) {
    top: 30px;
    right: 20px;
  }

  @media screen and (max-width: 960px) {
    top: 1.5%;
    right: 20%;
  }
}

.background {
  background: url('~@/assets/png/learning-kits-popup.png');
  background-size: contain;
  margin: auto;
  position: relative;
  width: 1200px;
  height: 527px;

  @media screen and (max-width: 1264px) {
    width: 900px;
    height: 395px;
  }
}
</style>
