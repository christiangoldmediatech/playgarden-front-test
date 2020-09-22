<template>
  <v-overlay :dark="false" :value="value" z-index="700">
    <div class="patch-earned-container">
      <v-card max-width="1124" height="100%" max-height="calc(100vh - 64px)" scrollable>
        <div class="green-line-bigger green-line-1" />
        <div class="green-line-bigger green-line-2" />
        <v-card-text class="patch-earned-content">
          <v-row align="center" justify="center">
            <v-col cols="5">
              <v-img
                class="mx-auto"
                :src="require('@/assets/png/dashboard/badge.png')"
                max-width="352px"
              />
            </v-col>
            <v-col cols="6">
              <div class="patch-earned-title-container">
                <underlined-title
                  class="patch-earned-title"
                  text="Congratulations!"
                />
              </div>
              <p class="patch-earned-paragraph-1">
                You have watched 5 videos for cognitive, you won a patch!
              </p>
              <p class="patch-earned-paragraph-2">
                Keep watching videos to master the category and earn more patches.
              </p>
            </v-col>
            <v-col cols="12">
              <v-row justify="center">
                <v-col cols="12">
                  <p class="patch-earned-next-text">
                    What do you want to do next?
                  </p>
                </v-col>
                <v-col cols="8">
                  <v-btn class="patch-earned-button" color="accent" block>
                    Go to next video
                  </v-btn>
                </v-col>
                <v-col cols="8">
                  <v-btn class="patch-earned-button" color="#FEC572" block>
                    Go to patches
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-btn class="patch-earned-return-btn" color="primary" text block @click.stop="close">
                Return to dashaboard
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>
  </v-overlay>
</template>

<script>
export default {
  name: 'PatchEarnedDialog',

  props: {
    value: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data: () => {
    return {}
  },

  methods: {
    close () {
      this.$emit('input', false)
    }
  }
}
</script>

<style lang="scss">
.patch-earned {
  &-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &-content {
    height: 100%;
    max-height: calc(100% - 60px);
    overflow-x: hidden;
    overflow-y: auto;
    box-shadow: 0 -1px 6px 0 rgba(0, 0, 0, 0.12);
  }
  &-title {
    font-size: 56px;
    line-height: 1.3;
    font-weight: bold;
    &-container {
      text-align: center;
    }
  }
  &-paragraph-1 {
    font-size: 28px;
    line-height: 1.52;
    font-weight: 600;
    text-align: center;
  }
  &-paragraph-2 {
    font-size: 24px;
    font-weight: 500;
    line-height: 1.38;
    text-align: center;
  }
  &-next-text {
    font-size: 33px;
    font-weight: 600;
    line-height: 1.52;
    text-align: center;
    margin-bottom: 0 !important;
  }
  &-button.v-btn {
    height: 59px !important;
    font-size: 24px;
    line-height: 1.46;
    letter-spacing: 0.04em;
    color: white !important;
  }
  &-return-btn.v-btn {
    font-size: 24px;
    font-weight: bold;
    letter-spacing: 0.04em;
    line-height: 1.46;
  }
}
</style>
