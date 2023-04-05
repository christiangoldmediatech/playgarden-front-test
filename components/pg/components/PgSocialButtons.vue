<template>
  <v-card
    :class="{ 'rounded-pill': miniVariant }"
    color="white"
    :width="miniVariant ? 50 : 230"
  >
    <v-toolbar color="primary" dense>
      <v-icon :class="{ 'ml-n1': miniVariant }" color="white">
        mdi-share-variant-outline
      </v-icon>

      <span
        v-if="toolbarTitle && !miniVariant"
        class="font-weight-bold ml-3 white--text"
      >
        {{ toolbarTitle }}
      </span>
    </v-toolbar>

    <p
      v-if="toolbarSubtitle && !miniVariant"
      class="font-weight-bold mb-0 mt-3 text-center"
    >
      {{ toolbarSubtitle }}
    </p>

    <v-card-text :class="{ 'mt-3 pa-0': miniVariant }">
      <v-row :justify="miniVariant ? 'center' : null" :no-gutters="miniVariant">
        <v-btn
          v-if="fakeNetworks.download"
          :block="!miniVariant"
          class="mb-2"
          :class="{ 'mov-spa': !miniVariant }"
          :color="fakeNetworks.download.color"
          :href="fakeImage"
          :fab="miniVariant"
          small
          target="_blank"
        >
          <v-icon v-if="fakeNetworks.download.icon" :left="!miniVariant">
            {{ fakeNetworks.download.icon }}
          </v-icon>

          <span
            v-if="!miniVariant"
            :style="{ color: fakeNetworks.download.textColor || textColor }"
          >
            {{ fakeNetworks.download.name }}
          </span>
        </v-btn>

        <share-network
          v-for="(network, indexN) in fakeNetworks.share"
          :key="indexN"
          class="mb-2"
          :class="{ 'w-100': !miniVariant }"
          :description="fakeDescription"
          :hashtags="hashtags"
          :media="media"
          :network="network.network"
          :quote="fakeQuote"
          :title="fakeTitle"
          :twitter-user="twitterUser"
          :url="fakeUrl"
        >
          <v-btn
            :block="!miniVariant"
            :class="{ 'mov-spa': !miniVariant }"
            :color="network.color"
            :fab="miniVariant"
            small
          >
            <v-icon v-if="network.icon" :left="!miniVariant">
              {{ network.icon }}
            </v-icon>

            <span
              v-if="!miniVariant"
              :class="{ 'mov-spa': !miniVariant }"
              :style="{ color: network.textColor || textColor }"
            >
              {{ network.name }}
            </span>
          </v-btn>
        </share-network>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
/**
 * Official doc
 * https://nicolasbeauvais.github.io/vue-social-sharing
 */
export default {
  name: 'PgSocialButtons',

  props: {
    description: {
      type: String,
      default: ''
    },

    entityAutoResolve: Boolean,

    entityId: {
      type: [Number, String],
      default: ''
    },

    entityType: {
      type: String,
      default: '',
      validator: (val) => {
        const values = { PATCH: 1, PUZZLE: 1, WORKSHEET: 1 }

        return val === null || val === '' || Boolean(values[val])
      }
    },

    childId: {
      type: Number,
      default: undefined
    },

    hashtags: {
      type: String,
      default: '' // 'pg,classes,online'
    },

    media: {
      type: String,
      default: ''
    },

    miniVariant: Boolean,

    networks: {
      type: Array,
      default: () => [
        {
          network: 'download',
          name: 'Download',
          icon: 'mdi-download',
          color: 'primary'
        },
        {
          network: 'email',
          name: 'Email',
          icon: 'mdi-email-outline',
          color: 'primary'
        },
        {
          network: 'facebook',
          name: 'Facebook',
          icon: 'mdi-facebook',
          color: 'primary'
        },
        {
          network: 'twitter',
          name: 'Twitter',
          icon: 'mdi-twitter',
          color: 'primary'
        }
      ]
    },

    quote: {
      type: String,
      default: ''
    },

    textColor: {
      type: String,
      default: '#ffffff'
    },

    title: {
      type: String,
      default: ''
    },

    toolbarTitle: {
      type: String,
      default: ''
    },

    toolbarSubtitle: {
      type: String,
      default: ''
    },

    twitterUser: {
      type: String,
      default: ''
    },

    url: {
      type: String,
      default: ''
    }
  },

  data: () => ({
    apiData: {
      link: null,
      imageUrl: null,
      text: null,
      description: null
    }
  }),

  computed: {
    fakeDescription () {
      return this.apiData.description || this.description
    },

    fakeImage () {
      return this.apiData.imageUrl || this.url || window.location.host
    },

    fakeNetworks () {
      const result = {
        download: null,
        share: []
      }

      this.networks.map((item) => {
        if (item.network === 'download') {
          result.download = item
        } else {
          result.share.push(item)
        }
      })

      return result
    },

    fakeQuote () {
      return this.apiData.text || this.quote
    },

    fakeTitle () {
      return this.apiData.text || this.title
    },

    fakeUrl () {
      return this.apiData.link || this.url || window.location.host
    }
  },

  async created () {
    if (this.entityAutoResolve) {
      try {
        const payload = this.childId
          ? {
              entityId: this.entityId,
              entityType: this.entityType,
              childId: this.childId
            }
          : {
              entityId: this.entityId,
              entityType: this.entityType
            }

        const {
          link,
          imageUrl,
          text,
          description
        } = await this.createSocialSharing(payload)

        this.apiData = { link, imageUrl, text, description }
      } catch (e) {
        this.$toast.error(
          'There was an error generating your social sharing link.'
        )
      }
    }
  },

  methods: mapActions('social-sharing', [
    'createSocialSharing',
    'getSocialSharingById'
  ])
}
</script>

<style lang="scss" scoped>
@media only screen and (max-width: 959px) {
  .mov-spa {
    align-content: start;
    justify-content: start;
  }
}
</style>
