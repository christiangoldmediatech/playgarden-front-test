<template>
  <span />
</template>

<script>
export default {
  name: 'Index',

  beforeCreate () {
    if (this.$route.query.redirect) {
      this.$router.push({ name: 'auth-login', query: { redirect: this.$route.query.redirect } })
    } else {
      this.$router.push({ name: 'auth-login' })
    }
  }
}
</script>
