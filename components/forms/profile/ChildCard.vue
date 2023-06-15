<template>
  <v-card
    class="!pg-relative pa-4 pa-sm-8"
    :class="[childCardColor ? 'account-card-border' : '']"
    :style="{ '--card-custom-color': childCardColor }"
  >
    <validation-observer v-if="isEditing" v-slot="{ passes }">
      <v-form
        :readonly="loading"
        @submit.prevent="passes().then(onSubmit(draft))"
      >
        <!-- Backpack -->
        <validation-provider
          :name="
            (isRemovable ? `Child #${index + 1} - ` : '') + 'Backpack'
          "
          rules="required"
        >
          <!-- Delete Child Profile Button -->
          <v-row no-gutters class="mb-6">
            <v-col v-if="draft.id" cols="12" class="d-flex justify-end">
              <v-btn
                v-if="isRemovable"
                text
                color="#F83838"
                class="text-decoration-underline"
                @click.stop="removeChild(draft)"
              >
                {{ $t('account.student.deleteChild') }}
              </v-btn>
            </v-col>
          </v-row>
          <!-- Backpack Picker -->
          <v-row class="mb-6" no-gutters>
            <v-col cols="12">
              <v-row justify="center" no-gutters>
                <v-col cols="12" md="10" lg="12">
                  <v-row no-gutters>
                    <v-col cols="12">
                      <span class="account-field-label">
                        {{ $t('account.student.changeIcon') }}
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
            <span class="d-inline-block account-field-label mb-2">{{ $t('commonWords.firstName') }}</span>
            <validation-provider
              v-slot="{ errors }"
              :name="
                (isRemovable ? `Child #${index + 1} - ` : '') + 'Name'
              "
              rules="required"
            >
              <pg-text-field
                v-model="draft.firstName"
                clearable
                :disabled="loading"
                :error-messages="errors"
                background-color="#F7F7F7"
                color="#AAAAAA"
                solo
                dense
                class="custom-text-field"
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
            <span class="d-inline-block account-field-label mb-2">{{ $t('commonWords.lastName') }}</span>
            <validation-provider
              v-slot="{ errors }"
              :name="
                (isRemovable ? `Child #${index + 1} - ` : '') + 'Name'
              "
              rules="required"
            >
              <pg-text-field
                v-model="draft.lastName"
                clearable
                :disabled="loading"
                :error-messages="errors"
                background-color="#F7F7F7"
                color="#AAAAAA"
                solo
                dense
                class="custom-text-field"
                flat
              />
            </validation-provider>
          </v-col>
        </v-row>
        <v-row class="mb-2" no-gutters>
          <v-col cols="12" md="6" class="pr-unset pr-md-2">
            <!-- Birthday date -->
            <span class="d-inline-block account-field-label mb-2">{{ $t('account.student.birthDate') }}</span>
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
                    (isRemovable ? `Child #${index + 1} - ` : '') +
                      'Birthday date'
                  "
                  rules="required"
                >
                  <div v-on="on">
                    <pg-text-field
                      v-bind="attrs"
                      :disabled="loading"
                      :error-messages="errors"
                      readonly
                      class="custom-text-field"
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
                min="2015-01-01"
                @input="onInputBirthday(draft)"
              />
            </v-menu>
          </v-col>
          <v-col cols="12" md="6" class="pl-unset pl-md-2">
            <!-- Gender -->
            <span class="d-inline-block account-field-label mb-2">{{ $t('account.student.gender') }}</span>
            <validation-provider
              v-slot="{ errors }"
              :name="
                (isRemovable ? `Child #${index + 1} - ` : '') + 'Gender'
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
          <v-col v-if="draft.progress.curriculumType && draft.id" cols="12" class="pr-2">
            <v-row no-gutters>
              <v-col cols="12" md="6">
                <div>
                  <span class="child-base-text pg-text-[#78C383]">{{ $t('account.student.currentLetter') }}</span>
                  <span class="child-base-text">
                    {{ draft.progress.curriculumType.letter ? `Letter ${draft.progress.curriculumType.letter}` : undefined }}
                  </span>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div>
                  <span class="child-base-text pg-text-[#78C383]">{{ $t('account.student.currentDay') }}</span>
                  <span class="child-base-text">
                    {{ draft.progress.day ? `Day ${draft.progress.day}` : undefined }}
                  </span>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-btn
          v-if="isChildChanged"
          block
          class="mt-4 mt-md-0 white--text"
          color="#AAD579"
          :loading="loading"
          type="submit"
          x-large
        >
          {{ $t('commonWords.save') }}
        </v-btn>
        <v-btn
          block
          text
          color="grey"
          :disabled="loading"
          x-large
          @click="editChild"
        >
          {{ $t('commonWords.cancel') }}
        </v-btn>
      </v-form>
    </validation-observer>
    <!-- Readonly child info -->
    <v-row v-if="!isEditing" class="mt-5 mt-md-0" no-gutters>
      <v-col cols="4" class="pb-3 d-flex justify-center">
        <img
          v-if="childBackpack"
          :alt="childBackpack.name"
          class="backpack-active"
          :src="childBackpack.image"
        >
      </v-col>

      <v-col cols="8" class="d-flex flex-column justify-start pl-3">
        <h1 class="child-name mb-0 mb-md-3">
          {{ draft.firstName }} {{ (draft.lastName) ? draft.lastName : '' }}
        </h1>

        <div>
          <span class="child-base-text pg-text-[#707070]">{{ $t('account.student.birthDate') }}</span>
          <span class="child-base-text pg-text-[#A5A5A5] pg-font-[400]">{{ getChildBirthday }}</span>
        </div>

        <div>
          <span class="child-base-text pg-text-[#707070]">{{ $t('account.student.gender') }}</span>
          <span class="child-base-text pg-text-[#A5A5A5] pg-font-[400]">
            {{ draft.gender === 'FEMALE' ? 'Girl' : draft.gender === 'MALE' ? 'Boy' : '' }}
          </span>
        </div>
      </v-col>

      <v-col v-if="draft.progress" cols="12" class="mt-4 mb-2">
        <v-row class="d-flex space-between" no-gutters>
          <v-col cols="12" md="6" class="d-flex">
            <div class="ml-md-auto mr-auto">
              <span class="child-base-text pg-text-[#78C383]">{{ $t('account.student.currentLetter') }}</span>
              <span class="child-base-text">
                {{ draft.progress.curriculumType.letter ? `Letter ${draft.progress.curriculumType.letter}` : undefined }}
              </span>
            </div>
          </v-col>

          <v-col cols="12" md="6" class="d-flex">
            <div class="ml-md-auto mr-auto">
              <span class="child-base-text pg-text-[#78C383]">{{ $t('account.student.currentDay') }}</span>
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
          @click="$emit('openTimeline')"
        >
          {{ $t('account.student.viewCurrentLetter') }}
        </v-btn>
      </v-col>
      <v-col cols="12" class="d-flex justify-center">
        <v-btn
          color="#FFA0C8"
          text
          class="text-decoration-underline"
          @click="goToProgressReport"
        >
          {{ $t('account.student.viewProgressReport') }}
        </v-btn>
      </v-col>

      <v-btn
        class="!pg-absolute pg-top-[10px] pg-right-[10px]"
        text
        color="#F89838"
        @click="editChild"
      >
        <span class="text-decoration-underline">{{ $t('commonWords.edit') }}</span>
        <v-icon right>
          mdi-pencil
        </v-icon>
      </v-btn>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { useNuxtHelper } from '@/composables'
import { TypedStore } from '@/models'
import { defineComponent, ref, computed, watch, onMounted, useStore, useRouter } from '@nuxtjs/composition-api'
import dayjs from 'dayjs'

export default defineComponent({
  name: 'ChildCard',
  props: {
    index: {
      type: Number,
      default: 0
    },
    item: {
      type: Object,
      default: () => {}
    },
    isRemovable: {
      type: Boolean,
      default: false
    },
    childCardColor: {
      type: String,
      default: ''
    },
    backpacks: {
      type: Array,
      default: () => []
    }
  },
  emits: ['removeChild', 'openTimeline', 'loadChild', 'removeChild'],
  setup(props, { emit }) {
    const nuxt = useNuxtHelper()
    const store = useStore<TypedStore>()
    const router = useRouter()

    const isEditing = ref(false)
    const loading = ref(false)
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

    const childBackpack = computed(() => {
      return props.backpacks.find((backpack: any) => backpack.id === props.item.backpackId)
    })

    const isChildChanged = computed(() => props.item._original !== getOriginalChild(draft.value))

    const getChildBirthday = computed(() => {
      if (!props.item.birthday) {
        return 'Add child birthday'
      }

      return dayjs(props.item.birthday).format('MM/DD/YYYY')
    })

    const onInputBirthday = () => {
      if (draft.value._birthdayPicker) {
        draft.value._birthdayFormatted = dayjs(draft.value._birthdayPicker).format(
          'MM/DD/YYYY'
        )
        draft.value.birthday = (draft.value._birthdayPicker) ? `${draft.value._birthdayPicker}T00:00:00.000` : null
      }
    }

    const getOriginalChild = ({ backpackId, birthday, firstName, level, gender, lastName }: any) => {
      return JSON.stringify({
        backpackId,
        birthday,
        firstName,
        lastName,
        level,
        gender
      })
    }

    const editChild = () => {
      isEditing.value = !isEditing.value

      if (!isEditing.value) {
        if (!draft.value.id) {
          emit('removeChild')
        }

        draft.value = { ...props.item }
      }
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

    const onSubmit = async (item: any) => {
      try {
        loading.value = true

        if (item.id) {
          const params = {
            backpackId: item.backpackId,
            firstName: item.firstName,
            lastName: item.lastName,
            birthday: item.birthday,
            gender: item.gender,
            level: item.level
          }

          const data = await store.dispatch('children/update', { id: item.id, params })
          item._original = getOriginalChild(item)
          emit('loadChild', data)
          editChild()
        } else {
          const data = await store.dispatch('children/store', item)

          data._original = getOriginalChild(item)

          emit('loadChild', data)

          nuxt.$emit('children-changed')
        }
      } catch (error) {
        return Promise.reject(error)
      } finally {
        loading.value = false
      }
    }

    const removeChild = (item: any) => {
      nuxt.$emit('open-prompt', {
        message: `Are you sure you want to delete <b>${item.firstName}</b>?`,
        action: async () => {
          loading.value = true
          try {
            if (item.id) {
              await store.dispatch('children/delete', item.id)
            }
            emit('removeChild')
            nuxt.$emit('children-changed')
          } catch (e) {
          } finally {
            loading.value = false
          }
        }
      })
      return false
    }

    const init = () => {
      draft.value = { ...props.item }
      isEditing.value = !props.item.id
    }

    watch(() => props.item, () => {
      init()
    }, { deep: true })

    onMounted(() => {
      init()
    })

    return {
      isEditing,
      loading,
      draft,
      genders,
      childBackpack,
      isChildChanged,
      editChild,
      onInputBirthday,
      getChildBirthday,
      goToProgressReport,
      onSubmit,
      removeChild
    }
  }
})

</script>

<style lang="scss" scoped>
@import '~/assets/scss/app.scss';
@import '~/assets/scss/account.scss';

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

.custom-btn::v-deep.v-btn.grey {
  background-color: #f2f2f2;
  color: #9d9d9d !important;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  text-transform: capitalize !important;
}

.custom-btn::v-deep.v-btn {
  text-transform: capitalize !important;
}

.v-btn:not(.v-btn--text) {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
}

::v-deep .v-text-field .v-input__control .v-input__slot input {
  color: #AAAAAA !important;
}

::v-deep .v-text-field .v-input__control .v-input__slot .v-text-field__suffix {
    color: #AAAAAA !important;
}
</style>
