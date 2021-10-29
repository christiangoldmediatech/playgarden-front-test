<template>
  <v-col class="fill-height">
    <!-- BACK BUTTON -->
    <div class="mt-3">
      <nuxt-link nuxt :to="{ name: 'app-playdates' }">
        <v-icon class="accent--text">
          mdi-chevron-left
        </v-icon>
        <span class="accent--text font-weight-medium">Go back to playdates</span>
      </nuxt-link>
    </div>

    <!-- HEADER -->
    <div class="mt-3 pg-w-full">
      <underlined-title
        text="My Educational Playdates"
        font-size="36px"
        font-size-mobile="24px"
      />
    </div>

    <!-- PAGE DESCRIPTION -->
    <div class="text-body-2 text-md-body-1 mt-3">
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
import { Playdate, TypedStore } from '@/models'
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

    const playdates = ref<Playdate[]>([])
    const loading = ref(false)

    const handleGetMyPlaydates = async () => {
      const response = await getChildrenInfo()

      playdates.value = response.reduce((acc, res) => {
        return [
          ...acc,
          ...res.groups.reduce((prev, group) => {
            const pd = group?.playdates?.map(({ backpackImages, date, playdate }) => ({
              ...playdate,
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
