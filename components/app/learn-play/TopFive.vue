<template>
  <v-row>
    <main>
      <div
        v-for="(
          item, index
        ) in 5"
        :key="`top-item-${index}`"
        width="100%"
      >
        <v-row no-gutters class="pl-6 mt-4">
          <v-col
            cols="2"
          >
            <v-avatar tile size="42">
              <img src="@/assets/png/cute-pumpkin.png">
            </v-avatar>
          </v-col>
          <v-col cols="10" align-self="center" class="pl-6">
            <div class="text-uppercase dashboard-item-title">
              Song - Artist
            </div>
          </v-col>
        </v-row>
      </div>
    </main>
  </v-row>
</template>

<script>
export default {
  name: 'TopFive'
}
