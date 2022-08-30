<template>
  <div
    class="icon-selector pg-flex pg-justify-center pg-items-center clickable pg-py-4 lg:pg-flex-col lg:pg-pa-4"
    @click="openDialog"
  >
    <img
      v-if="!backpackId"
      :width="imageSize"
      :height="imageSize"
      class="lg:pg-mb-4 pg-mr-4 lg:pg-mr-0"
      src="@/assets/svg/child-icon-selector.svg"
    />

    <div
      v-else
      class="selected-icon-wrapper pg-mr-4 lg:pg-mr-0"
    >
      <img
        :width="imageSize"
        :height="imageSize"
        :src="backpackIcon"
      />
      <img class="check-icon" src="@/assets/svg/check.svg" />
    </div>

    <div>
      <p v-if="!backpackId" class="text-wrap btn-text ma-0">
        Choose an icon for your child
      </p>
      <p v-else class="text-wrap btn-text ma-0">
        Change your child’s icon
      </p>
    </div>
    <v-dialog
      v-model="dialog"
      :fullscreen="$vuetify.breakpoint.xs"
      max-width="900px"
      class="icon-selector-dialog"
      scrollable
    >
      <v-card height="500px" class="card-icon-selector">
        <!-- CLOSE BUTTON -->
        <div
          class="close-icon-wrapper clickable"
          @click="closeDialog"
        >
          <img
            src="@/assets/svg/close-icon-2.svg"
            alt="Close icon"
            width="22px"
            class="pg-absolute pg-cursor-pointer"
          >
        </div>

        <v-card-title class="justify-center selector-title">
          CHOOSE AN ICON FOR YOUR CHILD:
        </v-card-title>

        <v-card-text>
          <v-row no-gutters>
            <v-col
              v-for="(backpack, indexB) in backpacks"
              :key="indexB"
              class="image"
              cols="4"
              md="2"
            >
              <img
                :alt="backpack.name"
                class="clickable"
                :class="{ active: backpackId === backpack.id }"
                :src="backpack.image"
                height="100px"
                @click="selectIcon(backpack.id)"
              >
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, PropType, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'ChildIconSelector',
  props: {
    value: {
      type: [Number, String],
      required: true,
      default: ''
    },
    backpacks: {
      type: Array as PropType<any[]>,
      required: true,
      default: () => []
    }
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const { $vuetify } = useContext()
    const dialog = ref(false)
    const backpackId = computed({
      get() { return props.value },
      set(value: number | string) { emit('update:value', value) }
    })
    const backpackIcon = computed(() => {
      return props.backpacks.find(x => x.id === backpackId.value).image
    })
    const imageSize = computed(() => $vuetify.breakpoint.lgAndUp ? '100px' : '80px')

    const openDialog = () => {
      dialog.value = true
    }

    const closeDialog = () => {
      dialog.value = false
    }

    const selectIcon = (id: number) => {
      backpackId.value = id
      closeDialog()
    }

    return {
      dialog,
      backpackId,
      backpackIcon,
      openDialog,
      closeDialog,
      selectIcon,
      imageSize
    }
  }
})
</script>

<style lang="scss">
.icon-selector-dialog {
  z-index: 1000;
}

.icon-selector {
  width: 100%;
  height: 100%;
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.160784);
  border-radius: 3px;
}

.card-icon-selector {
  position: relative;
}

.btn-text {
  font-weight: 700;
  font-size: 16px;
  line-height: 32px;
  text-align: center;
  text-decoration-line: underline;
  color: #F89838;
  caret-color: rgba(0,0,0,0);
  transition: 0.3s all;

  @media (min-width: 600px) {
    font-size: 18px;
  }

  @media (min-width: 1264px) {
    font-size: 21px;
  }
}

.icon-selector:hover {
  .btn-text {
    color: #68C453;
  }
}

.selector-title {
  font-weight: 700 !important;
  font-size: 32px;
  line-height: 48px;
  color: #F89838;
  word-break: break-word;
  text-align: center;
}

.close-icon-wrapper {
  position: absolute;
  top: 10px;
  right: 30px;
}

.image {
  height: 100px;
  width: 100px;
  display: flex;
  justify-content: center;
  align-content: center;

  img {
    max-height: 100px;
    max-width: 100px;
    width: 100%;
    border-radius: 50%;
    padding: 5px;

    &.active {
      background-color: var(--v-secondary-base);
      border-radius: 50%;
      padding: 5px;
    }
  }
}

.selected-icon-wrapper {
  position: relative;
}

.check-icon {
  position: absolute;
  bottom: -8px;
  right: -8px;
}
</style>
