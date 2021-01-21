<template>
  <v-btn block height="45" class="btn-dropbox" text @click="openChooser">
    <img
      alt="Dropbox"
      class="mr-1"
      src="@/assets/svg/dropbox.svg"
      height="40"
    >
    <span class="text-transform-none">Open dropbox</span>
  </v-btn>
</template>

<script>
export default {
  name: 'SelectFile',

  layout: 'admin',

  data () {
    return {
      apiKey: '6szr311owx7y96r',
      scriptLoaded: true,
      dropboxChooserIsSupported: false,
      multiselect: false,
      folderselect: false,
      sizeLimit: 1024
    }
  },

  computed: {},

  created () {},

  mounted () {
    const dropBox = document.createElement('script')
    dropBox.setAttribute(
      'src',
      'https://www.dropbox.com/static/api/2/dropins.js'
    )
    dropBox.setAttribute('id', 'dropboxjs')
    dropBox.setAttribute('data-app-key', this.apiKey)
    document.head.appendChild(dropBox)
  },

  methods: {
    openChooser () {
      console.log('aqui')
    }
  }

}
</script>

<style lang="scss" scoped>
.btn-dropbox {
  text-transform: capitalize !important;
  font-size: 14px !important;
}
</style>
