<template>
  <v-row align="center">
    <v-btn
      class="text-none mx-3"
      color="white"
      x-large
      @click.stop="goToFavorites"
    >
      Favorites
      <v-icon class="ml-2" color="#F5737F">
        mdi-heart
      </v-icon>
    </v-btn>

    <v-spacer />

    <v-col cols="12" sm="4" xl="3">
      <v-text-field
        v-model="query"
        placeholder="Search"
        append-icon="mdi-magnify"
        clearable
        hide-details
        solo
        @keydown.enter="search"
      />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'TopBar',

  data: () => {
    return {
      query: ''
    }
  },

  created () {
    this.query = this.$route.query.q || ''
  },

  methods: {
    goToFavorites () {
      this.$router.push({ name: 'app-activities-favorites' })
    },

    search () {
      this.$router.push({
        name: 'app-activities-search',
        query: { q: this.query }
      })
    }
  }
}
</script>
