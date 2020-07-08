<template>
  <v-container>
    <v-card>
      <v-card-title>
        Test View for Admin Layout
      </v-card-title>

      <v-card-text>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, deleniti sint. Id quam vel sequi exercitationem quis reprehenderit tempore, eos temporibus ad praesentium animi sit inventore repudiandae, officia illum accusamus?
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  layout: 'admin',

  name: 'Index',

  data () {
    return {
      placeholder: false
    }
  }
}
</script>
