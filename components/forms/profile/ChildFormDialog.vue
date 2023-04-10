<template>
  <v-dialog v-model="viewModal" max-width="600px" :style="{ 'z-index': zIndex }">
    <child-card
      class="!pg-rounded-3xl"
      :item="item"
      :backpacks="backpacks"
      @loadChild="loadChildren"
      @openTimeline="openTimeline(item)"
    />

    <user-child-timeline-dialog />
  </v-dialog>
</template>

<script lang="ts">
import { useNuxtHelper } from '@/composables'
import { defineComponent, computed, ref } from '@nuxtjs/composition-api'
import UserChildTimelineDialog from '@/components/forms/profile/UserChildTimelineDialog.vue'
import ChildCard from './ChildCard.vue'

export default defineComponent({
  name: 'ChildFormDialog',
  components: { UserChildTimelineDialog, ChildCard },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => ({})
    },
    firstBackpack: {
      type: Number,
      default: null
    },
    backpacks: {
      type: Array,
      default: () => []
    }
  },
  emits: ['input', 'reload'],
  setup(props, { emit }) {
    const nuxt = useNuxtHelper()

    const zIndex = ref('1000')

    const draft = ref<any>({})

    const viewModal = computed({
      get() {
        return props.value
      },
      set(val: boolean) {
        emit('input', val)
      }
    })

    const closeDialog = () => {
      viewModal.value = false
    }

    const openTimeline = () => {
      nuxt.$emit('open-timeline', props.item)
    }

    const loadChildren = () => {
      nuxt.$emit('children-changed')
      closeDialog()
    }

    return {
      viewModal,
      draft,
      zIndex,
      openTimeline,
      loadChildren,
      closeDialog
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/assets/scss/app.scss';
@import '~/assets/scss/account.scss';

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
</style>
