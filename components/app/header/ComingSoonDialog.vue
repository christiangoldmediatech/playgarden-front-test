<template>
  <v-dialog v-model="dialog" max-width="1000px">
    <v-card color="transparent" class="coming-soon-dialog d-flex flex-column justify-center align-center" height="540px">
      <v-btn class="close-btn" x-large color="#FAA938" icon @click="close">
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <img src="@/assets/png/rainbow-logo.png" class="pg-h-[200px]">
      <p class="coming-soon-text">
        <span class="pink-text">Coming </span>
        <span class="green-text">Soon</span>
      </p>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'ComingSoonDialog',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  emits: ['input'],
  setup(props, { emit }) {
    const dialog = computed({
      get(): boolean {
        return props.value
      },
      set(val: boolean) {
        emit('input', val)
      }
    })

    const close = () => {
      dialog.value = false
    }

    return {
      dialog,
      close
    }
  }
})

</script>

<style lang="scss" scoped>

.coming-soon-dialog {
  background-image: url('~@/assets/png/paper-header-mobile-3.png') !important;
  background-position: bottom center;
  background-size: cover;
  box-shadow: 2px 8px 23px 3px rgb(0 0 0 / 20%);
  position: relative;
}

.close-btn {
  position: absolute;
  top: 25px;
  right: 25px;
}

.coming-soon-text {
  span {
    font-family: 'Quicksand';
    font-weight: 600;
    font-size: 70px;
  }
}

.pink-text {
  color: #FFA0C8;
}

.green-text {
  color: #68c453;
}
</style>
