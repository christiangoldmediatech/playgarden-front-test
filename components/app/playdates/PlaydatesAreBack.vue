<template>
  <v-container class="mt-8 mt-md-0">
    <v-row no-gutters>
      <v-col v-if="$vuetify.breakpoint.smAndUp" cols="12" md="5">
        <v-img
          alt="Educational Playdates"
          class="align-center mr-md-15"
          contain
          :max-height="($vuetify.breakpoint.smAndDown) ? 200 : 500"
          :src="require('@/assets/png/playdates/willBeBackPlaydate.png')"
        />
      </v-col>

      <v-col cols="12" md="7">
        <v-row align-content="center" class="fill-height">
          <v-col cols="12" class="text-left">
            <underlined-title text="Playdates are back!" />
          </v-col>

          <v-col cols="12" class="text-md-left text-center">
            <p class="text-justify text-info-playdate">
              Play and learn with friends in our Playdate class! Come for fun activities such as spin-the-wheel, Play-doh art, stories and sharing time! <span class="font-weight-bold">Playdates must be reserved in advance</span>, as each <span class="font-weight-bold">Playdate is limited to 8 students to give each little one a chance to participate.</span> Playdates will be reserved on a first-come first-serve basis, so be sure to reserve in advance!
            </p>
            <p class="font-weight-bold  text-info-playdate mb-0">
              The following dates are available:
            </p>
            <ul class="mb-8">
              <li class="text-info-playdate">
                Thursday 10/14 at 11:15AM
              </li>
              <li class="text-info-playdate">
                Thursday 10/21 at 11:15AM
              </li>
            </ul>
            <p class="font-weight-bold  text-info-playdate">
              To reserve a Playdate, email <a href="mailto:hello@playgardenprep.com">hello@playgardenprep.com</a>
            </p>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang='ts'>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'PlaydatesAreBack'
})
</script>

<style lang="scss" scoped>
.text-info-playdate {
    font-size: 20px !important;
    line-height: 36px;
}
</style>
