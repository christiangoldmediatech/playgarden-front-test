<template>
  <v-row v-if="isChangePasswordModalVisible">
    <pg-dialog
      v-model="isChangePasswordModalVisible"
      content-class="white"
      :fullscreen="$vuetify.breakpoint.smAndDown"
      max-width="1000"
      persistent
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          x-large
          block
          color="primary"
          text
          v-on="on"
        >
          Change Password
        </v-btn>
      </template>

      <v-col cols="12">
        <v-row class="pr-3" justify="end">
          <v-btn icon @click.stop="isChangePasswordModalVisible = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-row>

        <update-password
          v-if="isChangePasswordModalVisible"
          :show-cancel="false"
        />
      </v-col>
    </pg-dialog>
  </v-row>
</template>

<script lang="ts">

import { defineComponent, onMounted, useStore } from '@nuxtjs/composition-api'
import { useGlobalModal } from '@/composables'
import { TypedStore } from '@/models'
import UpdatePassword from '@/components/app/password/UpdatePassword.vue'

export default defineComponent({
  name: 'ChangePasswordModal',

  components: {
    UpdatePassword
  },

  setup () {
    const store = useStore<TypedStore>()
    const { isChangePasswordModalVisible } = useGlobalModal({ store })

    return {
      isChangePasswordModalVisible
    }
  }
})
</script>
