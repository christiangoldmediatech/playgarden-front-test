<template>
  <div class="pa-4 pa-md-0">
    <caregiver-list manageable />
  </div>
</template>

<script>
import CaregiverList from '@/components/app/caregiver/CaregiverList.vue'

export default {
  name: 'Caregiver',
  components: {
    CaregiverList
  }
}
</script>
