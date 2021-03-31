<script>
import { VDialog } from 'vuetify/lib/components/VDialog'

export default {
  name: 'PgDialog',

  mixins: [VDialog],

  data: () => {
    return {
      stackMinZIndex: 2000
    }
  }
}
</script>
