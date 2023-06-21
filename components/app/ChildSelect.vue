<template>
  <pg-select
    :value="internalValue"
    :items="childrenList"
    :placeholder="$t('dailyLessons.childSelect.placeholder')"
    solo
    data-test-id="child-select"
    v-bind="{ ...$attrs }"
    @input="$emit('input', $event), sendAnalytics($event)"
  >
    <template v-slot:selection="{ item }">
      <v-list-item class="pa-0 w-100">
        <v-list-item-avatar v-if="!item.everyone && !showOnlySelectedName">
          <v-img :src="item.backpack.image" />
        </v-list-item-avatar>

        <v-list-item-avatar v-else>
          <v-img :src="require('~/assets/svg/everyone.svg')" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-if="!showOnlySelectedName" class="text-truncate">
            {{ item.firstName }}
          </v-list-item-title>
          <span v-else class="text-truncate font-weight-bold only-child-name-title">
            {{ item.firstName }}
          </span>
        </v-list-item-content>
      </v-list-item>
    </template>

    <template v-slot:item="{ item, on, attrs }">
      <v-list-item v-bind="attrs" class="w-100" v-on="on">
        <v-simple-checkbox
          v-if="multiple"
          color="primary"
          :ripple="false"
          :disabled="item.disabled"
          :value="attrs.inputValue"
        />

        <v-list-item-avatar v-if="!item.everyone">
          <v-img :src="item.backpack.image" />
        </v-list-item-avatar>

        <v-list-item-avatar v-else>
          <v-img :src="require('~/assets/svg/everyone.svg')" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title :class="{ 'pl-2': multiple }">
            {{ item.firstName }}
          </v-list-item-title>
          <v-list-item-subtitle
            v-if="item.disabled"
            :class="{ 'pl-2': multiple, 'grey--text': true }"
          >
            {{ $t('dailyLessons.childSelect.onPlaydate') }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>

    <template v-if="managementButton && !isUserCaregiver" v-slot:append-item>
      <v-list-item>
        <v-list-item-content>
          <v-btn
            color="primary"
            nuxt
            :to="{ name: 'app-account-index', query: { tab: 2 } }"
          >
            {{ $t('dailyLessons.childSelect.management') }}
          </v-btn>
        </v-list-item-content>
      </v-list-item>
    </template>
  </pg-select>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { APP_EVENTS } from '@/models'

export default {
  name: 'ChildSelect',

  props: {
    value: {
      type: [Array, Number, Object, String],
      default: null
    },

    playdates: {
      type: Array,
      default: () => []
    },

    managementButton: {
      type: Boolean,
      default: false
    },

    previewMode: {
      type: Boolean,
      default: false
    },

    showOnlySelectedName: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters('auth', ['isUserCaregiver']),

    ...mapGetters('auth', ['getUserInfo']),

    ...mapGetters('children', { children: 'rows' }),

    internalValue() {
      return this.multiple && !Array.isArray(this.value)
        ? [this.value]
        : this.value
    },

    multiple() {
      return (
        'multiple' in this.$attrs &&
        (this.$attrs.multiple === '' || this.$attrs.multiple)
      )
    },

    childrenList() {
      const childrens = this.children.map((child) => {
        return {
          value: child.id,
          text: child.firstName,
          disabled: this.childrenIdWithPlaydates.includes(child.id),
          ...child
        }
      })

      /* if (!(this.managementButton && !this.isUserCaregiver)) {
        const everyone = childrens.indexOf(
          childrens.filter(x => x.everyone === true)
        )

        if (everyone) {
          childrens.splice(everyone)
        }
      } */

      return childrens
    },

    childrenIdWithPlaydates() {
      return (
        this.playdates
          // filter children that have playdates
          .filter(
            playdate =>
              playdate &&
              Array.isArray(playdate.playdates) &&
              playdate.playdates.length > 0
          )
          // map those children id
          .map(playdate =>
            playdate && playdate.children ? playdate.children.id : undefined
          )
      )
    }
  },

  created() {
    if (this.previewMode) {
      return
    }

    this.getChildren(this.$route)
  },

  beforeDestroy() {
    this.$nuxt.$off(APP_EVENTS.SWITCH_NAME)
  },

  methods: {
    ...mapActions('children', { getChildren: 'get' }),

    sendAnalytics(item) {
      this.$gtm.push({
        event: APP_EVENTS.SWITCH_NAME,
        userId_parent: this.getUserInfo.id,
        userId_child: item
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.only-child-name-title {
  color: #7852b5 !important;
  font-size: 28px !important;
  text-align: center;
}
</style>
