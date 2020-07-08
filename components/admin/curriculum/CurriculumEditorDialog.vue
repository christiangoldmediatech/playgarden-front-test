<template>
  <v-dialog
    v-model="dialog"
    max-width="500px"
    :fullscreen="$vuetify.breakpoint.xs"
    persistent
    scrollable
  >
    <v-card>
      <v-toolbar
        class="flex-grow-0"
        color="primary darken-1"
        dark
        dense
        flat
      >
        <v-toolbar-title>
          {{ title }}
        </v-toolbar-title>

        <v-spacer />

        <v-btn
          icon
          :disabled="loading"
          @click.stop="close()"
        >
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-container>
          <v-row>
            <v-text-field
              v-model="item.name"
              label="Name"
              outlined
            />
          </v-row>
          <v-row>
            <v-textarea
              v-model="item.description"
              label="Description"
              outlined
            />
          </v-row>
        </v-container>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          :text="$vuetify.breakpoint.smAndUp"
          :dark="$vuetify.breakpoint.xs"
          color="green"
          :loading="loading"
          @click.stop="save()"
        >
          Save
        </v-btn>
        <v-btn
          :text="$vuetify.breakpoint.smAndUp"
          :dark="$vuetify.breakpoint.xs"
          color="red"
          :disabled="loading"
          @click.stop="close()"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'CurriculumEditorDialog',

  data () {
    return {
      dialog: false,
      loading: false,
      id: null,
      item: {
        name: '',
        description: ''
      }
    }
  },

  computed: {
    title () {
      return this.id === null ? 'New Curriculum Type' : 'Edit Curriculum Type'
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
      if (this.id === null) {
        await this.$store.dispatch('admin/curriculum/create', this.item)
      } else {
        await this.$store.dispatch('admin/curriculum/update', { id: this.id, data: this.item })
      }
      await this.$store.dispatch('admin/curriculum/get')
      this.close()
    },

    open ({ id = null, name = '', description = '' } = {}) {
      this.id = id
      this.item.name = name
      this.item.description = description

      this.$nextTick(() => {
        this.dialog = true
      })
    }
  }
}
</script>
