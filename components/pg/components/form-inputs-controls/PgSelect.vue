<script>
import { VSelect } from 'vuetify/lib/components/VSelect'

import noTabindex from '@/components/pg/mixins/no-tabindex'
import validatable from '@/components/pg/mixins/validatable'

export default {
  name: 'PgSelect',

  mixins: [VSelect, noTabindex, validatable]
}
</script>
