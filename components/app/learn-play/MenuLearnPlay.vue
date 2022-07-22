<template>
  <v-row class="menu-learn-play pt-4" justify="center">
    <v-col cols="12">
      <span class="color-main" @click="sendSection('videoLesson')">
        Sections
      </span>
    </v-col>
    <v-col cols="12">
      <span class="color-menu clickable" @click="sendSection('videoLesson')">
        Video Lessons
      </span>
    </v-col>
    <v-col cols="12">
      <span class="color-menu clickable" @click="sendSection('worksheets')">
        Worksheets
      </span>
    </v-col>
    <v-col cols="12">
      <span class="color-menu clickable" @click="sendSection('diy')">
        DIY Project
      </span>
    </v-col>
    <v-col cols="12">
      <span class="color-menu clickable" @click="sendSection('art-project')">
        Art Project
      </span>
    </v-col>
    <v-col cols="12">
      <span class="color-menu clickable" @click="sendSection('snack')">
        Snack of the Week
      </span>
    </v-col>
    <v-col cols="12">
      <span class="color-menu clickable" @click="sendSection('book')">
        Book
      </span>
    </v-col>
    <v-col cols="12">
      <span class="color-menu clickable" @click="sendSection('playlist')">
        Playlist
      </span>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'MenuLearnPlay',
  methods: {
    sendSection(section) {
      this.$nuxt.$emit('menu-section', section)
    }
  }
}
</script>

<style scoped>
.color-main {
  color: var(--v-primary-base) !important;
  font-weight: 800;
}

.color-menu {
  color: var(--v-primary-base) !important;
  font-weight: 600;
}

.menu-learn-play {
  position: sticky;
  top: 120px;
  max-height: calc(100vh - 128px);
  margin-bottom: 0px;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
