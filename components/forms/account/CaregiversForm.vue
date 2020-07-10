<template>
  <v-container>
    <v-row justify="start" no-gutters>
      <label class="caregivers-text">CAREGIVERS</label>
    </v-row>

    <v-row v-for="caregiver in caregiversData" :key="caregiver.id" class="mb-1 ml-6 mt-1" no-gutters>
      <v-col cols="6">
        <label class="caregivers-list-text">
          {{ caregiver.firstName }}
        </label>
      </v-col>
      <v-col cols="6">
        <label class="caregivers-list-text">
          {{ caregiver.email }}
        </label>
      </v-col>
    </v-row>

    <v-row class="justify-center" no-gutters>
      <v-btn class="caregivers-manage mt-4 pl-12 pr-12" :disabled="loading ? true : false" large>
        MANAGE CAREGIVERS
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'CaregiversForm',
  props: {
    loading: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      caregiversData: {}
    }
  },
  computed: {
    //
  },
  mounted () {
    this.getCaregiversData()
  },
  methods: {
    async getCaregiversData () {
      try {
        this.$emit('set-loading-state', true)
        const token = this.$store.getters['auth/getAccessToken']
        this.$axios.setToken(token, 'Bearer')

        const { data } = await this.$axios.get(`${process.env.apiBaseUrl}/caregivers`)

        this.caregiversData = data.users

        // eslint-disable-next-line no-console
        // console.log(data.users)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
      } finally {
        this.$emit('set-loading-state', false)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .caregivers-text {
    width: 251px;
    height: 45px;
    font-family: Poppins;
    font-size: 32px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: 4.8px;
    text-align: left;
    color: $pg-black;
  }
  .caregivers-list-text {
    font-family: Poppins;
    font-size: 16px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.88;
    letter-spacing: normal;
    text-align: left;
    color: #606060;
  }
  .caregivers-manage {
    width: 100%;
    background-color: #c2daa5 !important;
    color: #ffffff;
  }
</style>
