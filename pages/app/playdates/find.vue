<template>
  <v-col class="fill-height">
    <v-row>
      <v-btn
        class="top-left text-none"
        color="accent"
        nuxt
        :to="{ name: 'app-playdates' }"
        text
        exact
      >
        <v-icon class="mr-2" small left color="accent">
          mdi-less-than
        </v-icon>
        Back
      </v-btn>
    </v-row>

    <v-row class="mt-md-5" no-gutters>
      <p>
        <underlined-title text="Find the playdate that best suits your child" />
      </p>

      <p>
        Playgarden Prep has created custom virtual Playdates to provide important social opportunities for children to interact with their friends and family during this time of isolation.
      </p>
    </v-row>

    <v-row>
      <v-col
        v-for="(playdate, indexP) in playdates"
        :key="indexP"
        cols="12"
        md="6"
      >
        <card-playdate :playdates="activePlaydates" :playdate="playdate" finding />
      </v-col>
    </v-row>
  </v-col>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@nuxtjs/composition-api'
import { Child, Playdate, Playdates } from '@/models'
import { usePlaydates, useSnotifyHelper } from '@/composables'

import CardPlaydate from '@/components/app/playdates/CardPlaydate.vue'

export default defineComponent({
  name: 'Find',

  components: { CardPlaydate },

  setup () {
    const snotify = useSnotifyHelper()

    const { getAndFilterPlaydates, getChildrenInfo } = usePlaydates()
    const playdates = ref<Playdate[]>([])
    const activePlaydates = ref<{ children: Child, playdates: Playdates[] }[]>([])

    onMounted(() => {
      getActivePlaydates()
    })

    const getActivePlaydates = async () => {
      try {
        playdates.value = await getAndFilterPlaydates({
          showChildren: true
        })
        activePlaydates.value = await getChildrenInfo()
      } catch (error) {
        snotify.error('Something went wrong when fetching playdates information.')
      }
    }

    return {
      playdates,
      activePlaydates
    }
  }
})
</script>
