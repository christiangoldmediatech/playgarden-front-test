<template>
  <validation-observer ref="obs" v-slot="{ invalid, passes }">
    <v-dialog
      v-model="dialog"
      :fullscreen="$vuetify.breakpoint.xs"
      max-width="500px"
      persistent
    >
      <v-card>
        <v-toolbar class="flex-grow-0" color="primary darken-1" dark dense flat>
          <v-toolbar-title class="white--text">
            {{ title }}
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
            <v-form ref="roleForm" @submit.prevent="passes(save)">
              <validation-provider
                v-slot="{ errors }"
                name="Category Name"
                rules="required"
              >
                <pg-text-field
                  v-model="item.category"
                  :error-messages="errors"
                  label="Name"
                  solo
                />
              </validation-provider>
            </v-form>
          </v-container>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="green"
            :dark="$vuetify.breakpoint.xs"
            :disabled="invalid"
            :loading="loading"
            :text="$vuetify.breakpoint.smAndUp"
            @click.stop="passes(save)"
          >
            Save
          </v-btn>

          <v-btn
            color="red"
            :dark="$vuetify.breakpoint.xs"
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

<script>
import { mapActions } from 'vuex'
const itemTemplate = {
  category: ''
}

export default {
  name: 'ParentsCornerCategoryEditor',

  data: () => {
    return {
      dialog: false,
      loading: false,
      id: null,
      item: JSON.parse(JSON.stringify(itemTemplate))
    }
  },

  computed: {
    title () {
      return this.id === null ? 'New Category' : 'Edit Category'
    }
  },

  methods: {
    ...mapActions('parents-corner', {
      create: 'createCategory',
      update: 'updateCategory'
    }),

    reset () {
      this.id = null
      this.item = JSON.parse(JSON.stringify(itemTemplate))
    },

    open (item = null) {
      this.reset()
      if (item) {
        this.id = item.id
        this.item.category = item.category
      }
      this.dialog = true
    },

    close () {
      this.dialog = false
    },

    async save () {
      try {
        this.loading = true

        if (this.id) {
          await this.update({ id: this.id, payload: this.item })
        } else {
          await this.create(this.item)
        }

        this.$emit('saved')
        this.close()
      } catch (error) {
        Promise.reject(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
