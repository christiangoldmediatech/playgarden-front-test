<template>
  <v-row class="ml-2" width="100%">
    <v-list>
      <v-list-group
        no-action
      >
        <template v-slot:activator>
          <v-list-item-title color="primary" v-text="title" />
        </template>

        <v-list-item
          v-for="submenu in submenus"
          :key="submenu.title"
        >
          <v-list-item-content>
            <v-list-item-title @click="sendSection(submenu.name)" v-text="submenu.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-row>
</template>

<script>
export default {
  name: 'MenuMobile',
  data: () => {
    return {
      title: 'Sections',
      submenus: [
        {
          title: 'Video Lessons',
          name: 'videoLesson'
        },
        {
          title: 'Worksheets',
          name: 'worksheets'
        },
        {
          title: 'DIY Project',
          name: 'diy'
        },
        {
          title: 'Art Project',
          name: 'art-project'
        },
        {
          title: 'Snack with Description',
          name: 'snack'
        },
        {
          title: 'Book',
          name: 'book'
        },
        {
          title: 'Playlist',
          name: 'playlist'
        }
      ]
    }
  },
  methods: {
    sendSection (section) {
      this.$nuxt.$emit('menu-section', section)
    }
  }
}
</script>
