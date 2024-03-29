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

              <v-row class="pb-6" no-gutters>
                <div class="w-100 links-container d-flex flex-column align-center justify-center" :class="($vuetify.breakpoint.mobile) ? 'mobile-iframe' : ''">
                  <p class="links-base links-container-title">
                    Join the Playgarden Online community today!
                  </p>

                  <div class="w-100 links-row">
                    <a
                      v-for="(link, linkIndex) in links"
                      :key="linkIndex"
                      :href="link.link"
                      target="_blank"
                      class="links-base link"
                      :style="{ 'color': link.color }"
                    >
                      {{ link.name }}
                    </a>
                  </div>
                </div>
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
                          name="name"
                          rules="required"
                        >
                          <pg-text-field
                            v-model="help.name"
                            class="custom-text-field"
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
                          name="email"
                          rules="required|email"
                        >
                          <pg-text-field
                            v-model="help.email"
                            class="custom-text-field"
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
                      name="subject"
                      rules="required"
                    >
                      <pg-text-field
                        v-model="help.subject"
                        class="custom-text-field"
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
                      name="howCanWeHelpYou"
                      rules="required"
                    >
                      <pg-textarea
                        v-model="help.description"
                        class="custom-text-field"
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

import {
  useAuth,
  useFAQ,
  useFAQCategories,
  useHelp,
  useToastHelper,
  useVuetifyHelper
} from '@/composables'
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

    const links = ref([
      {
        name: 'Enrollment Plans',
        link: 'https://playgardenonline.com/plans/',
        color: 'rgba(105, 190, 255, 1)'
      },
      {
        name: 'About Us',
        link: 'https://playgardenonline.com/about-us/',
        color: 'rgba(195, 153, 237, 1)'
      },
      {
        name: 'Your Teachers',
        link: 'https://playgardenonline.com/your-teachers/',
        color: 'rgba(255, 160, 200, 1)'
      },
      {
        name: 'News',
        link: 'https://playgardenonline.com/news/',
        color: 'rgba(104, 196, 83, 1)'
      }
    ])

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
    const toast = useToastHelper()

    const onSubmit = async (reset: () => void) => {
      try {
        await sendHelpEmail({
          ...help.value
        })

        toast.success(
          'Email sent! We will reach out to you as soon as we can!'
        )
        help.value = {
          name: null,
          email: null,
          subject: null,
          description: null
        }
      } catch (error) {
        toast.error(
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
      onSubmit,
      links
    }
  },

  head() {
    return {
      title: 'Online Preschool FAQs'
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/assets/scss/app.scss';

.links-container {
  background-image: url("~@/assets/png/faq-paper.png");
  background-position: center center;
  background-size: 100% 500px;
  padding: 50px 10px;

  @media screen and (min-width: $breakpoint-xs) {
    background-size: 100% 323px;
    padding: 95px 70px;
  }
}

.links-row {
  display: flex;
  flex-direction: column;

  @media screen and (min-width: $breakpoint-xs) {
    flex-direction: row;
    justify-content: space-around;
  }

  @media screen and (min-width: $breakpoint-md) {
    padding: 0 140px;
  }
}

.links-container-title {
  color: #F89838;
}

.links-base {
  font-family: 'Quicksand';
  font-weight: 700;
  line-height: 50px;
  font-size: 18px;
  text-align: center;

  @media screen and (min-width: $breakpoint-md) {
    font-size: 25px;
  }
}

.mobile-iframe {
  padding-bottom: 120px !important;
}

.link {
  text-decoration-line: underline !important;
}
</style>
