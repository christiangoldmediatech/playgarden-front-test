<template>
  <div>
    <div class="text-center text-button font-weight-bold mb-n4">
      <template>
        <underlined-title
          class="text-h6 text-md-h5 ml-sm-4"
          text="Give your child an immersive educational experience at home!"
        />
      </template>
    </div>
    <v-card-text>
      <div>
        <center class="text-subtitle-1 mt-3 mb-3 aling-spacing">
          Start learning now; cancel any time!
        </center>
        <img
          src="@/assets/png/login-card-child.png"
          class="d-block mx-auto child-login"
        >
      </div>
    </v-card-text>
  </div>
</template>

<script>
export default {
  name: 'CardInfo'
}
</script>

<style lang="scss" scoped>
.child-login {
  border-radius: 50%;
  width: 50%;
  background-color: #b2e68d;
  border: 7px solid #b2e68d;
  outline: 7px solid #68c453;
}
.aling-spacing {
  text-align: center;
  text-align-last: center;
  letter-spacing: 1px !important;
  font-size: 16.6px !important;
}
</style>
