<template functional>
  <component :is="$options.components.VRow">
    <component :is="$options.components.VCol" cols="12">
      <component :is="$options.components.VCard" width="100%">
        <component :is="$options.components.VCardTitle">
          {{ props.title }}

          <component :is="$options.components.VSpacer" />

          <component
            :is="$options.components.VBtn"
            class="mr-2 text-none"
            color="primary darken-1"
            dark
            :icon="props.xs"
            @click.stop="$options.doEvent('open-editor', undefined, listeners)"
          >
            <component :is="$options.components.VIcon" class="hidden-sm-and-up">
              mdi-plus-circle
            </component>

            <component :is="$options.components.VIcon" class="hidden-xs-only" small>
              mdi-plus
            </component>
            <span class="hidden-xs-only white--text">{{ props.createButtonText }}</span>
          </component>
        </component>

        <component :is="$options.components.VCardText">
          {{ props.description }}
        </component>
      </component>
    </component>
  </component>
</template>

<script>
import { doEvent } from '@/utils/events.js'

import { VRow, VCol, VSpacer } from 'vuetify/lib/components/VGrid'
import { VCard, VCardTitle, VCardText } from 'vuetify/lib/components/VCard'
import { VIcon } from 'vuetify/lib/components/VIcon'
import { VBtn } from 'vuetify/lib/components/VBtn'

export default {
  name: 'AdminContentHeader',

  components: {
    VRow,
    VCol,
    VSpacer,
    VCard,
    VCardTitle,
    VCardText,
    VIcon,
    VBtn
  },

  doEvent
}
</script>
