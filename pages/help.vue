<template>
  <v-main class="main">
    <v-container class="pt-0" :class="{ 'fill-height': loading }" fluid>
      <v-row no-gutters>
        <v-col cols="12">
          <pg-loading v-if="loading" />

          <template v-else>
            <v-row>
              <v-img
                max-height="500"
                :src="require('@/assets/jpg/help-banner.jpg')"
              >
                <v-overlay absolute>
                  <underlined-title
                    class="text-h5 text-md-h3 white--text"
                    text="Hello, how can we help?"
                  />
                </v-overlay>
              </v-img>
            </v-row>

            <template v-if="categorySelect">
              <v-row
                v-if="$vuetify.breakpoint.mobile"
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
                          :style="{ backgroundColor: item.color }"
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
                          :style="{ backgroundColor: item.color }"
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

              <v-row class="mt-12 px-6 px-md-12" justify="center">
                <underlined-title
                  class="text-h5 text-md-h3"
                  :text="categorySelect.name"
                />

                <v-expansion-panels
                  v-if="faqs[categorySelect.id]"
                  :key="categorySelect.id"
                  accordion
                  class="mt-6"
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
                      <v-row align="center">
                        <v-icon color="accent">
                          mdi-checkbox-blank-circle
                        </v-icon>

                        <span class="ml-3 text-h6">{{ faq.question }}</span>

                        <v-spacer />

                        <v-icon color="accent">
                          {{ open ? "mdi-minus" : "mdi-plus" }}
                        </v-icon>
                      </v-row>
                    </v-expansion-panel-header>

                    <v-expansion-panel-content class="pa-6">
                      <div v-html="faq.answer" />
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-row>
            </template>

            <v-row class="mt-12 px-6 px-md-0" justify="center">
              <v-col cols="12" md="6">
                <validation-observer v-slot="{ invalid, passes, reset }">
                  <v-form
                    :readonly="sending"
                    @submit.prevent="passes(onSubmit(reset))"
                  >
                    <div class="text-center">
                      <underlined-title
                        class="text-h5 text-md-h3"
                        text="Still need help?"
                      />

                      <p class="mt-2">
                        Contact us an we will get back to you personally.
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
                          />
                        </validation-provider>
                      </v-col>
                    </v-row>

                    <!-- How can we help you? -->
                    <validation-provider
                      v-slot="{ errors }"
                      name="How can we help you?"
                      rules="required"
                    >
                      <pg-select
                        v-model="help.issueType"
                        clearable
                        :disabled="sending"
                        :error-messages="errors"
                        :items="emailTopics"
                        label="How can we help you?"
                        :loading="sending"
                        solo
                      />
                    </validation-provider>

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
                      />
                    </validation-provider>

                    <v-row justify="center">
                      <v-btn
                        class="mb-6"
                        color="primary"
                        :disabled="invalid"
                        :loading="sending"
                        type="submit"
                        width="400"
                        x-large
                      >
                        Submit
                      </v-btn>
                    </v-row>
                  </v-form>
                </validation-observer>
              </v-col>
            </v-row>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import { get } from 'lodash'
import { mapActions } from 'vuex'

const EMAIL_TOPICS = {
  ACCOUNT: 'ACCOUNT',
  ACTIVITIES: 'ACTIVITIES',
  LESSONS: 'LESSONS',
  LIVE_SESSIONS: 'LIVE SESSIONS',
  PARENT_CORNER: 'PARENT CORNER',
  STUDENT_CUBBY: 'STUDENT CUBBY'
}

export default {
  name: 'Help',

  data: () => ({
    loading: true,
    sending: false,
    categorySelect: null,
    categories: [],
    faqs: {},
    help: {
      name: null,
      email: null,
      issueType: null,
      subject: null,
      description: null
    }
  }),

  computed: {
    emailTopics () {
      return Object.values(EMAIL_TOPICS)
    }
  },

  async created () {
    try {
      const categories = await this.getFAQsCategories()
      this.categorySelect = get(categories, '0', null)

      const _faqs = {}
      const faqs = await this.getFAQs()

      faqs.map((faq) => {
        const id = get(faq, 'faqsCategory.id')

        if (id) {
          if (!_faqs[id]) {
            _faqs[id] = []
          }
          _faqs[id].push(faq)
        }
      })

      this.faqs = _faqs
      this.categories = categories
    } catch (e) {
    } finally {
      this.loading = false
    }
  },

  methods: {
    ...mapActions('faqs', ['getFAQs']),

    ...mapActions('faqs-categories', ['getFAQsCategories']),
    ...mapActions('help', ['sendHelpEmail']),

    async onSubmit (reset) {
      try {
        await this.sendHelpEmail({
          ...this.help
        })
        this.$snotify.success(
          'Email sent! We will reach out to you as soon as we can!'
        )
        this.help = {
          name: null,
          email: null,
          issueType: EMAIL_TOPICS.ACCOUNT,
          subject: null,
          description: null
        }
      } catch (error) {
        this.$snotify.error(
          'There was a problem sending the email, please try again.'
        )
      } finally {
        reset()
      }
    }
  },

  head: () => ({
    title: 'Help'
  })
}
</script>

<style lang="scss" scoped>
.main::v-deep {
  min-height: 500px;

  .v-overlay__content {
    width: 600px;
  }

  .mt-categories {
    margin-top: -80px;
  }
}
</style>
