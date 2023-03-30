<template>
  <v-card class="pa-4 pa-sm-8 d-flex flex-column align-start account-card-border" :style="{ '--card-custom-color': caregiverColor }">
    <div class="w-100 d-flex justify-space-between align-centers">
      <span class="account-card-title">
        Caregivers
      </span>
    </div>

    <div class="py-2 account-card-subtitle">
      Give access to your child’s caregiver!
    </div>

    <div class="account-green-dashed-line mt-2 mb-4 mx-auto"></div>

    <v-col cols="12">
      <v-row v-if="caregivers.length === 0" no-gutters align="center">
        <v-col cols="3">
          <img src="@/assets/svg/caregiver.svg" height="80px" />
        </v-col>
        <v-col cols="9">
          <p class="account-caregiver-placeholder ma-0">
            Give access to your child’s caregiver!
          </p>
        </v-col>
      </v-row>
      <v-row
        v-for="(caregiver, caregiverIndex) in caregivers"
        :key="caregiver.id"
        no-gutters
      >
        <v-col class="!pg-relative" cols="12">
          <v-row no-gutters align="center">
            <div class="account-caregiver-circle mr-4">
              C{{ caregiverIndex + 1 }}
            </div>
            <p class="account-caregiver-name ma-0">
              {{ caregiver.fullName }}
            </p>
          </v-row>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12">
      <v-btn
        class="white--text rounded-0"
        color="#359846"
        elevation="0"
        block
        @click="goToPage"
      >
        VIEW MORE
      </v-btn>
    </v-col>
  </v-card>
</template>

<script lang="ts">
import { TypedStore } from '@/models'
import { defineComponent, onMounted, ref, useRouter, useStore } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'CaregiversCard',
  setup() {
    const caregiverColor = ref('53, 152, 70')

    const store = useStore<TypedStore>()
    const router = useRouter()

    const caregivers = ref<any>([])

    const fetchCaregivers = async () => {
      const { users } = await store.dispatch('caregiver/fetchCaregiversList')
      caregivers.value = users
    }

    const goToPage = () => {
      router.push({ name: 'app-account-index-caregiver' })
    }

    onMounted(async () => {
      await fetchCaregivers()
    })

    return {
      caregiverColor,
      caregivers,
      goToPage
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/assets/scss/account.scss';
</style>
