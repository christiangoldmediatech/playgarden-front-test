<template>
  <v-container
    class="pa-0 mb-10"
    data-test-id="parent-corner-content"
  >
    <component
      :is="story.content.component"
      v-if="story.content.component"
      :key="story.content._uid"
      :blok="story.content"
    />
  </v-container>
</template>

<script>
export default {
  name: 'Index',

  asyncData (context) {
    // Load the JSON from the API
    return context.app.$storyapi.get('cdn/stories/app/parent-corner/index', {
      version: 'draft'
    }).then((res) => {
      return res.data
    }).catch((res) => {
      if (!res.response) {
        context.error({ statusCode: 404, message: 'Failed to receive content from the api' })
      } else {
        context.error({ statusCode: res.response.status, message: res.response.data })
      }
    })
  },

  data () {
    return {
      story: { content: {} }
    }
  },

  mounted () {
    // Listen to the events coming from the bridge
    this.$storybridge.on(['input', 'published', 'change'], (event) => {
      if (event.action === 'input') {
        if (event.story.id === this.story.id) {
          this.story.content = event.story.content
        }
      } else {
        this.$nuxt.$router.go({
          path: this.$nuxt.$router.currentRoute,
          force: true
        })
      }
    })
  }
}
</script>

<style>
html {
  scroll-behavior: smooth;
}
</style>
