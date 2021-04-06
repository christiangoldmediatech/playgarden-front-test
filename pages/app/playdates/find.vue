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

<script>
import { mapActions } from 'vuex'

import CardPlaydate from '@/components/app/playdates/CardPlaydate'

export default {
  name: 'Find',

  components: { CardPlaydate },

  data: () => ({
    playdates: [],
    activePlaydates: []
  }),

  mounted () {
    this.getActivePlaydates()
  },

  methods: {
    ...mapActions('playdates', ['getAndFilterPlaydates', 'getChildrenInfo']),

    async getActivePlaydates () {
      try {
        this.playdates = await this.getAndFilterPlaydates({
          showChildren: true
        })
        this.activePlaydates = await this.getChildrenInfo()
      } catch (e) {}
    }
  }
}
</script>
