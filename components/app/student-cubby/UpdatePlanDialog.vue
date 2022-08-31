import defineComponent from '../virtual-preschool/VirtualLearnAndPlay.vue';
<template>
  <v-dialog v-model="dialog" persistent max-width="700px">
    <v-card class="card-wrapper py-10">
      <v-btn class="btn-close" icon color="white" large @click="dialog = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <v-card-title class="d-flex justify-center">
        <h1 class="text-center dialog-title">
          Update Plan
        </h1>
      </v-card-title>

      <v-card-text class="d-flex flex-column align-center">
        <p class="dialog-text my-5">
          To gain more teacher feedback on your little one's progress, update to the <span>Online Preschool Plan</span>
        </p>

        <v-btn class="elevation-0 white--text px-16 main-btn" color="#B2E68D" @click="btnAction">
          COMPARE PLANS
        </v-btn>
      </v-card-text>

      <div class="img-wrapper">
        <img
          src="@/assets/svg/gift-of-learning/bottom-color-dashes.svg"
          class="pg-absolute pg-bottom-0 pg-left-0 pg-right-0 pg-mx-auto pg-w-full lg:pg-w-auto"
        >
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, useStore, useRouter, computed, onMounted } from '@nuxtjs/composition-api'
import { TypedStore } from '@/models'

export default defineComponent({
  name: 'UpdatePlanDialog',

  setup() {
    const store = useStore<TypedStore>()
    const router = useRouter()
    const dialog = ref(false)
    const hasUserLearnAndPlayPlan = computed(() => store.getters['auth/hasUserLearnAndPlayPlan'])

    onMounted(() => {
      dialog.value = hasUserLearnAndPlayPlan.value
    })

    const btnAction = () => {
      router.push({
        name: 'app-payment-plan'
      })
    }

    return {
      dialog,
      btnAction
    }
  }
})
</script>

<style lang="scss" scoped>
.card-wrapper {
  position: relative;
  border-radius: 45px;
}

.btn-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #F6B7D2;
}

.dialog-title {
  font-family: 'Quicksand';
  font-weight: bold;
  font-size: 40px;
  letter-spacing: 1.35px;
  color: #78C383;
}

.dialog-text {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 32px;
  text-align: center;
  color: #606060;
  text-transform: capitalize;

  span {
    color: #F89838;
  }
}

.main-btn {
  ::v-deep .v-btn__content {
    font-size: 20px;
  }
}

.img-wrapper {
  width: 100%;
  position: absolute;
  bottom: 0;

  img {
    width: 100%;
  }
}
</style>
