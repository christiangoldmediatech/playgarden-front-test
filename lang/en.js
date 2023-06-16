export default async (context, locale) => {
  if (context.$axios) {
    const response = await context.$axios.$get('/i18n/en')
    console.log(response.content)
  }
  return await Promise.resolve({
    commonWords: {
      conjunctionText: 'or',
      emailPlaceholder: 'Email',
      passwordPlaceholder: 'Password',
      firstName: 'First Name',
      lastName: 'Last Name',
      fullName: 'Full Name',
      birthDate: 'Birth Date',
      girl: 'Girl',
      boy: 'Boy',
      phoneNumber: 'Phone Number',
      viewMore: 'View more',
      date: 'Date',
      price: 'Price',
      edit: 'Edit',
      password: 'Password',
      newPassword: 'New Password',
      passwordConfirmation: 'Password Confirmation',
      save: 'Save',
      cancel: 'Cancel',
      changePassword: 'Change Password',
      browseByLetter: 'Browse by letter',
      apply: 'Apply',
      planPrice: 'Plan and price',
      onlinePreschool: 'ONLINE PRESCHOOL',
      backButton: 'Back'
    },
    menuLandingPage: {
      home: 'Home',
      admissions: 'Admissions',
      virtualPreschool: 'Virtual Preschool',
      enrollmentPlans: 'Enrollment Plans',
      parentTestimonials: 'Parent Testimonials',
      groupSolutions: 'Group Solutions',
      englishASL: 'English as a Second Language',
      resources: 'Resources',
      howItWorks: 'How It Works',
      blog: 'Blog',
      specializedLearning: 'Specialized Learning',
      doItYourself: 'Do It Yourself',
      aboutUs: 'About Us',
      faqs: 'FAQs',
      yourTeachers: 'Your Teachers',
      community: 'Community',
      login: 'Log In',
      tryForFree: 'TRY FOR FREE',
      goToPreschool: 'Go to Preschool'
    },
    login: {
      title: 'Welcome back!',
      backBtnText: 'Go Back To Homepage',
      loginBtn: 'LOGIN',
      loginWithFb: 'Login with Facebook',
      loginWithGoogle: 'Login with Google',
      forgotPassword: 'Forgot password?',
      invitationText: 'New to Playgarden Prep Online?',
      signUpInvitation: 'SIGN UP NOW!',
      signUp: 'SIGN UP NOW',
      callNowTextPart1: 'Call Now',
      callNowTextPart2: ' to speak with a specialist'
    },
    register: {
      title: 'CREATE AN ACCOUNT TO START LEARNING!',
      subtitle1: 'Are you excited for a fun-filled day of learning?',
      subtitle2: 'NO CREDIT CARD REQUIRED!'
    },
    account: {
      title: 'My Account',
      menu: {
        general: 'General',
        personalInformation: 'Personal Information',
        studentProfile: 'Student Profile',
        membership: 'Membership',
        caregivers: 'Caregivers',
        notifications: 'Notifications',
        logout: 'Logout'
      },
      general: {
        title: 'General Info',
        subtitle: 'Manage your personal information.',
        syncFacebook: 'Sync your Facebook Account',
        syncGoogle: 'Sync your Google Account',
        connectedFacebook: 'Your account is synced with Facebook',
        connectedGoogle: 'Your account is synced with Google'
      },
      shipping: {
        title: 'Shipping Address',
        subtitle: 'We use this information to send you Playgarden Prep educational materials.',
        street: 'Street',
        address: 'Address',
        city: 'City',
        country: 'Country',
        state: 'State',
        zip: 'Zip Code',
        message: 'Please enter your shipping address.',
        addAddress: 'Add Address',
        apt: 'Apt, Suite, PO BOX (optional)'
      },
      student: {
        title: 'Student Profile',
        subtitle: 'In this section you can edit the Child’s information or add a new Child.',
        birthDate: 'Date of birth:',
        gender: 'Gender:',
        addChild: 'Add Child',
        currentLetter: 'Current letter:',
        currentDay: 'Current day:',
        deleteChild: 'Delete child',
        changeIcon: 'Change icon:',
        viewCurrentLetter: 'View letter progress',
        viewProgressReport: 'View progress report',
        timeline: '\'s timeline'
      },
      caregivers: {
        title: 'Caregivers',
        subtitle: 'Give access to your child’s caregiver!',
        description: 'Give access to your child’s caregiver!',
        addCaregiver: 'Add caregiver',
        addNewCaregiver: 'Add new caregiver',
        sendInvitation: 'Send invites',
        deleteCaregiver: 'Delete caregiver',
        pending: 'Pending invites sent',
        pendingDescription: 'You don´t have any pending invites'
      },
      membership: {
        title: 'Membership',
        subtitle: 'Information about your membership',
        nextBilling: 'Your next billing date is:',
        monthly: 'monthly',
        yearly: 'yearly',
        feeDescription: 'Your %{type} membership fee is:',
        plan: 'Your plan is:',
        billing: 'Billing history',
        payment: 'Payment method',
        changePayment: 'Change payment method',
        addCoupon: 'Add coupon code',
        couponPlaceholder: 'Promotion code',
        couponNote: '*Note that you may only use one promotion code at a time; adding a new promo code will remove any currently-active coupons that were previously applied.',
        billingHistory: 'Billing history',
        viewBillingHistory: 'View your billing history',
        viewInvoice: 'View invoice',
        changePlan: 'Change plan',
        changePlanDescription: 'Change your plan whenever you want',
        cancelMembership: 'Cancel membership'
      },
      notifications: {
        title: 'Notifications',
        subtitle: 'Manage the notifications you want to receive'
      }
    },
    payment: {
      title: 'CREDIT CARD INFORMATION',
      description: 'FOR THE SAFETY OF OUR STUDENTS DURING THE LIVE CLASSES, WE NEED TO VERIFY WHO YOU ARE. Please add a credit card to your account. YOU WILL NOT BE CHARGED. Playgarden only charges when your trial has ended and you have confirmed your plan.',
      footer1: 'Playgarden Prep Online is COMPLETELY FREE for the next 15 days.',
      footer2: 'YOU CAN CANCEL YOUR TRIAL ANY TIME',
      footer3: 'You can easily cancel your trial or membership at any time from your Account Settings. Once your free trial ends, you will be placed on the',
      footer4: 'monthly plan; your provided payment information will be automatically charged, and your first billing cycle will begin. You can change plans at any time from your Account Settings. For assistance, contact',
      button1: 'REACTIVATE ACCOUNT',
      button2: 'START LEARNING NOW',
      card: {
        title: 'Join thousands of happy families that have graduated from Playgarden Prep',
        subtitle: 'Still not sure? Call, text, or email us with your questions, and a member of our teacher team will get back to you with more information.',
        teacherTitle: 'Reach out to speak with a teacher like Miss Sarah!',
        phone: '+1 (646) 504-4716 (call/text)'
      },
      cardKnowMore: {
        title: 'Your 15 Day Free Trial Includes:',
        subtitle1: 'WANT TO KNOW MORE ABOUT YOUR',
        subtitle2: 'FREE TRIAL',
        footer: '*You can cancel your membership at any time from the Account Settings.'
      },
      stripe: {
        description1: 'We need your credit card information to confirm your identity',
        description2: ', but you will NOT be charged until your 15 day free trial has ended, unless you choose to end your trial early',
        promotionCode: 'Promotion Code',
        acceptTerms1: 'I have read and accept the',
        acceptTerms2: 'Terms & Conditions',
        cancel: 'CLOSE',
        footer1: 'You can cancel your trial and membership anytime from the account settings. ',
        footer2: 'Once your free trial ends you will be placed on the',
        footer3: ' monthly plan, you can change plans at any time in your profile page.'
      }
    },
    children: {
      title: 'CHILD INFORMATION',
      subtitle: 'Tell us about your little one:',
      button1: 'START LEARNING',
      button2: 'ADD ANOTHER CHILD',
      button3: 'DELETE CHILD PROFILE',
      iconSelector: {
        title1: 'Choose an icon for your child',
        title2: 'Change your child’s icon',
        title3: 'CHOOSE AN ICON FOR YOUR CHILD:'
      }
    },
    welcome: {
      titleDay1: 'Welcome to Playgarden Online!',
      titleDay2: 'Hi, welcome back to Playgarden and your second day of learning',
      titleDay3: 'Hi, welcome back to Playgarden and your third day of learning',
      overlay: {
        title: 'Your free trial has officially begun!',
        subtitle1: '*Cancel any time from your',
        subtitle2: 'Account Settings'
      },
      daysSelector: {
        title: 'One last thing before you get started!',
        subtitle: 'Please tell us how many days a week do you expect to use Playgarden Online',
        daySingular: 'DAY',
        dayPlural: 'DAYS',
        button: 'START FIRST LESSON',
        footer: 'This will help us improve your little one\'s learning experience'
      }
    }
  })
}
