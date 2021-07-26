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

    <v-row v-else align="center" class="portfolio-card">
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
            </span>
          </v-card-title>
          <v-card-text>
            <v-btn
              color="primary"
              small
              :to="{
                name: 'admin-user-manager-profile',
                query: {id: dataChild.user.id}
              }"
            >
              <span class="font-weight-normal">
                Profile: {{ `${dataChild.user.firstName} ${dataChild.user.lastName}` }}
              </span>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-hover>
</template>

<script lang="ts">
import { defineComponent, ref, useRoute, computed, onMounted, watch } from '@nuxtjs/composition-api'
import { useWorksheetsCategories } from '@/composables/worksheets'
import { Child } from '@/models'
import { useChildLesson } from '@/composables'
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
      default: '',
      validator: (val) => {
        const values = { PATCH: 1, PUZZLE: 1, WORKSHEET: 1 }

        return val === null || val === '' || Boolean(values[val])
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
    }
  },

  setup (props) {
    const dataChild = ref<Child>()
    const { getChild } = useWorksheetsCategories()

    const getData = async () => {
      if (!props.child) {
        return
      }

      try {
        dataChild.value = await getChild(props.child.id)
      } catch (error) {
        console.log('error')
      }
    }

    onMounted(() => {
      getData()
    })

    return {
      dataChild
    }
  },

  computed: {
    textShare () {
      return `${this.child.firstName || 'Child'}'s awesome work!`
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
