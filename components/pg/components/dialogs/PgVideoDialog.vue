<script>
import { VDialog } from 'vuetify/lib/components/VDialog'

export default {
  name: 'PgVideoDialog',

  mixins: [VDialog],

  data: () => {
    return {
      stackMinZIndex: 4000
    }
  }
}
</script>
