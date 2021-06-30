<template>
  <v-dialog>
    <v-card>
      <v-toolbar class="flex-grow-0" color="primary darken-1" dark dense flat>
        <v-toolbar-title class="white--text">
          title
        </v-toolbar-title>

        <v-spacer />

        <!-- <v-btn :disabled="loading" icon @click.stop="close"> -->
        <v-btn :disabled="loading" icon>
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-toolbar>
    </v-card>
  </v-dialog>
</template>
