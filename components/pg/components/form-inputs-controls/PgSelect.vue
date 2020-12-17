<script>
import { VSelect } from 'vuetify/lib/components/VSelect'

import noTabindex from '@/components/pg/mixins/no-tabindex'
import soloLabeled from '@/components/pg/mixins/solo-labeled'
import validatable from '@/components/pg/mixins/validatable'

export default {
  name: 'PgSelect',

  mixins: [VSelect, noTabindex, soloLabeled, validatable],

  computed: {
    classes () {
      return {
        'v-select--solo-labeled': this.soloLabeled,
        ...VSelect.options.computed.classes.call(this)
      }
    }
  }
}
</script>
