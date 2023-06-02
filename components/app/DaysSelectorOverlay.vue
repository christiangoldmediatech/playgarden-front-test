<template>
  <v-overlay :dark="false" :value="viewOverlay" z-index="4000">
    <v-card :width="$vuetify.breakpoint.mdAndUp ? '800px' : '400px'" elevation="0" class="rounded-xl">
      <v-row no-gutters>
        <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="4">
          <img src="@/assets/jpg/girl-walking.jpg" class="day-selector-img rounded-l-xl" />
        </v-col>
        <v-col cols="12" md="8" class="py-6 px-2">
          <div class="day-selector-title mb-4">
            <h1>One last thing before you get started!</h1>
          </div>
          <div class="day-selector-subtitle mb-6">
            <h2>Please tell us how many days a week do you expect to use Playgarden Online</h2>
          </div>
          <v-row no-gutters justify="center">
            <v-col v-for="dayOption in dayOptions" :key="dayOption.value" cols="4" class="d-flex justify-center">
              <v-card
                width="100px"
                class="d-flex flex-column align-center py-2 day-selector-card"
                :class="{ 'mb-4': dayOption.value <= 3 }"
                :style="[{'box-shadow': daySelected === dayOption.value ? 'inset 0px 8px 24px rgba(0, 0, 0, 0.15);' : '0px 8px 24px rgba(0, 0, 0, 0.15)'}]"
                @click="selectDay(dayOption.value)"
              >
                <img class="mb-2" :src="dayOption.image" />
                <span>{{ dayOption.value === 1 ? 'DAY' : 'DAYS' }}</span>
              </v-card>
            </v-col>
          </v-row>
          <div class="d-flex justify-center mt-6 mb-4">
            <v-btn
              class="px-16 white--text elevation-0 pg-text-[16px]"
              color="#B2E68D"
              :loading="loading"
              :disabled="!daySelected"
              large
              @click="submitDaysSelected"
            >
              <span class="day-selector-btn">START FIRST LESSON</span>
            </v-btn>
          </div>
          <div class="d-flex justify-center day-selector-small-text">
            <span>This will help us improve your little one's learning experience</span>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-overlay>
</template>

<script lang="ts">
import { useUser } from '@/composables/users'
import { defineComponent, ref, computed } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'DaysSelectorOverlay',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  emits: ['input'],
  setup(props, { emit }) {
    const { setUserExpectDays } = useUser()

    const loading = ref(false)
    const daySelected = ref<number | null>(null)

    const viewOverlay = computed({
      get() {
        return props.value
      },
      set(val) {
        emit('input', val)
      }
    })

    const dayOptions = ref([
      {
        image: require('@/assets/svg/number-one.svg'),
        value: 1
      },
      {
        image: require('@/assets/svg/number-two.svg'),
        value: 2
      },
      {
        image: require('@/assets/svg/number-three.svg'),
        value: 3
      },
      {
        image: require('@/assets/svg/number-four.svg'),
        value: 4
      },
      {
        image: require('@/assets/svg/number-five.svg'),
        value: 5
      }
    ])

    const selectDay = (day: number) => {
      daySelected.value = day
    }

    const submitDaysSelected = async () => {
      loading.value = true
      await setUserExpectDays(daySelected.value!)
      loading.value = false
      viewOverlay.value = false
    }

    return {
      loading,
      viewOverlay,
      daySelected,
      dayOptions,
      selectDay,
      submitDaysSelected
    }
  }
})
</script>

<style lang="scss" scoped>
.day-selector-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.day-selector-title {
  h1 {
    margin: 0;
    font-family: 'Quicksand';
    font-style: normal;
    font-weight: 700;
    font-size: 26px;
    text-align: center;
    letter-spacing: 4.8px;
    text-transform: uppercase;
    color: #FE9923;
  }
}

.day-selector-subtitle {
  h2 {
    margin: 0;
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    text-align: center;
    color: #606060;
  }
}

.day-selector-btn {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 36px;
  letter-spacing: 0.96px;
  text-transform: uppercase;
}

.day-selector-small-text {
  span {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
    text-align: center;
    color: #606060;
  }
}

.day-selector-card {
  border-radius: 8px !important;
  cursor: pointer;

  span {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    text-align: center;
    letter-spacing: 0.96px;
    text-transform: uppercase;
    color: #474747;
  }
}
</style>
