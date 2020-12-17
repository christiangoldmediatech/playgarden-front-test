<script>
import { VFileInput } from 'vuetify/lib/components/VFileInput'

import noTabindex from '@/components/pg/mixins/no-tabindex'
import soloLabeled from '@/components/pg/mixins/solo-labeled'
import validatable from '@/components/pg/mixins/validatable'

export default {
  name: 'PgFileInput',

  mixins: [VFileInput, noTabindex, soloLabeled, validatable]
}
</script>
