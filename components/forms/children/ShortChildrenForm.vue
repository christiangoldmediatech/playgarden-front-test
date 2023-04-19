<template>
  <div class="">
    <p class="mb-4 text-center text-md-left">
      <span>
        Tell us a little about your little one
      </span>
    </p>
    <!-- Name -->
    <validation-provider
      v-slot="{ errors }"
      :name="(removable ? `Child #${index + 1} - ` : '') + 'Name'"
      rules="required"
    >
      <pg-text-field
        v-model="itemCurrent.firstName"
        clearable
        :disabled="isLoading"
        :error-messages="errors"
        label="Name"
        solo
        class="custom-text-field"
      />
    </validation-provider>

    <!-- Gender -->
    <validation-provider
      :name="(removable ? `Child #${index + 1} - ` : '') + 'Gender'"
      rules="required"
    >
      <v-row class="mb-6">
        <v-col v-for="(gender, indexG) in genders" :key="indexG" cols="6">
          <v-btn
            block
            class="custom-btn"
            :color="itemCurrent.gender === gender ? 'primary' : 'grey lighten-5'"
            :disabled="isLoading"
            min-height="60"
            x-large
            @click="itemCurrent.gender = gender"
          >
            {{ gender === "FEMALE" ? "Girl" : "Boy" }}
          </v-btn>
        </v-col>
      </v-row>

      <input v-model="itemCurrent.gender" type="hidden">
    </validation-provider>

    <!-- Backpack -->
    <center class="mb-4">
      <small>
        Choose a Backpack for you child:
      </small>
    </center>
    <validation-provider
      :name="(removable ? `Child #${index + 1} - ` : '') + 'Backpack'"
      rules="required"
    >
      <v-row no-gutters>
        <v-col
          v-for="(backpack, indexB) in backpacks"
          :key="indexB"
          :class="($vuetify.breakpoint.smAndUp) ? 'image': 'image-mobile'"
          cols="4"
          md="2"
        >
          <img
            :alt="backpack.name"
            class="clickable"
            :class="{ active: itemCurrent.backpackId === backpack.id }"
            :src="backpack.image"
            :height="($vuetify.breakpoint.smAndUp) ? '100px' : '60px'"
            @click="itemCurrent.backpackId = backpack.id"
          >
        </v-col>
      </v-row>

      <input v-model="itemCurrent.backpackId" type="hidden">
    </validation-provider>

    <v-btn
      v-if="removable"
      block
      text
      color="primary"
      @click.stop="removeChild"
    >
      DELETE CHILD PROFILE
    </v-btn>

    <v-divider v-if="removable" class="mt-6" />
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'ShortChildrenForm',
  props: {
    item: {
      type: Object,
      required: true
    },
    position: {
      type: Number,
      required: true
    },
    draft: {
      type: Array,
      required: true
    },
    loading: Boolean
  },
  data: () => ({
    menu: false,
    itemCurrent: null,
    indexCurrent: null,
    dataLoading: false,
    genders: ['MALE', 'FEMALE'],
    selectedDate: null
  }),
  computed: {
    ...mapGetters('auth', ['isUserLoggedIn']),
    ...mapGetters('backpacks', ['getBackpacks']),

    backpacks() {
      return this.getBackpacks
    },

    removable () {
      return this.draft.length > 1
    },

    isLoading () {
      return this.dataLoading || this.loading
    }
  },
  watch: {
    menu (val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    },
    backpacks (val) {
      if (val.length > 0) {
        this.itemCurrent.backpackId = val[0].id
        this.itemCurrent.gender = 'MALE'
      }
    }
  },
  async created () {
    this.index = this.position
    this.itemCurrent = this.item
    this.itemCurrent._birthdayFormatted = dayjs(this.itemCurrent._birthdayPicker).format(
      'MM/DD/YYYY'
    )
    this.itemCurrent.birthday = null // `${this.itemCurrent._birthdayPicker}T00:00:00.000`
    await this.loadBackpacks()
    if (this.isUserLoggedIn) {
      this.loadChildren()
    } else {
      this.addRow()
    }
  },
  methods: {
    ...mapActions('backpacks', ['fetchBackpacks']),

    ...mapActions('children', {
      getChildren: 'get',
      deleteChild: 'delete'
    }),

    async loadBackpacks () {
      if (backpacks.length === 0) {
        await this.fetchBackpacks()
      }
    },

    onInputBirthday () {
      if (this.itemCurrent._birthdayPicker) {
        this.itemCurrent._birthdayFormatted = dayjs(this.itemCurrent._birthdayPicker).format(
          'MM/DD/YYYY'
        )
        this.selectedDate = this.itemCurrent._birthdayFormatted
        this.itemCurrent.birthday = `${this.itemCurrent._birthdayPicker}T00:00:00.000`
      }
    },

    removeChild () {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete child profile?',
        message: `Are you sure you want to delete <b>${this.itemCurrent.firstName}</b>?`,
        action: async () => {
          this.dataLoading = true
          try {
            if (this.itemCurrent.id) {
              await this.deleteChild(this.itemCurrent.id)
            }

            this.$delete(this.draft, this.index)
          } catch (e) {
          } finally {
            this.dataLoading = false
          }
        }
      })
    },

    async loadChildren () {
      try {
        this.dataLoading = true

        const rows = await this.getChildren()

        if (rows.length) {
          rows.map(this.addRow)
        } else {
          this.addRow()
        }
      } catch (e) {
      } finally {
        this.dataLoading = false
      }
    },

    save (date) {
      this.$refs.menu.save(date)
      this.$emit('selected-date-birthday', date)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/app.scss';

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

    &.active {
      background-color: var(--v-secondary-base);
      border-radius: 50%;
      padding: 5px;
    }
  }
}

.image-mobile {
  height: 50px;
  width: 50px;
  display: flex;
  justify-content: center;
  align-content: center;

  img {
    max-height: 50px;
    max-width: 50px;
    width: 100%;

    &.active {
      background-color: var(--v-secondary-base);
      border-radius: 50%;
      padding: 5px;
    }
  }
}

.grey {
  color: var(--v-black-base);
}

.custom-btn::v-deep.v-btn.grey {
  background-color: #f2f2f2;
  color: #9d9d9d !important;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  text-transform: capitalize !important;
}
.custom-btn::v-deep.v-btn {
  text-transform: capitalize !important;
}
</style>
