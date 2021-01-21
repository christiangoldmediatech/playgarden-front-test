<template>
  <v-btn block height="45" class="btn-dropbox" text @click="dropboxIconClicked">
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
      apiKey: '6szr311owx7y96r'
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
    dropboxIconClicked () {
      const options = {
        success: (files) => {
          const attachments = []
          for (let i = 0; i < files.length; i++) {
            const attachment = {}
            attachment._id = files[i].id
            attachment.title = files[i].name
            attachment.size = files[i].bytes
            attachment.iconURL = files[i].icon
            attachment.link = files[i].link
            attachment.extension = `. ${files[i].name.split('.')[1]}`
            attachments.push(attachment)
          }
          this.tempAttachments = attachments
          console.log(this.tempAttachments)
        },

        cancel: () => {},

        linkType: 'preview',

        multiselect: true,

        extensions: [
          '.pdf',
          '.doc',
          '.docx',
          '.mp4'
        ],

        folderselect: false,

        sizeLimit: 102400000
      }
      window.Dropbox.choose(options)
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
