<template>
  <span />
</template>

<script>
export default {
  name: 'Index',

  beforeCreate () {
    this.$router.push({ name: 'auth-login' })
  }
}
</script>
