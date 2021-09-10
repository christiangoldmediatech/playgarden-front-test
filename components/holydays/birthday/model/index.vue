<template>
  <div>
    <birthday-content-dialog :value="isVisible" :is-closeable="true" @close="$emit('setModal', false) ">
      <br>
      <br>
      <hr class="green-line">
      <hr class="soft-green-line">
      <div>
        <img :src="require('@/assets/png/birthday/birthdayWish.png')" width="100%" alt="">
      </div>
    </birthday-content-dialog>
  </div>
</template>

<script lang="ts">
import BirthdayContentDialog from '@/components/ui/dialogs/LargeImageContentDialog/BirthdayContentDialog.vue'
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'BirthdayWishes',
  props: ['isVisible'],
  components: {
    BirthdayContentDialog
  },

  data: () => ({
    girlRedRibbon: require('@/assets/png/girl-red-ribbon.png')
  })
})
</script>

<style>
  .v-dialog{
    overflow-y:visible
  }
  .green-line{
    height:9px;border-width:0;color:red;background-color:green
  }
  .soft-green-line{
    height:9px;border-width:0;color:red;background-color:rgb(64, 167, 51)
  }
  @media screen and (max-width: 2500px) {
    .v-dialog:not(.v-dialog--fullscreen) {
      width: 1200px;
    }
  }
  @media screen and (max-width: 1600px) {
    .v-dialog:not(.v-dialog--fullscreen) {
      width: 750px !important;
    }
  }

  /* On screens that are 600px wide or less, make stack on top of each other instead of next to each other */
  @media screen and (max-width: 1367px) {
    .v-dialog:not(.v-dialog--fullscreen) {
      width: 600px !important;
    }
  }
</style>
