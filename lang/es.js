export default async (context, locale) => {
  if (context.$axios) {
    const response = await context.$axios.$get('/i18n/es')
    console.log(response.content)
  }

  return await Promise.resolve({
    commonWords: {
      conjunctionText: 'o',
      prepositionText: 'CON',
      upload: 'SUBIR',
      return1: 'VOLVER',
      emailPlaceholder: 'Email',
      passwordPlaceholder: 'Contraseña',
      firstName: 'Nombre',
      lastName: 'Apellido',
      fullName: 'Nombre completo',
      phoneNumber: 'Número de teléfono',
      viewMore: 'Ver más',
      date: 'Fecha',
      price: 'Precio',
      edit: 'Editar',
      password: 'Contraseña',
      newPassword: 'Nueva Contraseña',
      passwordConfirmation: 'Confirmación de Contraseña',
      save: 'Guardar',
      cancel: 'Cancelar',
      changePassword: 'Cambiar contraseña',
      browseByLetter: 'Buscar por letra',
      apply: 'Aplicar',
      planPrice: 'Plan y precio'
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
      signUpInvitation: '¡REGISTRATE AHORA!',
      signUp: 'REGISTRATE AHORA',
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
    },
    account: {
      title: 'Mi cuenta',
      menu: {
        general: 'General',
        personalInformation: 'Información personal',
        studentProfile: 'Perfil del estudiante',
        membership: 'Membresia',
        caregivers: 'Niñeras',
        notifications: 'Notificaciones',
        logout: 'Cerrar sesión'
      },
      general: {
        title: 'Información general',
        subtitle: 'Administra tu información personal.',
        syncFacebook: 'Conecta tu cuenta de Facebook',
        syncGoogle: 'Conecta tu cuenta de Google',
        connectedFacebook: 'Tu cuenta de Facebook está conectada\'',
        connectedGoogle: 'Tu cuenta de Google está conectada'
      },
      shipping: {
        title: 'Dirección de envío',
        subtitle: 'Usamos esta información para enviarte los materiales de estudio de Playgarden Prep',
        street: 'Dirección',
        address: 'Dirección',
        city: 'Ciudad',
        country: 'Paīs',
        state: 'Estado',
        zip: 'Codigo postal',
        message: 'Por favor ingrese una dirección de envío',
        addAddress: 'Agregar dirección de envío',
        apt: 'Apt, Suite, PO BOX (opcional)'
      },
      student: {
        title: 'Información del estudiante',
        subtitle: 'En esta sección puedes editar la información del estudiante o agregar un nuevo estudiante.',
        birthDate: 'Fecha de nacimiento:',
        gender: 'Género:',
        addChild: 'Agregar estudiante',
        currentLetter: 'Letra actual:',
        currentDay: 'Día actual:',
        deleteChild: 'Eliminar estudiante',
        changeIcon: 'Cambiar icono:',
        viewCurrentLetter: 'Ver progreso de la letra',
        viewProgressReport: 'Ver reporte del progreso',
        timeline: ' historial'
      },
      caregivers: {
        title: 'Niñeras',
        subtitle: 'Concede acceso a tu niñera!',
        addCaregiver: 'Agregar niñera',
        addNewCaregiver: 'Agregar nueva niñera',
        sendInvitation: 'Enviar invitaciones',
        deleteCaregiver: 'Eliminar niñera',
        pending: 'Invitaciones pendientes',
        pendingDescription: 'No tienes ninguna invitación pendiente'
      },
      membership: {
        title: 'Membresia',
        subtitle: 'Información de tu membresia',
        nextBilling: 'Tu siguiente pago es el:',
        monthly: 'mensual',
        yearly: 'anual',
        feeDescription: 'Tu membresia %{type} es de:',
        plan: 'Tu plan es:',
        billing: 'Historial de pagos',
        payment: 'Información de pago',
        changePayment: 'Cambiar información de pago',
        addCoupon: 'Agregar codigo de descuento',
        couponPlaceholder: 'Codigo de descuento',
        couponNote: '*Tenga en cuenta que solo puede usar un código de promoción a la vez; agregar un nuevo código de promoción eliminará cualquier cupón actualmente activo que se haya aplicado anteriormente.',
        billingHistory: 'Historial de pago',
        viewBillingHistory: 'Ver historial de pago',
        viewInvoice: 'Ver factura',
        changePlan: 'Cambiar plan',
        changePlanDescription: 'Cambiar tu plan cuando quieras',
        cancelMembership: 'Cancelar membresia'
      },
      notifications: {
        title: 'Notificaciones',
        subtitle: 'Administra las notificaciones que quieres recibir'
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
      onlineWorksheet: {
        title: 'Online Worksheet'
      }
    }
  })
}
