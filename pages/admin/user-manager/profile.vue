<template>
  <v-container>
    <v-row>
      <!-- Workbook modal -->
      <workbook-send-dates-editor-dialog ref="workbookSendDatesRef" @saved="getUserDetails" />
      <!-- Backpack modal -->
      <backpack-editor-dialog ref="backpackEditorDialogRef" @saved="getUserDetails" />
      <!-- Change Plan modal -->
      <shipping-address-editor-dialog ref="shippingAddress" @saved="getUserDetails" />
      <!-- Change Password-->
      <user-password-editor-dialog ref="userPassword" />
      <!-- Edit Child-->
      <child-editor-dialog ref="childEditorDialogRef" @saved="getUserDetails" />

      <v-dialog
        v-model="changePlanModal"
        content-class="white"
        :fullscreen="isMobile"
        max-width="80%"
        persistent
      >
        <v-col cols="12">
          <v-row class="pr-3 mb-md-n12" justify="end">
            <v-btn class="white" icon @click.stop="closeChangePlanModal">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-row>

          <subscription-plan-selection
            v-if="changePlanModal"
            :administrator="true"
            :user-load-plan="user.id"
            no-address
            no-payment
            updating
            @click:cancel="closeChangePlanModal"
            @click:administrator="onSuccessChangePlan"
          />
        </v-col>
      </v-dialog>

      <v-col cols="12">
        <v-card width="100%" class="mb-5">
          <v-card-title>
            User Profile

            <v-spacer />

            <v-btn
              class="ml-3 text-none"
              color="accent darken-1"
              depressed
              nuxt
              small
              :to="{ name: 'admin-user-manager' }"
            >
              Back
            </v-btn>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="mx-auto my-1" elevation="4">
      <v-row v-if="user" justify="center">
        <v-col cols="12">
          <v-row justify="center" align-content="center" no-gutters>
            <v-col cols="12" md="3">
              <v-row justify="center" class="mx-auto my-1" no-gutters>
                <v-img
                  max-width="157"
                  :src="require('@/assets/svg/user.svg')"
                />
              </v-row>
            </v-col>

            <v-col cols="12" md="9">
              <v-col>
                <v-row justify="center" justify-md="start" no-gutters>
                  <b>{{ user.fullName }}</b>
                </v-row>
              </v-col>

              <v-col class="mt-n5">
                <v-row justify="center" justify-md="start" no-gutters>
                  Joined {{ joined }}
                </v-row>
              </v-col>

              <v-col class="mt-n5">
                <v-chip
                  color="green"
                  text-color="white"
                >
                  <a :href="`https://dashboard.stripe.com/customers/${billing.customerId}`" target="_blank">View on Stripe</a>
                </v-chip>
              </v-col>
              <v-col v-if="user.testUser" class="mt-n5">
                <b class="mt-2">Test user</b>
              </v-col>
              <v-col class="mt-n12">
                <v-row class="mt-n6">
                  <v-col cols="12">
                    <v-row
                      justify="center"
                      justify-md="end"
                      class="user-edit pr-md-5 mt-n10"
                      no-gutters
                    >
                      <div class="text-center">
                        <v-menu offset-y>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              color="primary"
                              dark
                              v-bind="attrs"
                              v-on="on"
                            >
                              Actions
                              <v-icon dense>
                                mdi-chevron-down
                              </v-icon>
                            </v-btn>
                          </template>
                          <v-list>
                            <v-list-item class="clickable">
                              <v-list-item-title @click="goToEdit(user.id)">
                                <v-icon color="accent" dense>
                                  mdi-pencil-outline
                                </v-icon>
                                <span>
                                  Edit
                                </span>
                              </v-list-item-title>
                            </v-list-item>
                            <v-list-item class="clickable">
                              <v-list-item-title @click="$refs.userPassword.open($event, user.id)">
                                <v-icon color="accent" dense>
                                  mdi-account-key
                                </v-icon>
                                Change Password
                              </v-list-item-title>
                            </v-list-item>
                            <v-list-item class="clickable">
                              <v-list-item-title @click="changePlanModal = true">
                                <v-icon color="accent" dense>
                                  mdi-receipt
                                </v-icon>
                                Change Plan
                              </v-list-item-title>
                            </v-list-item>
                            <v-list-item class="clickable">
                              <v-list-item-title @click="$refs.shippingAddress.open($event, user.id)">
                                <v-icon color="accent" dense>
                                  mdi-map-marker-circle
                                </v-icon>
                                Edit Shipping Address
                              </v-list-item-title>
                            </v-list-item>
                            <v-divider v-if="billing.stripeStatus !== 'canceled' && billing.stripeStatus !== 'incomplete_expired'" />
                            <v-list-item v-if="billing.stripeStatus !== 'canceled' && billing.stripeStatus !== 'incomplete_expired'" class="clickable">
                              <v-list-item-title @click="remove">
                                <v-icon color="red" dense>
                                  mdi-account-remove
                                </v-icon>
                                <span class="red--text">Cancel Membership</span>
                              </v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </div>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-col>
          </v-row>

          <v-card class="mx-auto my-12" width="95%" elevation="4">
            <v-row
              justify-md="start"
              justify="center"
              class="ml-md-5 ml-0 mt-md-2"
            >
              <v-card-title>
                General Information
              </v-card-title>
            </v-row>
            <v-card-text>
              <v-row justify="center" class="px-md-5" no-gutters>
                <v-col>
                  <v-row align-content="center" no-gutters>
                    <v-col cols="12">
                      <v-row>
                        <v-col cols="6" md="2" class="field">
                          Address
                        </v-col>

                        <v-col cols="6" md="10">
                          <template v-if="shippingAddress">
                            <b>{{ shippingAddress.address1 }},</b>
                            <template v-if="shippingAddress.address2.length">
                              <b> {{ shippingAddress.address2 }},</b>
                            </template>
                            <b>{{ shippingAddress.city }},
                              {{ shippingAddress.state }},
                              {{ shippingAddress.zipCode }}</b>
                          </template>

                          <template v-else>
                            <b>Unknown</b>
                          </template>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col cols="6" md="2" class="field">
                          E-mail
                        </v-col>
                        <v-col cols="6" md="10">
                          <b>{{ user.email }}</b>
                        </v-col>
                      </v-row>
                    </v-col>

                    <v-col cols="6">
                      <v-row>
                        <v-col cols="6" md="4" class="field">
                          Phone Number
                        </v-col>
                        <v-col cols="6" md="8">
                          <b>{{ user.phoneNumber }}</b>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="6">
                      <v-row>
                        <v-col cols="6" md="4" class="field">
                          Role
                        </v-col>
                        <v-col cols="6" md="8" class="text-capitalize">
                          <b>{{ role }}</b>
                        </v-col>
                      </v-row>
                    </v-col>
                    <template v-if="role === 'parent'">
                      <v-col cols="6">
                        <v-row>
                          <v-col cols="6" md="4" class="field">
                            Register Step
                          </v-col>
                          <v-col cols="6" md="8" class="text-capitalize">
                            <b>{{ user.registerStepType.toLowerCase() || 'N/A' }}</b>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="6">
                        <v-row>
                          <v-col cols="6" md="4" class="field">
                            Status
                          </v-col>
                          <v-col cols="6" md="8" class="text-capitalize">
                            <b>{{ user.statusType.toLowerCase() }}</b>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="6">
                        <v-row>
                          <v-col cols="6" md="4" class="field">
                            Plan
                          </v-col>
                          <v-col cols="6" md="8" class="text-capitalize">
                            <b>{{ plan.name.toLowerCase() }}</b>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="6">
                        <v-row>
                          <v-col cols="6" md="4" class="field">
                            Membership fee
                          </v-col>
                          <v-col cols="6" md="8">
                            <b>{{ plan.fee }} USD</b>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="6">
                        <v-row>
                          <v-col cols="6" md="4" class="field">
                            Billing date
                          </v-col>
                          <v-col cols="6" md="8">
                            <b>{{ plan.billingDate }}</b>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="6">
                        <v-row>
                          <v-col cols="6" md="4" class="field">
                            Status Stripe
                          </v-col>
                          <v-col cols="6" md="8" class="text-capitalize">
                            <b>{{ billing.stripeStatus.toLowerCase() }}</b>
                          </v-col>
                        </v-row>
                      </v-col>
                      <template v-if="discount.code !== 'N/A'">
                        <v-col cols="6">
                          <v-row>
                            <v-col cols="6" md="4" class="field">
                              Discount
                            </v-col>
                            <v-col cols="6" md="8" class="text-capitalize">
                              <b>{{ discount.percent }}</b>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="6">
                          <v-row>
                            <v-col cols="6" md="4" class="field">
                              Coupon code
                            </v-col>
                            <v-col cols="6" md="8" class="text-capitalize">
                              <b>{{ discount.code }}</b>
                            </v-col>
                          </v-row>
                        </v-col>
                      </template>
                      <v-divider />
                      <v-col cols="6">
                        <v-row>
                          <v-col cols="6" md="4" class="field">
                            Backpack
                          </v-col>

                          <v-col cols="6" md="8">
                            <template v-if="backpackSent">
                              <v-row class="clickable" no-gutters @click="$refs.backpackEditorDialogRef.open($event, user)">
                                <b v-if="!workbookDateSent">Sent {{ dateBackpack() }}</b>
                                <b v-else>
                                  Sent on: {{ dateBackpack() }}
                                </b>
                                <v-icon
                                  color="primary"
                                  class="ml-1"
                                  @click="$emit('prev-week')"
                                >
                                  mdi-eye
                                </v-icon>
                              </v-row>
                            </template>

                            <template v-else>
                              <v-row class="clickable" no-gutters @click="$refs.backpackEditorDialogRef.open($event, user)">
                                <b>Pending</b>
                                <v-img
                                  class="ml-1"
                                  max-height="25"
                                  max-width="24"
                                  :src="require('@/assets/svg/pending.svg')"
                                />
                                <div class="">
                                  <v-btn
                                    class="ml-2 mt-n1"
                                    small
                                    block
                                    @click="$refs.backpackEditorDialogRef.open($event, user)"
                                  >
                                    <v-icon color="accent" dense>
                                      mdi-pencil-outline
                                    </v-icon>
                                    Edit
                                  </v-btn>
                                </div>
                              </v-row>
                            </template>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="6">
                        <v-row>
                          <v-col cols="6" md="4" class="field">
                            Workbook
                          </v-col>

                          <v-col cols="6" md="8" class="pl-md-3">
                            <template v-if="workbookSent">
                              <v-row no-gutters class="clickable" @click="$refs.workbookSendDatesRef.open($event, user)">
                                <b v-if="!backpackDateSent">{{ getNumberWorkbook }} Sent</b>
                                <b v-else>
                                  Sent on: {{ dateBackpack() }}
                                </b>
                                <v-icon
                                  color="primary"
                                  class="ml-1"
                                  @click="$emit('prev-week')"
                                >
                                  mdi-eye
                                </v-icon>
                              </v-row>
                            </template>

                            <template v-else>
                              <v-row no-gutters class="clickable" @click="$refs.workbookSendDatesRef.open($event, user)">
                                <b>Pending</b>
                                <v-img
                                  class="ml-1"
                                  max-height="25"
                                  max-width="24"
                                  :src="require('@/assets/svg/pending.svg')"
                                />
                                <div class="">
                                  <v-btn
                                    class="ml-2 mt-n1"
                                    small
                                    block
                                    @click="$refs.workbookSendDatesRef.open($event, user)"
                                  >
                                    <v-icon color="accent" dense>
                                      mdi-pencil-outline
                                    </v-icon>
                                    Edit
                                  </v-btn>
                                </div>
                              </v-row>
                            </template>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col v-if="existCancelReason" cols="6">
                        <v-row>
                          <v-col cols="6" md="4" class="field">
                            Cancel reason
                          </v-col>
                          <v-col cols="6" md="8">
                            <b>{{ user.cancelReason }}</b>
                          </v-col>
                        </v-row>
                      </v-col>
                    </template>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <billing-history-card v-if="billing.stripeStatus ==='active'" class="mx-7" v-bind="{ id }" />

          <v-card
            v-if="role === 'parent'"
            class="mx-auto my-12"
            width="95%"
            elevation="4"
          >
            <v-row>
              <v-row
                justify-md="start"
                justify="center"
                class="ml-md-5 ml-0 mt-md-2"
              >
                <v-card-title>
                  Children's Information
                </v-card-title>
              </v-row>

              <v-card-text>
                <v-row
                  v-for="(child, i) in children"
                  :key="`child-${child.id}`"
                  justify="center"
                  class="px-5"
                  no-gutters
                >
                  <v-col cols="12">
                    <v-row justify="center" align-content="center">
                      <v-col cols="12" md="4" align-content="center">
                        <v-row justify="center">
                          <img
                            class="center"
                            width="150"
                            :src="child.backpack.image"
                            alt="backpack"
                          >
                        </v-row>

                        <v-row class="mb-15" justify="center">
                          <v-app class="children-actions">
                            <v-btn
                              class="text-none worksheet-uploaded"
                              large
                              @click.stop="$router.push({ name: 'admin-portfolio', query: {id: child.id } })"
                            >
                              View Uploaded Worksheets
                            </v-btn>
                            <v-btn
                              class=" mt-2 text-none"
                              color="accent"
                              large
                              @click.stop="openTimeline(child)"
                            >
                              Go to Letter Progress
                            </v-btn>
                            <v-btn
                              class="mt-2 text-none"
                              color="primary"
                              large
                              @click.stop="goToProgressReport(child.id)"
                            >
                              Go to Progress Report
                            </v-btn>
                            <v-btn
                              class="mt-2 text-none"
                              color="primary"
                              text
                              large
                              @click="$refs.childEditorDialogRef.open($event, child)"
                            >
                              Edit
                            </v-btn>
                          </v-app>
                        </v-row>
                      </v-col>

                      <v-col cols="12" md="8">
                        <v-row>
                          <v-col cols="6" md="3" class="field">
                            Name
                          </v-col>
                          <v-col cols="6" md="9">
                            <b>{{ child.firstName }} {{ child.lastName }}</b>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col cols="6" md="3" class="field">
                            Date of birth
                          </v-col>
                          <v-col cols="6" md="9">
                            <b>{{ getDob(child.birthday) }}</b>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col cols="6" md="3" class="field">
                            Gender
                          </v-col>
                          <v-col cols="6" md="9">
                            <b>{{ getGender(child.gender) }}</b>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col cols="6" md="3" class="field">
                            Current letter
                          </v-col>
                          <v-col cols="6" md="9">
                            <b>
                              Letter {{ getLessonStatus(child.id).letter }}</b>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col cols="6" md="3" class="field">
                            Current day
                          </v-col>
                          <v-col cols="6" md="9">
                            <b>Day {{ getLessonStatus(child.id).day }}</b>
                          </v-col>
                        </v-row>
                      </v-col>

                      <div v-if="i < children.length - 1" class="gray-div mt-6" />
                    </v-row>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-row>
          </v-card>

          <v-card
            v-if="role === 'parent'"
            class="mx-auto my-12"
            width="95%"
            elevation="4"
          >
            <v-row class="mx-4">
              <caregivers-data-table :id="user.id" />
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <user-child-timeline-dialog />
    <user-child-lesson-overlay />
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import SubscriptionPlanSelection from '@/components/app/payment/SubscriptionPlanSelection'
import UserPasswordEditorDialog from '@/components/admin/users/UserPasswordEditorDialog'
import ShippingAddressEditorDialog from '@/components/admin/shipping-address/ShippingAddressEditorDialog.vue'
import WorkbookSendDatesEditorDialog from '@/components/admin/users/WorkbookSendDatesEditorDialog.vue'
import BackpackEditorDialog from '@/components/admin/users/BackpackEditorDialog.vue'
import UserChildLessonOverlay from '@/components/admin/users/UserChildLessonOverlay.vue'
import UserChildTimelineDialog from '@/components/admin/users/UserChildTimelineDialog.vue'
import CaregiversDataTable from '@/components/admin/caregivers/CaregiversDataTable.vue'
import ChildEditorDialog from '@/components/admin/children/ChildEditorDialog'
import BillingHistoryCard from '@/components/BillingHistoryCard.vue'
import { formatDate } from '~/utils/dateTools'

const CANCELATION_CONFIRMATION_WORD = 'confirm'

export default {
  name: 'Profile',

  layout: 'admin',

  components: {
    SubscriptionPlanSelection,
    UserPasswordEditorDialog,
    ShippingAddressEditorDialog,
    WorkbookSendDatesEditorDialog,
    BackpackEditorDialog,
    UserChildTimelineDialog,
    UserChildLessonOverlay,
    CaregiversDataTable,
    ChildEditorDialog,
    BillingHistoryCard
  },

  data: () => ({
    exporting: false,
    dialog: false,
    changePlanModal: false,
    user: null,
    children: [],
    childrenStatus: []
  }),

  computed: {
    id () {
      return this.$route.query.id
    },

    isMobile () {
      return this.$vuetify.breakpoint.mobile
    },

    joined () {
      if (this.user) {
        return formatDate(this.user.createdAt, {
          format: 'MMMM, YYYY'
        })
      }
      return ''
    },

    getNumberWorkbook () {
      let total = 0
      if (this.user && this.user.shipments && this.user.shipments.workbookDate) {
        Object.keys(this.user.shipments.workbookDate).forEach((key) => {
          total = (this.user.shipments.workbookDate[key]) ? total + 1 : total
        })
      }
      return total
    },

    role () {
      if (this.user && this.user.role) {
        let role = this.user.role.name
        role = role.replace('_', ' ')
        role = role.toLowerCase()
        if (role[role.length - 1] === 's') {
          role = role.substr(0, role.length - 1)
        }
        return role
      }
      return ''
    },

    billing () {
      if (this.user && this.user.billings && this.user.billings[0]) {
        return this.user.billings[0]
      }
      return null
    },

    discount () {
      const discount = {
        percent: '0%',
        code: 'N/A'
      }
      if (
        this.billing &&
        this.billing.subscriptionData &&
        this.billing.subscriptionData.discount &&
        this.billing.subscriptionData.discount.coupon
      ) {
        const coupon = this.billing.subscriptionData.discount.coupon
        discount.percent = `${coupon.percent_off} %`
        discount.code = coupon.name
      }
      return discount
    },

    plan () {
      const plan = {
        name: 'N/A',
        fee: 'N/A',
        billingDate: 'N/A',
        trialEnd: 'N/A'
      }

      if (this.user && this.user.planSelected && this.billing) {
        // Name and type of plan
        plan.name =
          this.user.planSelected.planName.toLowerCase() +
          ' ' +
          this.billing.billingType.toLowerCase()

        if (this.billing.subscriptionData) {
          // Membership fee
          const amount = this.billing.subscriptionData.plan.amount / 100

          plan.fee = amount.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
          })

          // Next billing date
          const nextBillingDate = new Date()
          nextBillingDate.setTime(
            this.billing.subscriptionData.current_period_end * 1000
          )

          plan.billingDate = formatDate(nextBillingDate, {
            format: 'MMMM DD, YYYY'
          })
        }
      }

      return plan
    },

    shippingAddress () {
      if (
        this.user &&
        this.user.shippingAddress &&
        this.user.shippingAddress.length
      ) {
        return this.user.shippingAddress[0]
      }
      return null
    },

    workbookSent () {
      return this.user && this.user.shipments && this.user.shipments.workbook
    },

    backpackSent () {
      return this.user && this.user.shipments && this.user.shipments.backpack
    },

    workbookDateSent () {
      return this.user && this.user.shipments && this.user.shipments.workbookDate
    },

    backpackDateSent () {
      return this.user && this.user.shipments && this.user.shipments.backpackDate
    },

    existCancelReason () {
      if (this.user && this.billing) {
        return this.user.status === 0 && this.billing.stripeStatus === 'canceled' && this.user.cancelReason !== null
      } else {
        return false
      }
    }

    // isCancelConfirmationBtnDisabled () {
    //   return
    // }
  },

  async created () {
    await this.getUserDetails()
  },

  methods: {
    ...mapActions('admin/users', ['getById', 'getChildren', 'updateUserPlanByAdmin']),
    ...mapActions('payment', ['cancelSubscriptionById']),
    ...mapActions('children/lesson', ['getLessonChildrenStatus']),

    goToProgressReport (id) {
      this.$router.push({ name: 'admin-progress-report', query: { id } })
    },

    closeChangePlanModal () {
      this.changePlanModal = false
      /* if (this.$route.params.planRedirect) {
        this.$router.push({ name: this.$route.params.planRedirect })
      } */
    },

    async onSuccessChangePlan (val) {
      try {
        const plan = {
          planId: val.planSelected.id,
          invoiceType: val.planSelected.type,
          userId: this.user.id
        }
        await this.updateUserPlanByAdmin(plan)
      } catch (e) {
      } finally {
        await this.getUserDetails()
        this.closeChangePlanModal()
      }
    },

    dateWorkbook () {
      return formatDate(this.user.shipments.workbookDate, {
        format: 'MMMM DD, YYYY'
      })
    },

    dateBackpack () {
      return formatDate(this.user.shipments.backpackDate, {
        format: 'MMMM DD, YYYY'
      })
    },

    async getUserDetails () {
      if (this.id) {
        try {
          const promises = await Promise.all([
            this.getById(this.id),
            this.getChildren(this.id)
          ])
          const user = promises[0]
          const children = promises[1]

          if (children.length) {
            const childrenIds = children.map(({ id }) => id)
            const childrenStatus = await this.getLessonChildrenStatus(
              childrenIds
            )
            this.childrenStatus = childrenStatus
          }

          this.children = children
          this.user = user
        } catch (err) {
          return Promise.reject(err)
        }
      } else {
        await this.$router.push({ name: 'admin-user-manager' })
      }
    },

    goToEdit (id) {
      this.$router.push({
        name: 'admin-user-manager-editor',
        query: { id }
      })
    },

    getDob (timestamp) {
      if (!timestamp) {
        return 'Missing information'
      }

      return formatDate(timestamp, {
        format: 'MMMM DD, YYYY'
      })
    },

    getGender (gender) {
      if (gender === 'FEMALE') {
        return 'Girl'
      }
      return 'Boy'
    },

    getLessonStatus (childId) {
      const result = {
        letter: 'N/A',
        day: 'N/A'
      }

      const status = this.childrenStatus.find((childStatus) => {
        return (
          childStatus.children.id === childId &&
          childStatus.curriculumType &&
          childStatus.day
        )
      })

      if (status) {
        result.day = status.day
        result.letter = status.curriculumType.letter.substr(0, 1)
      }

      return result
    },

    openTimeline (child) {
      this.$nuxt.$emit('open-timeline', child)
    },

    remove () {
      this.$nuxt.$emit('open-prompt', {
        isInputTextToConfirm: true,
        confirmationWord: CANCELATION_CONFIRMATION_WORD,
        image: 'delete',
        message: `Are you sure you want to cancel this <b>${this.plan.name || ''}</b> plan?`,
        action: async () => {
          await this.cancelSubscriptionById(this.billing.id)
          await this.getUserDetails()
        }
      })
    }
  }
}
</script>

<style lang="scss">
.field {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  color: #9b9b9b;
  width: 155px;
}
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.gray-div {
  background: #cdcdcd;
  border-bottom: solid 1px #cdcdcd;
  width: 90%;
  height: 1px;
}
.edit-color {
  color: #f89838;
}
.children-actions {
  max-height: 110px !important;
}

.worksheet-uploaded {
  color: white!important;
  background-color: #13AADF!important;
}
</style>
