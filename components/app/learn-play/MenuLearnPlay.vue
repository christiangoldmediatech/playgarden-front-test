<template>
  <v-row class="menu-learn-play pt-4" justify="center">
    <v-col cols="12">
      <span class="color-main" @click="sendSection('videoLesson')">
        {{ $t('socialEmotional.common.sections') }}
      </span>
    </v-col>
    <v-col cols="12">
      <span class="color-menu clickable" @click="sendSection('videoLesson')">
        {{ $t('socialEmotional.common.videos') }}
      </span>
    </v-col>
    <v-col v-if="getPrintables.length > 0" cols="12">
      <span class="color-menu clickable" @click="sendSection('worksheets')">
        {{ $t('socialEmotional.common.printables') }}
      </span>
    </v-col>
    <v-col v-if="getDiyProject.length > 0" cols="12">
      <span class="color-menu clickable" @click="sendSection('diy')">
        {{ $t('socialEmotional.common.doItTogether') }}
      </span>
    </v-col>
    <v-col v-if="getArtProjects.length > 0" cols="12">
      <span class="color-menu clickable" @click="sendSection('art-project')">
        {{ $t('socialEmotional.common.sensoryPlay') }}
      </span>
    </v-col>
    <v-col v-if="getSnacks.length > 0" cols="12">
      <span class="color-menu clickable" @click="sendSection('snack')">
        {{ $t('socialEmotional.common.snackOfTheWeek') }}
      </span>
    </v-col>
    <v-col v-if="getBook.length > 0" cols="12">
      <span class="color-menu clickable" @click="sendSection('book')">
        {{ $t('socialEmotional.common.book') }}
      </span>
    </v-col>
    <v-col cols="12">
      <span class="color-menu clickable" @click="sendSection('playlist')">
        {{ $t('socialEmotional.common.playlist') }}
      </span>
    </v-col>
  </v-row>
</template>

<script>
import { useLearnPlayV2, useNuxtHelper } from '@/composables'
import { defineComponent, useStore } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'MenuLearnPlay',

  setup(_, { emit }) {
    const store = useStore()
    const nuxt = useNuxtHelper()

    const learnPlayV2 = useLearnPlayV2({ store })

    const sendSection = (section) => {
      nuxt.$emit('menu-section', section)
    }

    return {
      getPrintables: learnPlayV2.computedProps.getOfflineWorksheet,
      getBook: learnPlayV2.computedProps.getRelatedBooks,
      getArtProjects: learnPlayV2.computedProps.getArtProjects,
      getSnacks: learnPlayV2.computedProps.getSnacks,
      getDiyProject: learnPlayV2.computedProps.getDiyProject,
      sendSection
    }
  }
})
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
