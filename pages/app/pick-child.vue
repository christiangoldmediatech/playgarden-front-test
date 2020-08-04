<template>
  <v-row align="center" justify="center">
    <v-card>
      <v-card-title>Pick a child</v-card-title>

      <v-card-text>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quia itaque dolorem enim cupiditate sint pariatur voluptates dolore sequi esse at quaerat aliquam, tenetur aliquid aperiam eius, suscipit saepe! Explicabo, ut!
      </v-card-text>

      <v-card-actions>
        <v-btn
          color="primary"
          text
          block
          nuxt
          :to="{ name: 'app-profile' }"
        >
          MANAGE PROFILES
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-row>
</template>

<script>
export default {
  name: 'PickChild'
}
</script>
