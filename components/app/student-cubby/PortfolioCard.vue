<template>
  <v-hover v-slot="{ hover }">
    <v-container fluid :class="['portfolio-card', { 'clickable': !displayMode, 'scaled': hover && !displayMode }]">
      <v-row no-gutters justify="space-around" @click.stop="$nuxt.$emit('open-portfolio-overlay', image)">
        <v-col cols="12">
          <v-img
            :src="image"
            aspect-ratio="1.7"
            contain
          />
          <div v-if="!displayMode" class="mt-3">
            <div class="title mb-1">
              <span
                class="d-block text-center font-weight-bold"
                :class="{ 'white--text': displayMode }"
              >
                {{ `Lesson ${lesson.curriculumType.name}` }}
              </span>
            </div>
            <div class="subheading">
              <span class="d-block text-center" :class="{ 'white--text': displayMode }">
                {{ `Day ${lesson.day}` }}
              </span>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-hover>
</template>

<script>
export default {
  name: 'PortfolioCard',

  props: {
    image: {
      type: [Object, Function, String],
      required: true
    },

    lesson: {
      type: Object,
      required: false,
      default: () => {}
    },

    displayMode: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.portfolio-card {
  transition: transform 250ms;
}

.scaled {
  transform: scale(1.1);
  z-index: 1;
}
</style>
