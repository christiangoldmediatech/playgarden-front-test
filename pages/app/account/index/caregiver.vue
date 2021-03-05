<template>
  <div>
    <caregiver-list manageable />
    <manage-caregivers />
  </div>
</template>

<script>
import CaregiverList from '@/components/app/caregiver/CaregiverList'
import ManageCaregivers from '@/components/app/caregiver/ManageCaregivers'

export default {
  name: 'Caregiver',
  components: {
    CaregiverList,
    ManageCaregivers
  }
}
</script>
