export default async (context, locale) => {
  if (context.$axios) {
    const response = await context.$axios.$get('/i18n/en')
    console.log(response.content)
  }
  return await Promise.resolve({
    commonWords: {
      conjunctionText: 'or',
      prepositionText: 'with',
      letter: 'Letter',
      day: 'DAY',
      progress: 'PROGRESS',
      view: 'View',
      puzzle: 'Puzzle',
      upload: 'UPLOAD',
      return1: 'GO BACK',
      return2: 'Go back',
      returnToLesson: 'Return to lesson',
      skip: 'Skip for now',
      continue: 'Continue',
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
    },
    lessonEnd: {
      title: 'We can\'t wait to see you tomorrow!',
      emailText1: 'Want to receive an email with all of the things you did today?',
      emailText2: 'Click here to update your Email Notification Settings.',
      overlay: {
        title: 'You\'ve completed your first day of video lessons.',
        subtitle: 'Join us in our next live class!',
        footer: 'For more daily learning, check out our other features:',
        sectionTitle: 'Worksheet',
        sectionDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor '
      },
      todayCard: {
        title1: 'Sorry!',
        title2: 'This class has been cancelled today. See you next time!'
      },
      meetingCard: {
        button: 'GO TO LIVE CLASSES SCHEDULE'
      }
    },
    dailyLessons: {
      downloadWorksheetDay: 'DOWNLOAD WORKSHEET OF THE DAY!',
      worksheet: 'Worksheet',
      worksheetPlural: 'Worksheets',
      panel: {
        previousDay: 'GO TO PREVIOUS DAY',
        nextDay: 'GO TO NEXT DAY',
        nextDay1: 'Go to next day',
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
        browse: 'BROWSE FILES'
      },
      onlineWorksheet: {
        title: 'Online Worksheet',
        titleUppercase: 'ONLINE WORKSHEET',
        coming: 'Coming next!',
        handsOn1: 'HANDS-ON LEARNING',
        handsOn2: 'is a crucial part of the educational experience. Learning through doing strengthens the cognitive connections and builds a strong foundation for knowledge.',
        button1: 'TEACHERS VIDEO',
        button2: 'DOWNLOAD WORKSHEET',
        button3: 'UPLOAD WORKSHEET',
        button4: 'UPLOAD COMPLETED WORKSHEET',
        messageDialog1: 'GREAT JOB!',
        messageDialog2: 'OOPS!',
        complete: 'Complete the Online Worksheets, and get a new Puzzle Piece!'
      },
      offlineWorksheet: {
        title: 'Watch the Worksheet Video',
        subtitle: 'Complete your hands-on worksheets with a Playgarden Prep teacher!',
        alternativeTitle: 'Hands-on Learning',
        alternativeSubtitle: 'Hands-on learning is a crucial part of the educational experience. Learning through doing strengthens the cognitive connections and builds a strong foundation for knowledge.',
        question: 'What do you want to do next?',
        download1: 'DOWNLOAD WORKSHEET',
        download2: 'DOWNLOAD HANDS-ON WORKSHEET',
        upload1: 'UPLOAD WORKSHEET',
        upload2: 'UPLOAD COMPLETED WORKSHEET',
        correctAnswer: 'is the correct answer!',
        nextWord: 'Next Word'
      },
      scheduledFinished: {
        description1: 'Don\'t forget to join us in our next live class.',
        description2: 'They are a great complement to the video lessons!',
        subtitle: 'If the schedule doesn\'t work for you, check out the recommended videos in the Library!',
        librarySubtitle: 'Come read with us in the book nook!',
        nextDay: 'Go to next day'
      },
      childSelect: {
        placeholder: 'Select a child',
        onPlaydate: 'Already on a Playdate',
        management: 'Manage Student Profiles'
      },
      unlockPrompt: {
        title: 'DAILY LESSONS',
        description: 'Upgrade your plan to have access to daily lessons with your favorite playgarden prep teachers',
        unlock: 'To unlock',
        upgrade: 'Upgrade your Plan'
      },
      carouselLetter: {
        placeholder: 'Browse by letter'
      },
      puzzles: {
        title: 'PUZZLE LETTER',
        description: 'Look at all the pieces you\'ve got! Keep going to earn a printable coloring page.',
        congratulations: 'CONGRATULATIONS!',
        getPuzzlePiece: 'GET A PUZZLE PIECE!',
        earned: 'You earned a puzzle piece',
        watch1: 'Watch',
        watch2: 'in a row'
      },
      lessonCompleted: {
        congratulations: 'Congratulations!',
        subtitle1: 'You\'ve completed the',
        subtitle2: 'day of video lessons!',
        first: 'first',
        second: 'second',
        third: 'third',
        fourth: 'fourth',
        fifth: 'fifth',
        card1: 'Online Worksheets',
        card2: 'Print Worksheets',
        card3: 'Activities',
        footer: 'Remember that in order to continue to the next lesson, you must complete the online worksheets, video activities and worksheets of this lesson.'
      },
      letterSelect: {
        nature: 'Nature',
        welcome: 'Welcome'
      }
    }
  })
}
