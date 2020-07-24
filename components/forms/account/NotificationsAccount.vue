<template>
  <v-container>
    <v-row justify="start">
      <p class="font-weight-bold">
        NOTIFICATIONS
      </p>
    </v-row>
    <v-btn block color="primary" :disabled="loading">
      MANAGE EMAIL LIST
    </v-btn>
    <v-switch
      :color="color"
      :disabled="disabled"
      :error="error"
      :flat="flat"
      :inset="inset"
      label="I'm a switch"
      :loading="loading"
      :readonly="readonly"
      :success="success"
    />
  </v-container>
</template>

<script>
export default {
  name: 'NotificationsAccount'
}
</script>

<style lang="scss" scoped></style>
