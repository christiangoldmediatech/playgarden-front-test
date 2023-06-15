<template>
  <pg-loading :loading="loading">
    <v-row
      no-gutters
      data-test-id="caregivers-content"
      class="pa-4 pa-md-0"
      :class="{ 'account-card-border': $vuetify.breakpoint.smAndDown }"
      :style="{ '--card-custom-color': caregiversColor }"
    >
      <!-- Desktop Title -->
      <v-col cols="12" md="6">
        <div class="account-page-title !pg-text-[#78C383]">
          {{ $t('account.caregivers.title') }}
        </div>
        <div class="account-page-subtitle">
          {{ $t('account.caregivers.subtitle') }}
        </div>
        <div class="my-4 pr-10 pl-2">
          <div class="account-green-dashed-line"></div>
        </div>
      </v-col>
      <v-col cols="12" md="6" class="d-flex justify-center justify-md-end mb-4 mb-md-0">
        <add-caregiver />
      </v-col>

      <!-- Caregivers List Information -->
      <v-col cols="12" md="6" class="pr-md-8 mb-6 mb-md-0">
        <v-card v-if="caregivers.length === 0" class="account-caregiver-card px-6 py-6">
          <v-row no-gutters align="center">
            <v-col cols="4" lg="3">
              <img src="@/assets/svg/caregiver.svg" :height="iconSize" />
            </v-col>
            <v-col cols="8" lg="9">
              <p class="account-caregiver-placeholder ma-0">
                {{ $t('account.caregivers.subtitle') }}
              </p>
            </v-col>
          </v-row>
        </v-card>

        <v-card v-else class="pa-4 px-md-10 py-md-6 account-caregiver-card">
          <!-- List -->
          <v-row
            v-for="(caregiver, caregiverIndex) in caregivers"
            :key="caregiver.id"
            no-gutters
          >
            <v-col v-if="caregivers.length > 0 && !isEditing" class="!pg-relative" cols="12">
              <v-row no-gutters align="center">
                <v-btn
                  text
                  class="!pg-absolute pg-top-[-10px] pg-right-[-20px]"
                  color="#F89838"
                  @click="setEditing(caregiver)"
                >
                  <span class="text-decoration-underline">{{ $t('commonWords.edit') }}</span>
                  <v-icon right>
                    mdi-pencil
                  </v-icon>
                </v-btn>

                <div class="account-caregiver-circle mr-4">
                  C{{ caregiverIndex + 1 }}
                </div>
                <p class="account-caregiver-name ma-0">
                  {{ caregiver.fullName }}
                </p>
              </v-row>
            </v-col>

            <v-col v-if="isEditing" class="!pg-relative" cols="12">
              <v-btn
                v-if="isEditing"
                class="text-decoration-underline !pg-absolute pg-top-[-10px] pg-right-[-20px]"
                color="#F83838"
                text
                @click="remove(caregiver)"
              >
                {{ $t('account.caregivers.deleteCaregiver') }}
              </v-btn>

              <v-row class="mt-8" no-gutters>
                <v-row no-gutters>
                  <v-col cols="12" md="6" class="pr-unset pr-sm-4">
                    <span class="d-inline-block account-field-label mb-2">{{ $t('commonWords.firstName') }}</span>
                    <pg-text-field
                      v-model="form.firstName"
                      background-color="#F7F7F7"
                      color="#AAAAAA"
                      solo
                      dense
                      flat
                      :disabled="!isEditing"
                    />
                  </v-col>

                  <v-col cols="12" md="6" class="pl-unset pl-sm-4">
                    <span class="d-inline-block account-field-label mb-2">{{ $t('commonWords.lastName') }}</span>
                    <v-text-field
                      v-model="form.lastName"
                      background-color="#F7F7F7"
                      color="#AAAAAA"
                      solo
                      flat
                      :disabled="!isEditing"
                    />
                  </v-col>
                </v-row>
              </v-row>

              <v-btn
                x-large
                block
                :loading="loading"
                :disabled="loading"
                class="rounded-0 white--text"
                elevation="0"
                color="#AAD579"
                @click="saveCaregivers(form)"
              >
                {{ $t('commonWords.save') }}
              </v-btn>
              <v-btn
                x-large
                block
                :loading="loading"
                :disabled="loading"
                text
                class="text-decoration-underline"
                color="#F89838"
                @click="isEditing = false"
              >
                {{ $t('commonWords.cancel') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" class="pl-md-8 mb-12 mb-md-0">
        <!-- Pending Invites List -->
        <v-card class="account-caregiver-card px-6 py-6">
          <v-row no-gutters align="center">
            <v-col cols="4" lg="3">
              <img src="@/assets/svg/pending-invite.svg" :height="iconSize" />
            </v-col>
            <v-col cols="8" lg="9">
              <p class="account-caregiver-title mb-2">
                {{ $t('account.caregivers.pending') }}
              </p>
              <invitation-list />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </pg-loading>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AddCaregiver from '@/components/app/caregiver/AddCaregiver'
import InvitationList from '@/components/app/caregiver/InvitationList'

export default {
  name: 'CaregiverList',

  components: {
    InvitationList,
    AddCaregiver
  },

  data () {
    return {
      isEditing: false,
      form: {},
      loading: false
    }
  },

  computed: {
    ...mapGetters('caregiver', ['getCaregivers']),

    caregivers() {
      return this.getCaregivers
    },

    caregiversColor() {
      return '53, 152, 70'
    },

    iconSize() {
      return this.$vuetify.breakpoint.smAndDown ? '60px' : '80px'
    }
  },

  mounted () {
    this.getCaregiversData()
  },

  methods: {
    ...mapActions('caregiver', ['fetchCaregiversList', 'deleteCaregiver', 'editCaregiver']),

    async getCaregiversData () {
      try {
        this.loading = true
        if (this.caregivers.length === 0) {
          await this.fetchCaregiversList()
        }
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    async saveCaregivers(item) {
      try {
        this.loading = true
        const caregiver = await this.editCaregiver({ id: item.id, body: { firstName: item.firstName, lastName: item.lastName } })

        if (caregiver) {
          await this.getCaregiversData()
        }
      } catch (e) {
      } finally {
        this.isEditing = false
        this.loading = false
      }
    },

    setEditing(item) {
      this.isEditing = true
      this.form = { ...item }
    },

    remove ({ id, firstName }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete caregiver?',
        message: `Are you sure you want to delete <b>${firstName}</b>?`,
        action: () => this.deleteCaregiver(id).then(this.getCaregiversData)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/account.scss';

.card-custom-border {
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.25) !important;
  border-radius: 8px !important;
}

.v-btn:not(.v-btn--text) {
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16) !important;
}

.max-width-400 {
  max-width: 400px;
}
</style>
