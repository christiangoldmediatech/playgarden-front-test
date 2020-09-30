<script>
import { VTextarea } from 'vuetify/lib/components/VTextarea'

import noTabindex from '@/components/pg/mixins/no-tabindex'
import validatable from '@/components/pg/mixins/validatable'

export default {
  name: 'PgTextarea',

  mixins: [VTextarea, noTabindex, validatable]
}
</script>
