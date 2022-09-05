<template>
  <v-app>
    <template v-if="showContent">
      <coming-soon-player />

      <!-- APP MAV & BAR -->
      <app-navigation />

      <application-header />

      <!-- NOTIFICATION CARD -->
      <notification-card />

      <!-- SHIPPING NOTIFICATION MODAL -->
      <shipping-address-modal />

      <!-- TRIAL EXPIRED MODAL -->
      <trial-expired-modal v-if="isUserLoggedIn" />
      <trial-ending-week-two-modal />
      <trial-ending-week-three-modal />
      <trial-ending-week-four-modal />
      <trial-ending-plan-selected />
      <credit-card-form />
      <PlanUpgradeModal v-if="isUserLoggedIn" />
      <TrialEndingModalForLastDay />
      <CanceledTrialModal />

      <!-- CONTACT US FORM MODAL -->
      <contact-us-form-modal />

      <!-- NOTIFICATION SIGNUP -->
      <notification-signup-modal />

      <!-- CHANGE PASSWORD ON FIRST LOGIN -->
      <change-password-modal />
      <email-conflict-modal />
      <account-inactive-modal />

      <!-- CONTENT -->
      <v-main v-if="!isFullWidth">
        <v-container class="pa-md-3 pa-0" fill-height>
          <nuxt />
        </v-container>
      </v-main>

      <v-container v-else fluid class="pa-0 fill-height">
        <nuxt />
      </v-container>

      <!-- FOOTER -->
      <default-footer />

      <!-- TRIAL EXPIRING RIBBON -->
      <trial-is-expiring v-if="isTrialExpiringRibbonVisible" />

      <notify-event />

      <prompt-dialog />

      <coming-soon-dialog :showing="isComingSoonDialogOpen" />
    </template>

    <template v-else>
      <v-main>
        <v-container fill-height fluid>
          <pg-loading />
        </v-container>
      </v-main>
    </template>
  </v-app>
</template>

<script>
import { defineComponent, useRoute, useStore, useMeta } from '@nuxtjs/composition-api'
import { computed, onMounted, ref, watch } from '@vue/composition-api'

import ApplicationHeader from '@/components/app/header/ApplicationHeader.vue'
import AppNavigation from '@/components/app/header/AppNavigation.vue'
import ComingSoonDialog from '@/components/app/ComingSoonDialog.vue'
import ComingSoonPlayer from '@/components/app/ComingSoonPlayer.vue'
import DefaultFooter from '@/components/app/footer/DefaultFooter.vue'
import NotificationCard from '@/components/app/notifications/NotificationCard.vue'
import ShippingAddressModal from '@/components/app/payment/ShippingAddressModal.vue'
import TrialExpiredModal from '@/components/app/payment/TrialExpiredModal.vue'
import TrialEndingWeekTwoModal from '@/components/app/payment/TrialEnding/WeekTwoModal.vue'
import TrialEndingWeekThreeModal from '@/components/app/payment/TrialEnding/WeekThreeModal.vue'
import TrialEndingWeekFourModal from '@/components/app/payment/TrialEnding/WeekFourModal.vue'
import TrialIsExpiring from '@/components/app/header/TrialIsExpiring.vue'
import ContactUsFormModal from '@/components/forms/contact/ContactUsFormModal.vue'
import NotificationSignupModal from '@/components/app/notifications/NotificationSignupModal.vue'
import ChangePasswordModal from '@/components/app/notifications/ChangePasswordModal.vue'
import TrialEndingModalForLastDay from '@/components/app/payment/TrialEnding/TrialEndingModalForLastDay.vue'
import PlanUpgradeModal from '@/components/app/payment/TrialEnding/PlanUpgradeModal/index.vue'

import {
  useAuth,
  useLayout,
  useNotification,
  useVuetifyHelper
} from '@/composables'

export default defineComponent({
  middleware: ['utmHandler'],

  components: {
    ApplicationHeader,
    AppNavigation,
    ComingSoonDialog,
    ComingSoonPlayer,
    DefaultFooter,
    NotificationCard,
    ShippingAddressModal,
    TrialExpiredModal,
    TrialIsExpiring,
    ContactUsFormModal,
    NotificationSignupModal,
    ChangePasswordModal,
    TrialEndingModalForLastDay,
    TrialEndingWeekTwoModal,
    TrialEndingWeekThreeModal,
    TrialEndingWeekFourModal,
    PlanUpgradeModal,
    TrialEndingPlanSelected: () =>
      import('@/components/app/payment/TrialEnding/PlanSelected.vue'),
    CreditCardForm: () =>
      import('@/components/app/payment/TrialEnding/CreditCardForm.vue'),
    EmailConflictModal: () =>
      import('@/components/app/register/EmailConflictModal.vue'),
    AccountInactiveModal: () =>
      import('@/components/app/register/AccountInactiveModal.vue'),
    CanceledTrialModal: () =>
      import('@/components/app/payment/CanceledTrialModal.vue')
  },

  head: {},

  setup() {
    const faqQuestions = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [{
        '@type': 'Question',
        name: 'What is Playgarden Prep\'s Online Preschool?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '<p>Playgarden Prep\'s online preschool is a premier online preschool program offering children 2-4 years old a private preschool experience at home! The Online Preschool program offers a private preschool curriculum, lessons with certified teachers, hands-on learning tools, and a daily learning schedule. You can sign up for your free trial <a href="https://playgardenonline.com/school/auth/normal/parent">here</a>.</p>'
        }
      }, {
        '@type': 'Question',
        name: 'What age range is this program best suited for?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '<p>While our program is ideal for children aged two and up, little ones under two may still be able to follow along with our video lessons and worksheets. Because our memberships can be used for the whole family, younger siblings can benefit from seeing their older siblings at work. If you find that the Daily Lessons are too advanced, you can also try introducing your little one to our KidsCorner, which is full of funny educational videos for hours of Edu-tainment! At our in-person NYC preschools, children as old as 4 have benefited from Playgarden Prep\'s custom curriculum, and we look forward to providing advanced content worksheets in the near future to make our program even more useful for older children.</p>'
        }
      }, {
        '@type': 'Question',
        name: 'Is an online preschool as effective as a regular preschool?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '<p>Absolutely! Playgarden Prep’s online preschool follows the same curriculum as our elite and award winning preschools in New York City. Your little one will learn from the same teachers that teach at our in-person schools, using the same worksheets and educational tools. With technology, our goal is to make sure that children can have access to a real, effective learning experience at home. Check out some of our <a href="https://playgardenonline.com/testimonials/">parent testimonials</a> that highlight how well their children are doing while learning with Playgarden Prep Online!</p>'
        }
      }, {
        '@type': 'Question',
        name: 'What is the program length and daily schedule?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '<p>If you complete your Daily Lessons consistently each week (while accommodating typical school year breaks, such as Winter and Spring breaks), the program will last for a full 9-month school year–though you are always welcome to take it at the best pace for your little one! Because our Daily Lessons are pre-recorded, they can be completed at any time of year. Additionally, we offer our Live Zoom classes year-round for a whole year of learning! The days can be as long or short as you want! You can get a full day of online preschool learning from 9AM-12PM if your little one does their Daily Lessons, Worksheets, Activities, and more! We also offer our Live Classes throughout the day, and you can visit our Video and Music Libraries at any time for an all-day educational experience!</p>'
        }
      }, {
        '@type': 'Question',
        name: 'Can I start online preschool anytime, anywhere?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '<p>Absolutely! Our program has been developed so that you can start it when it\'s most convenient for your family. Your little one will get started with their first day of class on our platform, and will continue to learn and grow as they progress through the program. Our virtual preschool live classes are meant to complement the daily learning from our lesson videos and worksheets, and to provide a place for little ones to socialize and interact with their teachers. You can access Playgarden Prep’s online preschool program from any desktop, tablet, or smartphone device— anywhere in the world! We are also working to make our lesson videos available for download, so that you can watch them even without a Wifi connection!</p>'
        }
      }, {
        '@type': 'Question',
        name: 'Do I need to accompany my child during online preschool?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '<p>While we do suggest that an adult supervise your child while they watch our videos, we have developed the platform so that a child can watch unattended if you need to take a short break. You may find that your little one will need more supervision if they are younger, and less supervision if they are older. </p>'
        }
      }, {
        '@type': 'Question',
        name: 'What if my child doesn\'t like going to preschool online?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '<p>Our online curriculum is the same as the curriculum we use at our in-person locations in New York City, where we\'ve been the first preschool experience for children 2, 3 and 4 years old for over ten years. We know it takes time getting used to new things, so we\'ve created a gradual and fun introduction to our program. Your little one will love and look forward to attending preschool online by the end of your 15 day trial! You can sign up for your free trial <a href="https://playgardenonline.com/school/auth/normal/parent">here</a>.</p>'
        }
      }, {
        '@type': 'Question',
        name: 'What is the difference in educational content between your online preschool and in-person preschool?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '<p>When you sign up for Playgarden Prep\'s online preschool, you will have access to up to 1.5 hours of educational content every day, 5 days a week. This is about the same educational content that you get in a regular day of preschool! Our In-person preschool includes checking in, getting to the classroom, getting ready for class, lunch break, naps, getting ready to go home, and check out—all of which take a lot of time for children ages 2-5.</p>'
        }
      }, {
        '@type': 'Question',
        name: 'Can you actually do Montessori preschool online?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '<p>Yes—We make sure that our online preschool materials follow the Montessori Curriculum. While there may be some hurdles to jump over, we do our best to modify Montessori-based lessons for an online setting; additionally, we suggest Montessori materials that compliment our lessons, and can help you to set up a Montessori workspace to create a proper learning experience!</p>'
        }
      }, {
        '@type': 'Question',
        name: 'Does my child get a certificate for completing the online preschool program?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '<p>Absolutely! We love celebrating accomplishments. Our workbooks provide Diplomas for every letter learned and every month of work completed. We also provide a Certificate for having completed the whole school year of preschool online, using the uploaded worksheets and progress reports from your Student Cubby as evidence of your little one\'s hard work.</p>'
        }
      }
      ]
    }

    useMeta({ script: [{ innerHTML: JSON.stringify(faqQuestions), type: 'application/ld+json' }] })

    const isComingSoonDialogOpen = ref(false)

    const store = useStore()
    const route = useRoute()
    const vuetify = useVuetifyHelper()

    const {
      isTrialExpiringRibbonVisible,
      checkIfShouldSendShippingAddressNotification,
      checkIfShouldShowTrialExpiringRibbon,
      checkIfShouldShowTrialExpiredModal,
      handleTrialEndingFlow
    } = useNotification({ store })

    const { showContent, setShowContent, isFullWidth } = useLayout({
      store,
      route,
      vuetify
    })

    const { isUserLoggedIn, isUserEmailVerified } = useAuth({ store })

    const routeName = computed(() => route.value.name)

    watch(routeName, async () => {
      if (routeName.value !== 'app-payment-plan') {
        await checkIfShouldShowTrialExpiredModal()
      }
    })

    onMounted(() => {
      watch(
        isUserLoggedIn,
        async () => {
          if (routeName.value !== 'shared-slug' && isUserLoggedIn.value) {
            await checkIfShouldSendShippingAddressNotification()
            await checkIfShouldShowTrialExpiredModal()
            await checkIfShouldShowTrialExpiringRibbon()
            await handleTrialEndingFlow()
          }
        },
        { immediate: true }
      )

      setShowContent(true)
    })

    const isMobile = computed(() => vuetify.breakpoint.mobile)

    return {
      isComingSoonDialogOpen,
      isTrialExpiringRibbonVisible,
      showContent,
      setShowContent,
      isUserLoggedIn,
      isUserEmailVerified,
      isFullWidth,
      isMobile
    }
  }
})
</script>

<style lang="scss" scoped>
.v-application ::v-deep {
  .container:not(.container--fluid) {
    max-width: 1200px;
  }
  .v-text-field .v-input__control .v-input__slot {
    box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.16) !important;
  }
  .pg-letter-spacing {
    letter-spacing: 6.75px !important;
  }
}
</style>
