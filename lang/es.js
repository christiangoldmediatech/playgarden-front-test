export default async (context, locale) => {
  if (context.$axios) {
    const response = await context.$axios.$get('/i18n/es')
    console.log(response.content)
  }
  return await Promise.resolve({
    commonWords: {
      conjunctionText: 'o',
      prepositionText: 'con',
      prepositionTextUpper: 'Con',
      letter: 'Letra',
      here: 'AQUÍ',
      day: 'DÍA',
      progress: 'PROGRESO',
      view: 'Ver',
      puzzle: 'Puzzle',
      upload: 'SUBIR',
      return1: 'VOLVER',
      return2: 'volver',
      returnToLesson: 'Volver a la lección',
      skip: 'Skip for now',
      continue: 'Continuar',
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
      cancelUppercase: 'CANCELAR',
      close: 'Cerrar',
      changePassword: 'Cambiar contraseña',
      browseByLetter: 'Buscar por letra',
      apply: 'Aplicar',
      plan: 'PLAN',
      planPrice: 'Plan y precio',
      onlinePreschool: 'ONLINE PRESCHOOL',
      backButton: 'Atrás',
      activitiesType: {
        art: 'Arte',
        cognitive: 'Cognitivo',
        language: 'Lenguaje',
        math: 'Matemáticas',
        movement: 'Movimiento',
        music: 'Música',
        nutrition: 'Nutrición',
        science: 'Ciencia',
        sensory: 'Sensorial',
        songs: 'Canciones',
        storytime: 'Cuentos',
        theater: 'Teatro',
        writing: 'Escritura'
      }
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
      subtitle1:
        '¿Estás emocionado para un día lleno de diversión aprendiendo?',
      subtitle2: '¡NO ES NECESARIA UNA TARJETA DE CRÉDITO!',
      registerForm: {
        firstName: 'Nombre',
        lastName: 'Apellido',
        optionalPhoneNumber: 'Número de teléfono (opcional)',
        email: 'Email',
        address: 'Dirección',
        password: 'Contraseña',
        passwordSuggestion1:
          'Como mínimo 6 caracteres, cuanto más caracteres, mejor.',
        passwordSuggestion2: 'Una mezcla de letras mayúsculas y minúsculas.',
        passwordSuggestion3: 'Una mezcla de letras y números.',
        passwordSuggestion4:
          'Inclusión de al menos un carácter especial, por ejemplo, !@#?]',
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
        title:
          '¡Es la forma más fácil de darle a tu hijo una educación inmersiva en casa!',
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
        connectedFacebook: "Tu cuenta de Facebook está conectada'",
        connectedGoogle: 'Tu cuenta de Google está conectada'
      },
      shipping: {
        title: 'Dirección de envío',
        subtitle:
          'Usamos esta información para enviarte los materiales de estudio de Playgarden Prep',
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
        subtitle:
          'En esta sección puedes editar la información del estudiante o agregar un nuevo estudiante.',
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
        trialPeriod: 'El periodo de prueba gratuito termina:',
        couponApplied: 'Cupón aplicado:',
        couponApplied2: '¡Cupón aplicado!',
        couponDiscount: 'descuento en tu membresia',
        couponValid: 'CUPÓN VÁLIDO',
        couponInvalid: 'CUPÓN INVÁLIDO',
        addOn: 'Complemento',
        learningKits: 'Kits de aprendizaje',
        learningKitsDesc: 'Añade la entrega a domicilio de los Kits de Aprendizaje a cualquiera de los Planes de Inscripción',
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
        couponNote:
          '*Tenga en cuenta que solo puede usar un código de promoción a la vez; agregar un nuevo código de promoción eliminará cualquier cupón actualmente activo que se haya aplicado anteriormente.',
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
      description:
        'PARA LA SEGURIDAD DE NUESTROS ESTUDIANTES DURANTE LAS CLASES EN VIVO, NECESITAMOS VERIFICAR QUIÉN ERES. Agregue una tarjeta de crédito a su cuenta. NO SE LE COBRARÁ. Playgarden solo cobra cuando su prueba ha finalizado y ha confirmado su plan.',
      footer1:
        'Playgarden Prep Online es COMPLETAMENTE GRATIS durante los próximos 15 días.',
      footer2: 'PUEDES CANCELAR TU PRUEBA EN CUALQUIER MOMENTO',
      footer3:
        'Puedes fácilmente cancelar tu prueba o membresía en cualquier momento desde tu Configuración de cuenta. Una vez que finalice tu prueba gratuita, se te colocará en el',
      footer4:
        'plan mensual; su información de pago proporcionada se debitará automáticamente, y su primer ciclo de facturación comenzará. Puede cambiar los planes en cualquier momento desde su Configuración de cuenta. Para obtener ayuda, comuníquese con',
      button1: 'REACTIVAR CUENTA',
      button2: 'EMPIEZA A APRENDER AHORA',
      card: {
        title:
          'Únase a miles de familias felices que se han graduado de Playgarden Prep',
        subtitle:
          '¿Aún no estás seguro? Llámanos, envíanos un mensaje de texto o un correo electrónico con tus preguntas, y un miembro de nuestro equipo de profesores se comunicará contigo para brindarte más información.',
        teacherTitle: '¡Comunícate con un maestro como la señorita Sarah!',
        phone: '+1 (646) 504-4716 (llamada/mensaje de texto)'
      },
      cardKnowMore: {
        title: 'Tu prueba de 15 días incluye:',
        subtitle1: 'QUIERES SABER MÁS SOBRE TU',
        subtitle2: 'PRUEBA GRATUITA',
        footer:
          '*Puedes cancelar tu membresía en cualquier momento desde la Configuración de tu cuenta.'
      },
      stripe: {
        description1:
          'Necesitamos tu información de tarjeta de crédito para confirmar tu identidad',
        description2:
          ', pero NO se te cobrará hasta que finalice tu prueba gratuita de 15 días, a menos que elijas finalizar tu prueba antes de tiempo',
        promotionCode: 'Código de Promoción',
        acceptTerms1: 'He leído y acepto los',
        acceptTerms2: 'Términos y Condiciones',
        cancel: 'CERRAR',
        footer1:
          'Puedes cancelar tu prueba y membresía en cualquier momento desde la Configuración de tu cuenta. ',
        footer2: 'Una vez que finalice tu prueba gratuita se te colocará en el',
        footer3:
          ' plan mensual, puedes cambiar planes en cualquier momento desde tu página de perfil.'
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
      titleDay2:
        'Hola, bienvenido de nuevo a Playgarden y tu segundo día de aprendizaje',
      titleDay3:
        'Hola, bienvenido de nuevo a Playgarden y tu tercer día de aprendizaje',
      overlay: {
        title: '¡Tu prueba gratuita ha comenzado oficialmente!',
        subtitle1: '*Cancela en cualquier momento desde tu',
        subtitle2: 'Configuración de cuenta'
      },
      daysSelector: {
        title: '¡Un último paso antes de comenzar!',
        subtitle:
          'Por favor, dinos cuántos días a la semana esperas usar Playgarden Online',
        daySingular: 'DÍA',
        dayPlural: 'DÍAS',
        button: 'EMPIEZA A APRENDER',
        footer:
          'Esto nos ayudará a mejorar la experiencia de aprendizaje de tu pequeño'
      }
    },
    lessonEnd: {
      title: '¡No podemos esperar a verte mañana!',
      emailText1:
        '¿Quieres recibir un correo electrónico con todas las cosas que hiciste hoy?',
      emailText2:
        'Haz clic aquí para actualizar tu configuración de notificación por email.',
      overlay: {
        title: 'Has completado tu primer día de lecciones de video.',
        subtitle: '¡Únete a nosotros en nuestra próxima clase en vivo!',
        footer:
          'Para más aprendizaje diario, revisa nuestras otras características:',
        sectionTitle: 'Worksheet',
        sectionDescription:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor '
      },
      todayCard: {
        title1: '¡Disculpa!',
        title2: 'Esta clase ha sido cancelada hoy. ¡Nos vemos la próxima vez!'
      },
      meetingCard: {
        button: 'IR AL HORARIO DE CLASES EN VIVO'
      }
    },
    studentCubby: {
      puzzle: {
        text: 'PIEZAS',
        title: 'PORTAL DEL ESTUDIANTE',
        content:
          'Encuentra todas las insignias completas de %{childName} aqui. Una vez completado, puedes imprimir tus insignias como hojas de color. Coleccionalos todos! Puedes compartirnos tus insignias completadas en Instragram <strong>@PlaygardenPrep</strong>. No podemos esperar a verlas!',
        viewPuzzle: 'Ver piezas',
        viewProgress: 'Ver Progreso',
        unlockText:
          'Encuentra todos los rompecabezas completados por tus hijos. Una vez completado, puede imprimir sus rompecabezas como hojas para colorear. ¡Colecciónalos todos! Puede compartir sus rompecabezas completados en Instagram @PlaygardenPrep. ¡No podemos esperar a ver el tuyo!',
        piecesDesc:
          '¡Mira todas las piezas que tienes! Sigue adelante para ganar una página para colorear imprimible.',
        progress: 'PROGRESO',
        puzzleLetter: 'PIEZAS LETRA %{letter}',
        unlockIntro: 'Desbloquea este en ',
        videoUnlock: 'Video Letra %{letter} Día %{day}',
        worksheetUnlock: 'Hoja de trabajo Letra %{letter} Día %{day}',
        activitiesUnlock: 'Actividad Letra %{letter} Día %{day}'
      },
      patches: {
        text: 'Insignias',
        title: 'Gana insignias por ver videos de actividades',
        content:
          '¡Domina materias para coleccionar insignias para tu Portal de Estudiante!',
        unlockText:
          '¡Domine materias en la sección de Actividades para recolectar parches para su Student Cubby! Recoge todas las insignias para recibir un parche real para tu mochila.',
        unlockShort: 'Desbloquea',
        unlockLong: 'Desbloquear logro'
      },
      curriculum: {
        text: 'CURRÍCULA',
        title: 'Ver todos tus curriculum',
        download: 'DESCARGA LAS ACTIVIDADES DE LA LETRA %{letter}',
        downloading: 'OBTENIENDO DOCUMENTO...',
        content: '¡Desplácese para revisar sus lecciones y hojas de trabajo!',
        unlockText: '¡Desplácese para revisar sus lecciones y hojas de trabajo!'
      },
      portfolio: {
        text: 'PORTAFOLIO',
        title: 'PORTAFOLIO',
        content: '¡Haz un seguimiento de tus hojas de trabajo y tu progreso!',
        letter: 'Letra',
        upload: 'CARGAR HOJA DE TRABAJO',
        verifying: 'VERIFICANDO LECCIÓN'
      },
      progressReport: {
        text: 'REPORTE DE PROGRESO',
        title: 'Reporte de progreso del alumno',
        content:
          'Las lecciones en línea de Playgarden Prep se han desarrollado para respaldar una o más de las áreas centrales de desarrollo. Después de ver un video, hacer la hoja de trabajo junto con un adulto o participar activamente en una clase en vivo, los padres estarán ayudando en el desarrollo de su hijo en cada una de las áreas específicas.',
        unlockText:
          'Las lecciones en línea de Playgarden Prep se han desarrollado para respaldar una o más de las áreas centrales de desarrollo. Después de ver un video, hacer la hoja de trabajo junto con un adulto o participar activamente en una clase en vivo, los padres estarán ayudando en el desarrollo de su hijo en cada una de las áreas específicas.',
        generalProgress: 'Progreso General',
        lettersProgress: 'Progreso de letras',
        areaOfStrength: 'Areas de fortaleza',
        ageAppropriate: 'Edad apropiada',
        progressing: 'Progresando',
        cognitive: 'Cognitivo',
        languageAndLiteracy: 'Idioma y alfabetización',
        physical: 'Física',
        socialEmotional: 'Social y Emocional',
        dailyLessons: 'Lecciones diarias asistidas',
        videosCompled: 'Videos completados',
        activitiesCompleted: 'Actividades completadas',
        onlineWorksheet: 'Hoja de trabajo en línea',
        worksheetsUploaded: 'Hojas de trabajo subidas'
      }
    },
    dailyLessons: {
      downloadWorksheetDay: '¡DESCARGA EL WORKSHEET DEL DÍA!',
      worksheet: 'Worksheet',
      worksheetPlural: 'Worksheets',
      panel: {
        previousDay: 'IR AL DÍA ANTERIOR',
        nextDay: 'IR AL DÍA SIGUIENTE',
        nextDay1: 'Ir al día siguiente',
        downloadWorksheets1: 'DESCARGAR LA LETRA',
        downloadWorksheets2: 'WORKSHEETS DE LA SEMANA',
        winPuzzlePiece: '¡Gana una pieza de puzzle!',
        earnedPuzzlePiece: 'Has obtenido una pieza de puzzle',
        videoTitle: 'Lecciones de video',
        worksheetTitle: 'Worksheets',
        activitiesTitle: 'Actividades',
        uploadWorksheet: 'SUBIR WORKSHEET',
        uploadWorksheetSubtitle:
          'El/Los archivo(s) deben ser formato JPG o PNG',
        downloadWorksheet: 'DESCARGA EL WORKSHEET',
        viewWorksheets: 'Ver worksheets'
      },
      uploadWorksheetDialog: {
        title: ' SUBE TU WORKSHEET',
        requirement1: '* Archivo(s) deben ser solamente en formato',
        requirement2: '',
        success: '¡CARGA EXITOSA!',
        uploadMore: 'SUBE MÁS',
        dragAndDrop: 'ARRASTRA Y SUELTA TUS DOCUMENTOS O SUBE MÁS',
        drag: 'ARRASTRA TU WORKSHEET',
        browse: 'EXPLORAR ARCHIVOS'
      },
      onlineWorksheet: {
        title: 'Online Worksheet',
        titleUppercase: 'ONLINE WORKSHEET',
        coming: '¡Próximamente!',
        handsOn1: 'APRENDIZAJE PRÁCTICO',
        handsOn2:
          'es una parte crucial de la experiencia educativa. Aprender haciendo fortalece las conexiones cognitivas y construye una base sólida para el conocimiento.',
        button1: 'VIDEO DE LOS PROFESORES',
        button2: 'DESCARGAR WORKSHEET',
        button3: 'SUBIR WORKSHEET',
        button4: 'SUBIR WORKSHEET COMPLETO',
        messageDialog1: '¡BUEN TRABAJO!',
        messageDialog2: '¡OOPS!',
        complete:
          '¡Completa los Online Worksheets, y obtiene una nueva pieza de puzzle!'
      },
      offlineWorksheet: {
        title: 'Ve el video del Worksheet',
        subtitle:
          '¡Completa tus worksheets prácticos con un profesor de Playgarden Prep!',
        alternativeTitle: 'Aprendizaje Práctico',
        alternativeSubtitle:
          'El aprendizaje práctico es una parte crucial de la experiencia educativa. Aprender haciendo fortalece las conexiones cognitivas y construye una base sólida para el conocimiento.',
        question: '¿Que quieres hacer ahora?',
        download1: 'DESCARGA WORKSHEET',
        download2: 'DESCARGA WORKSHEET PRÁCTICO',
        upload1: 'SUBE WORKSHEET',
        upload2: 'SUBE EL WORKSHEET COMPLETADO',
        correctAnswer: 'es la respuesta correcta!',
        nextWord: 'Próxima Palabra'
      },
      scheduledFinished: {
        description1:
          'No olvides de unirte a nosotros en nuestra próxima clase en vivo.',
        description2: '¡Son un gran complemento a las lecciones de vídeo!',
        subtitle:
          '¡Si el horario no se adecua a ti, échale un ojo a los videos recomendados en Library!',
        librarySubtitle: '¡Ven a leer con nosotros en el rincón de los libros!',
        nextDay: 'Ir al día siguiente'
      },
      childSelect: {
        placeholder: 'Selecciona un niño',
        onPlaydate: 'Ya estás en un Playdate',
        management: 'Administrar Perfiles de Estudiantes'
      },
      unlockPrompt: {
        title: 'LECCIONES DIARIAS',
        description:
          'Actualiza tu plan para tener acceso a lecciones diarias con tus profesores favoritos de Playgarden Prep',
        unlock: 'Por desbloquear',
        upgrade: 'Actualiza tu Plan'
      },
      carouselLetter: {
        placeholder: 'Navegar por letra'
      },
      puzzles: {
        title: 'LETRA DE PUZZLE',
        description:
          '¡Mira todas las piezas que tienes! Sigue adelante para ganar una página para colorear imprimible.',
        congratulations: '¡FELICIDADES!',
        getPuzzlePiece: '¡OBTÉN UNA PIEZA DE PUZZLE!',
        earned: 'Has obtenido una pieza de puzzle',
        watch1: 'Mira',
        watch2: 'seguidos'
      },
      lessonCompleted: {
        congratulations: '¡FELICIDADES!',
        subtitle1: '¡Has completado el',
        subtitle2: 'día de lecciones de video!',
        first: 'primero',
        second: 'segundo',
        third: 'tercero',
        fourth: 'cuarto',
        fifth: 'quinto',
        card1: 'Online Worksheets',
        card2: 'Imprimir Worksheets',
        card3: 'Actividades',
        footer:
          'Recuerda que para continuar a la siguiente lección, debes completar los online worksheets, video activities y worksheets de esta lección.'
      },
      letterSelect: {
        nature: 'Naturaleza',
        welcome: 'Bienvenida'
      }
    },
    liveClasses: {
      day: 'Día',
      week: 'Semana',
      timezone1: '*Horas en la',
      timezone2: ', puedes cambiar tu zona horaria haciendo clic',
      schedule: 'Horario de Clases en vivo',
      placeholder:
        'No hay clases en vivo programadas para esta semana. Vuelve más tarde.',
      access: 'Obtén acceso a las clases en vivo',
      upgrade: 'Actualiza tu plan',
      compare: 'COMPARA PLANES',
      timezone: 'ZONA HORARIA',
      timezoneLowercase: 'Zona horaria',
      unlockPrompt: {
        title: 'CLASES EN VIVO',
        description: 'Desbloquea la sección de clases en vivo'
      },
      days: {
        sunday: 'Domingo',
        monday: 'Lunes',
        tuesday: 'Martes',
        wednesday: 'Miércoles',
        thursday: 'Jueves',
        friday: 'Viernes',
        saturday: 'Sábado'
      },
      months: {
        january: 'Enero',
        february: 'Febrero',
        march: 'Marzo',
        april: 'Abril',
        may: 'Mayo',
        june: 'Junio',
        july: 'Julio',
        august: 'Agosto',
        september: 'Septiembre',
        october: 'Octubre',
        november: 'Noviembre',
        december: 'Diciembre'
      },
      entryDialog: {
        description: 'Descripción',
        download1: 'Descargar Lista de Ingredientes',
        download2: 'Descargar Información Adicional',
        recommendedAges: 'Edades recomendadas',
        spots: 'Lugares:',
        fullClass:
          '¡Ups! Esta clase está llena. ¡Esperamos verte la próxima vez!',
        whoIsGoing: '¿Quién va a ir?',
        by: 'Por:',
        watchRecorded: 'Ver clase grabada',
        reserve: 'RESERVAR LUGAR',
        unlock: 'DESBLOQUEA ESTA SECCIÓN CON EL',
        cancel: 'Cancelar Lugar',
        open: 'ABRIR LINK DE ZOOM',
        addToCalendar: 'Añadir al calendario'
      },
      sessionsTable: {
        noLiveClasses: 'No hay clases en vivo programadas para este día.'
      },
      tableEntry: {
        live: 'En vivo',
        cancelled1: '¡Lo sentimos!',
        cancelled2:
          'Esta clase ha sido cancelada hoy. ¡Nos vemos la próxima vez!',
        toUnlock: 'Para desbloquear',
        upgrade: 'Actualiza tu Plan'
      },
      todayCardPanel: {
        filter: 'Filtrar por',
        allClasses: 'Todas las clases',
        liveClasses: 'Clases en vivo',
        playdates: 'Playdates',
        myPlaydates: 'Mis playdates',
        nextClasses: 'Próximas clases',
        pending1: 'No hay eventos pendientes',
        pending2: 'para ti',
        pending3: 'esta semana.'
      }
    },
    videoLibrary: {
      library: 'Biblioteca',
      start: '¡Empezar!',
      columnA: 'Explorar por Letras',
      columnB: 'Explorar por Categoría',
      patchEarned: {
        congratulations: '¡Felicidades!',
        watch1: 'Has visto',
        watch2: 'Actividades y has ganado un NUEVO parche!',
        keepWatching:
          'Sigue viendo videos para dominar la categoría y ganar más parches.',
        nextText: '¿Qué quieres hacer ahora?',
        nextVideo: 'Siguiente video',
        goNextVideo: 'Ir al siguiente video',
        goPatches: 'Ir a Parches',
        returnText1: 'Volver a Biblioteca',
        returnText2: 'Volver a Lecciones'
      },
      inlinePlayer: {
        columnA: 'Recomendado para ti',
        columnB: 'Más lecciones para ti',
        videoOfWeek: 'Video de la semana'
      },
      videoCard: {
        viewed: 'Visto'
      }
    },
    socialEmotional: {
      common: {
        sections: 'Secciones',
        videos: 'Vídeos',
        printables: 'Imprimibles',
        doItTogether: 'Hagámoslo-Juntos',
        sensoryPlay: 'Juego Sensorial',
        snackOfTheWeek: 'Bocadillo de la semana',
        book: 'Libro',
        playlist: 'Lista de Reproducción',
        topFive: 'Top cinco',
        videoLessons: 'Lecciones de Video',
        moreLikeThis: 'Más videos',
        worksheets: 'Hojas de Trabajo',
        diyProject: 'Hagámoslo-Juntos - Proyecto',
        goToProject: 'Ir a proyecto',
        downloadPdf: 'Descargar PDF',
        snack: 'Bocadillo',
        weekReccomendedBooks: 'Libros recomendados de la semana',
        booksOfTheWeek: 'Libros de la semana',
        buyNowOn: 'Comprar ahora en'
      }
    },
    music: {
      unlockPrompt: {
        title: 'MÚSICA',
        description: 'Desbloquea la biblioteca de música completa'
      },
      songList: {
        title: 'Lista de canciones',
        favorites: 'Favoritos',
        placeholder: 'Agrega tus canciones favoritas aquí, haciendo clic en sus iconos de Corazón.'
      },
      letterSongs: {
        playing: 'REPRODUCIENDO',
        addQueue: 'Añadir a la cola',
        addedQueue: 'Añadido a la cola'
      },
      queue: {
        empty: 'Cola vacía'
      },
      letterCarousel: {
        placeholder: 'Explorar por letra'
      }
    },
    virtualPreschool: {
      header: {
        welcomeMsg: 'Bienvenidos a la Escuela',
        welcomeMsgSubtitle: '¡Gracias por aprender con nosotros el día de hoy!',
        profile: 'Perfil',
        help: 'Ayuda',
        faq: 'PREGUNTAS FRECUENTES'
      },
      startLearning: 'Iniciar<br/>Aprendizaje',
      sections: {
        dashboard: {
          title: 'Lecciones diarias',
          message:
            '¡Aprende cada día con video lecciones y hojas de trabajo estructuradas y personalizadas!'
        },
        kidscorner: {
          title: 'Rincón de los Niños',
          message:
            '¡Los niños eligen como aprender en un espacio seguro y divertido!'
        },
        classes: {
          title: 'Clases en Vivo y Citas para Jugar',
          message:
            '¡Conéctate con maestros y compañeros en clases diarias por Zoom!'
        },
        cubby: {
          title: 'Cubìculo de Estudiante',
          message: '¡Guardar tu trabajo y rastrae tu avance en tu cubículo!'
        },
        music: {
          title: 'Música',
          message: '¡Escucha cuando quieras, \n para cantar y aprender!'
        },
        library: {
          title: 'Biblioteca de Vídeos',
          message:
            '¡Explore nuestra biblioteca para crear listas de reproducción y ver sus videos favoritos para atraer a los pequeños aprendientes!'
        },
        wellbeing: {
          title: 'Social & Emocional',
          message:
            '¡Jugar y aprender juntos, con actividades, juegos, libros y mucho más!'
        }
      }
    },
    modals: {
      textPlaceholder: '(campo requerido)',
      textPlaceholderUppercase: '(REQUERIDO)',
      textPlaceholderOptional: '(Opcional)',
      learningKits: {
        buy: 'Comprar Kits de Aprendizaje'
      },
      cancelSubscription: {
        title: '¿ESTÁS DEJANDONOS?',
        description: 'Antes de cancelar, por favor déjanos saber la razón por la que te vas. ¡Cada comentario nos ayuda a crear una mejor experiencia educativa para los pequeños!',
        confirmCancel: 'CANCELAR CUENTA',
        cancel: 'No, quiero seguir aprendiendo con Playgarden Prep!',
        motives: {
          technicalIssues: 'Problemas técnicos repetidos',
          tooExpensive: 'Muy caro',
          usingOtherPlatform: 'Usando otra plataforma de aprendizaje',
          goingToInPerson: 'Yendo a la escuela presencial',
          tooMuchTime: 'Demasiado tiempo de compromiso',
          littleOneNotEngaged: 'Mi pequeño no estaba comprometido',
          didNotUseEnough: 'No lo usé lo suficiente',
          missingFeatures: 'Faltan características que necesito',
          didNotMeetExpectations: 'No cumplió mis expectativas',
          otherReason: 'Otra (por favor explique)'
        }
      },
      annualSubscriptionCancellation: {
        title: '¡Estamos tristes de verte irte!',
        subtitle: 'Su cuenta seguirá activa hasta',
        description1: '¡Siempre estamos buscando mejorar!',
        description2: 'Por favor, háganos saber por qué canceló a continuación.',
        cancel: 'Cancelar suscripción',
        error: 'No se pudo cancelar la suscripción'
      },
      cancellationSteps: {
        positive: '¡Gracias por ser parte de la comunidad de Playgarden Online!',
        error1: 'No se pudo procesar la cancelación del plan',
        error2: 'Algo salió mal',
        error3: 'No se pudo cambiar el plan de suscripción'
      },
      baseCancellation: {
        title: 'Cuentanos más:',
        cancel: 'NO, SOLO QUIERO CANCELAR'
      },
      intermediateCancellation: {
        subtitleHeader: 'Cuentanos más:',
        subtitle: 'Estamos tristes de verte ir, Antes de irte, ¿puedes compartir algunos comentarios sobre tu tiempo con nosotros?',
        confirm1: 'SÍ, QUIERO ESTA OFERTA',
        confirm2: 'SÍ, INSCRÍBEME',
        cancel: 'NO, SOLO QUIERO CANCELAR'
      },
      positiveCancellation: {
        title: '¡Felicitaciones!',
        back: 'Volver a mi cuenta',
        firstMessageFirstAlt: 'Tu descuento del 50% se ha aplicado a tus próximas 3 fechas de facturación.',
        firstMessageSecondAlt: 'Tu descuento del 40% se ha aplicado a tus próximas 5 fechas de facturación.',
        firstMessageThirdAlt: 'Tu descuento se ha aplicado a todas las fechas futuras de facturación.',
        secondMessageFirstAlt: 'Tu prueba gratuita de 15 días de Play & Learn LIVE comienza ahora.',
        secondMessageSecondAlt: 'Tu prueba gratuita de 15 días de Play & Learn comienza ahora.',
        thirdMessage: 'Tu prueba gratuita de 15 días de Play & Learn comienza ahora.'
      },
      negativeCancellation: {
        firstTitle: '¿Estás seguro?',
        secondTitle: '¡Estamos tristes de verte ir!',
        firstMessageFirstAltPart1: 'Conoces nuestro',
        firstMessageFirstAltPart2: 'Play & Learn LIVE',
        firstMessageFirstAltPart3: 'Program? Por',
        firstMessageFirstAltPart4: 'solo $39.99/mes',
        firstMessageFirstAltPart5: '¡obtienes aún más videos de aprendizaje atractivos, contenido de bienestar y clases en vivo ILIMITADAS, por un valor de solo $ 3 por clase!',
        firstMessageFirstAltPart6: '¿Quieres probar Play & Learn LIVE gratis durante 15 días?',
        firstMessageSecondAltPart1: 'Por solo',
        firstMessageSecondAltPart2: '$15.99/mes',
        firstMessageSecondAltPart3: ', nuestro',
        firstMessageSecondAltPart4: 'Play & Learn',
        firstMessageSecondAltPart5: 'program incluye nuestra biblioteca completa de videos con más de 1000 videos educativos de maestros reales, contenido de bienestar y listas de reproducción de música atractivas, ¡y más!',
        firstMessageSecondAltPart6: '¿Quieres probar Play & Learn gratis durante 15 días?',
        secondMessageFirstAltPart1: 'Por solo',
        secondMessageFirstAltPart2: '$15.99/mes',
        secondMessageFirstAltPart3: ', nuestro',
        secondMessageFirstAltPart4: 'Play & Learn',
        secondMessageFirstAltPart5: 'program incluyer nuestra biblioteca completa de videos con más de 1000 videos educativos de maestros reales, contenido de bienestar y listas de reproducción de música atractivas, ¡y más!',
        secondMessageFirstAltPart6: '¿Quieres probar Play & Learn gratis durante 15 días?'
      },
      last: {
        title: '¡Estamos tristes de verte ir!',
        message1: 'No olvides que las',
        message2: ', y',
        message3: 'secciones son siempre gratis.',
        message4: '¡Esperamos que sigas disfrutándolos!',
        secondMessage1: 'Cuéntanos más:',
        secondMessage2: 'Estamos tristes de verte ir, Antes de irte, ¿puedes compartir algunos comentarios sobre tu tiempo con nosotros?',
        kidsCorner: 'Rincón de los niños',
        diy: 'DIY',
        community: 'Comunidad',
        cancel: 'CANCELAR CUENTA'
      },
      creditCard: {
        backBtn: 'Volver a elegir plan',
        btnText: 'Empezar a aprender',
        title: 'INFORMACIÓN DE LA TARJETA DE CRÉDITO',
        subtitle: 'Necesitamos su información de tarjeta de crédito para confirmar quién es usted.',
        footer: 'Puede cancelar su prueba y membresía en cualquier momento desde la configuración de la cuenta.',
        success: '¡Método de pago agregado!',
        error: '¡No se pudo agregar el método de pago! Por favor, inténtelo de nuevo.'
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
    }
  })
}
