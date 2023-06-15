export default async (context, locale) => {
  if (context.$axios) {
    const response = await context.$axios.$get('/i18n/en')
    console.log(response.content)
  }

  return await Promise.resolve({
    commonWords: {
      conjunctionText: 'or',
      emailPlaceholder: 'Email',
      passwordPlaceholder: 'Password'
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
    }
  })
}
