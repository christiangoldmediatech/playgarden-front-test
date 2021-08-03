<template>
  <v-hover v-slot="{ hover }">
    <v-container
      v-if="!displayMode"
      fluid
      :class="[
        'portfolio-card',
        { clickable: !displayMode, scaled: hover && !displayMode },
      ]"
    >
      <v-row
        no-gutters
        justify="space-around"
        @click.stop="
          $nuxt.$emit('open-portfolio-overlay', { child, entityId, entityType, image })
        "
      >
        <v-col cols="12">
          <v-img :src="image" aspect-ratio="1.7" contain />

          <div class="mt-3">
            <div class="title mb-1">
              <span
                class="d-block text-center font-weight-bold"
                :class="{ 'white--text': displayMode }"
              >
                {{ `Lesson ${lesson.curriculumType.name}` }}
              </span>
            </div>

            <div class="subheading">
              <span
                class="d-block text-center"
                :class="{ 'white--text': displayMode }"
              >
                {{ `Day ${lesson.day}` }}
              </span>
            </div>

            <div v-if="child" class="subheading">
              <span
                class="d-block text-center"
                :class="{ 'white--text': displayMode }"
              >
                {{ child.firstName }}
              </span>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-row v-else :align="!noShare ? 'center' : 'top'" class="portfolio-card">
      <v-col cols="12" md="">
        <img class="w-100" :src="image">
      </v-col>

      <v-col v-if="!noShare" class="shrink" cols="12" md="">
        <pg-social-buttons
          class="mx-auto mx-md-0"
          entity-auto-resolve
          :entity-id="entityId"
          :entity-type="entityType"
          :quote="textShare"
          :title="textShare"
          :toolbar-title="`Share ${textShare}`"
          :toolbar-subtitle="textShare"
          :url="image"
        />
      </v-col>

      <v-col v-if="infoUser && dataChild" class="shrink" cols="12" md="4">
        <v-card class="mx-auto mx-md-0">
          <v-card-title>
            <span>
              Student: {{ dataChild.firstName }}
            </span><br>
            <span>
              Parent: {{ `${dataChild.user.firstName} ${dataChild.user.lastName}` }}
            </span>
          </v-card-title>
          <v-card-text>
            <v-btn
              color="accent darken-1"
              small
              :to="{
                name: 'admin-user-manager-profile',
                query: {id: dataChild.user.id}
              }"
            >
              <span class="font-weight-normal">
                Go to Profile
              </span>
            </v-btn>
            <v-row>
              <v-col cols="12">
                <pg-text-field
                  v-model="feedback.title"
                  label="Title"
                  solo-labeled
                />
              </v-col>
              <v-col cols="12">
                <pg-text-field
                  v-model="feedback.feedback"
                  label="Feedback"
                  solo-labeled
                />
              </v-col>
            </v-row>
            <v-btn
              color="primary darken-1"
              small
              @click="save"
            >
              <span class="font-weight-normal">
                Save
              </span>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-hover>
</template>

<script lang="ts">
import { defineComponent, ref, useRoute, computed, onMounted } from '@nuxtjs/composition-api'
import { useWorksheetsCategories } from '@/composables/worksheets'
import { Child, Feedback } from '@/models'
import { useSnotifyHelper, useChildLesson } from '@/composables'
import { useFeedback } from '@/composables/feedback'

export default defineComponent({
  name: 'PortfolioCard',

  props: {
    child: {
      type: Object,
      default: () => {}
    },

    image: {
      type: [Object, Function, String],
      required: true
    },

    entityId: {
      type: [Number, String],
      default: ''
    },

    noShare: {
      type: Boolean,
      default: false,
      required: false
    },

    infoUser: {
      type: Boolean,
      default: false,
      required: false
    },

    entityType: {
      type: String,
      default: ''
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
  },

  setup (props: any) {
    const route = useRoute()
    const snotify = useSnotifyHelper()
    const dataChild = ref<Child>()
    const { getChild } = useWorksheetsCategories()
    const { feedback, getFeedbackById, getFeedbackByUploadedWorksheetsId, saveFeedback, updateFeedback } = useFeedback()
    const studentId = computed(() => Number(route.value.query.id))

    if (!props.child) {
      props.child = { id: studentId.value }
    }

    const getData = async () => {
      if (!props.child) {
        return
      }

      try {
        dataChild.value = await getChild(props.child.id)
      } catch (error) {
        snotify.error('Sorry! There was an error loading the page.')
      }
    }

    onMounted(async () => {
      try {
        getData()
        if (props.entityId) {
          await getFeedbackByUploadedWorksheetsId(props.entityId)
        }
      } catch (error) {}
      feedback.value.uploadedWorksheetId = props.entityId
    })

    return {
      feedback,
      dataChild,
      saveFeedback,
      updateFeedback
    }
  },

  computed: {
    textShare (): string {
      return (this.child) ? `${this.child.firstName || 'Child'}'s awesome work!` : ''
    }
  },

  methods: {
    async save () {
      if (this.feedback.id) {
        await this.updateFeedback(this.feedback.id, { data: this.feedback })
        this.$snotify.success(
          'Feedback is update.'
        )
      } else {
        await this.saveFeedback({ data: this.feedback })
        this.$snotify.success(
          'Feedback is saved.'
        )
      }
    }
  }
})
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

function newFunction(feedback,props: any) {
  feedback.uploadWorksheetId=props.entityId
}
