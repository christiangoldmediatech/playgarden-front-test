<template>
  <!-- <validation-observer ref="obs" v-slot="{ invalid, passes }"> -->
  <validation-observer ref="obs">
    <v-dialog
      v-model="dialog"
      :fullscreen="$vuetify.breakpoint.xs"
      max-width="600px"
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
            <v-row>
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
                          :class="{ active: backpackId === backpack.id }"
                          :src="backpack.image"
                          @click="backpackId = backpack.id"
                        >
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />

          <v-btn
            class="white--text"
            color="green"
            :loading="loading"
            :text="$vuetify.breakpoint.smAndUp"
          >
            Save
          </v-btn>

          <v-btn
            class="white--text"
            color="red"
            :disabled="loading"
            :text="$vuetify.breakpoint.smAndUp"
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
export default defineComponent({
  name: 'ChildEditorDialog',

  setup () {
    const store = useStore<TypedStore>()
    const dialog = ref(false)
    const loading = ref(false)
    const id = ref<number | null>(null)
    const backpackId = ref<number | null>(null)
    const child = ref<Child | null>(null)
    const { update, getBackpacks, backpacks } = useChild({ store })

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
      console.log('item--', item)
      id.value = item.id
      child.value = { ...item }
      backpackId.value = item.backpack.id
    }

    const resetItem = () => {
      id.value = null
      child.value = null
    }

    const save = async () => {
      loading.value = true
      try {
        if (id.value && child.value) {
          await update(id.value, child.value)
        }
      } catch (error) {

      }
    }

    onMounted(async () => {
      await getBackpacks()
    })

    return {
      id,
      child,
      backpacks,
      backpackId,
      dialog,
      loading,
      open
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
