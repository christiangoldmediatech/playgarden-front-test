<template>
  <v-row>
    <v-row width="100%">
      <v-col
        v-for="(item, index) in lesson.videos"
        :key="index"
        cols="4"
      >
        <v-item>
          <v-card @click="loadDetailVideo(item)">
            <v-card-title>
              <v-list-item>
                <v-list-item-avatar tile>
                  <v-img
                    class="clickable account-btn mx-2"
                    :src="item.activityType.icon"
                  />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>
                    <p>
                      {{ item.description }}
                    </p>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-card-title>
            <v-row class="px-2">
              <v-col>
                <div class="mx-2 my-4">
                  <span class="text-body-2 text-lg-h7 text-xl-h6">
                    {{ item.name }}
                  </span>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-item>
      </v-col>
    </v-row>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'
// import ContentList from '@/components/app/dashboard/ContentList.vue'
export default {
  name: 'VideosLesson',

  components: {
    // ContentList
  },

  data: vm => ({
    lessonId: vm.$route.query.lessonId
      ? parseInt(vm.$route.query.lessonId)
      : null,
    lesson: {
      videos: []
    }
  }),

  created () {
    this.getLesson()
  },

  methods: {
    ...mapActions('admin/curriculum', ['getLessonById']),

    async getLesson () {
      this.lesson = await this.getLessonById(this.lessonId)
      console.log(' aqui video lesson--', this.lesson)
    },

    loadDetailVideo (item) {
      this.$nuxt.$emit('send-video', item)
    }
  }
}
</script>
