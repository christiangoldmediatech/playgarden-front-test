<template>
  <!-- Continue Button -->
  <v-col class="d-flex align-center flex-shrink-0 flex-grow-1" cols="12">
    <v-row justify="center" :no-gutters="$vuetify.breakpoint.mdAndUp">
      <v-col
        cols="10"
        sm="8"
        md="7"
        lg="6"
        xl="4"
      >
        <v-btn
          class="worksheet-button"
          color="primary"
          :disabled="!selected"
          large
          block
          v-on="{ click: $listeners.click }"
        >
          Continue
          <v-icon right>
            mdi-greater-than
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
export default {
  name: 'WorksheetContinueBtn',

  props: {
    selected: {
      validator: (val) => {
        return typeof val === 'number' || val === null
      },
      required: true
    }
  }
}
</script>
