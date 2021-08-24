<template>
  <v-container>
    <v-row class="mx-4 my-4">
      <v-card width="100%">
        <v-card-title>
          Playdate
          <v-spacer />

          <v-btn
            class="ma-3"
            color="accent"
            :loading="loading"
            @click="backList"
          >
            BACK
          </v-btn>
        </v-card-title>
      </v-card>
    </v-row>
    <v-row class="mx-4 my-4">
      <v-card width="100%">
        <v-card-text>
          <v-container>
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
            <v-row>
              <v-col cols="4">
                <label>Name: <span class="font-weight-bold">{{ playdate.name }}</span></label>
              </v-col>
              <v-col cols="4">
                <label>Day: <span class="font-weight-bold">{{ playdate.day }}</span></label>
              </v-col>
              <v-col cols="4">
                <label>Duration: <span class="font-weight-bold">{{ playdate.duration }}</span></label>
              </v-col>
              <v-col cols="4">
                <label>Start: <span class="font-weight-bold">{{ playdate.start }}</span></label>
              </v-col>
              <v-col cols="4">
                <label>End: <span class="font-weight-bold">{{ playdate.end }}</span></label>
              </v-col>
              <v-col cols="12">
                <pg-textarea
                  v-model="playdate.description"
                  label="Description"
                  readonly
                  solo-labeled
                />
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
            @click.stop="save"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, useRouter, nextTick, useRoute } from '@nuxtjs/composition-api'
import { mapActions, mapGetters } from 'vuex'
import { Playdate } from '@/models'
import { usePlaydates } from '@/composables/playdates'
import { useSnotifyHelper } from '@/composables'
export default defineComponent({
  name: 'PlaydatesEditor',

  setup (_, { emit }) {
    const snotify = useSnotifyHelper()
    const loading = ref(false)
    const id = ref<null|number>()
    const route = useRoute()
    const router = useRouter()
    const { updatePlaydate, states, getPlaydatesById } = usePlaydates()
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

    onMounted(async () => {
      id.value = Number(route.value.query.id)
      generateItemTemplate()
      playdate.value = await getPlaydatesById(id.value)
      if (playdate.value.specialistUser) {
        playdate.value.specialistId = playdate.value.specialistUser.id
      }
    })

    const backList = () => {
      router.push({
        name: 'admin-playdates-management'
      })
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

    const save = async () => {
      loading.value = true
      try {
        if (id.value && playdate.value) {
          await updatePlaydate(id.value, playdate.value)
          snotify.success('Playdate updated successfully.')
          backList()
        }
      } catch (error) {
        snotify.error(error.message)
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      states,
      id,
      playdate,
      generateItemTemplate,
      updatePlaydate,
      save,
      backList
    }
  }
})
</script>
