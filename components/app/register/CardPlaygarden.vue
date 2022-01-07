<template>
  <v-row>
    <v-card-title primary-title>
      <h4 class="text-center">
        <underlined-title
          class="text-h6 text-md-h5 ml-sm-4 text-center"
          text="Our family loves Playgarden Prep Online!"
          line-color="#68C453"
        />
      </h4>
    </v-card-title>
    <v-card-text>
      <div>
        <p class="text-center">
          Still not sure? Call us, text us, email us, We'll be happy to explain
          our program in more detail
        </p>
        <img
          src="@/assets/png/login-payment-teacher.png"
          alt="Miss Sarah"
          class="d-block mx-auto teacher-payment"
        >
        <div class="text-center mt-4">
          <span>
            Miss Sarah
          </span>
          <br>
          <a class="blue--text" href="tel:646-504-4716">646-504-4716 </a>
          <br>
          <a
            class="black--text"
            href="mailto:hello@playgardenprep.com"
          >hello@playgardenprep.com</a>
        </div>
      </div>
    </v-card-text>
  </v-row>
</template>

<script>
export default {
  name: 'CardPlaygarden',

  data: vm => ({})
}
</script>

<style lang="scss" scoped>
.teacher-payment {
  border-radius: 50%;
  width: 30%;
  background-color: #b2e68d;
  border: 7px solid #b2e68d;
  outline: 7px solid #68c453;
}
@media screen and (max-width: 426px) {
  .teacher-payment {
    width: 50%;
  }
}
</style>
