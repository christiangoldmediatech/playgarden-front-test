<template>
  <v-card class="pa-4 pa-sm-8 d-flex flex-column align-start account-card-border" :style="{ '--card-custom-color': studentProfileColor }">
    <div class="w-100 d-flex justify-space-between align-centers">
      <span class="account-card-title">
        Student Profile
      </span>
    </div>

    <div class="py-2 account-card-subtitle">
      In this section you can edit the Child’s information or add a new Child.
    </div>

    <div class="account-orange-dashed-line"></div>

    <v-row no-gutters class="pt-4">
      <v-col cols="12">
        <v-row no-gutters>
          <v-col
            v-for="(item, indexD) in items"
            :key="indexD"
            cols="12"
            class="mb-2"
          >
            <!-- Readonly child info -->
            <v-row no-gutters>
              <v-col cols="4" md="3">
                <img
                  v-if="firstBackpack"
                  :alt="childBackpack(item.backpackId).name"
                  class="backpack-active"
                  :src="childBackpack(item.backpackId).image"
                >
              </v-col>
              <v-col cols="8" md="9" class="d-flex flex-column pl-3">
                <div class="d-flex justify-space-between">
                  <h1 class="child-name mb-3">
                    {{ item.firstName }} {{ (item.lastName) ? item.lastName : '' }}
                  </h1>
                  <v-btn
                    text
                    class="account-child-btn"
                    small
                    color="#FFAB37"
                    @click="selectChildToEdit(item)"
                  >
                    View more
                  </v-btn>
                </div>
                <div>
                  <span class="child-base-text pg-text-[#707070]">Date of birth:  </span>
                  <span class="child-base-text pg-text-[#A5A5A5] pg-font-[400]">{{ getChildBirthday(item.birthday) }}</span>
                </div>
                <div>
                  <span class="child-base-text pg-text-[#707070]">Gender:  </span>
                  <span class="child-base-text pg-text-[#A5A5A5] pg-font-[400]">
                    {{ item.gender === 'FEMALE' ? 'Girl' : item.gender === 'MALE' ? 'Boy' : '' }}
                  </span>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-col cols="12">
      <v-btn
        class="white--text rounded-0"
        color="#F89838"
        elevation="0"
        block
        @click="goToPage"
      >
        VIEW MORE
      </v-btn>
    </v-col>

    <child-form-dialog
      v-model="viewModal"
      :item="childToEdit"
      :backpacks="backpacks"
      :first-backpack="firstBackpack"
    />
  </v-card>
</template>

<script lang="ts">
import { TypedStore } from '@/models'
import { defineComponent, onMounted, ref, computed, useRouter, useStore, onUnmounted } from '@nuxtjs/composition-api'
import ChildFormDialog from '@/components/forms/profile/ChildFormDialog.vue'
import dayjs from 'dayjs'
import { useNuxtHelper } from '@/composables'

export default defineComponent({
  name: 'StudentProfileCard',
  components: {
    ChildFormDialog
  },
  setup() {
    const nuxt = useNuxtHelper()

    const studentProfileColor = ref('248, 152, 56')
    const items = ref<any>([])
    const backpacks = ref<any>([])
    const childrenProgress = ref<any[]>([])

    const store = useStore<TypedStore>()
    const router = useRouter()

    const viewModal = ref(false)
    const childToEdit = ref({})

    const firstBackpack = computed(() => {
      if (backpacks.value.length) {
        return backpacks.value[0].id
      }
      return null
    })

    const fetchBackpacks = async () => {
      backpacks.value = await store.dispatch('backpacks/getBackpacks')
    }

    const fetchChildren = async () => {
      items.value = []
      const rows = await store.dispatch('children/get')

      childrenProgress.value = await store.dispatch('children/progress/getUserChildrenProgress')

      rows.forEach((row: any) => {
        loadChild(row)
      })
    }

    const loadChild = (
      { _original, id, backpack, birthday, firstName, lastName, gender, level }: any
    ) => {
      const _birthdayPicker = (birthday) ? new Date(birthday).toISOString().substr(0, 10) : dayjs(`${new Date().getFullYear() - 2}-01-01`).format('YYYY-MM-DD')
      const _birthdayFormatted = dayjs(birthday).format(
        'MM/DD/YYYY'
      )

      const progress = childrenProgress.value.find((progress) => {
        if (progress && progress.children && progress.children.id) {
          return progress.children.id === id
        }
        return false
      })

      const item = {
        _birthdayPicker,
        _birthdayFormatted,
        _original,
        id,
        backpackId: backpack.id,
        birthday: `${_birthdayPicker}T00:00:00.000`,
        firstName,
        lastName,
        gender,
        level,
        progress: {
          curriculumType: {
            letter: progress && progress.curriculumType ? progress.curriculumType.letter : undefined
          },
          day: progress ? progress.day : undefined
        }
      }

      addRow(item)
    }

    const addRow = (data = {}) => {
      const _data = {
        ...data
      }

      items.value.unshift(_data)
    }

    const childBackpack = (id: number) => {
      return backpacks.value.find((backpack: any) => backpack.id === id)
    }

    const goToPage = () => {
      router.push({ name: 'app-account-index-student-profile' })
    }

    const getChildBirthday = (date: any) => {
      if (!date) {
        return 'Add child birthday'
      }

      return dayjs(date).format('MM/DD/YYYY')
    }

    const selectChildToEdit = (item: any) => {
      childToEdit.value = item
      viewModal.value = true
    }

    onMounted(async () => {
      await fetchBackpacks()
      await fetchChildren()
      nuxt.$on('children-changed', fetchChildren)
    })

    onUnmounted(() => {
      nuxt.$off('children-changed')
    })

    return {
      viewModal,
      items,
      childToEdit,
      firstBackpack,
      backpacks,
      studentProfileColor,
      childBackpack,
      getChildBirthday,
      selectChildToEdit,
      goToPage,
      fetchChildren
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/assets/scss/account.scss';

.child-name {
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 36px;
  color: #707070;

  @media screen and (min-width: $breakpoint-md) {
    font-size: 24px;
  }
}

.child-base-text {
  font-style: normal;
  font-size: 15px;
  line-height: 22px;
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
  height: 70px;

  @media screen and (min-width: $breakpoint-md) {
    height: 85px;
  }

  @media screen and (min-width: $breakpoint-lg) {
    height: 100px;
  }
}

</style>
