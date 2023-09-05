<template>
  <pg-select
    :loading="loading"
    :disabled="loading"
    :value="value"
    :items="languages"
    :placeholder="$t('dailyLessons.childSelect.placeholder')"
    item-value="id"
    item-text="language"
    class="elevation-0"
    :background-color="small ? 'transparent' : '#F6F6F6'"
    solo
    dense
    flat
    hide-details
    @input="changeLang($event)"
  >
    <template v-slot:selection="{ item }">
      <v-list-item class="pa-0" :class="{ 'w-100': !small }">
        <v-list-item-avatar>
          <v-img :src="item.icon" />
        </v-list-item-avatar>

        <v-list-item-content v-if="!small">
          <v-list-item-title class="text-truncate">
            {{ item.language }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>

    <template v-slot:item="{ item, on, attrs }">
      <v-list-item v-bind="attrs" :class="{ 'w-100': !small }" v-on="on">
        <v-list-item-avatar>
          <v-img :src="item.icon" />
        </v-list-item-avatar>

        <v-list-item-content v-if="!small">
          <v-list-item-title>
            {{ item.language }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
  </pg-select>
</template>

<script lang="ts">
import { useToastHelper } from '@/composables'
import { computed, defineComponent, onMounted, ref, useStore } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'LanguageSelect',
  props: {
    small: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const loading = ref(false)
    const store = useStore()
    const toast = useToastHelper()
    const value = ref<number|null>(null)
    const userInfo = computed(() => store.getters['auth/getUserInfo'])
    const languages = computed(() => store.getters['account/getLanguages'])

    const fetchLanguages = async () => {
      loading.value = true

      try {
        await store.dispatch('account/fetchLanguages')
      } catch {
        toast.error('Could not fetch languages')
      } finally {
        loading.value = false
      }
    }

    const setSelectValue = () => {
      const englishLanguage = languages.value.find((language: any) => language.language === 'English')
      value.value = userInfo.value.language ? userInfo.value.language.id : englishLanguage.id
    }

    const changeLang = async (languageId: number) => {
      loading.value = true

      try {
        await store.dispatch('account/setUserLanguage', languageId)
        await store.dispatch('auth/fetchUserInfo')
      } catch {
        toast.error('Could not change language')
      } finally {
        loading.value = false
        location.reload()
      }
    }

    onMounted(async () => {
      await fetchLanguages()
      setSelectValue()
    })

    return {
      loading,
      userInfo,
      value,
      changeLang,
      languages
    }
  }
})

</script>

<style lang="scss" scoped>
.only-child-name-title {
  color: #7852b5 !important;
  font-size: 28px !important;
  text-align: center;
}
</style>
