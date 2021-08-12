<template>
  <validation-observer ref="obs" v-slot="{ invalid, passes }">
    <v-dialog
      v-model="dialog"
      :fullscreen="$vuetify.breakpoint.xs"
      max-width="500px"
      persistent
      scrollable
    >
      <v-card>
        <v-toolbar class="flex-grow-0" color="primary darken-1" dark dense flat>
          <v-toolbar-title class="white--text">
            EDIT STATUS PLAYDATE
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
            <label>Name: <span class="font-weight-bold">{{ playdate.name }}</span></label>
            <validation-provider
              v-slot="{ errors }"
              name="Status"
              rules="required"
            >
              <pg-select
                v-model="playdate.state"
                clearable
                class="mt-4"
                :disabled="loading"
                :error-messages="errors"
                :items="states"
                item-text="name"
                item-value="id"
                label="Status"
                solo-labeled
              />
            </validation-provider>
          </v-container>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />

          <v-btn
            class="white--text"
            color="green"
            :disabled="invalid"
            :loading="loading"
            :text="$vuetify.breakpoint.smAndUp"
            @click.stop="passes(save)"
          >
            Save
          </v-btn>

          <v-btn
            :disabled="loading"
            :text="$vuetify.breakpoint.smAndUp"
            @click.stop="close"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </validation-observer>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@nuxtjs/composition-api'
import { mapActions, mapGetters } from 'vuex'
import { Playdate } from '@/models'
import { usePlaydates } from '@/composables/playdates'
export default defineComponent({
  name: 'PlaydatesEditorDialog',

  setup () {
    const loading = ref(false)
    const dialog = ref(false)
    const id = ref()
    const { updatePlaydate, states } = usePlaydates()
    const playdate = ref<Partial<Playdate>>({
      ages: '',
      day: '',
      description: '',
      duration: 0,
      end: '',
      link: '',
      name: '',
      playdateType: '',
      specialistUser: { id: 0 },
      sports: 0,
      start: '',
      state: ''
    })

    const resetItem = () => {
      id.value = null
      generateItemTemplate()
    }

    const generateItemTemplate = () => {
      playdate.value.ages = ''
      playdate.value.day = ''
      playdate.value.description = ''
      playdate.value.duration = 0
      playdate.value.end = ''
      playdate.value.link = ''
      playdate.value.name = ''
      playdate.value.playdateType = ''
      playdate.value.sports = 0
      playdate.value.start = ''
      playdate.value.state = ''
      playdate.value.specialistUser = { id: 0 }
    }

    const loadItem = (item: Playdate) => {
      id.value = item.id
      playdate.value = { ...item }
      if (item.specialistUser) {
        playdate.value.specialistId = item.specialistUser.id
      }
    }

    return {
      loading,
      dialog,
      states,
      id,
      playdate,
      generateItemTemplate,
      resetItem,
      loadItem,
      updatePlaydate
    }
  },

  methods: {
    close () {
      this.$nextTick(() => {
        this.dialog = false
        this.loading = false
      })
    },

    async save () {
      this.loading = true
      try {
        await this.updatePlaydate(this.id, this.playdate)
      } catch (error) {} finally {
        this.loading = false
        this.dialog = false
        this.$emit('saved')
      }
    },

    open (evt: unknown, item: Playdate) {
      this.resetItem()
      if (item) {
        this.loadItem(item)
      }

      this.$nextTick(() => {
        this.dialog = true
      })
    }
  }
})
</script>
