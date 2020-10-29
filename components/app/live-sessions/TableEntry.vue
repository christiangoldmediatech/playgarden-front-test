<template>
  <v-card class="lsess-table-entry lsess-table-entry-active">
    <div class="lsess-table-entry-live">
      Live <img class="lsess-table-entry-live-icon" src="/svg/sessions-active-camera.svg">
    </div>
    <div class="d-flex align-end mb-2">
      <img class="lsess-table-entry-type" src="/svg/activityType.svg">
      <div class="lsess-table-entry-title">
        Music
      </div>
    </div>

    <div>
      Music class with Emma and Skylar
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'TableEntry'
}
</script>

<style lang="scss" scoped>
.lsess {
  &-table {
    &-entry {
      position: relative;
      padding: 8px;
      &-active {
        border: solid 3px #F89838;
      }
      &-live {
        position: absolute;
        top: 0px;
        right: 0px;
        display: flex;
        align-items: center;
        &-icon {
          width: 24px;
          height: 24px;
        }
      }
      &-type{
        width: 60px;
        height: 60px;
        border-radius: 8px;
        margin-right: 8px;
        border: solid 3px #f2f2f2;
        object-fit: contain;
        object-position: center center;
      }
      &-title {
        font-size: 1.5rem;
        line-height: 1.25;
      }
    }
  }
}
</style>
