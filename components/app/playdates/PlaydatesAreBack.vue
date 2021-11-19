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
            <underlined-title text="Playdates are back for Premium and Premium+ members!" />
          </v-col>

          <v-col cols="12" class="text-md-left text-center">
            <p class="text-justify text-info-playdate">
              Play and learn with friends in our Playdate class! Come for fun activities such as spin-the-wheel, Play-doh art, stories and sharing time! <span class="font-weight-bold">Playdates are limited to 8 little ones per session</span>, to promote social interaction. We are currently accepting reservations for this <span class="font-weight-bold">Thursday, October 28th at 11:15AM Eastern time</span>.
            </p>

            <p class="font-weight-bold  text-info-playdate">
              Premium and Premium+ members can reserve a spot by emailing <a href="mailto:hello@playgardenprep.com">hello@playgardenprep.com!</a>
            </p>

            <p class="text-justify text-info-playdate">
              If you'd like to end your trial early to gain access to Playdates, you may do so by sending us an email. We hope to see you there!
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
