<template>
  <v-container
    :class="{ 'dashboard-container': !$vuetify.breakpoint.smAndDown }"
    fluid
  >
    <v-main>
      <v-row class="fill-height" justify="center">
        <v-col cols="3">
          panel
        </v-col>
        <v-col>
          cenetr
        </v-col>
      </v-row>
    </v-main>
  </v-container>
</template>
