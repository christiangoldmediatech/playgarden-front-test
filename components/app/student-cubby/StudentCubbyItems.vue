<template>
  <v-card class="d-flex flex-direciton-row align-center justify-center cubby-items">
    <div
      v-for="(item, itemIndex) in items"
      :key="item.routeName"
      class="d-flex align-center justify-center"
      @click="goToItem(item)"
    >
      <div
        class="d-flex align-center cubby-item"
        :class="{
          'cubby-item-selected': isSelectedItem(item)
        }"
      >
        <img
          height="35px"
          :src="require(`@/assets/png/student-cubby/${item.imgName}`)"
        >
        <span class="cubby-item-text">{{ item.text }}</span>
      </div>
      <v-divider
        v-if="itemIndex !== items.length - 1 && !isSelectedItem(item)"
        vertical
        class="cubby-item-divider"
      />
    </div>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, PropType, useRoute, useRouter } from '@nuxtjs/composition-api'

interface StudentCubbyItem {
  routeName: string
  imgName: string
  text: string
}

export default defineComponent({
  props: {
    selectedChildId: {
      type: Number,
      required: true
    },
    items: {
      type: Array as PropType<StudentCubbyItem[]>,
      required: true
    }
  },
  setup (props) {
    const router = useRouter()
    const route = useRoute()

    const isSelectedItem = (item: StudentCubbyItem) => {
      return route.value.name?.includes(item.routeName)
    }

    const goToItem = (item: StudentCubbyItem) => {
      router.push({ name: item.routeName, query: { id: `${props.selectedChildId}` } })
    }

    return { isSelectedItem, goToItem }
  }
})
</script>

<style lang="scss" scoped>
  .cubby-items {
    height: 60px;
    background: #FFFFFF;
    box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15) !important;
    border-radius: 21px;
  }

  .cubby-item {
    padding-left: 28px;
    padding-right: 28px;

    &-selected {
      height: 60px;
      margin: -6px;
      border: 6px solid #DCE7B5;
      box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15) !important;
      border-radius: 21px;
      background: #FFFFFF;
    }

    &-text {
      font-weight: 500;
      font-size: 18px;
      line-height: 30px;
      text-align: center;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: #606060;
      margin-left: 16px;
    }

    &-divider {
      height: 35px;
      display: flex;
      align-self: center;
    }
  }
</style>
