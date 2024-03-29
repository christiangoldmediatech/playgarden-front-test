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
        @click.stop="$nuxt.$emit('open-portfolio-overlay', { child, entityId, entityType, image, created })"
      >
        <v-col cols="12">
          <v-img :src="image" aspect-ratio="1.7" contain />

          <div class="mt-3">
            <div v-if="showTitle" class="title mb-1">
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

            <div v-if="child && showChildName" class="subheading">
              <span
                class="d-block text-center"
                :class="{ 'white--text': displayMode }"
              >
                {{ child.firstName }}
              </span>
            </div>

            <div class="subheading">
              <span
                class="d-block text-center"
                :class="{ 'white--text': displayMode }"
              >
                {{ `Uploaded Date: ${createdDateFormatted}` }}
              </span>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-row v-else align="center" class="portfolio-card">
      <v-col v-if="!noShare" class="shrink" cols="12" md="3">
        <pg-social-buttons
          class="mx-auto mx-md-0"
          entity-auto-resolve
          :entity-id="entityId"
          :entity-type="entityType"
          :quote="textShare"
          :title="textShare"
          toolbar-title="Share"
          :toolbar-subtitle="textShare"
          :url="image"
        />
      </v-col>
      <v-col>
        <img class="w-100" :src="image">
      </v-col>
      <v-col v-if="!noShare && feedback && feedback.feedback" class="shrink" cols="12" md="3">
        <v-card>
          <v-card-title>
            {{ feedback.title }}
          </v-card-title>
          <v-card-text>
            <div class="feedback">
              {{ feedback.feedback }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col v-if="infoUser && dataChild" class="shrink" cols="12" md="3">
        <v-card class="mx-auto mx-md-0">
          <v-card-text>
            <span>
              Student: {{ dataChild.firstName }}
            </span><br>
            <span>
              Parent: {{ `${dataChild.user.firstName} ${dataChild.user.lastName}` }}
            </span> <br>
            <span>
              Date: {{ `${createdDateFormatted}` }}
            </span>
          </v-card-text>
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
                <span class="font-weight-bold">
                  Feedback on the worksheet:
                </span>
              </v-col>
              <v-col cols="12">
                <pg-text-field
                  v-model="feedback.title"
                  class="custom-text-field"
                  label="Title"
                  solo-labeled
                />
              </v-col>
              <v-col cols="12">
                <pg-textarea
                  v-model="feedback.feedback"
                  class="custom-text-field"
                  label="Feedback"
                  solo-labeled
                />
              </v-col>
            </v-row>
            <v-btn
              :loading="isLoading"
              color="primary darken-1"
              small
              @click="save"
            >
              <span class="font-weight-normal">
                {{ isCreatingFeedback ? 'Save' : 'Update' }}
              </span>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-hover>
</template>

<script lang="ts">
import dayjs from 'dayjs'
import { defineComponent, ref, useRoute, computed, onMounted } from '@nuxtjs/composition-api'
import { useWorksheetsCategories } from '@/composables/worksheets'
import { Child } from '@/models'
import { useToastHelper } from '@/composables'
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
    created: {
      type: String,
      required: true
    },
    entityId: {
      type: [Number, String],
      default: ''
    },
    showTitle: {
      type: Boolean,
      default: false,
      required: false
    },
    showChildName: {
      type: Boolean,
      default: false,
      required: false
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
      default: '',
      validator: (val: String) => {
        const values: any = { PATCH: 1, PUZZLE: 1, WORKSHEET: 1 }
        return val === null || val === '' || Boolean(values[val.toString()])
      }
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
    },
    worksheetFeedback: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup (props: any) {
    const route = useRoute()
    const toast = useToastHelper()
    const dataChild = ref<Child>()
    const { getChild } = useWorksheetsCategories()
    const { feedback, getFeedbackByUploadedWorksheetsId, saveFeedback, updateFeedback } = useFeedback()
    const isLoading = ref(false)
    const studentId = computed(() => Number(route.value.query.id))
    const child = props.child || { id: studentId.value }
    const getData = async () => {
      if (!child || !child.id) {
        return
      }
      try {
        dataChild.value = await getChild(props.child.id)
      } catch (error) {
        toast.error('Sorry! There was an error loading the page.')
      }
    }

    onMounted(async() => {
      if (props.worksheetFeedback) {
        try {
          await getData()
          if (props.entityId) {
            await getFeedbackByUploadedWorksheetsId(props.entityId)
          }
        } catch (error) {}
      }
      feedback.value.uploadedWorksheetId = props.entityId
    })

    return {
      isLoading,
      feedback,
      dataChild,
      saveFeedback,
      updateFeedback
    }
  },
  computed: {
    textShare (): string {
      return (this.child) ? `${this.child.firstName || 'Child'}'s awesome work!` : ''
    },

    createdDateFormatted (): unknown {
      return this.created ? dayjs(this.created).format('MM/DD/YYYY') : null
    },

    isCreatingFeedback (): boolean {
      return !this.feedback?.id
    }
  },

  methods: {
    async save () {
      this.isLoading = true
      try {
        if (this.isCreatingFeedback) {
          await this.saveFeedback({ data: this.feedback })
          this.$toast.success(
            'Feedback saved.'
          )
        } else if (this.feedback.id) {
          await this.updateFeedback(this.feedback.id, { data: this.feedback })
          this.$toast.success(
            'Feedback updated.'
          )
        }
      } catch (error) {
        this.$toast.error(
          'Sorry! There was an error saving the feedback.'
        )
      } finally {
        this.isLoading = false
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/assets/scss/app.scss';

.portfolio-card {
  transition: transform 250ms;
}
.scaled {
  transform: scale(1.1);
  z-index: 1;
}
.feedback {
  background:#F5F5F5 !important;
  text-align: justify !important;
}
</style>
