<template>
  <v-card :width="miniVariant ? 50 : 300">
    <v-toolbar color="primary" dense>
      <v-icon color="white">
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
          :href="url"
          :icon="miniVariant"
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
          :description="description"
          :hashtags="hashtags"
          :media="media"
          :network="network.network"
          :quote="quote"
          :title="title"
          :twitter-user="twitterUser"
          :url="url"
        >
          <v-btn
            :block="!miniVariant"
            :class="{ 'mov-spa': !miniVariant }"
            :color="network.color"
            :icon="miniVariant"
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
      required: true
    }
  },

  computed: {
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
    }
  }
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
