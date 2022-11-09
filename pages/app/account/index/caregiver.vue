<template>
  <div>
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
