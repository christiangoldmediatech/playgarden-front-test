<template>
  <v-row>
    <v-row no-gutters>
      <v-btn
        color="accent"
        nuxt
        text
        :to="{
          name: 'app-payment',
          query: { process: 'signup', step: '2' }
        }"
      >
        <v-icon left>
          mdi-less-than
        </v-icon>

        Back
      </v-btn>
    </v-row>
    <v-col cols="12">
      <v-row>
        <v-col>
          <v-row
            class="flex-column flex-md-row"
            justify="center"
          >
            <v-col
              cols="12"
              md="6"
            >
              <v-img
                v-if="$vuetify.breakpoint.smAndUp"
                max-width="550"
                :src="require('@/assets/svg/child-information.svg')"
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
              sm="12"
              xs="12"
              :class="{ 'mt-n14 px-8': !$vuetify.breakpoint.smAndUp }"
            >
              aqui
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>

export default {
  name: 'InactiveSubscription',

  components: {},

  data: vm => ({}),

  computed: {},

  created () {},

  methods: {}
}
</script>
