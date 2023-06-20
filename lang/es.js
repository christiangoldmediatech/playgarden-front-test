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
      birthDate: 'Fecha de nacimiento',
      girl: 'Niña',
      boy: 'Niño',
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
      planPrice: 'Plan y precio',
      onlinePreschool: 'ONLINE PRESCHOOL',
      backButton: 'Atrás'
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
        description: 'Concede acceso a tu niñera!',
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
    payment: {
      title: 'INFORMACIÓN DE TARJETA DE CRÉDITO',
      description: 'PARA LA SEGURIDAD DE NUESTROS ESTUDIANTES DURANTE LAS CLASES EN VIVO, NECESITAMOS VERIFICAR QUIÉN ERES. Agregue una tarjeta de crédito a su cuenta. NO SE LE COBRARÁ. Playgarden solo cobra cuando su prueba ha finalizado y ha confirmado su plan.',
      footer1: 'Playgarden Prep Online es COMPLETAMENTE GRATIS durante los próximos 15 días.',
      footer2: 'PUEDES CANCELAR TU PRUEBA EN CUALQUIER MOMENTO',
      footer3: 'Puedes fácilmente cancelar tu prueba o membresía en cualquier momento desde tu Configuración de cuenta. Una vez que finalice tu prueba gratuita, se te colocará en el',
      footer4: 'plan mensual; su información de pago proporcionada se debitará automáticamente, y su primer ciclo de facturación comenzará. Puede cambiar los planes en cualquier momento desde su Configuración de cuenta. Para obtener ayuda, comuníquese con',
      button1: 'REACTIVAR CUENTA',
      button2: 'EMPIEZA A APRENDER AHORA',
      card: {
        title: 'Únase a miles de familias felices que se han graduado de Playgarden Prep',
        subtitle: '¿Aún no estás seguro? Llámanos, envíanos un mensaje de texto o un correo electrónico con tus preguntas, y un miembro de nuestro equipo de profesores se comunicará contigo para brindarte más información.',
        teacherTitle: '¡Comunícate con un maestro como la señorita Sarah!',
        phone: '+1 (646) 504-4716 (llamada/mensaje de texto)'
      },
      cardKnowMore: {
        title: 'Tu prueba de 15 días incluye:',
        subtitle1: 'QUIERES SABER MÁS SOBRE TU',
        subtitle2: 'PRUEBA GRATUITA',
        footer: '*Puedes cancelar tu membresía en cualquier momento desde la Configuración de tu cuenta.'
      },
      stripe: {
        description1: 'Necesitamos tu información de tarjeta de crédito para confirmar tu identidad',
        description2: ', pero NO se te cobrará hasta que finalice tu prueba gratuita de 15 días, a menos que elijas finalizar tu prueba antes de tiempo',
        promotionCode: 'Código de Promoción',
        acceptTerms1: 'He leído y acepto los',
        acceptTerms2: 'Términos y Condiciones',
        cancel: 'CERRAR',
        footer1: 'Puedes cancelar tu prueba y membresía en cualquier momento desde la Configuración de tu cuenta. ',
        footer2: 'Una vez que finalice tu prueba gratuita se te colocará en el',
        footer3: ' plan mensual, puedes cambiar planes en cualquier momento desde tu página de perfil.'
      }
    },
    children: {
      title: 'INFORMACIÓN DEL NIÑO',
      subtitle: 'Cuéntanos sobre tu pequeño:',
      button1: 'EMPIEZA A APRENDER',
      button2: 'AGREGAR OTRO NIÑO',
      button3: 'ELIMINAR PERFIL DEL NIÑO',
      iconSelector: {
        title1: 'Elige un icono para tu hijo',
        title2: 'Cambia el icono de tu hijo',
        title3: 'ELIGE UN ICONO PARA TU HIJO:'
      }
    },
    welcome: {
      titleDay1: 'Bienvenido a Playgarden Online!',
      titleDay2: 'Hola, bienvenido de nuevo a Playgarden y tu segundo día de aprendizaje',
      titleDay3: 'Hola, bienvenido de nuevo a Playgarden y tu tercer día de aprendizaje',
      overlay: {
        title: '¡Tu prueba gratuita ha comenzado oficialmente!',
        subtitle1: '*Cancela en cualquier momento desde tu',
        subtitle2: 'Configuración de cuenta'
      },
      daysSelector: {
        title: '¡Un último paso antes de comenzar!',
        subtitle: 'Por favor, dinos cuántos días a la semana esperas usar Playgarden Online',
        daySingular: 'DÍA',
        dayPlural: 'DÍAS',
        button: 'EMPIEZA A APRENDER',
        footer: 'Esto nos ayudará a mejorar la experiencia de aprendizaje de tu pequeño'
      }
    },
    lessonEnd: {
      title: '¡No podemos esperar a verte mañana!',
      emailText1: '¿Quieres recibir un correo electrónico con todas las cosas que hiciste hoy?',
      emailText2: 'Haz clic aquí para actualizar tu configuración de notificación por email.',
      overlay: {
        title: 'Has completado tu primer día de lecciones de video.',
        subtitle: '¡Únete a nosotros en nuestra próxima clase en vivo!',
        footer: 'Para más aprendizaje diario, revisa nuestras otras características:',
        sectionTitle: 'Worksheet',
        sectionDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor '
      },
      todayCard: {
        title1: '¡Disculpa!',
        title2: 'Esta clase ha sido cancelada hoy. ¡Nos vemos la próxima vez!'
      },
      meetingCard: {
        button: 'IR AL HORARIO DE CLASES EN VIVO'
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
