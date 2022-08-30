<template>
  <!-- <validation-observer ref="obs" v-slot="{ invalid, passes }"> -->
  <validation-observer ref="obs">
    <v-dialog
      v-model="dialog"
      :fullscreen="$vuetify.breakpoint.xs"
      max-width="750px"
      persistent
      scrollable
    >
      <v-card>
        <v-toolbar class="flex-grow-0" color="primary darken-1" dark dense flat>
          <v-toolbar-title class="white--text">
            Edit Child
          </v-toolbar-title>

          <v-spacer />

          <v-btn :disabled="loading" icon @click.stop="close">
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <v-container>
            <v-row v-if="child">
              <v-col cols="12" class="d-flex justify-center">
                <img
                  v-if="child"
                  :alt="child.backpack.name"
                  class="backpack-active"
                  :src="child.backpack.image"
                >
              </v-col>
              <v-col cols="12" md="10" lg="12">
                <!-- Backpack Picker -->
                <v-row justify="center" no-gutters>
                  <v-col cols="12" md="10" lg="12">
                    <v-row no-gutters>
                      <v-col cols="12">
                        <span class="text-h6 font-weight-bold text-uppercase">
                          Change backpack:
                        </span>
                      </v-col>

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
                          :class="{ active: child.backpackId === backpack.id }"
                          :src="backpack.image"
                          @click="child.backpackId = backpack.id"
                        >
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="6">
                <!-- First name -->
                <validation-provider
                  v-slot="{ errors }"
                  name="Name"
                  rules="required"
                >
                  <pg-text-field
                    v-model="child.firstName"
                    clearable
                    :disabled="loading"
                    :error-messages="errors"
                    label="First name"
                    solo-labeled
                  />
                </validation-provider>
              </v-col>
              <v-col cols="6">
                <!-- Last name -->
                <validation-provider
                  v-slot="{ errors }"
                  name="Lastname"
                  rules="required"
                >
                  <pg-text-field
                    v-model="child.lastName"
                    clearable
                    :disabled="loading"
                    :error-messages="errors"
                    label="Last name"
                    solo-labeled
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12">
                <!-- Birthday date -->
                <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  min-width="290px"
                  solo
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Birthday date"
                      rules="required"
                    >
                      <pg-text-field
                        v-bind="attrs"
                        :disabled="loading"
                        :error-messages="errors"
                        label="Birthday date"
                        readonly
                        solo-labeled
                        :suffix="birthdayFormatted ? '' : 'MM/DD/YYYY'"
                        validate-on-blur
                        :value="birthdayFormatted"
                        v-on="on"
                      />
                    </validation-provider>
                  </template>

                  <v-date-picker
                    v-model="child.birthdayPicker"
                    :max="new Date().toISOString().substr(0, 10)"
                    min="1990-01-01"
                    @input="onInputBirthday(child)"
                  />
                </v-menu>
              </v-col>
              <v-col cols="12">
                <!-- Gender -->
                <validation-provider
                  name="Gender"
                  rules="required"
                >
                  <v-row class="mb-6">
                    <v-col
                      v-for="(gender, indexG) in genders"
                      :key="indexG"
                      cols="6"
                    >
                      <v-btn
                        block
                        class="custom-btn"
                        :color="
                          child.gender === gender ? 'primary' : 'grey lighten-5'
                        "
                        :disabled="loading"
                        x-large
                        @click="child.gender = gender"
                      >
                        {{ gender === "FEMALE" ? "Girl" : "Boy" }}
                      </v-btn>
                    </v-col>
                  </v-row>

                  <input v-model="child.gender" type="hidden">
                </validation-provider>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="green"
            :loading="loading"
            :text="$vuetify.breakpoint.smAndUp"
            @click="save"
          >
            Save
          </v-btn>

          <v-btn
            color="red"
            :disabled="loading"
            :text="$vuetify.breakpoint.smAndUp"
            @click="close"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </validation-observer>
</template>

<script lang="ts">
import { defineComponent, onMounted, useStore, ref, nextTick } from '@nuxtjs/composition-api'
import { useChild } from '@/composables'
import { Child, TypedStore } from '@/models'
import dayjs from 'dayjs'
export default defineComponent({
  name: 'ChildEditorDialog',

  setup (_, { emit }) {
    const store = useStore<TypedStore>()
    const dialog = ref(false)
    const menu = ref(false)
    const loading = ref(false)
    const id = ref<number | null>(null)
    const birthdayFormatted = ref<string | null>(null)
    const child = ref<Child | null>(null)
    const { update, getBackpacks, backpacks, genders } = useChild({ store })

    const open = (evt: any, item: any = null) => {
      resetItem()
      if (item) {
        loadItem(item)
      }
      nextTick(() => {
        dialog.value = true
      })
    }

    const loadItem = (item: any) => {
      id.value = item.id
      const birthdayPicker = (item.birthday) ? new Date(item.birthday).toISOString().substr(0, 10) : dayjs(`${new Date().getFullYear() - 2}-01-01`).format('YYYY-MM-DD')
      child.value = { ...item, backpackId: item.backpack.id, birthdayPicker }
      birthdayFormatted.value = item.birthday
      if (child.value) {
        onInputBirthday(child.value)
      }
    }

    const resetItem = () => {
      id.value = null
      child.value = null
    }

    const onInputBirthday = (child: Child) => {
      if (child.birthdayPicker) {
        birthdayFormatted.value = dayjs(child.birthdayPicker).format(
          'MM/DD/YYYY'
        )
        child.birthday = (child.birthdayPicker) ? `${child.birthdayPicker}T00:00:00.000` : ''
      }
    }

    const save = async () => {
      loading.value = true
      try {
        if (id.value && child.value) {
          await update(id.value, child.value)
        }
      } catch (e) {
      } finally {
        close()
        emit('saved')
      }
    }

    const close = () => {
      nextTick(() => {
        loading.value = false
        dialog.value = false
        resetItem()
      })
    }

    onMounted(async () => {
      await getBackpacks()
    })

    return {
      id,
      child,
      backpacks,
      genders,
      dialog,
      loading,
      birthdayFormatted,
      menu,
      open,
      onInputBirthday,
      save,
      close
    }
  },

  methods: {
  }
})
</script>

<style lang="scss" scoped>
.image {
  height: 100px;
  width: 100px;
  display: flex;
  justify-content: center;
  align-content: center;

  img {
    max-height: 80px;
    max-width: 80px;
    width: 100%;

    &.active {
      background-color: var(--v-secondary-base);
      border-radius: 50%;
      padding: 5px;
    }
  }
}

.backpack-active {
  height: 175px;
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

.custom-card-border {
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.25) !important;
  border-radius: 8px !important;
}

.v-btn:not(.v-btn--text) {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
}
</style>
