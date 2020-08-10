<template>
  <v-row :key="currentLessonVideo.id">
    <jw-player
      :file="currentLessonVideo.videoUrl"
      :title="currentLessonVideo.name"
      :image="currentLessonVideo.thumbnail"
      :description="currentLessonVideo.description"
    />
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  // eslint-disable-next-line vue/match-component-file-name
  name: 'Id',

  computed: {
    ...mapGetters('children/lesson', {
      currentLessonVideo: 'getCurrentLessonVideo'
    })
  }
}
</script>
