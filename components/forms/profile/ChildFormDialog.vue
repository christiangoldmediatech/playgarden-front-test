<template>
  <v-dialog v-model="viewModal" max-width="600px" :style="{ 'z-index': zIndex }">
    <v-card
      v-if="draft.id"
      class="!pg-relative pa-4 pa-sm-8 !pg-rounded-3xl"
    >
      <validation-observer v-if="isEditing" v-slot="{ passes }">
        <v-form
          :readonly="loading"
          @submit.prevent="passes().then(onSubmit(draft))"
        >
          <!-- Backpack -->
          <validation-provider
            :name="
              `Child #${draft.id} - ` + 'Backpack'
            "
            rules="required"
          >
            <!-- Backpack Picker -->
            <v-row class="mb-6" no-gutters>
              <v-col cols="12">
                <v-row justify="center" no-gutters>
                  <v-col cols="12" md="10" lg="12">
                    <v-row no-gutters>
                      <v-col cols="12">
                        <span class="account-field-label">
                          Change icon:
                        </span>
                      </v-col>
                      <v-sheet
                        class="my-2"
                        width="100%"
                      >
                        <v-slide-group
                          v-model="draft.backpackId"
                          show-arrows="always"
                        >
                          <v-slide-item
                            v-for="backpack in backpacks"
                            :key="backpack.id"
                            v-slot="{ active, toggle }"
                            :value="backpack.id"
                          >
                            <img
                              :alt="backpack.name"
                              class="clickable image mx-2"
                              :class="{ active }"
                              :src="backpack.image"
                              height="100px"
                              @click="toggle"
                            >
                          </v-slide-item>
                          <template v-slot:next>
                            <v-icon color="#F89838" x-large>
                              mdi-chevron-right
                            </v-icon>
                          </template>
                          <template v-slot:prev>
                            <v-icon color="#F89838" x-large>
                              mdi-chevron-left
                            </v-icon>
                          </template>
                        </v-slide-group>
                      </v-sheet>
                    </v-row>
                  </v-col>
                </v-row>
                <input v-model="draft.backpackId" type="hidden">
              </v-col>
            </v-row>
          </validation-provider>
          <v-row no-gutters>
            <v-col
              class="pr-unset pr-md-2"
              cols="12"
              md="6"
            >
              <!-- First name -->
              <span class="d-inline-block account-field-label mb-2">First name</span>
              <validation-provider
                v-slot="{ errors }"
                :name="
                  `Child #${draft.id} - ` + 'Name'
                "
                rules="required"
              >
                <pg-text-field
                  v-model="draft.firstName"
                  class="custom-text-field"
                  clearable
                  :disabled="loading"
                  :error-messages="errors"
                  background-color="#F7F7F7"
                  color="#AAAAAA"
                  solo
                  dense
                  flat
                />
              </validation-provider>
            </v-col>
            <v-col
              class="pl-unset pl-md-2"
              cols="12"
              md="6"
            >
              <!-- Last name -->
              <span class="d-inline-block account-field-label mb-2">Last name</span>
              <validation-provider
                v-slot="{ errors }"
                :name="
                  `Child #${draft.id} - ` + 'Name'
                "
                rules="required"
              >
                <pg-text-field
                  v-model="draft.lastName"
                  class="custom-text-field"
                  clearable
                  :disabled="loading"
                  :error-messages="errors"
                  background-color="#F7F7F7"
                  color="#AAAAAA"
                  solo
                  dense
                  flat
                />
              </validation-provider>
            </v-col>
          </v-row>
          <v-row class="mb-2" no-gutters>
            <v-col cols="12" md="6" class="pr-unset pr-md-2">
              <!-- Birthday date -->
              <span class="d-inline-block account-field-label mb-2">Date of birth</span>
              <v-menu
                v-model="draft._menu"
                :close-on-content-click="false"
                min-width="290px"
                solo
                transition="scale-transition"
              >
                <template v-slot:activator="{ on, attrs }">
                  <validation-provider
                    v-slot="{ errors }"
                    :name="
                      `Child #${draft.id} - ` +
                        'Birthday date'
                    "
                    rules="required"
                  >
                    <div v-on="on">
                      <pg-text-field
                        v-bind="attrs"
                        :disabled="loading"
                        :error-messages="errors"
                        class="custom-text-field"
                        readonly
                        background-color="#F7F7F7"
                        color="#AAAAAA"
                        solo
                        dense
                        flat
                        :suffix="draft._birthdayFormatted ? '' : 'MM/DD/YYYY'"
                        validate-on-blur
                        :value="draft._birthdayFormatted"
                      />
                    </div>
                  </validation-provider>
                </template>
                <v-date-picker
                  v-model="draft._birthdayPicker"
                  :max="new Date().toISOString().substr(0, 10)"
                  min="1990-01-01"
                  @input="onInputBirthday(draft)"
                />
              </v-menu>
            </v-col>
            <v-col cols="12" md="6" class="pl-unset pl-md-2">
              <!-- Gender -->
              <span class="d-inline-block account-field-label mb-2">Gender </span>
              <validation-provider
                v-slot="{ errors }"
                :name="
                  `Child #${draft.id} - ` + 'Gender'
                "
                rules="required"
              >
                <pg-select
                  v-model="draft.gender"
                  :items="genders"
                  clearable
                  :error-messages="errors"
                  :loading="loading"
                  background-color="#F7F7F7"
                  color="#AAAAAA"
                  solo
                  class="custom-text-field"
                  dense
                />
              </validation-provider>
            </v-col>
            <v-col cols="12" class="pr-2">
              <v-row no-gutters>
                <v-col cols="12" md="6">
                  <div>
                    <span class="child-base-text pg-text-[#78C383]">Current letter: </span>
                    <span class="child-base-text">
                      {{ draft.progress.curriculumType.letter ? `Letter ${draft.progress.curriculumType.letter}` : undefined }}
                    </span>
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div>
                    <span class="child-base-text pg-text-[#78C383]">Current day: </span>
                    <span class="child-base-text">
                      {{ draft.progress.day ? `Day ${draft.progress.day}` : undefined }}
                    </span>
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-btn
            block
            class="mt-4 mt-md-0 white--text"
            color="#AAD579"
            :loading="loading"
            type="submit"
            x-large
          >
            SAVE
          </v-btn>
          <v-btn
            block
            text
            color="grey"
            :disabled="loading"
            x-large
            @click="editChild"
          >
            Cancel
          </v-btn>
        </v-form>
      </validation-observer>
      <!-- Readonly child info -->
      <v-row v-if="!isEditing" class="mt-8 mt-md-0" no-gutters>
        <v-col cols="4" class="pb-3 d-flex justify-center">
          <img
            v-if="firstBackpack"
            :alt="childBackpack(draft.backpackId).name"
            class="backpack-active"
            :src="childBackpack(draft.backpackId).image"
          >
        </v-col>

        <v-col cols="8" class="d-flex flex-column justify-start justify-md-end pl-3">
          <h1 class="child-name mb-0 mb-md-3">
            {{ draft.firstName }} {{ (draft.lastName) ? draft.lastName : '' }}
          </h1>

          <div>
            <span class="child-base-text pg-text-[#707070]">Date of birth:  </span>
            <span class="child-base-text pg-text-[#A5A5A5] pg-font-[400]">{{ getChildBirthday }}</span>
          </div>

          <div>
            <span class="child-base-text pg-text-[#707070]">Gender:  </span>
            <span class="child-base-text pg-text-[#A5A5A5] pg-font-[400]">
              {{ draft.gender === 'FEMALE' ? 'Girl' : draft.gender === 'MALE' ? 'Boy' : '' }}
            </span>
          </div>
        </v-col>

        <v-col cols="12" class="mt-4 mb-2">
          <v-row class="d-flex space-between" no-gutters>
            <v-col cols="12" md="6">
              <div>
                <span class="child-base-text pg-text-[#78C383]">Current letter: </span>
                <span class="child-base-text">
                  {{ draft.progress.curriculumType.letter ? `Letter ${draft.progress.curriculumType.letter}` : undefined }}
                </span>
              </div>
            </v-col>

            <v-col cols="12" md="6" class="d-flex">
              <div class="ml-md-auto mr-auto">
                <span class="child-base-text pg-text-[#78C383]">Current day: </span>
                <span class="child-base-text">
                  {{ draft.progress.day ? `Day ${draft.progress.day}` : undefined }}
                </span>
              </div>
            </v-col>
          </v-row>
        </v-col>

        <v-col v-if="draft.id" cols="12" class="d-flex justify-center">
          <v-btn
            color="#A7CFFC"
            text
            class="text-decoration-underline"
            @click="openTimeline(draft)"
          >
            View letter progress
          </v-btn>
        </v-col>
        <v-col cols="12" class="d-flex justify-center">
          <v-btn
            color="#FFA0C8"
            text
            class="text-decoration-underline"
            @click="goToProgressReport(draft)"
          >
            View progress report
          </v-btn>
        </v-col>

        <div class="!pg-absolute pg-top-[10px] pg-right-[10px]">
          <v-btn
            text
            color="#F89838"
            @click="editChild"
          >
            <span class="text-decoration-underline">Edit</span>
            <v-icon right>
              mdi-pencil
            </v-icon>
          </v-btn>

          <v-btn
            icon
            color="white"
            class="pg-bg-[#F6B7D2]"
            @click="closeDialog"
          >
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </div>
      </v-row>
    </v-card>

    <user-child-timeline-dialog />
  </v-dialog>
</template>

<script lang="ts">
import { useNuxtHelper } from '@/composables'
import { TypedStore } from '@/models'
import { defineComponent, watch, computed, ref, useStore, useRouter } from '@nuxtjs/composition-api'
import UserChildTimelineDialog from '@/components/forms/profile/UserChildTimelineDialog.vue'
import dayjs from 'dayjs'

export default defineComponent({
  name: 'ChildFormDialog',
  components: { UserChildTimelineDialog },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => ({})
    },
    firstBackpack: {
      type: Number,
      default: null
    },
    backpacks: {
      type: Array,
      default: () => []
    }
  },
  emits: ['input', 'reload'],
  setup(props, { emit }) {
    const store = useStore<TypedStore>()
    const nuxt = useNuxtHelper()

    const isEditing = ref(false)
    const loading = ref(false)
    const router = useRouter()

    const zIndex = ref('1000')

    const draft = ref<any>({})

    const genders = ref([
      {
        text: 'Boy',
        value: 'MALE'
      },
      {
        text: 'Girl',
        value: 'FEMALE'
      }
    ])

    const viewModal = computed({
      get() {
        return props.value
      },
      set(val: boolean) {
        emit('input', val)
      }
    })

    const getChildBirthday = computed(() => {
      if (!props.item.birthday) {
        return 'Add child birthday'
      }

      return dayjs(props.item.birthday).format('MM/DD/YYYY')
    })

    const childBackpack = (id: number) => {
      return props.backpacks.find((backpack: any) => backpack.id === id)
    }

    const closeDialog = () => {
      viewModal.value = false
    }

    const editChild = () => {
      isEditing.value = !isEditing.value

      if (!isEditing.value) {
        draft.value = { ...props.item }
      }
    }

    const onSubmit = async (item: any) => {
      try {
        loading.value = true

        const params = {
          backpackId: item.backpackId,
          firstName: item.firstName,
          lastName: item.lastName,
          birthday: item.birthday,
          gender: item.gender,
          level: item.level
        }

        await store.dispatch('children/update', { id: item.id, params })

        nuxt.$emit('children-changed')
        emit('reload')
        closeDialog()
        editChild()
      } catch (error) {
        return Promise.reject(error)
      } finally {
        loading.value = false
      }
    }

    const openTimeline = () => {
      nuxt.$emit('open-timeline', props.item)
    }

    const goToProgressReport = () => {
      if (props.item.id) {
        store.dispatch('setChild', { value: [props.item], save: true })
        router.push({
          name: 'app-student-cubby-progress-report',
          query: { id: props.item.id }
        })
      }
    }

    const onInputBirthday = () => {
      if (draft.value._birthdayPicker) {
        draft.value._birthdayFormatted = dayjs(draft.value._birthdayPicker).format(
          'MM/DD/YYYY'
        )
        draft.value.birthday = (draft.value._birthdayPicker) ? `${draft.value._birthdayPicker}T00:00:00.000` : null
      }
    }

    watch(() => props.item, () => {
      draft.value = { ...props.item }
    }, { deep: true })

    return {
      viewModal,
      draft,
      zIndex,
      loading,
      isEditing,
      genders,
      getChildBirthday,
      childBackpack,
      onInputBirthday,
      onSubmit,
      openTimeline,
      goToProgressReport,
      editChild,
      closeDialog
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/assets/scss/app.scss';
@import '~/assets/scss/account.scss';

.image {
  max-height: 80px;
  max-width: 80px;
  width: 100%;

  &.active {
    background-color: var(--v-secondary-base);
    border-radius: 50%;
    padding: 5px;
  }
}

.backpack-active {
  height: 100px;
}

.child-name {
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #707070;

  @media screen and (min-width: $breakpoint-xs) {
    font-size: 24px;
    line-height: 36px;
  }
}

.child-base-text {
  font-style: normal;
  font-size: 14px;
  line-height: 21px;

  @media screen and (min-width: $breakpoint-xs) {
    font-size: 15px;
    line-height: 22px;
  }
}
</style>
