<template>
  <v-row no-gutters>
    <v-col>
      <v-row
        class="flex-column flex-md-row"
        justify="center"
        no-gutters
      >
        <v-col
          cols="12"
          md="6"
        >
          <v-img
            max-width="550"
            :src="require('@/assets/svg/child-information.svg')"
          />
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <short-register-form />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import ShortRegisterForm from '@/components/forms/children/ShortRegisterForm.vue'

export default {
  name: 'StepThree',

  components: {
    ShortRegisterForm
  }
}
</script>
