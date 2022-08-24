import { pathWidth } from '../../app/library/pathConstants';
<template>
  <div
    class="icon-selector d-flex justify-center align-center clickable"
    :class="{ 'flex-column': this.$vuetify.breakpoint.lgAndUp, 'pa-4': !this.$vuetify.breakpoint.lgAndUp }"
    @click="openDialog"
  >
    <img
      v-if="!backpackId"
      width="100px"
      height="100px"
      :class="{ 'mb-4': this.$vuetify.breakpoint.lgAndUp, 'mr-4': !this.$vuetify.breakpoint.lgAndUp }"
      src="@/assets/svg/child-icon-selector.svg"
    />

    <div
      v-else
      class="selected-icon-wrapper"
      :class="{ 'mb-4': this.$vuetify.breakpoint.lgAndUp, 'mr-4': !this.$vuetify.breakpoint.lgAndUp }"
    >
      <img
        :width="this.$vuetify.breakpoint.lgAndUp ? '100px' : '80px'"
        :height="this.$vuetify.breakpoint.lgAndUp ? '100px' : '80px'"
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

<script>
export default {
  name: 'ChildIconSelector',
  props: {
    value: {
      type: Number,
      required: true,
      default: undefined
    },
    backpacks: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      dialog: false
    }
  },
  computed: {
    backpackId: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    backpackIcon() {
      return this.backpacks.find(x => x.id === this.backpackId).image
    }
  },
  methods: {
    openDialog() {
      this.dialog = true
    },
    closeDialog() {
      this.dialog = false
    },
    selectIcon(id) {
      this.backpackId = id
      this.closeDialog()
    }
  }
}
</script>

<style lang="scss">
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
