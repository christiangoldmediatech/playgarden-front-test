<template>
  <v-main class="main">
    <v-container class="pt-0" :class="{ 'fill-height': loading }" fluid>
      <v-row no-gutters>
        <v-col cols="12">
          <pg-loading v-if="loading" />

          <div v-else data-test-id="help-content">
            <v-row>
              <v-img
                height="500px"
                :src="require('@/assets/jpg/help-banner.jpg')"
              >
                <v-overlay absolute class="text-center">
                  <underlined-title
                    class="text-h5 text-md-h3 white--text underlined-title-dark-green"
                    text="Hello, how can we help?"
                  />
                </v-overlay>
              </v-img>
            </v-row>

            <template v-if="categorySelect">
              <v-row
                v-if="isMobile"
                class="mt-n8"
                justify="center"
              >
                <pg-select
                  v-model="categorySelect"
                  class="shrink"
                  :items="categories"
                  item-text="name"
                  item-value="id"
                  return-object
                  solo
                >
                  <template v-slot:selection="{ item }">
                    <v-list-item class="pa-0 w-100">
                      <v-list-item-avatar>
                        <v-img
                          class="rounded-circle"
                          max-width="50"
                          :src="item.icon"
                        />
                      </v-list-item-avatar>

                      <v-list-item-content>
                        <v-list-item-title class="text-truncate">
                          {{ item.name }}
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>

                  <template v-slot:item="{ item, on, attrs }">
                    <v-list-item v-bind="attrs" class="w-100" v-on="on">
                      <v-list-item-avatar>
                        <v-img
                          class="rounded-circle"
                          max-width="50"
                          :src="item.icon"
                        />
                      </v-list-item-avatar>

                      <v-list-item-content>
                        <v-list-item-title>
                          {{ item.name }}
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </pg-select>
              </v-row>

              <v-row v-else class="mt-categories" justify="center">
                <v-col
                  v-for="(category, indexC) in categories"
                  :key="indexC"
                  cols="6"
                  sm="3"
                >
                  <v-card
                    class="pa-2"
                    :color="
                      category.id === categorySelect.id ? 'primary' : 'white'
                    "
                    :data-test-id="`help-section-${category.name}`"
                    @click="categorySelect = category"
                  >
                    <v-card-text class="pa-0 white">
                      <v-col cols="12">
                        <v-row justify="center" no-gutters>
                          <v-img
                            class="rounded-circle"
                            max-width="50"
                            :src="category.icon"
                          />
                        </v-row>
                      </v-col>

                      <v-col class="pt-0 text-center" cols="12">
                        <span class="text-h6">{{ category.name }}</span>
                      </v-col>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <v-row class="mt-4 mb-14 mt-md-12 px-4 px-md-12" justify="center">
                <underlined-title
                  class="text-h5 text-md-h3"
                  :data-test-id="`help-title-${categorySelect.name}`"
                  :text="categorySelect.name"
                />

                <v-expansion-panels
                  v-if="faqs[categorySelect.id]"
                  :key="categorySelect.id"
                  accordion
                  class="mt-2 mt-md-6"
                >
                  <v-expansion-panel
                    v-for="(faq, indexF) in faqs[categorySelect.id]"
                    :key="indexF"
                  >
                    <v-expansion-panel-header
                      v-slot="{ open }"
                      disable-icon-rotate
                      expand-icon=""
                    >
                      <v-row align="center" no-gutters>
                        <v-col cols="2" sm="1">
                          <v-icon color="accent">
                            mdi-checkbox-blank-circle
                          </v-icon>
                        </v-col>
                        <v-col>
                          <span class="text-subtitle-1 text-md-h6">{{ faq.question }}</span>
                        </v-col>
                        <v-col cols="1">
                          <v-icon color="accent">
                            {{ open ? "mdi-minus" : "mdi-plus" }}
                          </v-icon>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-header>

                    <v-expansion-panel-content class="pa-6">
                      <div v-html="faq.answer" />
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-row>
            </template>

            <v-row v-if="isLogin" class="px-6 px-md-0" justify="center">
              <v-col cols="12" md="6">
                <validation-observer v-slot="{ invalid, passes, reset }">
                  <v-form
                    :readonly="sending"
                    @submit.prevent="passes(() => onSubmit(reset))"
                  >
                    <div class="text-center">
                      <underlined-title
                        class="text-h5 text-md-h3"
                        text="Still need help?"
                      />

                      <p class="mt-2">
                        Contact us and we will get back to you soon!
                      </p>
                    </div>

                    <v-row>
                      <v-col class="pb-0" cols="6">
                        <!-- Name -->
                        <validation-provider
                          v-slot="{ errors }"
                          name="Name"
                          rules="required"
                        >
                          <pg-text-field
                            v-model="help.name"
                            clearable
                            :disabled="sending"
                            :error-messages="errors"
                            label="Name"
                            :loading="sending"
                            solo
                            data-test-id="help-form-name"
                          />
                        </validation-provider>
                      </v-col>

                      <v-col class="pb-0" cols="6">
                        <!-- E-mail -->
                        <validation-provider
                          v-slot="{ errors }"
                          name="E-mail"
                          rules="required|email"
                        >
                          <pg-text-field
                            v-model="help.email"
                            clearable
                            :disabled="sending"
                            :error-messages="errors"
                            label="E-mail"
                            :loading="sending"
                            solo
                            data-test-id="help-form-email"
                          />
                        </validation-provider>
                      </v-col>
                    </v-row>

                    <!-- Subject -->
                    <validation-provider
                      v-slot="{ errors }"
                      name="Subject"
                      rules="required"
                    >
                      <pg-text-field
                        v-model="help.subject"
                        clearable
                        :disabled="sending"
                        :error-messages="errors"
                        label="Subject"
                        :loading="sending"
                        maxlength="20"
                        solo
                        data-test-id="help-form-subject"
                      />
                    </validation-provider>

                    <!-- How can we help you? -->
                    <validation-provider
                      v-slot="{ errors }"
                      name="How can we help you?"
                      rules="required"
                    >
                      <pg-textarea
                        v-model="help.description"
                        clearable
                        :disabled="sending"
                        :error-messages="errors"
                        label="How can we help you?"
                        :loading="sending"
                        solo
                        data-test-id="help-form-textarea"
                      />
                    </validation-provider>

                    <v-row justify="center" class="px-2 px-md-0">
                      <v-btn
                        class="mb-6"
                        color="primary"
                        :disabled="invalid"
                        :loading="sending"
                        type="submit"
                        :width="isMobile ? undefined : 400"
                        :block="isMobile"
                        x-large
                        data-test-id="help-form-submit"
                      >
                        Submit
                      </v-btn>
                    </v-row>
                  </v-form>
                </validation-observer>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import { defineComponent, useMeta, useStore } from '@nuxtjs/composition-api'
import { computed, onMounted, ref } from '@vue/composition-api'

import { useAuth, useFAQ, useFAQCategories, useHelp, useSnotifyHelper, useVuetifyHelper } from '@/composables'
import { FAQ, FAQCategory, TypedStore } from '@/models'

export default defineComponent({
  name: 'Help',
  layout: 'empty',

  setup () {
    useMeta({ title: 'Help' })
    const store = useStore<TypedStore>()
    const vuetify = useVuetifyHelper()
    const { isUserLoggedIn } = useAuth({ store })

    const loading = ref(true)
    const sending = ref(false)
    const categorySelect = ref<FAQCategory | null>(null)
    const categories = ref<FAQCategory[]>([])
    const faqs = ref<Record<number, FAQ[]>>({})

    const help = ref({
      name: null,
      email: null,
      subject: null,
      description: null
    })

    const isMobile = computed(() => vuetify.breakpoint.mobile)

    const { getFAQs } = useFAQ()
    const { getFAQsCategories } = useFAQCategories()

    onMounted(async () => {
      try {
        loading.value = true

        const cats = await getFAQsCategories()
        categorySelect.value = cats?.[0] || null

        const faqsList = await getFAQs()
        const _faqs = {} as Record<number, FAQ[]>

        faqsList.map((faq) => {
          const id = faq.faqsCategory.id

          if (id) {
            if (!_faqs[id]) {
              _faqs[id] = []
            }
            _faqs[id].push(faq)
          }
        })

        faqs.value = _faqs
        categories.value = cats
      } catch (error) {

      } finally {
        loading.value = false
      }
    })

    const { sendHelpEmail } = useHelp()
    const snotify = useSnotifyHelper()

    const onSubmit = async (reset: () => void) => {
      try {
        await sendHelpEmail({
          ...help.value
        })

        snotify.success(
          'Email sent! We will reach out to you as soon as we can!'
        )
        help.value = {
          name: null,
          email: null,
          subject: null,
          description: null
        }
      } catch (error) {
        snotify.error(
          'There was a problem sending the email, please try again.'
        )
      } finally {
        reset()
      }
    }

    return {
      loading,
      sending,
      categorySelect,
      categories,
      faqs,
      help,
      isMobile,
      isLogin: isUserLoggedIn,
      onSubmit
    }
  },

  head: {}
})
</script>

<style lang="scss" scoped>
// .main::v-deep {
//   min-height: 500px;

//   .v-expansion-panel:before {
//     box-shadow: none;
//   }

//   .v-overlay__content {
//     width: 600px;
//   }

//   .mt-categories {
//     margin-top: -80px;
//   }
// }
</style>
