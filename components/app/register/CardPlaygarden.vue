<template>
  <div class="pg-p-4 pg-min-h-[385px]">
    <!-- ARROW ICON -->
    <v-icon class="pg-block pg-float-right pg-cursor-pointer">
      {{ hiddenCardFamily ? ' mdi-chevron-down' : ' mdi-chevron-up' }}
    </v-icon>

    <!-- TITLE -->
    <h4 class="pg-text-center pg-mt-5">
      <underlined-title
        font-size="26px"
        font-size-mobile="20px"
        text="Our family loves Playgarden Prep Online!"
      />
    </h4>

    <div v-if="!hiddenCardFamily">
      <div>
        <p class="pg-text-center pg-mt-5">
          Still not sure? Call us, text us, email us, We'll be happy to explain
          our program in more detail
        </p>

        <img
          src="@/assets/png/Miss Sarah.png"
          alt="Miss Sarah"
          class="pg-block pg-mx-auto pg-w-[150px] pg-mt-5 pg-rounded-[50%]"
        >

        <div class="pg-text-center pg-mt-5">
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardPlaygarden',

  props: {
    hiddenCardFamily: {
      type: Boolean,
      required: true
    }
  },

  data: vm => ({})
}
</script>
