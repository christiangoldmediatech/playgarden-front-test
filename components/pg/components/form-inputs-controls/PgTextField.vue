<script>
import { VTextField } from 'vuetify/lib/components/VTextField'

import noTabindex from '@/components/pg/mixins/no-tabindex'
import validatable from '@/components/pg/mixins/validatable'

export default {
  name: 'PgTextField',

  mixins: [VTextField, noTabindex, validatable]
}
</script>
