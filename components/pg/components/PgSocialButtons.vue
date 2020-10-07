<template>
  <v-card max-width="500" class="mx-auto">
    <v-toolbar color="primary" dense>
      <v-icon color="white">
        mdi-share-variant-outline
      </v-icon>

      <span v-if="toolbarTitle" class="font-weight-bold ml-3 white--text">{{ toolbarTitle }}</span>
    </v-toolbar>

    <p v-if="toolbarSubtitle" class="font-weight-bold mb-0 mt-3 text-center">
      {{ toolbarSubtitle }}
    </p>

    <v-card-text>
      <v-row :justify="fakeBlock ? null : 'space-between'">
        <v-btn
          v-if="fakeNetworks.download"
          :block="fakeBlock"
          class="mb-2"
          :color="fakeNetworks.download.color"
          :href="url"
          target="_blank"
        >
          <v-icon v-if="fakeNetworks.download.icon" left>
            {{ fakeNetworks.download.icon }}
          </v-icon>

          <span
            :style="{ color: fakeNetworks.download.textColor || textColor }"
          >
            {{ fakeNetworks.download.name }}
          </span>
        </v-btn>

        <share-network
          v-for="(network, indexN) in fakeNetworks.share"
          :key="indexN"
          class="mb-2"
          :class="{ 'w-100': fakeBlock }"
          :description="description"
          :hashtags="hashtags"
          :media="media"
          :network="network.network"
          :quote="quote"
          :title="title"
          :twitter-user="twitterUser"
          :url="url"
        >
          <v-btn :block="fakeBlock" :color="network.color">
            <v-icon v-if="network.icon" left>
              {{ network.icon }}
            </v-icon>

            <span :style="{ color: network.textColor || textColor }">
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
    noAutoBlock: Boolean,

    block: Boolean,

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

    networks: {
      type: Array,
      default: () => [
        {
          network: 'download',
          name: 'Download',
          icon: 'mdi-download',
          color: 'primary lighten-1'
        },
        {
          network: 'email',
          name: 'Email',
          icon: 'mdi-email-outline',
          color: 'primary lighten-1'
        },
        {
          network: 'facebook',
          name: 'Facebook',
          icon: 'mdi-facebook',
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
      required: true
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
    fakeBlock () {
      return this.noAutoBlock ? this.block : this.$vuetify.breakpoint.mobile
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
    }
  }
}
</script>
