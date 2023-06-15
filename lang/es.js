export default async (context, locale) => {
  if (context.$axios) {
    const response = await context.$axios.$get('/i18n/es')
    console.log(response.content)
  }
  return await Promise.resolve({
    commonWords: {
      conjunctionText: 'o',
      emailPlaceholder: 'Email',
      passwordPlaceholder: 'Contraseña'
    },
    menuLandingPage: {
      home: 'Inicio',
      admissions: 'Admisiones',
      virtualPreschool: 'Virtual Preschool',
      enrollmentPlans: 'Planes',
      parentTestimonials: 'Testimonios de Padres',
      groupSolutions: 'Soluciones grupales',
      englishASL: 'Inglés como segundo idioma',
      resources: 'Recursos',
      howItWorks: 'Como funciona',
      blog: 'Blog',
      specializedLearning: 'Aprendizaje Especializado',
      doItYourself: 'Hazlo Tu Mismo',
      aboutUs: 'Sobre Nosotros',
      faqs: 'FAQs',
      yourTeachers: 'Tus Profesores',
      community: 'Communidad',
      login: 'Ingresar',
      tryForFree: 'PRUEBA GRATIS',
      goToPreschool: 'Ir a Preschool'
    },
    login: {
      title: 'Bienvenidos!',
      backBtnText: 'Volver a la página de inicio',
      loginBtn: 'INGRESAR',
      loginWithFb: 'Ingresar con Facebook',
      loginWithGoogle: 'Ingresar con Google',
      forgotPassword: '¿Olvidaste tu contraseña?',
      invitationText: '¿Nuevo en Playgarden Prep Online?',
      signUpInvitation: '¡REGÍSTRATE AHORA!',
      signUp: 'REGÍSTRATE AHORA',
      callNowTextPart1: 'Llama ahora',
      callNowTextPart2: ' para hablar con un especialista'
    },
    register: {
      title: '¡CRÉATE UNA CUENTA PARA EMPEZAR A APRENDER!',
      subtitle1: '¿Estás emocionado para un día lleno de diversión aprendiendo?',
      subtitle2: '¡NO ES NECESARIA UNA TARJETA DE CRÉDITO!',
      registerForm: {
        firstName: 'Nombre',
        lastName: 'Apellido',
        optionalPhoneNumber: 'Número de teléfono (opcional)',
        email: 'Email',
        address: 'Dirección',
        password: 'Contraseña',
        passwordSuggestion1: 'Como mínimo 6 caracteres, cuanto más caracteres, mejor.',
        passwordSuggestion2: 'Una mezcla de letras mayúsculas y minúsculas.',
        passwordSuggestion3: 'Una mezcla de letras y números.',
        passwordSuggestion4: 'Inclusión de al menos un carácter especial, por ejemplo, !@#?]',
        coupon: 'Cupón',
        validCoupon: '¡Cupón válido!',
        invalidCoupon: '¡Cupón inválido!',
        termsAndConditionsPart1: 'Acepto los',
        termsAndConditionsPart2: 'Términos y Condiciones',
        choosePlan: 'ELIGE TU PLAN',
        registerWithFb: 'Continuar con Facebook',
        registerWithGoogle: 'Continuar con Google'
      },
      cardInfo: {
        title: '¡Es la forma más fácil de darle a tu hijo una educación inmersiva en casa!',
        subtitle: '¡Niños comprometidos y resultados comprobados!'
      }
    }
  })
}
