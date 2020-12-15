<script>
import { VTextarea } from 'vuetify/lib/components/VTextarea'

import noTabindex from '@/components/pg/mixins/no-tabindex'
import soloLabeled from '@/components/pg/mixins/solo-labeled'
import validatable from '@/components/pg/mixins/validatable'

export default {
  name: 'PgTextarea',

  mixins: [VTextarea, noTabindex, soloLabeled, validatable],

  computed: {
    classes () {
      return {
        'v-textarea--solo-labeled': this.soloLabeled,
        ...VTextarea.options.computed.classes.call(this)
      }
    }
  }
}
</script>
