<template>
  <v-row align="center" justify="space-between" :no-gutters="!$vuetify.breakpoint.mobile">
    <v-col cols="12" sm="4" md="3" order="1" order-sm="0">
      <v-btn
        class="text-none btn-favorities"
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

    <v-col cols="12" sm="4" md="3" order="0" order-sm="1">
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
  color: var(--v-black-base) !important;
  width: 100% !important;
  font-size: 1.2rem !important;
}
</style>
