<template>
  <v-row>
    <v-card-title primary-title>
      <h4 v-if="$vuetify.breakpoint.smAndUp">
        Our family loves Playgarden Prep Online!
      </h4>
      <v-btn
        v-else
        block
        text
      >
        <p :class="($vuetify.breakpoint.smAndUp) ? 'text-center free-trial-info' : 'text-center free-trial-info-mobile'">
          <span>Our family loves </span> Playgarden <br />
          <span>Prep Online!</span>
        </p>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <div class="text-mdi-monitor">
        <center class="text-pay-information">
          “We have seen Liam learn a lot through the platform <br />
          and appreciate your team creating it during this time. <br />
          Features we love:

          <div class="pb-10">
            <v-row>
              <ul>
                <li
                  class="register-item text-left"
                >
                  <small class="text-trial">
                    Workbook exercises
                  </small>
                </li>
                <li
                  class="register-item text-left"
                >
                  <small class="text-trial">
                    Library (Liam has many favorites)
                  </small>
                </li>
                <li
                  class="register-item text-left"
                >
                  <small class="text-trial">
                    Liam looks forward to cooking and reading with Miss Lucy so much”
                  </small>
                </li>
              </ul>
            </v-row>
          </div>
          <span
            class="info-mother
            mt-8"
          >
            - Mother of 3 year old Liam
          </span>
        </center>
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
ul {
  list-style: none; /* Remove default bullets */
}
ul li::before {
  content: "●";
  font-size: 24px !important;
  color: var(--v-accent-base); /* Change the color */
  font-weight: bold; /* If you want it to be bold */
  display: inline-block; /* Needed to add space between the bullet and the text */
  width: 0.7em; /* Also needed for space (tweak if needed) */
  margin-left: -1rem; /* Also needed for space (tweak if needed) */
  margin-top: 10px;
}
.free-trial-info {
  font-size: 18px;
}
.free-trial-info-mobile {
  font-size: 16px;
}
.text-trial {
  margin-top: 14px;
  font-size: 14px !important;
  position: absolute;
}
.much-info {
  color: var(--v-accent-base);
}
.text-header-info {
  font-size: 14px !important;
}

.free-trial {
  font-size: 22px !important;
}
.free-trial-mobile {
  font-size: 18px !important;
}

.info-mother {
  color: #A6A6A6 !important;
}

.info-much-more {
  background-color: rgba(248, 152, 56, 0.3) !important;
}

.text-pay-information {
  font-size: 12px;
  font-style: italic;
}

.text-pay-get {
  font-size: 12px;
}
</style>
