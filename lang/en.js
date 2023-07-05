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
        registerWithFb: 'Continue with Facebook',
        registerWithGoogle: 'Continue with Google'
      },
      cardInfo: {
        title:
          "It's the easiest way to give your child an immersive education at home!",
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
        title: "You've completed your first day of video lessons.",
        subtitle: 'Join us in our next live class!',
        footer: 'For more daily learning, check out our other features:',
        sectionTitle: 'Worksheet',
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
    }
  })
}
