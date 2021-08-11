<template>
  <v-container>
    <v-row class="mt-6 mt-md-0">
      <v-col v-if="$vuetify.breakpoint.smAndUp" cols="12" md="6">
        <v-img
          alt="Educational Playdates"
          class="align-center mr-md-15"
          contain
          :max-height="($vuetify.breakpoint.smAndDown) ? 200 : 500"
          :src="require('@/assets/png/playdates/willBeBackPlaydate.png')"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-row align-content="center" class="fill-height">
          <v-col cols="12" class="text-md-left">
            <underlined-title text="Playdates will be back very soon!" />
          </v-col>

          <v-col cols="12" class="text-md-left text-center">
            <p class="text-justify text-info-playdate">
              As we work to bring the playdates back, you can go to the library and watch a lot of great videos with your Playgarden Prep teachers.
            </p>
          </v-col>

          <v-col cols="12">
            <v-row no-gutters>
              <v-col cols="12" md="6">
                <v-btn
                  nuxt
                  :to="{ name: 'app-library' }"
                  width="200"
                  large
                  color="accent"
                  class="text-transform-none"
                >
                  Go to library
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang='ts'>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'WillBeBack'
})
</script>

<style lang="scss" scoped>
.text-info-playdate {
    font-size: 22px !important;
}
</style>
