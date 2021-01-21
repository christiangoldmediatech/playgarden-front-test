<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
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

    <v-row v-if="user">
      <v-col cols="12">
        <v-card class="user-wrapper-card" width="100%">
          <div class="user-header">
            <img class="user-img" src="@/assets/svg/user.svg">
            <div class="user-basic-info">
              <div class="user-name">
                {{ user.fullName }}
              </div>
              <div class="user-joined">
                Joined {{ joined }}
              </div>
              <div class="user-edit">
                <v-icon
                  color="accent"
                  dense
                  @click="goToEdit(user.id)"
                >
                  mdi-pencil-outline
                </v-icon>
                <span class="clickable" @click="goToEdit(user.id)">
                  EDIT
                </span>
              </div>
            </div>
          </div>

          <v-card class="user-general" width="100%">
            <div class="user-general-title">
              General Information
            </div>

            <div class="user-general-table">
              <div class="user-general-table-row">
                <div class="user-general-field">
                  Address
                </div>
                <div class="user-general-value">
                  <template v-if="shippingAddress">
                    {{ shippingAddress.address1 }},
                    <template v-if="shippingAddress.address2.length">
                      {{ shippingAddress.address2 }},
                    </template>
                    {{ shippingAddress.city }}, {{ shippingAddress.state }}, {{ shippingAddress.zipCode }}
                  </template>
                  <template v-else>
                    Unknown
                  </template>
                </div>
              </div>

              <div class="user-general-table-row">
                <div class="user-general-field">
                  E-mail
                </div>
                <div class="user-general-value">
                  {{ user.email }}
                </div>
              </div>

              <div class="user-general-table-row">
                <div class="user-general-table-row-divider">
                  <div class="user-general-field">
                    Phone Number
                  </div>
                  <div class="user-general-value">
                    {{ user.phoneNumber }}
                  </div>
                </div>
                <div class="user-general-field">
                  Role
                </div>
                <div class="user-general-value text-capitalize">
                  {{ role }}
                </div>
              </div>

              <div class="user-general-table-row">
                <div class="user-general-table-row-divider">
                  <div class="user-general-field">
                    Status
                  </div>
                  <div class="user-general-value text-capitalize">
                    {{ user.statusType.toLowerCase() }}
                  </div>
                </div>
                <div class="user-general-field">
                  Register Step
                </div>
                <div class="user-general-value text-capitalize">
                  {{ user.registerStepType || 'N/A' }}
                </div>
              </div>

              <template v-if="role === 'parent'">
                <div class="user-general-table-row">
                  <div class="user-general-table-row-divider">
                    <div class="user-general-field">
                      Plan
                    </div>
                    <div class="user-general-value text-capitalize">
                      {{ plan.name }}
                    </div>
                  </div>
                  <div class="user-general-field">
                    Backpack
                  </div>
                  <div class="user-general-value">
                    <template v-if="backpackSent">
                      Sent <img class="user-sent-status" src="@/assets/svg/green-check.svg">
                    </template>
                    <template v-else>
                      Pending <img class="user-sent-status" src="@/assets/svg/pending.svg">
                    </template>
                  </div>
                </div>

                <div class="user-general-table-row">
                  <div class="user-general-table-row-divider">
                    <div class="user-general-field">
                      Membership fee
                    </div>
                    <div class="user-general-value">
                      {{ plan.fee }}
                    </div>
                  </div>
                  <div class="user-general-field">
                    Workbook
                  </div>
                  <div class="user-general-value">
                    <template v-if="workbookSent">
                      Sent <img class="user-sent-status" src="@/assets/svg/green-check.svg">
                    </template>
                    <template v-else>
                      Pending <img class="user-sent-status" src="@/assets/svg/pending.svg">
                    </template>
                  </div>
                </div>

                <div class="user-general-table-row">
                  <div class="user-general-table-row-divider">
                    <div class="user-general-field">
                      Discount
                    </div>
                    <div class="user-general-value">
                      {{ discount.percent }}
                    </div>
                  </div>
                  <div class="user-general-field">
                    Coupon code
                  </div>
                  <div class="user-general-value">
                    {{ discount.code }}
                  </div>
                </div>

                <div class="user-general-table-row">
                  <div class="user-general-field">
                    Billing date
                  </div>
                  <div class="user-general-value">
                    {{ plan.billingDate }}
                  </div>
                </div>
              </template>
            </div>
          </v-card>

          <v-card v-if="role === 'parent'" class="user-child" width="100%">
            <div class="user-child-title">
              Children's Information
            </div>

            <div
              v-for="(child, i) in children"
              :key="`child-${child.id}`"
              class="user-child-wrapper"
            >
              <div class="user-child-row">
                <div class="user-child-backpack">
                  <img class="mb-3" width="100%" :src="child.backpack.image">

                  <v-btn class="text-none" color="accent" block @click.stop="openTimeline(child)">
                    Progress
                  </v-btn>
                </div>

                <div class="user-child-table">
                  <div class="user-child-table-row">
                    <div class="user-child-table-field">
                      Name
                    </div>
                    <div class="user-child-table-value">
                      {{ child.firstName }} {{ child.lastName }}
                    </div>
                  </div>

                  <div class="user-child-table-row">
                    <div class="user-child-table-field">
                      Date of birth
                    </div>
                    <div class="user-child-table-value">
                      {{ getDob(child.birthday) }}
                    </div>
                  </div>

                  <div class="user-child-table-row">
                    <div class="user-child-table-field">
                      Gender
                    </div>
                    <div class="user-child-table-value">
                      {{ getGender(child.gender) }}
                    </div>
                  </div>

                  <div class="user-child-table-row">
                    <div class="user-child-table-field">
                      Current letter
                    </div>
                    <div class="user-child-table-value">
                      {{ getLessonStatus(child.id).letter }}
                    </div>
                  </div>

                  <div class="user-child-table-row">
                    <div class="user-child-table-field">
                      Current day
                    </div>
                    <div class="user-child-table-value">
                      {{ getLessonStatus(child.id).day }}
                    </div>
                  </div>
                </div>
              </div>
              <hr v-if="i < children.length - 1" class="user-child-separator">
            </div>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
    <user-child-timeline-dialog />
    <user-child-lesson-overlay />
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import UserChildLessonOverlay from '@/components/admin/users/UserChildLessonOverlay.vue'
import UserChildTimelineDialog from '@/components/admin/users/UserChildTimelineDialog.vue'

export default {
  name: 'Profile',

  layout: 'admin',

  components: {
    UserChildTimelineDialog,
    UserChildLessonOverlay
  },

  data: () => {
    return {
      user: null,
      children: [],
      childrenStatus: []
    }
  },

  computed: {
    id () {
      return this.$route.query.id
    },

    joined () {
      if (this.user) {
        const date = new Date(this.user.createdAt)
        const month = date.toLocaleString('default', { month: 'long' })
        return `${month}, ${date.getFullYear()}`
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
      if (this.billing && this.billing.subscriptionData && this.billing.subscriptionData.discount && this.billing.subscriptionData.discount.coupon) {
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
        billingDate: 'N/A'
      }

      if (this.user && this.user.planSelected && this.billing) {
        // Name and type of plan
        plan.name = this.user.planSelected.planName.toLowerCase() + ' ' + this.billing.billingType.toLowerCase()

        if (this.billing.subscriptionData) {
          // Membership fee
          const amount = this.billing.subscriptionData.plan.amount / 100

          plan.fee = amount.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
          })

          // Next billing date
          const nextBillingDate = new Date()
          nextBillingDate.setTime(this.billing.subscriptionData.current_period_end * 1000)

          const month = nextBillingDate.toLocaleString('default', { month: 'long' })

          plan.billingDate = `${month} ${nextBillingDate.getDate()}, ${nextBillingDate.getFullYear()}`
        }
      }

      return plan
    },

    shippingAddress () {
      if (this.user && this.user.shippingAddress && this.user.shippingAddress.length) {
        return this.user.shippingAddress[0]
      }
      return null
    },

    workbookSent () {
      return this.user && this.user.shipments && this.user.shipments.workbook
    },

    backpackSent () {
      return this.user && this.user.shipments && this.user.shipments.backpack
    }
  },

  async created () {
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
          const childrenStatus = await this.getLessonChildrenStatus(childrenIds)
          this.childrenStatus = childrenStatus
        }

        this.children = children
        this.user = user
      } catch (err) {
        return Promise.reject(err)
      }
    } else {
      this.$router.push({ name: 'admin-user-manager' })
    }
  },

  methods: {
    ...mapActions('admin/users', ['getById', 'getChildren']),
    ...mapActions('children/lesson', ['getLessonChildrenStatus']),

    goToEdit (id) {
      this.$router.push({ name: 'admin-user-manager-editor', query: { id } })
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
        return childStatus.children.id === childId && childStatus.curriculumType && childStatus.day
      })

      if (status) {
        result.day = status.day
        result.letter = status.curriculumType.letter.substr(0, 1)
      }

      return result
    },

    openTimeline (child) {
      this.$nuxt.$emit('open-timeline', child)
    }
  }
}
</script>

<style lang="scss">
.user {
  &-wrapper-card {
    padding-top: 65px;
    padding-left: 76px;
    padding-right: 76px;
    padding-bottom: 47px;
    &.v-card.v-sheet {
      box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.25);
    }
  }
  &-header {
    display: flex;
    align-items: center;
    margin-bottom: 45px;
  }
  &-img {
    width: 157px;
    height: 157px;
  }
  &-basic-info {
    padding-left: 29px;
  }
  &-name {
    font-size: 20px;
    line-height: 1.5;
    font-weight: 600;
  }
  &-joined {
    font-size: 18px;
    line-height: 1.5;
    font-weight: 400;
  }
  &-edit {
    display: flex;
    align-items: center;
    span {
      font-size: 16px;
      line-height: 1.5;
      font-weight: 500;
      color: var(--v-accent-base);
      text-decoration: underline;
    }
  }
  &-general {
    padding: 24px 32px;
    padding-bottom: 8px;
    margin-bottom: 40px;
    &.v-card.v-sheet {
      box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.25);
    }
    &-title {
      font-size: 20px;
      font-weight: 600;
      line-height: 1.5;
      margin-bottom: 24px;
    }
    &-table {
      display: flex;
      flex-direction: column;
      &-row {
        display: flex;
        margin-bottom: 16px;
        &-divider {
          display: flex;
          width: 50%;
        }
      }
    }
    &-field {
      font-size: 16px;
      font-weight: 500;
      line-height: 1.5;
      color:#9B9B9B;
      width: 155px;
    }
    &-value {
      font-size: 18px;
      font-weight: 600;
      line-height: 1.5;
      display: inline;
      color: #484848;
    }
  }
  &-child {
    padding: 28px 32px;
    &.v-card.v-sheet {
      box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.25);
    }
    &-title {
      font-size: 20px;
      font-weight: 600;
      line-height: 1.5;
      margin-bottom: 32px;
    }
    &-wrapper {
      display: flex;
      flex-direction: column;
    }
    &-row {
      display: flex;
    }
    &-separator {
      margin-top: 40px;
      margin-bottom: 40px;
      border-top: 1px solid #E2E2E2;
    }
    &-backpack {
      width: 131px;
      margin-right: 40px;
      img {
        filter: drop-shadow( 0px 3px 6px rgba(0, 0, 0, 0.203922));
      }
    }
    &-table {
      display: flex;
      flex-direction: column;
      &-row {
        display: flex;
        margin-bottom: 20px;
      }
      &-field {
        width: 150px;
        font-size: 16px;
        font-weight: 500;
        line-height: 1.5;
        color: #9B9B9B;
      }
      &-value {
        font-size: 18px;
        font-weight: 600;
        line-height: 1.5;
        color: #484848;
      }
    }
  }
  &-sent-status {
    vertical-align: middle;
    margin-left: 12px;
    width: 24px;
    height: 24px;
  }
}
</style>
