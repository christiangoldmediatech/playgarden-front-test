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
      phoneNumber: 'Phone Number',
      viewMore: 'View more',
      date: 'Date',
      price: 'Price'
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
      general: {
        title: 'General Info',
        subtitle: 'Manage your personal information.'
      },
      shipping: {
        title: 'Shipping Address',
        subtitle: 'We use this information to send you Playgarden Prep educational materials.',
        street: 'Street',
        city: 'City',
        country: 'Country',
        state: 'State',
        zip: 'Zip Code'
      },
      student: {
        title: 'Student Profile',
        subtitle: 'In this section you can edit the Child’s information or add a new Child.',
        birthDate: 'Date of birth:',
        gender: 'Gender:'
      },
      caregivers: {
        title: 'Caregivers',
        subtitle: 'Give access to your child’s caregiver!',
        description: 'Give access to your child’s caregiver!'
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
        payment: 'Payment method'
      },
      notifications: {
        title: 'Notifications',
        subtitle: 'Manage the notifications you want to receive'
      }
    }
  })
}
