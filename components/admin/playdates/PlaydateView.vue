<template>
  <v-container>
    <live-session-editor-dialog
      ref="editor"
      mode="Playdate"
    />
    <v-row class="mx-4 my-4">
      <v-card width="100%">
        <v-card-title>
          <span class="font-weight-bold">Playdate with {{ playdate.teacher }}</span>
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
        <v-card-title>
          <label class="font-weight-bold">{{ getDateText }}</label>

          <v-spacer />

          <v-btn
            icon
            color="#81A1F7"
            :loading="loading"
            @click="$refs.editor.open(null, playdate)"
          >
            <v-icon>mdi-pencil-outline</v-icon>
          </v-btn>
          <v-btn
            icon
            color="error"
            :loading="loading"
            @click="remove"
          >
            <v-icon>mdi-delete-outline</v-icon>
          </v-btn>
        </v-card-title>
        <v-container>
          <label class="font-weight-bold">General Information</label>
          <v-row no-gutters class="mt-8">
            <v-col cols="5">
              <v-row>
                <v-col cols="4">
                  <label class="label-playdate">Teacher</label>
                </v-col>
                <v-col cols="8">
                  <label class="font-weight-bold grey--text text--darken-2">{{ playdate.teacher }}</label>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <label class="label-playdate">Spots</label>
                </v-col>
                <v-col cols="8">
                  <label class="font-weight-bold grey--text text--darken-2">{{ playdate.spots }}</label>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <label class="label-playdate">Duration</label>
                </v-col>
                <v-col cols="8">
                  <label class="font-weight-bold grey--text text--darken-2">{{ playdate.duration }} minutes</label>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <label class="label-playdate">Day</label>
                </v-col>
                <v-col cols="8">
                  <label class="font-weight-bold grey--text text--darken-2">{{ playdate.day }}</label>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <label class="label-playdate">Zoom Link</label>
                </v-col>
                <v-col cols="8">
                  <v-btn
                    color="accent"
                    :href="playdate.link"
                    target="_blank"
                    :loading="loading"
                  >
                    Open zoom link
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="7">
              <v-row>
                <v-col cols="3">
                  <label class="label-playdate">Description</label>
                </v-col>
                <v-col cols="9">
                  <label class="font-weight-bold grey--text text--darken-2">{{ playdate.description }}</label>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="3">
                  <label class="label-playdate">Who’s going?</label>
                </v-col>
                <v-col no-guters cols="9">
                  <v-row v-if="playdate.meetingsChildren && playdate.meetingsChildren.length > 0" no-gutters>
                    <v-col v-for="item in playdate.meetingsChildren" :key="item.id" cols="6">
                      <div class="black--text my-1">
                        <v-avatar size="26">
                          <img
                            alt="user"
                            :src="item.children.backpack.image"
                          >
                        </v-avatar>
                        {{ item.children.fullName }}
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, useRouter, computed, useRoute } from '@nuxtjs/composition-api'
import { Meeting } from '@/models'
import { usePlaydates } from '@/composables/playdates'
import LiveSessionEditorDialog from '@/components/admin/live-sessions/LiveSessionEditorDialog.vue'
import dayjs from 'dayjs'
export default defineComponent({
  name: 'PlaydatesView',
  components: { LiveSessionEditorDialog },
  setup () {
    const loading = ref(false)
    const id = ref<null|number>()
    const start = ref<null|string>()
    const end = ref<null|string>()
    const route = useRoute()
    const router = useRouter()
    const { getPlaydatesById, deletePlaydate } = usePlaydates()
    const playdate = ref<Partial<Meeting>>({
      title: '',
      description: '',
      duration: 0,
      day: '',
      ages: '',
      dateStart: null,
      dateEnd: null,
      spots: 0,
      link: '',
      teacher: '',
      meetingsChildren: []
    })
    const getDateText = computed(() => {
      return (playdate.value) ? `${playdate.value.day}, from ${start.value} to ${end.value}` : ''
    })

    onMounted(async () => {
      generateItemTemplate()
      if (route.value.query.id) {
        id.value = Number(route.value.query.id)
        playdate.value = await getPlaydatesById(id.value)
        if (playdate.value.dateStart && playdate.value.dateEnd) {
          const dateStart = new Date(playdate.value.dateStart)
          playdate.value.day = dayjs(dateStart).format('dddd, MMMM DD YYYY').toUpperCase()
          start.value = `${dateStart.getHours().toString().padStart(2, '0')}:${dateStart.getMinutes().toString().padStart(2, '0')}`
          const dateEnd = new Date(playdate.value.dateEnd)
          end.value = `${dateEnd.getHours().toString().padStart(2, '0')}:${dateEnd.getMinutes().toString().padStart(2, '0')}`
        }
      }
    })
    const backList = () => {
      router.push({
        name: 'admin-playdates-management'
      })
    }
    const generateItemTemplate = () => {
      playdate.value.title = ''
      playdate.value.description = ''
      playdate.value.duration = 0
      playdate.value.link = ''
      playdate.value.dateStart = null
      playdate.value.dateEnd = null
      playdate.value.spots = 0
      playdate.value.ages = ''
      playdate.value.teacher = ''
      playdate.value.meetingsChildren = []
      start.value = ''
      end.value = ''
    }
    return {
      loading,
      id,
      playdate,
      getDateText,
      deletePlaydate,
      generateItemTemplate,
      backList
    }
  },
  methods: {
    remove () {
      if (this.id) {
        this.$nuxt.$emit('open-prompt', {
          title: 'Delete playdate?',
          message: `Are you sure you want to delete <b>${this.playdate.title}</b>?`,
          action: () => this.deletePlaydate(Number(this.id)).then(this.backList)
        })
      }
    }
  }
})
</script>
