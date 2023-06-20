export default async (context, locale) => {
  if (context.$axios) {
    const response = await context.$axios.$get('/i18n/en')
    console.log(response.content)
  }
  return await Promise.resolve({
    commonWords: {
      conjunctionText: 'or',
      prepositionText: 'with',
      upload: 'UPLOAD',
      return1: 'GO BACK',
      emailPlaceholder: 'Email',
      passwordPlaceholder: 'Password',
      firstName: 'First Name',
      lastName: 'Last Name',
      fullName: 'Full Name',
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
      planPrice: 'Plan and price'
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
      subtitle2: 'NO CREDIT CARD REQUIRED!',
      registerForm: {
        firstName: 'First Name',
        lastName: 'Last Name',
        optionalPhoneNumber: 'Phone Number (optional)',
        email: 'Email',
        address: 'Address',
        password: 'Password',
        passwordSuggestion1: 'At least 6 characters—the more characters, the better.',
        passwordSuggestion2: 'A mixture of both uppercase and lowercase letters.',
        passwordSuggestion3: 'A mixture of letters and numbers.',
        passwordSuggestion4: 'Inclusion of at least one special character, e.g., !@#?]',
        coupon: 'Coupon',
        validCoupon: 'Valid coupon!',
        invalidCoupon: 'Invalid Coupon!',
        termsAndConditionsPart1: 'I agree to the',
        termsAndConditionsPart2: 'Terms & Conditions',
        choosePlan: 'CHOOSE YOUR PLAN',
        registerWithFb: 'Continue with Facebook',
        registerWithGoogle: 'Continue with Google'
      },
      cardInfo: {
        title: 'It\'s the easiest way to give your child an immersive education at home!',
        subtitle: 'Engaged children and proven outcomes!'
      }
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
    dailyLessons: {
      downloadWorksheetDay: 'DOWNLOAD WORKSHEET OF THE DAY!',
      worksheet: 'Worksheet',
      worksheetPlural: 'Worksheets',
      panel: {
        previousDay: 'GO TO PREVIOUS DAY',
        nextDay: 'GO TO NEXT DAY',
        downloadWorksheets1: 'DOWNLOAD LETTER',
        downloadWorksheets2: 'WEEK WORKSHEETS',
        winPuzzlePiece: 'Win a puzzle piece!',
        earnedPuzzlePiece: 'You earned a puzzle piece',
        videoTitle: 'Video Lessons',
        worksheetTitle: 'Worksheets',
        activitiesTitle: 'Activities',
        uploadWorksheet: 'UPLOAD WORKSHEET',
        uploadWorksheetSubtitle: 'File(s) must be in JPG or PNG format',
        downloadWorksheet: 'DOWNLOAD WORKSHEET',
        viewWorksheets: 'View worksheets'
      },
      uploadWorksheetDialog: {
        title: ' UPLOAD YOUR WORKSHEET',
        requirement1: '* File(s) must be in',
        requirement2: 'format only.',
        success: 'UPLOAD SUCCESSFUL!',
        uploadMore: 'UPLOAD MORE',
        dragAndDrop: 'DRAG AND DROP YOUR DOCUMENTS OR UPLOAD MORE',
        drag: 'DRAG YOUR WORKSHEET',
        browse: 'BROWSE FILES',
        return: 'Return to lesson'
      },
      onlineWorksheet: {
        title: 'Online Worksheet'
      }
    }
  })
}
