<template>
  <v-row align="center" no-gutters>
    <v-col cols="5" xs="4" sm="4" md="3">
      <v-btn
        class="text-none mx-3 btn-favorities"
        color="white"
        height="60"
        @click.stop="goToFavorites"
      >
        Favorites
        <v-icon class="ml-2" color="#F5737F">
          mdi-heart
        </v-icon>
      </v-btn>
    </v-col>

    <v-spacer />

    <v-col cols="6" md="4">
      <pg-text-field
        v-model="query"
        placeholder="Search"
        append-icon="mdi-magnify"
        clearable
        hide-details
        solo
        class="search-top-bar"
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

<style lang="scss" scoped>
.btn-favorities {
  color: $pg-black !important;
  width: 100% !important;
  font-size: 1.2rem !important;
}
</style>
