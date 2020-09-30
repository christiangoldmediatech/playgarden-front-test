<script>
import { VFileInput } from 'vuetify/lib/components/VFileInput'

import noTabindex from '@/components/pg/mixins/no-tabindex'
import validatable from '@/components/pg/mixins/validatable'

export default {
  name: 'PgFileInput',

  mixins: [VFileInput, noTabindex, validatable]
}
</script>
