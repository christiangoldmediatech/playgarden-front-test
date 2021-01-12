<template functional>
  <component
    :is="$options.components.VDataTable"
    dense
    hide-default-footer
    v-bind="props"
    v-on="listeners"
  >
    <!-- Default Top Bar -->
    <template v-if="$options.slotAvailable('top', scopedSlots)" v-slot:top>
      <component :is="$options.components.VRow" :align="props.topAlign || 'start'" :justify="props.topJustify || 'end'">
        <slot name="top.prepend" />

        <component :is="$options.components.VCol" cols="12" md="4">
          <component
            :is="$options.components.PgTextField"
            append-icon="mdi-magnify"
            class="shrink"
            clearable
            hide-details
            label="Search"
            solo-labeled
            @keydown.enter="$options.doEvent('search', $event.target.value, listeners)"
          />
        </component>
      </component>
    </template>

    <!-- No Data -->
    <template v-if="$options.slotAvailable('no-data', scopedSlots)" v-slot:no-data>
      <component
        :is="$options.components.VBtn"
        color="primary"
        text
        @click="$options.doEvent('refresh', undefined, listeners)"
      >
        Refresh
      </component>
    </template>

    <!-- Loading -->
    <template v-if="$options.slotAvailable('loading', scopedSlots)" v-slot:loading>
      <component :is="$options.components.VSkeletonLoader" class="mx-auto" type="table-row-divider@3" />
    </template>

    <!-- Created At -->
    <template v-if="$options.slotAvailable('item.createdAt', scopedSlots)" v-slot:[`item.createdAt`]="{ item }">
      {{ item.createdAt | formatDate }}
    </template>

    <!-- Updated At -->
    <template v-if="$options.slotAvailable('item.updatedAt', scopedSlots)" v-slot:[`item.updatedAt`]="{ item }">
      {{ item.updatedAt | formatDate }}
    </template>

    <!-- Item Actions -->
    <template v-if="$options.slotAvailable('item.actions', scopedSlots)" v-slot:[`item.actions`]="{ item }">
      <slot name="item.actions.prepend" v-bind="{ item }" />

      <component
        :is="$options.components.VIcon"
        v-if="props.action"
        color="accent"
        dense
        @click.stop="$options.doEvent('action-item', item, listeners)"
      >
        mdi-clipboard-text
      </component>

      <component
        :is="$options.components.VIcon"
        color="#81A1F7"
        dense
        @click.stop="$options.doEvent('edit-item', item, listeners)"
      >
        mdi-pencil-outline
      </component>

      <component
        :is="$options.components.VIcon"
        color="#d30909"
        dense
        @click.stop="$options.doEvent('remove-item', item, listeners)"
      >
        mdi-delete-outline
      </component>

      <slot name="item.actions.append" :v-bind="{ item }" />
    </template>

    <!-- Footer -->
    <template v-if="$options.slotAvailable('footer', scopedSlots)" v-slot:footer="table">
      <component :is="$options.components.VContainer" fluid>
        <component :is="$options.components.VRow" align="center" justify="end">
          <component
            :is="$options.components.VIcon"
            class="clickable mr-2"
            color="green"
            :disabled="table.props.pagination.page === 1 || props.loading"
            x-small
            @click.stop="$options.doEvent('update:page', table.props.pagination.page - 1, listeners)"
            v-text="'mdi-less-than'"
          />
          <template v-for="i in table.props.pagination.pageCount">
            <span
              :key="`footer-page-number-${i}`"
              :class="[
                'font-weight-normal',
                {
                  'accent--text text--darken-1': table.props.pagination.page === i,
                  'clickable': table.props.pagination.page !== i
                }
              ]"
              @click.stop="$options.doEvent('update:page', table.props.pagination.page = i, listeners)"
            >
              {{ i }}
            </span>
            <span
              v-if="i !== table.props.pagination.pageCount"
              :key="`footer-page-dot-${i}`"
              class="font-weight-normal mx-1"
            >
              &centerdot;
            </span>
          </template>

          <component
            :is="$options.components.VIcon"
            class="clickable ml-2"
            color="green"
            :disabled="table.props.pagination.page === table.props.pagination.pageCount || props.loading"
            x-small
            @click.stop="$options.doEvent('update:page', table.props.pagination.page + 1, listeners)"
            v-text="'mdi-greater-than'"
          />
        </component>
      </component>
    </template>

    <!-- Parent defined slots -->
    <template v-for="(index, name) in $options.filterScopedSlots(scopedSlots)" v-slot:[name]="data">
      <slot :name="name" v-bind="data" />
    </template>
  </component>
</template>

<script>
import { doEvent } from '@/utils/events.js'

import { VDataTable } from 'vuetify/lib/components/VDataTable'
import { VContainer, VRow, VCol, VSpacer } from 'vuetify/lib/components/VGrid'
import { VIcon } from 'vuetify/lib/components/VIcon'
import { VSkeletonLoader } from 'vuetify/lib/components/VSkeletonLoader'
import { VBtn } from 'vuetify/lib/components/VBtn'
import PgTextField from '@/components/pg/components/form-inputs-controls/PgTextField.vue'

export default {
  name: 'PgAdminDataTable',

  components: {
    VDataTable,
    VContainer,
    VRow,
    VCol,
    VSpacer,
    VIcon,
    VSkeletonLoader,
    VBtn,
    PgTextField
  },

  doEvent,

  slotAvailable (slot, scopedSlots) {
    const keys = Object.keys(scopedSlots)
    if (keys.includes(slot)) {
      return false
    }
    return true
  },

  filterScopedSlots (scopedSlots) {
    const result = {}
    const slots = Object.keys(scopedSlots)
    const exclusionList = [
      'top.prepend',
      'item.actions.prepend',
      'item.actions.append'
    ]

    slots.forEach((slot) => {
      if (exclusionList.includes(slot)) {
        return
      }
      result[slot] = scopedSlots[slot]
    })

    return result
  }
}
</script>
