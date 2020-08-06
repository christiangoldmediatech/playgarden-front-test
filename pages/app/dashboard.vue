<template>
  <v-row>
    <v-col cols="12" sm="6" lg="4">
      <v-card>
        <v-card-title>
          Componente menu
        </v-card-title>

        <v-card-text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure, ipsam dignissimos sed eveniet quidem tenetur impedit omnis beatae illum, assumenda architecto odio alias expedita explicabo tempora! Aspernatur sit voluptas adipisci.
        </v-card-text>
      </v-card>
    </v-col>

    <v-col>
      <!-- Aquí se van a cargar los pages de la carpeta dashboard -->
      <nuxt-child />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'Dashboard'
}
</script>
