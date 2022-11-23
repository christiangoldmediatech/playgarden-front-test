<template>
  <v-col class="fill-height">
    <!-- BACK BUTTON -->
    <div class="mt-3">
      <nuxt-link nuxt :to="{ name: 'app-live-classes' }">
        <v-icon class="accent--text">
          mdi-chevron-left
        </v-icon>
        <span class="accent--text font-weight-medium">Go back</span>
      </nuxt-link>
    </div>

    <!-- HEADER -->
    <div class="mt-5 pg-w-full">
      <h2 class="pg-text-center pg-text-primary pg-text-4xl">
        My playdates
      </h2>
    </div>

    <!-- PAGE DESCRIPTION -->
    <div class="text-body-2 text-md-body-1 mt-3 pg-text-center">
      In this section you can find all the playdates that you have reserved
    </div>

    <!-- MY PLAYDATES -->
    <v-row v-if="!loading" class="mt-3">
      <v-col v-for="playdate in playdates" :key="playdate.id" cols="12" md="6">
        <card-playdate
          :playdate="playdate"
          @spot-reserved="handleGetMyPlaydates"
          @spot-canceled="handleGetMyPlaydates"
        />
      </v-col>
    </v-row>
  </v-col>
</template>

<script lang="ts">
import { usePlaydates } from '@/composables'
import { Meeting, TypedStore } from '@/models'
import { defineComponent, ref, useStore } from '@nuxtjs/composition-api'
import { onMounted } from '@vue/composition-api'
import CardPlaydate from '@/components/app/playdates/CardPlaydate.vue'

export default defineComponent({
  name: 'MyPlaydates',

  components: {
    CardPlaydate
  },

  setup () {
    const store = useStore<TypedStore>()
    const { getChildrenInfo } = usePlaydates({ store })

    const playdates = ref<Meeting[]>([])
    const loading = ref(false)

    const handleGetMyPlaydates = async () => {
      const response = await getChildrenInfo()

      playdates.value = response.reduce((acc, res) => {
        return [
          ...acc,
          ...res.groups.reduce((prev, group:any) => {
            const pd = group?.meetings?.map(({ backpackImages, date, meeting }: any) => ({
              ...meeting,
              date,
              backpackImages
            })) ?? []

            return [...prev, ...pd]
          }, [] as any)
        ]
      }, [] as any)
    }

    onMounted(() => {
      handleGetMyPlaydates()
    })

    return {
      loading,
      playdates,
      handleGetMyPlaydates
    }
  }
})
</script>
