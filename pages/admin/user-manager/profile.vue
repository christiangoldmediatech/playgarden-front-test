<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%" class="mb-5">
          <v-card-title>
            User Profile

            <v-spacer />

            <v-btn
              class="text-none"
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

              <v-col class="mt-n5">
                <v-row
                  justify="center"
                  justify-md="start"
                  class="user-edit"
                  no-gutters
                >
                  <v-icon color="accent" dense @click="goToEdit(user.id)">
                    mdi-pencil-outline
                  </v-icon>
                  <span class="clickable edit-color" @click="goToEdit(user.id)">
                    EDIT
                  </span>
                </v-row>
              </v-col>

              <v-col v-if="billing.stripeStatus !== 'canceled'" class="mt-5">
                <v-row
                  justify="center"
                  justify-md="end"
                  class="user-edit pr-md-5"
                  no-gutters
                >
                  <div class="text-center">
                    <v-btn color="#FF0000" dark @click="remove">
                      Cancel Membership
                    </v-btn>
                  </div>
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
                              <v-row no-gutters>
                                <b v-if="!workbookDateSent">Sent</b>
                                <b v-else>
                                  Sent on: {{ dateWorkbook() }}
                                </b>
                                <v-img
                                  class="ml-1"
                                  max-height="25"
                                  max-width="24"
                                  :src="require('@/assets/svg/green-check.svg')"
                                />
                              </v-row>
                            </template>

                            <template v-else>
                              <v-row no-gutters>
                                <b>Pending</b>
                                <v-img
                                  class="ml-1"
                                  max-height="25"
                                  max-width="24"
                                  :src="require('@/assets/svg/pending.svg')"
                                />
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
                              <v-row no-gutters>
                                <b v-if="!backpackDateSent">Sent</b>
                                <b v-else>
                                  Sent on: {{ dateBackpack() }}
                                </b>
                                <v-img
                                  class="ml-1"
                                  max-height="25"
                                  max-width="24"
                                  :src="require('@/assets/svg/green-check.svg')"
                                />
                              </v-row>
                            </template>

                            <template v-else>
                              <v-row no-gutters>
                                <b>Pending</b>
                                <v-img
                                  class="ml-1"
                                  max-height="25"
                                  max-width="24"
                                  :src="require('@/assets/svg/pending.svg')"
                                />
                              </v-row>
                            </template>
                          </v-col>
                        </v-row>
                      </v-col>
                    </template>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

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

                        <v-row justify="center">
                          <v-btn
                            class="text-none"
                            color="accent"
                            large
                            @click.stop="openTimeline(child)"
                          >
                            Progress
                          </v-btn>
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

                      <div v-if="i < children.length - 1" class="gray-div" />
                    </v-row>
                  </v-col>
                </v-row>
              </v-card-text>
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
import UserChildLessonOverlay from '@/components/admin/users/UserChildLessonOverlay.vue'
import UserChildTimelineDialog from '@/components/admin/users/UserChildTimelineDialog.vue'
import { formatDate } from '~/utils/dateTools'

const CANCELATION_CONFIRMATION_WORD = 'confirm'

export default {
  name: 'Profile',

  layout: 'admin',

  components: {
    UserChildTimelineDialog,
    UserChildLessonOverlay
  },

  data: () => ({
    exporting: false,
    dialog: false,
    user: null,
    children: [],
    childrenStatus: []
  }),

  computed: {
    id () {
      return this.$route.query.id
    },

    joined () {
      if (this.user) {
        return formatDate(this.user.createdAt, {
          format: 'MMMM, YYYY'
        })
      }
      return ''
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
    }

    // isCancelConfirmationBtnDisabled () {
    //   return
    // }
  },

  async created () {
    await this.getUserDetails()
  },

  methods: {
    ...mapActions('admin/users', ['getById', 'getChildren']),
    ...mapActions('payment', ['cancelSubscriptionById']),
    ...mapActions('children/lesson', ['getLessonChildrenStatus']),

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
      const birthday = new Date(timestamp)
      const month = birthday.toLocaleString('default', { month: 'long' })
      return `${month} ${birthday.getDate()}, ${birthday.getFullYear()}`
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
</style>
