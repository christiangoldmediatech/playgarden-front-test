export default async (context, locale) => {
  if (context.$axios) {
    const response = await context.$axios.$get('/i18n/en')
    console.log(response.content)
  }
  return await Promise.resolve({
    commonWords: {
      conjunctionText: 'or',
      prepositionText: 'with',
      prepositionTextUpper: 'With',
      and: 'AND',
      letter: 'Letter',
      here: 'HERE',
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
      cancelUppercase: 'CANCEL',
      close: 'Close',
      changePassword: 'Change Password',
      browseByLetter: 'Browse by letter',
      apply: 'Apply',
      plan: 'PLAN',
      planPrice: 'Plan and price',
      onlinePreschool: 'ONLINE PRESCHOOL',
      backButton: 'Back',
      activitiesType: {
        art: 'Art',
        cognitive: 'Cognitive',
        language: 'Language',
        math: 'Math',
        movement: 'Movement',
        music: 'Music',
        nutrition: 'Nutrition',
        science: 'Science',
        sensory: 'Sensory',
        songs: 'Songs',
        storytime: 'Storytime',
        theater: 'Theater',
        writing: 'Writing'
      }
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
        passwordSuggestion1:
          'At least 6 characters—the more characters, the better.',
        passwordSuggestion2:
          'A mixture of both uppercase and lowercase letters.',
        passwordSuggestion3: 'A mixture of letters and numbers.',
        passwordSuggestion4:
          'Inclusion of at least one special character, e.g., !@#?]',
        coupon: 'Coupon',
        validCoupon: 'Valid coupon!',
        invalidCoupon: 'Invalid Coupon!',
        termsAndConditionsPart1: 'I agree to the',
        termsAndConditionsPart2: 'Terms & Conditions',
        choosePlan: 'CHOOSE YOUR PLAN',
        startLearning: 'START LEARNING',
        registerWithFb: 'Continue with Facebook',
        registerWithGoogle: 'Continue with Google',
        registerWithLibraryCard: 'Continue with your library card number'
      },
      cardInfo: {
        title:
          'The easiest and most effective way to give your child an immersive education outside of school!',
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
        subtitle:
          'We use this information to send you Playgarden Prep educational materials.',
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
        subtitle:
          'In this section you can edit the Child’s information or add a new Child.',
        birthDate: 'Date of birth:',
        gender: 'Gender:',
        addChild: 'Add Child',
        currentLetter: 'Current letter:',
        currentDay: 'Current day:',
        deleteChild: 'Delete child',
        changeIcon: 'Change icon:',
        viewCurrentLetter: 'View letter progress',
        viewProgressReport: 'View progress report',
        timeline: "'s timeline"
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
        trialPeriod: 'Free trial period ends:',
        couponApplied: 'Coupon applied:',
        couponApplied2: 'Coupon applied!',
        couponDiscount: 'discount on your membership',
        couponValid: 'VALID COUPON',
        couponInvalid: 'INVALID COUPON',
        addOn: 'Add-on',
        learningKits: 'Learning Kits',
        learningKitsDesc: 'Add home delivery of the Learning Kits to any of the Enrollment Plans',
        nextBilling: 'Your next billing date is:',
        monthly: 'monthly',
        yearly: 'yearly',
        biannual: 'by semester',
        feeDescription: 'Your %{type} membership fee is:',
        plan: 'Your plan is:',
        billing: 'Billing history',
        payment: 'Payment method',
        changePayment: 'Change payment method',
        addCoupon: 'Add coupon code',
        couponPlaceholder: 'Promotion code',
        couponNote:
          '*Note that you may only use one promotion code at a time; adding a new promo code will remove any currently-active coupons that were previously applied.',
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
      description:
        'FOR THE SAFETY OF OUR STUDENTS DURING THE LIVE CLASSES, WE NEED TO VERIFY WHO YOU ARE. Please add a credit card to your account. YOU WILL NOT BE CHARGED. Playgarden only charges when your trial has ended and you have confirmed your plan.',
      footer1:
        'Playgarden Prep Online is COMPLETELY FREE for the next 15 days.',
      footer2: 'YOU CAN CANCEL YOUR TRIAL ANY TIME',
      footer3:
        'You can easily cancel your trial or membership at any time from your Account Settings. Once your free trial ends, you will be placed on the',
      footer4:
        'monthly plan; your provided payment information will be automatically charged, and your first billing cycle will begin. You can change plans at any time from your Account Settings. For assistance, contact',
      button1: 'REACTIVATE ACCOUNT',
      button2: 'START LEARNING NOW',
      card: {
        title:
          'Join thousands of happy families that have graduated from Playgarden Prep',
        subtitle:
          'Still not sure? Call, text, or email us with your questions, and a member of our teacher team will get back to you with more information.',
        teacherTitle: 'Reach out to speak with a teacher like Miss Sarah!',
        phone: '+1 (646) 504-4716 (call/text)'
      },
      cardKnowMore: {
        title: 'Your 15 Day Free Trial Includes:',
        subtitle1: 'WANT TO KNOW MORE ABOUT YOUR',
        subtitle2: 'FREE TRIAL',
        footer:
          '*You can cancel your membership at any time from the Account Settings.'
      },
      stripe: {
        description1:
          'We need your credit card information to confirm your identity',
        description2:
          ', but you will NOT be charged until your 15 day free trial has ended, unless you choose to end your trial early',
        promotionCode: 'Promotion Code',
        acceptTerms1: 'I have read and accept the',
        acceptTerms2: 'Terms & Conditions',
        cancel: 'CLOSE',
        footer1:
          'You can cancel your trial and membership anytime from the account settings. ',
        footer2: 'Once your free trial ends you will be placed on the',
        footer3:
          ' monthly plan, you can change plans at any time in your profile page.'
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
      titleDay2:
        'Hi, welcome back to Playgarden and your second day of learning',
      titleDay3:
        'Hi, welcome back to Playgarden and your third day of learning',
      overlay: {
        title: 'Your free trial has officially begun!',
        subtitle1: '*Cancel any time from your',
        subtitle2: 'Account Settings'
      },
      daysSelector: {
        title: 'One last thing before you get started!',
        subtitle:
          'Please tell us how many days a week do you expect to use Playgarden Online',
        daySingular: 'DAY',
        dayPlural: 'DAYS',
        button: 'START FIRST LESSON',
        footer:
          "This will help us improve your little one's learning experience"
      }
    },
    lessonEnd: {
      title: "We can't wait to see you tomorrow!",
      emailText1:
        'Want to receive an email with all of the things you did today?',
      emailText2: 'Click here to update your Email Notification Settings.',
      overlay: {
        congratulations: 'Congratulations!',
        title: "You've completed your first day of video lessons.",
        title1stDay: "You've completed your first day of video lessons.",
        title2ndDay: "You've completed the second day of video lessons.",
        title3rdDay: "You've completed the third day of video lessons.",
        subtitle1: 'If you still want more learning today you can:',
        subtitle2: 'Join us in our next live class!',
        subtitle3: 'For more daily learning, check out our other features:',
        sectionTitle: 'Worksheet',
        sectionWorksheet: 'Worksheet',
        sectionOnlineWorksheet: 'Online Worksheet',
        goToLibrary: 'Go to Library',
        goToOnlineWorksheets: 'Go to Online Worksheets',
        downloadWorksheet: 'Download worksheet of the day!',
        exploreLibrary: 'Explore our Library, to create playlists and watch your favorite videos to engage little learners!',
        watchVideoAgain: 'Watch video again',
        sectionDescription:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor '
      },
      todayCard: {
        title1: 'Sorry!',
        title2: 'This class has been cancelled today. See you next time!'
      },
      meetingCard: {
        button: 'GO TO LIVE CLASSES SCHEDULE'
      }
    },
    studentCubby: {
      puzzle: {
        text: 'PUZZLE',
        title: 'STUDENT CUBBY',
        content:
          "Find all of %{childName} completed puzzles here. Once completed, you can print out your puzzles as coloring sheets. Collect them all! You can share your completed puzzles on Instagram <strong>@PlaygardenPrep</strong>. We can't wait to see yours!",
        viewPuzzle: 'View Puzzle',
        viewProgress: 'View Progress',
        unlockText:
          "Find all of your children completed puzzles. Once completed, you can print out your puzzles as coloring sheets. Collect them all! You can share your completed puzzles on Instagram @PlaygardenPrep. We can't wait to see yours!",
        piecesDesc:
          "Look at all the pieces you've got! Keep going to earn a printable coloring page.",
        progress: 'PROGRESS',
        puzzleLetter: 'PUZZLE LETTER %{letter}',
        unlockIntro: 'Unlock This in ',
        videoUnlock: 'Video Letter %{letter} Day %{day}',
        worksheetUnlock: 'Worksheet Letter %{letter} Day %{day}',
        activitiesUnlock: 'Activities Letter %{letter} Day %{day}'
      },
      patches: {
        text: 'PATCHES',
        title: 'Earn Activity Patches for learning',
        content: 'Master subjects to collect patches for your Student Cubby!',
        unlockText:
          'Master subjects in the Activities section to collect patches for your Student Cubby! Collect all badges to receive a real patch for your backpack.',
        unlockShort: 'Unlock',
        unlockLong: 'Unlock This Patch'
      },
      curriculum: {
        text: 'CURRICULUM',
        title: 'Review all Curriculum',
        download: 'DOWNLOAD LETTER %{letter} WEEK WORKSHEETS',
        downloading: 'GETTING DOCUMENT...',
        content: 'Scroll through to review your lessons and worksheets!',
        unlockText: 'Scroll through to review your lessons and worksheets!'
      },
      portfolio: {
        text: 'PORTFOLIO',
        title: 'PORTFOLIO',
        content: 'Keep track of your worksheets and progress!',
        letter: 'Letter',
        upload: 'UPLOAD WORKSHEET',
        verifying: 'VERIFYING LESSON'
      },
      progressReport: {
        text: 'PROGRESS REPORT',
        title: 'Student progress report',
        content:
          ' Playgarden Prep Online Lessons have been developed to support one or more of the core areas of development. After watching a video, doing the worksheet together with an adult, or actively participating in a Live Class, parents will be helping in the development of their child in each of the specific areas.',
        unlockText:
          'Playgarden Prep Online Lessons have been developed to support one or more of the core areas of development. After watching a video, doing the worksheet together with an adult, or actively participating in a Live Class, parents will be helping in the development of their child in each of the specific areas.',
        generalProgress: 'General Progress',
        lettersProgress: 'Letters Progress',
        areaOfStrength: 'Area of Strength',
        ageAppropriate: 'Age Appropriate',
        progressing: 'Progressing',
        cognitive: 'Cognitive',
        languageAndLiteracy: 'Language & Literacy',
        physical: 'Physical',
        socialEmotional: 'Social and Emotional',
        dailyLessons: 'Daily Lessons Attended',
        videosCompled: 'Videos Completed',
        activitiesCompleted: 'Activities Completed',
        onlineWorksheet: 'Online Worksheets',
        worksheetsUploaded: 'Worksheets Uploaded'
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
        handsOn2:
          'is a crucial part of the educational experience. Learning through doing strengthens the cognitive connections and builds a strong foundation for knowledge.',
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
        subtitle:
          'Complete your hands-on worksheets with a Playgarden Prep teacher!',
        alternativeTitle: 'Hands-on Learning',
        alternativeSubtitle:
          'Hands-on learning is a crucial part of the educational experience. Learning through doing strengthens the cognitive connections and builds a strong foundation for knowledge.',
        question: 'What do you want to do next?',
        download1: 'DOWNLOAD WORKSHEET',
        download2: 'DOWNLOAD HANDS-ON WORKSHEET',
        upload1: 'UPLOAD WORKSHEET',
        upload2: 'UPLOAD COMPLETED WORKSHEET',
        correctAnswer: 'is the correct answer!',
        nextWord: 'Next Word'
      },
      scheduledFinished: {
        description1: "Don't forget to join us in our next live class.",
        description2: 'They are a great complement to the video lessons!',
        subtitle:
          "If the schedule doesn't work for you, check out the recommended videos in the Library!",
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
        description:
          'Upgrade your plan to have access to daily lessons with your favorite playgarden prep teachers',
        unlock: 'To unlock',
        upgrade: 'Upgrade your Plan'
      },
      carouselLetter: {
        placeholder: 'Browse by letter'
      },
      puzzles: {
        title: 'PUZZLE LETTER',
        description:
          "Look at all the pieces you've got! Keep going to earn a printable coloring page.",
        congratulations: 'CONGRATULATIONS!',
        getPuzzlePiece: 'GET A PUZZLE PIECE!',
        earned: 'You earned a puzzle piece',
        watch1: 'Watch',
        watch2: 'in a row'
      },
      lessonCompleted: {
        congratulations: 'Congratulations!',
        subtitle1: "You've completed the",
        subtitle2: 'day of video lessons!',
        first: 'first',
        second: 'second',
        third: 'third',
        fourth: 'fourth',
        fifth: 'fifth',
        card1: 'Online Worksheets',
        card2: 'Print Worksheets',
        card3: 'Activities',
        footer:
          'Remember that in order to continue to the next lesson, you must complete the online worksheets, video activities and worksheets of this lesson.'
      },
      letterSelect: {
        nature: 'Nature',
        welcome: 'Welcome'
      }
    },
    liveClasses: {
      day: 'Day',
      week: 'Week',
      timezone1: '*Hours are in',
      timezone2: ', you can change your time zone by clicking',
      schedule: 'Live Classes Schedule',
      placeholder:
        'There are no live classes programmed for this week. Check back later.',
      access: 'Get access to Live Classes',
      upgrade: 'Upgrade your plan',
      compare: 'COMPARE PLANS',
      timezone: 'TIMEZONE',
      timezoneLowercase: 'Timezone',
      unlockPrompt: {
        title: 'LIVE CLASSES',
        description: 'Unlock the live classes section'
      },
      days: {
        sunday: 'Sunday',
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday'
      },
      months: {
        january: 'January',
        february: 'February',
        march: 'March',
        april: 'April',
        may: 'May',
        june: 'June',
        july: 'July',
        august: 'August',
        september: 'September',
        october: 'October',
        november: 'November',
        december: 'December'
      },
      entryDialog: {
        description: 'Description',
        download1: 'Download Ingredient List',
        download2: 'Download Additional Information',
        recommendedAges: 'Recommended ages',
        spots: 'Spots:',
        fullClass: 'Oops! This class is full. We hope to see you next time!',
        whoIsGoing: 'Who is going?',
        by: 'By:',
        watchRecorded: 'Watch recorded class',
        reserve: 'RESERVE SPOT',
        unlock: 'UNLOCK THIS SECTION WITH',
        cancel: 'Cancel Spot',
        open: 'OPEN ZOOM LINK',
        addToCalendar: 'Add to calendar'
      },
      sessionsTable: {
        noLiveClasses: 'There are no live classes programmed for this day.'
      },
      tableEntry: {
        live: 'Live',
        cancelled1: 'Sorry!',
        cancelled2: 'This class has been cancelled today. See you next time!',
        toUnlock: 'To unlock',
        upgrade: 'Upgrade your Plan'
      },
      todayCardPanel: {
        filter: 'Filter by',
        allClasses: 'All classes',
        liveClasses: 'Live Classes',
        playdates: 'Playdates',
        myPlaydates: 'My playdates',
        nextClasses: 'Next Classes',
        pending1: 'There are no pending events',
        pending2: 'for you',
        pending3: 'this week.'
      }
    },
    videoLibrary: {
      library: 'Library',
      start: 'Start!',
      columnA: 'Browse by Letters',
      columnB: 'Browse by Category',
      patchEarned: {
        congratulations: 'Congratulations!',
        watch1: 'You have watched',
        watch2: 'Activities and earned a NEW patch!',
        keepWatching:
          'Keep watching videos to master the category and earn more patches.',
        nextText: 'What do you want to do next?',
        nextVideo: 'Next video',
        goNextVideo: 'Go to next video',
        goPatches: 'Go to Patches',
        returnText1: 'Return to Library',
        returnText2: 'Return to Lesson'
      },
      inlinePlayer: {
        columnA: 'Recommended for you',
        columnB: 'More Lessons for You',
        videoOfWeek: 'Video of the week'
      },
      videoCard: {
        viewed: 'Viewed'
      }
    },
    socialEmotional: {
      common: {
        sections: 'Sections',
        videos: 'Videos',
        printables: 'Printables',
        doItTogether: 'Do-It-Together',
        sensoryPlay: 'Sensory Play',
        snackOfTheWeek: 'Snack of the Week',
        book: 'Book',
        playlist: 'Playlist',
        topFive: 'Top five',
        videoLessons: 'Video Lessons',
        moreLikeThis: 'More like this',
        worksheets: 'Worksheets',
        diyProject: 'DIY Project',
        goToProject: 'Go to project',
        downloadPdf: 'Download PDF',
        snack: 'Bocadillo',
        weekReccomendedBooks: "This week's recommended books",
        booksOfTheWeek: 'Books of the week',
        buyNowOn: 'Buy now on'
      }
    },
    music: {
      unlockPrompt: {
        title: 'MUSIC',
        description: 'Unlock the full music library'
      },
      songList: {
        title: 'Song List',
        favorites: 'Favorites',
        placeholder: 'Add your favorite songs here, by clicking on their Heart icons.'
      },
      letterSongs: {
        playing: 'PLAYING',
        addQueue: 'Add to queue',
        addedQueue: 'Added to queue'
      },
      queue: {
        empty: 'Empty queue'
      },
      letterCarousel: {
        placeholder: 'Browse by letter'
      }
    },
    virtualPreschool: {
      header: {
        welcomeMsg: 'Welcome to School',
        welcomeMsgSubtitle: 'Thank you for learning with us today!',
        profile: 'Profile',
        help: 'Help',
        faq: 'FAQ'
      },
      startLearning: 'Start<br/>Learning',
      sections: {
        dashboard: {
          title: 'Daily Lessons',
          message:
            'Learn everyday with personalized, structured video lessons and worksheets!'
        },
        kidscorner: {
          title: 'Kids Corner',
          message: 'Children choose how to learn in a safe, fun space!'
        },
        classes: {
          title: 'Live Classes & Playdates',
          message: 'Connect with teachers and peers in daily zoom classes!'
        },
        cubby: {
          title: 'Student Cubby',
          message: 'Save your work and track progress in your cubby!'
        },
        music: {
          title: 'Music',
          message: 'Listen anytime, \n to sing and learn!'
        },
        library: {
          title: 'Video Library',
          message:
            'Explore our Library, to create playlists and watch your favorite videos to engage little learners!'
        },
        wellbeing: {
          title: 'Social & Emotional',
          message:
            'Play and learn together with activities, games, books and so much more!'
        }
      }
    },
    paymentPlan: {
      goBack: 'Go Back to Home',
      title: 'Enrollment Plans',
      description1: 'Choose the plan that works best for your family!',
      description2: 'All of our plans are monthly subscriptions offering different access to Playgarden Prep\'s curriculum and teachers.',
      description3: 'You can also pay annually for important savings!',
      trialExpired: 'YOUR TRIAL PERIOD HAS EXPIRED',
      trialExpiring: 'YOUR TRIAL PERIOD IS EXPIRING',
      trialPeriod1: 'Your trial period',
      trialEnded: 'ended',
      trialWillEnd: 'will end',
      trialPeriod2: 'on',
      trialPeriod3: 'You',
      trialWere: 'were',
      trialCurrently: 'are currently',
      trialPeriod4: 'trialing the',
      trialPeriod5: 'plan. After your trial',
      trialEnds: 'ends',
      trialPeriod6: 'you',
      trialWillBe: 'will be',
      trialPeriod7: 'automatically placed into the',
      trialPeriod8: 'monthly plan. If you would like to trial a different plan, you may do so below!',
      subscriptionPlan: {
        billMonthly: 'Billed Monthly',
        billAnnually: 'Billed Annually',
        billBiannually: 'Billed by semester',
        sixMonths: '(6 months)',
        year: '/year',
        month: '/month',
        biannual: '/semester',
        subtitle: 'What\'s included:',
        choose: 'Choose plan',
        current: 'Current Plan',
        footer: 'Playgarden Prep Online is COMPLETELY FREE for the first 15 days.'
      },
      paymentInformation: {
        title: 'Please confirm your payment information',
        current: 'Current Plan:',
        switch: 'Switch to:',
        edit: 'Edit',
        couponQuestion: 'Do you have a coupon?',
        label: 'Promotion Code',
        cancel: 'Cancel',
        btnConfirmation: 'Upgrade to',
        valid: 'VALID COUPON',
        invalid: 'INVALID COUPON',
        error1: 'A credit card must be provided',
        error2: 'Could not select plan. Please, try again later.'
      },
      cards: {
        title: 'Payment Method',
        subtitle: 'Credit or debit cards',
        add: 'Add a Payment Method',
        delete: 'DELETE CARD',
        save: 'Save',
        cancel: 'Cancel',
        success: 'Card has been updated successfully!'
      }
    },
    modals: {
      textPlaceholder: '(required field)',
      textPlaceholderUppercase: '(REQUIRED)',
      textPlaceholderOptional: '(Optional)',
      learningKits: {
        buy: 'Buy Learning Kits'
      },
      cancelSubscription: {
        title: 'ARE YOU LEAVING US?',
        description: 'Before you cancel, please let us know the reason you are leaving. Every bit of feedback helps us create a better educational experience for little ones!',
        confirmCancel: 'CANCEL ACCOUNT',
        cancel: 'Nevermind, I want to keep learning with playgarden prep!',
        motives: {
          technicalIssues: 'Repeated technical issues',
          tooExpensive: 'Too expensive',
          usingOtherPlatform: 'Using another learning platform',
          goingToInPerson: 'Going to in person school',
          tooMuchTime: 'Too much time commitment',
          littleOneNotEngaged: 'My little one wasn\'t engaged',
          didNotUseEnough: 'Didn\'t use it enough',
          missingFeatures: 'Missing features I need',
          didNotMeetExpectations: 'Didn\'t meet my expectations',
          otherReason: 'Other (please explain)'
        }
      },
      annualSubscriptionCancellation: {
        title: 'We\'re sad to see you go!',
        subtitle: 'You will still have access to your account until',
        description1: 'We\'re always looking to improve!',
        description2: 'Please let us know why you canceled below.',
        cancel: 'Cancel Subscription',
        error: 'Could not cancel subscription'
      },
      cancellationSteps: {
        positive: 'Thanks for being a part of the Playgarden Online community!',
        error1: 'Could not process plan cancellation',
        error2: 'Something went wrong',
        error3: 'Could not change subscription plan'
      },
      baseCancellation: {
        title: 'Tell us more:',
        cancel: 'NO, I JUST WANT TO CANCEL'
      },
      intermediateCancellation: {
        subtitleHeader: 'Tell us more:',
        subtitle: 'We are sad to see you go, Before you go, can you share some feedback about your time with us?',
        confirm1: 'YES, I WANT THIS DEAL',
        confirm2: 'YES, SIGN ME UP',
        cancel: 'NO, I JUST WANT TO CANCEL'
      },
      positiveCancellation: {
        title: 'Congrats!',
        back: 'Back to my account',
        firstMessageFirstAlt: 'Your 50% discount has been applied to your next 3 billing dates.',
        firstMessageSecondAlt: 'Your 40% discount has been applied to your next 5 billing dates.',
        firstMessageThirdAlt: 'Your discount has been applied to all future billing dates.',
        secondMessageFirstAlt: 'Your 15 day free trial of Play & Learn LIVE starts now.',
        secondMessageSecondAlt: 'Your 15 day free trial of Play & Learn starts now.',
        thirdMessage: 'Your 15 day free trial of Play & Learn starts now.'
      },
      negativeCancellation: {
        firstTitle: 'Are you sure?',
        secondTitle: 'Sorry to see you go!',
        firstMessageFirstAltPart1: 'Do you know about our',
        firstMessageFirstAltPart2: 'Play & Learn LIVE',
        firstMessageFirstAltPart3: 'Program? For',
        firstMessageFirstAltPart4: 'only $39.99/month',
        firstMessageFirstAltPart5: 'you get even more engaging learning videos, well-being content, and UNLIMITED live classes—for a value of only $3 per class!',
        firstMessageFirstAltPart6: 'Do you want to try Play & Learn LIVE for free for 15 days?',
        firstMessageSecondAltPart1: 'For only',
        firstMessageSecondAltPart2: '$15.99/month',
        firstMessageSecondAltPart3: ', our',
        firstMessageSecondAltPart4: 'Play & Learn',
        firstMessageSecondAltPart5: 'program includes our full video library with over 1000 educational videos by real teachers, Well-Being content, and engaging music playlists, and more!',
        firstMessageSecondAltPart6: 'Do you want to try Play & Learn for free for 15 days?',
        secondMessageFirstAltPart1: 'For only',
        secondMessageFirstAltPart2: '$15.99/month',
        secondMessageFirstAltPart3: ', our',
        secondMessageFirstAltPart4: 'Play & Learn',
        secondMessageFirstAltPart5: 'program includes our full video library with over 1000 educational videos by real teachers, Well-Being content, and engaging music playlists, and more!',
        secondMessageFirstAltPart6: 'Do you want to try Play & Learn for free for 15 days?'
      },
      last: {
        title: 'Sorry to see you go!',
        message1: 'Don\'t forget that the',
        message2: ', and',
        message3: 'sections are always free.',
        message4: 'We hope you\'ll continue enjoying them!',
        secondMessage1: 'Tell us more:',
        secondMessage2: 'We are sad to see you go, Before you go, can you share some feedback about your time with us?',
        kidsCorner: 'Kids Corner',
        diy: 'DIY',
        community: 'Community',
        cancel: 'CANCEL ACCOUNT'
      },
      creditCard: {
        backBtn: 'Back to choose plan',
        btnText: 'Start Learning',
        title: 'CREDIT CARD INFORMATION',
        subtitle: 'We need your credit card information to confirm who you are.',
        footer: 'You can cancel your trial and membership anytime from the account settings.',
        success: 'Payment method added!',
        error: 'Could not add payment method! Please try again.'
      },
      technicalIssues: {
        subtitle: 'Let us know about the issues you\'ve been experiencing—we\'d love to fix them for you!',
        baseMessageFirstAlt1: 'We\'re sorry you are experiencing problems! Give us another chance and we\'ll provide a',
        baseMessageFirstAlt2: 'off discount',
        baseMessageFirstAlt3: '—That\'s',
        baseMessageFirstAlt4: 'only $%{price} for the next three months.',
        baseMessageSecondAlt1: 'We\'re sorry you are experiencing problems! Give us another chance and we\'ll provide a',
        baseMessageSecondAlt2: 'off discount',
        baseMessageSecondAlt3: '—That\'s',
        baseMessageSecondAlt4: 'only $%{price} for the next five months.',
        baseMessageThirdAlt1: 'We\'re sorry you are experiencing problems! Give us another chance and we\'ll provide a discount',
        baseMessageThirdAlt2: '—A',
        baseMessageThirdAlt3: 'Play & Learn membership for only $9.99/month, forever!',
        confirmation1: 'YES, I WANT %{price} OFF',
        confirmation2: 'YES, I WANT THIS DEAL'
      },
      tooExpensive: {
        subtitle: 'Is there a price that would better match your budget?',
        baseMessageFirstAlt1: 'Are you a member of our Mailing List? Subscribe now for weekly coupons, giveaways, and more! Give us another chance and we\'ll provide a',
        baseMessageFirstAlt2: 'off discount',
        baseMessageFirstAlt3: '—That\'s',
        baseMessageFirstAlt4: 'only $%{price} for the next three months.',
        baseMessageSecondAlt1: 'Are you a member of our Mailing List? Subscribe now for weekly coupons, giveaways, and more! Give us another chance and we\'ll provide a',
        baseMessageSecondAlt2: 'off discount',
        baseMessageSecondAlt3: '—That\'s',
        baseMessageSecondAlt4: 'only $%{price} for the next five months.',
        baseMessageThirdAlt1: 'We\'re sorry to see you go! Give us another chance and we\'ll provide a discount—',
        baseMessageThirdAlt2: 'A Play & Learn membership for only $9.99/month, forever!',
        confirmation1: 'YES, I WANT %{price} OFF',
        confirmation2: 'YES, I WANT THIS DEAL'
      },
      usingOtherPlatform: {
        subtitle: 'We are sad to see you go, but happy to see that you\'re continuing your educational journey! Before you go, can you let us know which learning platform you\'re using instead?',
        baseMessageFirstAlt1: 'We’re sorry to see you go! Give us another chance and we\'ll provide a',
        baseMessageFirstAlt2: 'off discount',
        baseMessageFirstAlt3: '—That\'s',
        baseMessageFirstAlt4: 'only $%{price} for the next three months.',
        baseMessageSecondAlt1: 'We\'d love to show you all the hidden perks of your Playgarden Online membership! Give us another chance and we\'ll provide a',
        baseMessageSecondAlt2: 'off discount',
        baseMessageSecondAlt3: '—That\'s',
        baseMessageSecondAlt4: 'only $%{price} for the next five months.',
        baseMessageThirdAlt1: 'We\'re sorry to see you go! Give us another chance and we\'ll provide a discount—',
        baseMessageThirdAlt2: 'A Play & Learn membership for only $9.99/month, forever!',
        confirmation1: 'YES, I WANT %{price} OFF',
        confirmation2: 'YES, I WANT THIS DEAL'
      },
      goingToInPerson: {
        subtitle: 'We are sad to see you go, but glad to see you continuing your educational journey! Before you go, can you share some feedback about your time with us?',
        baseMessageFirstAlt1: 'Did you know, some families use Playgarden in conjunction with in-person school? Give us another chance and we\'ll provide a',
        baseMessageFirstAlt2: 'off discount',
        baseMessageFirstAlt3: '—That\'s',
        baseMessageFirstAlt4: 'only $%{price} for the next three months.',
        baseMessageSecondAlt1: 'Did you know, some families use Playgarden in conjunction with in-person school? Give us another chance and we\'ll provide a',
        baseMessageSecondAlt2: 'off discount',
        baseMessageSecondAlt3: '—That\'s',
        baseMessageSecondAlt4: 'only $%{price} for the next five months.',
        baseMessageThirdAlt1: 'Did you know, some families use Playgarden in conjunction with in-person school? Give us another chance and we\'ll provide a discount—',
        baseMessageThirdAlt2: 'A Play & Learn membership for only $9.99/month, forever!',
        confirmation1: 'YES, I WANT %{price} OFF',
        confirmation2: 'YES, I WANT THIS DEAL'
      },
      tooMuchTime: {
        subtitle: 'We\'d love to know what schedule would work better for your family. Could you share some additional feedback about your time with us?',
        baseMessageFirstAlt1: 'We understand family schedules can get busy, we\'d love to work out a way to better fit into your schedule! Give us another chance and we\'ll provide a',
        baseMessageFirstAlt2: 'off discount',
        baseMessageFirstAlt3: '—That\'s',
        baseMessageFirstAlt4: 'only $%{price} for the next three months.',
        baseMessageSecondAlt1: 'We understand family schedules can get busy, we\'d love to work out a way to better fit into your schedule! Give us another chance and we\'ll provide a',
        baseMessageSecondAlt2: 'off discount',
        baseMessageSecondAlt3: '—That\'s',
        baseMessageSecondAlt4: 'only $%{price} for the next five months.',
        baseMessageThirdAlt1: 'We understand family schedules can get busy, we\'d love to work out a way to better fit into your schedule! Give us another chance and we\'ll provide a discount—',
        baseMessageThirdAlt2: 'A Play & Learn membership for only $9.99/month, forever!',
        confirmation1: 'YES, I WANT %{price} OFF',
        confirmation2: 'YES, I WANT THIS DEAL'
      },
      littleOneNotEngaged: {
        subtitle: 'We\'re always looking to improve! What could we do to increase engagement with your little one?',
        baseMessageFirstAlt1: 'We\'re sorry to see you go! Have you tried our LIVE Zoom lessons where your little one can engage in real time with our teachers? Give us another chance and we\'ll provide a',
        baseMessageFirstAlt2: 'off discount',
        baseMessageFirstAlt3: '—That\'s',
        baseMessageFirstAlt4: 'only $%{price} for the next three months.',
        baseMessageSecondAlt1: 'We\'re sorry to see you go! Have you tried our LIVE Zoom lessons where your little one can engage in real time with our teachers? Give us another chance and we\'ll provide a',
        baseMessageSecondAlt2: 'off discount',
        baseMessageSecondAlt3: '—That\'s',
        baseMessageSecondAlt4: 'only $%{price} for the next five months.',
        baseMessageThirdAlt1: 'We\'re sorry to see you go! Give us another chance and we\'ll provide a discount—',
        baseMessageThirdAlt2: 'A Play & Learn membership for only $9.99/month, forever!',
        confirmation1: 'YES, I WANT %{price} OFF',
        confirmation2: 'YES, I WANT THIS DEAL'
      },
      didNotUseEnough: {
        subtitle: 'We are always looking to improve, could you share more about your time with us? Are there features that would make you utilize us more?',
        baseMessageFirstAlt1: 'Need more time to explore? Give us another chance and we\'ll provide a',
        baseMessageFirstAlt2: 'off discount',
        baseMessageFirstAlt3: '—That\'s',
        baseMessageFirstAlt4: 'only $%{price} for the next three months.',
        baseMessageSecondAlt1: 'Need more time to explore? Give us another chance and we\'ll provide a',
        baseMessageSecondAlt2: 'off discount',
        baseMessageSecondAlt3: '—That\'s',
        baseMessageSecondAlt4: 'only $%{price} for the next five months.',
        baseMessageThirdAlt1: 'Need more time to explore? Give us another chance and we\'ll provide a discount—',
        baseMessageThirdAlt2: 'A Play & Learn membership for only $9.99/month, forever!',
        confirmation1: 'YES, I WANT %{price} OFF',
        confirmation2: 'YES, I WANT THIS DEAL'
      },
      missingFeatures: {
        subtitle: 'We are always looking to improve, could you share more about your time with us? Are there features that would make you utilize us more?',
        baseMessageFirstAlt1: 'We\'d love for you to continue growing with us! Give us another chance and we\'ll provide a',
        baseMessageFirstAlt2: 'off discount',
        baseMessageFirstAlt3: '—That\'s',
        baseMessageFirstAlt4: 'only $%{price} for the next three months.',
        baseMessageSecondAlt1: 'We\'d love for you to continue growing with us! Give us another chance and we\'ll provide a',
        baseMessageSecondAlt2: 'off discount',
        baseMessageSecondAlt3: '—That\'s',
        baseMessageSecondAlt4: 'only $%{price} for the next five months.',
        baseMessageThirdAlt1: 'We\'re sorry to see you go! Give us another chance and we\'ll provide a discount—',
        baseMessageThirdAlt2: 'A Play & Learn membership for only $9.99/month, forever!',
        confirmation1: 'YES, I WANT %{price} OFF',
        confirmation2: 'YES, I WANT THIS DEAL'
      },
      didNotMeetExpectations: {
        subtitle: 'We are sad to see you go! We\'d love it if you could share some additional feedback about your time with us and what in particular we did not meet?',
        baseMessageFirstAlt1: 'So sorry we didn\'t meet your expectations! Give us another chance and we\'ll provide a',
        baseMessageFirstAlt2: 'off discount',
        baseMessageFirstAlt3: '—That\'s',
        baseMessageFirstAlt4: 'only $%{price} for the next three months.',
        baseMessageSecondAlt1: 'So sorry we didn\'t meet your expectations! Give us another chance and we\'ll provide a',
        baseMessageSecondAlt2: 'off discount',
        baseMessageSecondAlt3: '—That\'s',
        baseMessageSecondAlt4: 'only $%{price} for the next five months.',
        baseMessageThirdAlt1: 'We\'re sorry to see you go! Give us another chance and we\'ll provide a discount—',
        baseMessageThirdAlt2: 'A Play & Learn membership for only $9.99/month, forever!',
        confirmation1: 'YES, I WANT %{price} OFF',
        confirmation2: 'YES, I WANT THIS DEAL'
      },
      otherReason: {
        subtitle: 'We are sad to see you go! Please share some additional feedback about your experience with us!',
        baseMessageFirstAlt1: 'Give us another chance and we\'ll provide a',
        baseMessageFirstAlt2: 'off discount',
        baseMessageFirstAlt3: '—That\'s',
        baseMessageFirstAlt4: 'only $%{price} for the next three months.',
        baseMessageSecondAlt1: 'Give us another chance and we\'ll provide a',
        baseMessageSecondAlt2: 'off discount',
        baseMessageSecondAlt3: '—That\'s',
        baseMessageSecondAlt4: 'only $%{price} for the next five months.',
        baseMessageThirdAlt1: 'We\'re sorry to see you go! Give us another chance and we\'ll provide a discount—',
        baseMessageThirdAlt2: 'A Play & Learn membership for only $9.99/month, forever!',
        confirmation1: 'YES, I WANT %{price} OFF',
        confirmation2: 'YES, I WANT THIS DEAL'
      },
      pickChild: {
        title: 'Who’s at Play and Learn today?',
        titleAlt: 'Who is at school today?',
        button: 'MANAGE STUDENT PROFILES'
      }
    },
    menus: {
      header: {
        home: 'Home',
        dailyLessons: 'Daily Lessons',
        socialEmotional: 'Social & Emotional',
        liveClasses: 'Live Classes',
        videoLibrary: 'Video Library',
        music: 'Music',
        kidsCorner: 'Kids Corner',
        cubby: 'Student Cubby',
        community: 'Community',
        parentCorner: 'Parent Corner'
      },
      trial: {
        title: 'Your free trial will expire in:',
        days: 'Days',
        compare: 'Compare plans now'
      },
      footer: {
        onlineSchool: 'Online School',
        rights: 'All rights reserved',
        playgardenPrep: 'Playgarden Prep',
        preschool: 'Preschool',
        terms: 'Terms of Use',
        privacy: 'Privacy Policy',
        help: 'Help'
      }
    }
  })
}
