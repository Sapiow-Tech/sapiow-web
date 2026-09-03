export default {
  // Common
  hello: "Bonjour",
  continue: "Continuer",
  cancel: "Annuler",
  accept: "Accepter",
  loading: "Chargement...",
  error: "Erreur",
  success: "Succès",
  today: "Aujourd'hui",
  patient: "Patient",
  session: "Session",
  stripeActionRequiredTitle: "Une action est requise sur votre compte Stripe :",
  stripeCreateAccountRequired:
    "Vous devez créer un compte Stripe pour recevoir des paiements.",
  stripeCardPayments: "Paiements par carte",
  stripeTransfers: "Transferts",
  stripeManagedByOrganization:
    "Les paiements de votre organisation sont gérés par le propriétaire.",

  organization: {
    pageTitle: "Organisation",
    loading: "Chargement...",
    createTitle: "Créer une organisation",
    createDescription:
      "Devenez propriétaire et configurez le compte Stripe de votre organisation.",
    namePlaceholder: "Nom de l'organisation",
    createButton: "Créer l'organisation",
    joinTitle: "Rejoindre une organisation",
    joinDescription:
      "Saisissez le code d'invitation fourni par le propriétaire.",
    codePlaceholder: "Code d'invitation",
    joinButton: "Envoyer la demande",
    pendingTitle: "Demande en attente",
    pendingDescription:
      "Votre demande pour rejoindre {name} est en cours de validation.",
    refresh: "Actualiser",
    memberPaymentsInfo:
      "Les paiements de {name} passent par le compte Stripe de l'organisation.",
    memberRole: "Membre",
    ownerRole: "Propriétaire",
    leaveButton: "Quitter l'organisation",
    ownerTitle: "Mon organisation",
    save: "Enregistrer",
    inviteCode: "Code d'invitation",
    copy: "Copier",
    regenerate: "Régénérer",
    inviteCodeHelp:
      "Partagez ce code avec les experts que vous souhaitez inviter.",
    requests: "Demandes en attente",
    accept: "Accepter",
    refuse: "Refuser",
    members: "Membres",
    remove: "Retirer",
    unknownMember: "Expert",
    dissolve: "Dissoudre l'organisation",
    dissolveHint: "Retirez tous les membres avant de dissoudre l'organisation.",
    memberRevenueBlocked:
      "Les revenus et le compte bancaire sont gérés par le propriétaire de l'organisation.",
    creating: "Création en cours...",
    processing: "Traitement...",
    requestPending: "Demande en attente",
    dissolveConfirmTitle: "Dissoudre l'organisation",
    dissolveConfirmMessage:
      "Cette action est irréversible. L'organisation et son code d'invitation seront supprimés.",
    dissolveConfirmWarning:
      "Tous les membres perdront leur accès à l'organisation.",
    dissolveCancel: "Annuler",
    dissolveConfirm: "Dissoudre",
    leaveConfirmTitle: "Quitter l'organisation",
    leaveConfirmMessage:
      "Vous ne ferez plus partie de cette organisation. Vos paiements repasseront sur votre compte personnel.",
    leaveConfirm: "Quitter",
    removeConfirmTitle: "Retirer ce membre",
    removeConfirmMessage:
      "Êtes-vous sûr de vouloir retirer {name} de l'organisation ?",
    removeConfirm: "Retirer",
    pendingBadge: "En attente",
    description: "Description",
    descriptionPlaceholder: "Décrivez votre organisation...",
    changeImage: "Changer l'image",
    removeImage: "Supprimer l'image",
    team: "Équipe",
    revenueOrganizationTab: "Organisation",
    revenuePersonalTab: "Personnel",
    dashboardOrganizationTab: "Organisation",
    dashboardPersonalTab: "Personnel",
    organizationStripeTitle: "Compte Stripe de {name}",
    organizationStripeBadge: "Stripe organisation",
    personalEarningsTitle: "Mes revenus",
    personalRevenueOrgPayoutNote:
      "Les versements sont centralisés sur le compte Stripe de votre organisation.",
    revenueByMember: "Par membre",
    organizationStripeStatus: "Statut Stripe",
    organizationStripeValid: "Compte validé",
    organizationStripePending: "En attente de validation",
    organizationStripeNotConfigured: "Non configuré",
    configureStripe: "Configurer Stripe",
    organizationStripeActionRequired:
      "Complétez le Stripe de votre organisation pour recevoir les paiements.",
    assignedProWith: "Avec",
    otherMemberAppointment: "RDV d'un membre de l'équipe",
  },

  // Login Page
  login: {
    title: "Entrez votre numéro de téléphone",
    subtitle: "Vous allez recevoir un code pour vous connecter.",
    sendingCode: "Envoi en cours...",
    legalText: "J'ai lu et j'accepte les",
    termsOfService: "CGU",
    and: "et la",
    privacyPolicy: "Politique de Confidentialité",
    ofSapiow: "de Sapiow.",
  },

  // Verify Code Page
  verify: {
    title: "Entrez le code a 6 chiffres reçu par SMS",
    noCodeReceived: "Vous n'avez pas reçu le code ?",
    resend: "Renvoyer",
    sending: "Envoi...",
    changeNumber: "Changer de numéro",
    verifying: "Vérification...",
  },

  // Onboarding
  onboarding: {
    checkingProfile: "Vérification de votre profil...",
    whatDoYouWant: "Que voulez-vous faire sur Sapiow ?",
    lookingForExpert: "Je cherche un expert",
    iAmExpert: "Je suis un expert",
    // Common
    letsGetAcquainted: "Faisons connaissance",
    next: "Suivant",
    confirm: "Confirmer",
    registering: "Inscription en cours...",
    errorOccurred: "Une erreur est survenue lors de l'inscription",
    // Personal info
    firstName: "Votre prénom",
    lastName: "Votre nom de famille",
    email: "Votre email",
    profession: "Votre profession",
    // Seeker specific
    personalizeExperience:
      "Nous avons besoin de quelques informations pour personnaliser votre expérience.",
    preferredDomain: "Votre domaine préféré ?",
    highlightExperts:
      "Nous allons mettre en avant les experts qui vous intéressent le plus.",
    // Expert specific
    createExpertAccount:
      "Nous avons besoin de quelques informations pour personnaliser créer votre compte Expert.",
    exerciseDomain: "Dans quelle domaine exercez-vous ?",
    needDomainInfo:
      "Nous avons besoin de connaître votre domaine d'expertise pour vous proposer les meilleures opportunités.",
    specialties: "Vos spécialités",
    chooseSpecialties:
      "Choisissez vos spécialités dans le domaine sélectionné.",
    chooseYourSpecialties: "Choisissez vos spécialités",
    loadingExpertises: "Chargement des expertises...",
    noExpertisesAvailable: "Aucune expertise disponible pour ce domaine",
    aboutYou: "Parlez-nous de vous",
    describeYourself:
      "Décrivez-vous en quelques mots pour que vos futurs clients puissent mieux vous connaître.",
    aboutMePlaceholder:
      "Parlez-nous de votre parcours, de vos compétences et de ce qui vous passionne dans votre domaine...",
    linkedinUrl: "Lien LinkedIn (optionnel)",
    websiteUrl: "Site web (optionnel)",
    profilePhoto: "Photo de profil",
    addProfilePhoto:
      "Ajoutez une photo de profil pour que vos clients puissent vous identifier facilement.",
    visioConfig: "Configuration des visios",
    configureServices: "Configurez vos services de consultation vidéo.",
    skipForNow: "Passer pour le moment",
    completeProfile: "Terminer mon profil",
    later: "Plus tard",
    back: "Retour",
    validate: "Valider",
    skip: "Passer",
    finish: "Terminer",
    // Visio Configuration
    addFirstVisio: "Ajoutez votre première visio",
    minutes: "minutes",
    price: "Prix",
  },

  // Visios/Appointments
  visios: {
    upcoming: "A venir",
    pending: "En attente",
    history: "Historique",
    noUpcomingVisios: "Aucune visio confirmée à venir",
    noPendingRequests: "Aucune demande en attente",
    noHistoryVisios: "Aucune visio dans l'historique",
    startVideo: "Commencer la visio",
    duration: "45mn",
    cancelled: "Annulé",
    completed: "Terminé",
    // Session Card
    sessionDuration: "Visio de",
    viewDetails: "Voir détails",
    viewRequest: "Voir la demande",
    calendarAlt: "calendar",
    clockAlt: "clock",
    // Session Modal
    sessionDetail: "Détail de la visio",
    pendingRequest: "Demande en attente",
    requestedBy: "Demandé par :",
    sessionName: "Nom de la session :",
    questionsComments: "Questions ou commentaires",
    close: "Fermer",
    refuse: "Refuser",
    confirming: "Confirmation...",
    cancelling: "Annulation...",
    // Client page
    myVideoConferences: "Mes visioconférences",
    sessionInProgress: "Session en cours",
    loadingVideoConferences: "Chargement de vos visioconférences...",
    imminentAppointment: "Rendez-vous imminent",
    upcomingVideo: "Visio à venir",
    nextVideos: "Prochaines visios",
    noConfirmedUpcoming: "Aucune visioconférence confirmée à venir",
    noOtherScheduled: "Aucune autre visioconférence programmée",
  },

  // Navigation
  nav: {
    home: "Accueil",
    messages: "Messages",
    visios: "Visios",
    favorites: "Favoris",
    account: "Compte",
  },

  // Messages
  messages: {
    selectConversation: "Sélectionnez une conversation",
    selectConversationToView:
      "Sélectionnez une conversation pour voir les messages",
    loadingConversations: "Chargement des conversations...",
    errorLoadingMessages: "Erreur lors du chargement des messages",
    noMessagesInConversation: "Aucun message dans cette conversation",
    today: "Aujourd'hui",
    // Message Input
    messagePlaceholder: "Votre message",
    unsupportedFileType: "Type de fichier non supporté",
    fileAttached: "📎",
    imageAttached: "🖼️",
    photoTaken: "📷 Photo prise",
    audioRecording: "🎤 Enregistrement audio",
    cameraAccessError: "Impossible d'accéder à la caméra",
    microphoneAccessError: "Impossible d'accéder au microphone",
    takePhoto: "Prendre une photo",
    takePhotoButton: "📷 Prendre la photo",
    sendingError: "Erreur lors de l'envoi du message:",
    cameraAccessErrorLog: "Erreur accès caméra:",
    microphoneAccessErrorLog: "Erreur accès microphone:",
    // Conversations List
    conversationError: "Erreur:",
    noConversationsFound: "Aucune conversation trouvée",
  },

  // Availability Buttons
  availabilityButtons: {
    manageAvailability: "Gérer mes disponibilités",
    syncCalendars: "Synchroniser mes calendriers",
  },

  // Availability Sheet
  availabilitySheet: {
    title: "Gérer mes disponibilités",
    availablePeriod: "Période disponible",
    availability: "Disponibilité",
    availableDays: "Jours disponible",
    startDate: "Date début",
    endDate: "Date fin",
    selectPeriod: "Sélectionner une période",
    unavailable: "Indisponible",
    session: "session",
    sessions: "sessions",
    addSession: "Ajouter une session",
    to: "à",
    noPeriodDefined: "Aucune période définie",
    save: "Enregistrer",
    saving: "Enregistrement...",
    // Days of the week
    sunday: "Dimanche",
    monday: "Lundi",
    tuesday: "Mardi",
    wednesday: "Mercredi",
    thursday: "Jeudi",
    friday: "Vendredi",
    saturday: "Samedi",
    // Time periods
    oneMonth: "1 mois",
    threeMonths: "3 mois",
    sixMonths: "6 mois",
    oneYear: "1 an",
    month: "mois",
    months: "mois",
    day: "jour",
    days: "jours",
  },

  // Time Slots Manager
  timeSlotsManager: {
    selectDatePrompt: "Sélectionnez une date pour gérer les créneaux horaires",
    saving: "Sauvegarde...",
    addAvailability: "Ajouter une disponibilité",
    to: "à",
    selectStartTime: "Heure de début",
    selectEndTime: "Heure de fin",
  },

  // Block Day Section
  blockDaySection: {
    question: "Disponibilité pour ce jour ?",
    blocked: "Bloqué",
    unblocked: "Débloqué",
    title: "Bloquer cette journée ?",
    description: "Il n'est pas possible d'avoir une session à cette date.",
    unblockTitle: "Débloquer cette journée ?",
    unblockDescription: "Permettre les réservations pour cette date.",
  },

  // Disponibilites Page
  disponibilites: {
    sessionDetails: "Détails de la session",
    googleCalendarSync: "Synchronisation avec Google Agenda",
    googleCalendarDescription:
      "Connectez votre compte Google pour éviter les réservations en double.",
    googleCalendar: "Google Agenda",
    connected: "Connecté",
    connectedSince: "Connecté depuis le",
    notConnected: "Non connecté",
    connect: "Connecter",
    disconnect: "Déconnecter",
    syncAutomatic:
      "La synchronisation est automatique ! Vos rendez-vous sont synchronisés toutes les 15 minutes.",
  },

  // Google Calendar Connect
  googleCalendarConnect: {
    connecting: "Connexion...",
    connectButton: "Connecter Google Calendar",
  },

  // OAuth Callback
  oauthCallback: {
    connecting: "Connexion à Google Calendar en cours...",
    pleaseWait: "Veuillez patienter",
    error: "Erreur",
    redirecting: "Redirection vers la page des disponibilités...",
    missingCode: "Code d'autorisation manquant",
    connectionError: "Erreur de connexion",
    processingError: "Erreur lors du traitement de la connexion",
  },

  // Synced Calendars Sheet
  syncedCalendars: {
    title: "Calendriers synchronisés",
    disconnect: "Déconnecter",
    disconnecting: "Déconnexion...",
    addCalendar: "Ajouter un calendrier",
  },

  // Visio Sessions Config
  visioSessionsConfig: {
    loadingSessions: "Chargement des sessions...",
    loadingError: "Erreur lors du chargement des sessions",
    saving: "Sauvegarde en cours...",
    price: "Prix",
    expectations: "Attentes",
    questionExamples: "Exemples de questions",
    // Expectations list
    expectation1: "Posez trois questions ou plus",
    expectation2: "Conseils pour démarrer une entreprise prospère",
    expectation3: "Conseils pour obtenir vos 10 000 premiers clients",
    expectation4: "Astuces de croissance et démarrage de la croissance",
    // Question examples
    question1:
      "Je pense à créer une entreprise. Quelles sont les prochaines choses auxquelles je devrais me concentrer ?",
    question2: "Comment savoir si mon idée d'entreprise va fonctionner ?",
    question3: "Comment aborder votre le croissance de ma startup ?",
    // Editing actions
    add: "Ajouter",
    edit: "Modifier",
    finishEditing: "Terminer l'édition",
    // Empty states
    noQuestionsAvailable:
      "Aucune question disponible. Cliquez sur 'Ajouter' pour en créer une.",
    noExpectationsAvailable:
      "Aucune attente disponible. Cliquez sur 'Ajouter' pour en créer une.",
  },

  // Payment Page
  paymentPage: {
    pay: "Payer",
    loading: "Encours...",
    paymentError: "Erreur de paiement",
    orderSummary: "Récapitulatif de la commande",
    sessionWith: "Session avec",
    quantity: "Qté",
    subtotal: "Sous-total",
    serviceFee: "Frais de service",
    tax: "Taxe",
    totalAmount: "Montant total",
    addPromoCode: "Ajouter un code promotionnel",
    payWithoutLink: "Payer sans Link",
  },

  // Account Pages
  account: {
    profile: "Mon profil",
    availability: "Mes disponibilités",
    offers: "Mes offres",
    revenue: "Revenus",
    organization: "Organisation",
    paymentHistory: "Historique des paiements",
    notifications: "Notifications",
    language: "Langue",
    support: "Besoin d'aide ?",
    about: "A propos",
    legalMentions: "Mentions légales",
    logout: "Se déconnecter",
    loggingOut: "Déconnexion...",
    switchToExpert: "Passer en mode expert",
    switchToClient: "Passer en mode client",
    becomeExpert: "Devenez expert",
    becomeExpertDescription:
      "Devenez expert et accédez à notre plateforme pour offrir des consultations vidéo à votre audience.",
    learnMore: "En savoir plus",
    becomeExpertButton: "Devenir expert",
  },

  // Profile Pages
  profile: {
    loadingProfile: "Chargement du profil...",
    errorLoadingProfile: "Erreur lors du chargement du profil :",
    errorUpdatingProfile: "Erreur lors de la mise à jour :",
    // Form fields
    yourJob: "Votre métier",
    yourName: "Votre nom",
    linkedinLink: "Lien LinkedIn",
    website: "Site web",
    expertiseDomain: "Domaine d'expertise",
    noDomains: "Aucun domaine disponible",
    aboutYouPlaceholder: "À propos de vous",
    // Expertises
    specialties: "Spécialités",
    loadingExpertises: "Chargement des spécialités...",
    noExpertisesAvailable: "Aucune spécialité disponible pour ce domaine",
    specialtiesSelected: "spécialité(s) sélectionnée(s)",
    // Actions
    deleteAccount: "Supprimer mon compte",
    saving: "Sauvegarde...",
    saveChanges: "Enregistrer changement",
    // Photo Upload
    deletePhoto: "Supprimer la photo",
    uploading: "Upload en cours...",
    changePhoto: "Changer de photo",
    addPhoto: "Ajouter une photo",
    profilePhotoAlt: "Photo de profil",
    userIconAlt: "Icône utilisateur",
    uploadIconAlt: "Icône d'upload",
    // Delete Account Modal
    deleteAccountConfirmation:
      "Êtes-vous sûr de vouloir supprimer votre compte ?",
    deleteAccountWarning:
      "Cette action est irréversible. Toutes vos données seront définitivement supprimées.",
    cancelDelete: "Annuler",
    confirmDelete: "Supprimer",
    deleting: "Suppression...",
    cannotDeleteWithAppointments:
      "Impossible de supprimer votre compte. Vous avez des rendez-vous en attente ou confirmés. Veuillez d'abord annuler ou terminer tous vos rendez-vous.",
  },

  // Notification Settings
  notificationSettings: {
    appointmentNotifications: "Notifications de Rendez-vous",
    messageNotifications: "Notifications de Messagerie",
    promotionsNotifications: "Promotions & Offres spéciales",
    errorLoadingSettings:
      "Erreur lors du chargement des paramètres de notification",
    errorUpdatingSettings: "Erreur lors de la mise à jour des paramètres",
    // Page UI
    loadingSettings: "Chargement des paramètres...",
    smsNotifications: "Notifications par SMS",
    emailNotifications: "Notifications par Email",
  },

  // Legal Mentions
  legalMentions: {
    termsOfService: "CGU",
    privacyPolicy: "Politique de confidentialité",
    openSourceLicenses: "Licences Open Source",
    termsContent:
      "Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation de la plateforme Sapiow, accessible via notre site web et notre application mobile. Sapiow est une plateforme qui permet aux experts de s'inscrire et de proposer leurs services, et aux clients de consulter la liste des experts disponibles pour prendre rendez-vous avec eux. En utilisant Sapiow, vous acceptez de vous conformer à ces CGU. Sapiow se réserve le droit de modifier ces conditions à tout moment, et les utilisateurs seront informés des changements importants. L'utilisation continue de la plateforme après modification des CGU constitue une acceptation de ces modifications. Les experts s'engagent à fournir des informations exactes et à jour concernant leur profil, leurs compétences et leurs disponibilités. Les clients s'engagent à respecter les rendez-vous pris et à annuler dans un délai raisonnable si nécessaire. Sapiow n'est pas responsable de la qualité des services fournis par les experts, mais s'efforce de maintenir une communauté d'experts qualifiés.",
    privacyContent: `<h1><strong>POLITIQUE DE CONFIDENTIALITÉ</strong></h1>

<p><strong>Entrée en vigueur :</strong> 1er juillet 2026</p>

<p>Chez SAPIOW, le respect de votre vie privée et la protection de vos données personnelles sont notre priorité.</p>

<p>La présente politique de confidentialité (la « Politique de Confidentialité ») vise à vous informer sur les modalités de traitement de vos données personnelles dans le cadre de l'utilisation du site <a href="https://sapiow.com/">https://sapiow.com/</a> (le « Site ») et/ou de l'application Sapiow (l' « Application ») conformément au Règlement (UE) 2016/679 du 27 avril 2016 relatif à la protection des personnes physiques à l'égard du traitement des données à caractère personnel et à la libre circulation de ces données (le « RGPD ») et la Loi n° 78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés dans sa dernière version en vigueur (ensemble la « Réglementation Applicable »).</p>

<p>La présente Politique de Confidentialité ne décrit pas les modalités de collecte et de traitement de vos données via les cookies et autres traceurs (« Cookies ») sur le Site et/ou l'Application. Pour en savoir plus, veuillez consulter notre Politique Cookies.</p>

<h2><strong>Qui est le responsable de traitement ?</strong></h2>

<p>Lors de votre navigation et/ou votre inscription sur notre Site et/ou notre Application ou d'une manière plus générale dans le cadre de la gestion de nos relations contractuelles avec vous, le responsable de traitement est la société SAPIOW, inscrite au RCS de Rouen sous le n°107 277 550 dont le siège social est situé La Maison Bleue - 16 rue Alsace Lorraine 76000 Rouen. (« Nous », « Nos », « Notre »).</p>

<h2><strong>Quelles données collectons-nous ?</strong></h2>

<p>Une donnée personnelle est une donnée qui permet d'identifier un individu directement ou par recoupement avec d'autres données.</p>

<p>Nous collectons des données personnelles qui relèvent des catégories suivantes :</p>

<ul>
  <li>Des données d'identification (nom, prénom, adresse email, numéro de téléphone) ;</li>
  <li>Des données relatives à votre vie professionnelle (nom de l'entreprise, CV, poste/fonction, URL LinkedIn) ;</li>
  <li>Des données relatives à vos réseaux sociaux (profils ou pseudonyme) ;</li>
  <li>Des données relatives à vos achats sur le Site et/ou l'Application lorsque vous êtes mis en relation avec un Expert ;</li>
  <li>Des données de connexion (logs de connexion, mots de passe chiffrés) ;</li>
  <li>Des données de navigation (adresse IP, pages consultées, date et heure de connexion, navigateur utilisé, système d'exploitation, user ID, MAID) ;</li>
  <li>Des données économiques et financières (données relatives à vos cartes bancaires) ;</li>
  <li>Toute information que vous souhaitez nous transmettre dans le cadre de votre demande de contact ;</li>
  <li>Données techniques relatives aux appels vidéo : seules les métadonnées de connexion (durée, qualité réseau) sont traitées pour assurer la maintenance du service, dans le respect des normes de sécurité les plus strictes (SOC2, HIPAA).</li>
</ul>

<p>Pour libérer les conversations et assurer une hygiène numérique, SAPIOW garantit la confidentialité stricte de vos échanges via l'infrastructure sécurisée de son partenaire technique certifié.</p>

<p>SAPIOW s'engage formellement à ne jamais enregistrer le contenu de vos appels vidéo ; aucun flux audio ou vidéo et aucune retranscription ne sont enregistrés.</p>

<p>Les échanges sont chiffrés en transit et ne sont jamais stockés sur serveur. Il n'existe aucune archive : une fois l'appel vidéo terminé, le contenu est définitivement inexistant.</p>

<p>Nous n'avons aucun intérêt à exploiter vos données : elles ne sont jamais analysées, jamais vendues, ni utilisées pour l'entraînement de technologies tierces.</p>

<p>Les données obligatoires sont indiquées lorsque vous nous fournissez vos données. Elles sont signalées par tous moyens.</p>

<h2><strong>Précisions sur le traitement de vos données personnelles</strong></h2>

<div class="overflow-x-auto my-4">
  <table>
    <thead>
      <tr>
        <th>Finalités</th>
        <th>Bases légales</th>
        <th>Durées de conservation</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Fournir nos services disponibles sur notre Site et/ou notre Application via votre compte</td>
        <td>Exécution du contrat que vous avez souscrit avec Nous (i.e. : nos Conditions Générales d'Utilisation)</td>
        <td>
          <p>Lorsque vous vous êtes créé un compte : vos données sont conservées pour toute la durée de votre compte.</p>
          <p>Vos logs de connexion sont conservés pendant 6 mois ou 1 an.</p>
          <p>En cas de compte inactif pendant 2 ans, vos données personnelles seront supprimées en l'absence de réponse de votre part à notre email de réactivation.</p>
          <p>En outre, vos données peuvent être archivées à des fins probatoires pendant une durée de 5 ans.</p>
        </td>
      </tr>
      <tr>
        <td>Effectuer les opérations relatives à la gestion de nos clients concernant les achats et s'assurer du suivi de la relation contractuelle avec nos clients</td>
        <td>Exécution du contrat que vous avez souscrit avec Nous (i.e. : nos Conditions Générales d'Utilisation)</td>
        <td>
          <p>Les données personnelles sont conservées pendant toute la durée de la relation contractuelle.</p>
          <p>En outre, vos données (à l'exception de vos coordonnées bancaires) sont archivées à des fins probatoires pendant une durée de 5 ans.</p>
          <p>Concernant les données relatives à votre carte bancaire, elles sont conservées par notre prestataire de service de paiement disponible sur le Site et/ou l'Application selon ses propres conditions générales.</p>
          <p>Les données relatives au cryptogramme visuel ou CVV2, inscrit sur votre carte bancaire, ne sont pas stockées.</p>
        </td>
      </tr>
      <tr>
        <td>Constituer un fichier de prospects</td>
        <td>Notre intérêt légitime à développer et promouvoir notre activité</td>
        <td>Vos données sont conservées pendant un délai de 3 ans à compter de votre dernier contact avec nous.</td>
      </tr>
      <tr>
        <td>Nous conformer à nos obligations légales en matière de signalement des contenus illicites sur le Site et/ou l'Application</td>
        <td>Nous conformer à nos obligations légales et réglementaires dans le cadre de notre Site et/ou Application</td>
        <td>
          <p>Les données relatives à votre identité sont conservées pendant 5 ans à compter de la fin de la validité des CGU, de la fermeture de votre compte ou de la clôture du signalement.</p>
          <p>Les autres informations fournies par l'utilisateur, notamment les informations relatives au paiement sont conservées pendant un an à compter de la fin de la validité des CGU, de la fermeture de votre compte ou de la clôture du signalement.</p>
          <p>Les données techniques permettant d'identifier la source de la connexion ou celles relatives aux équipements terminaux utilisés sont conservées pendant une durée d'un an à compter de la connexion ou de l'utilisation des équipements terminaux.</p>
        </td>
      </tr>
      <tr>
        <td>Adresser des newsletters, sollicitations et messages promotionnels par email</td>
        <td>
          <p>Pour les clients : notre intérêt légitime à fidéliser et informer nos clients de nos dernières actualités</p>
          <p>Pour les prospects ou les clients n'ayant pas réservé de session avec un Expert sur le Site et/ou l'Application : votre consentement</p>
          <p>Pour les Experts professionnels : notre intérêt légitime à fidéliser et informer nos clients et prospects de nos dernières actualités</p>
        </td>
        <td>Les données sont conservées pendant 3 ans à compter de votre dernier contact avec nous ou jusqu'au retrait de votre consentement.</td>
      </tr>
      <tr>
        <td>Répondre à vos demandes d'information, de contact et/ou de démonstration</td>
        <td>L'exécution de mesures précontractuelles prises à votre demande</td>
        <td>Les données sont conservées pendant un délai de 3 ans à compter de votre dernier contact.</td>
      </tr>
      <tr>
        <td>Conserver les informations et documents administratifs liés à notre activité</td>
        <td>Nous conformer à nos obligations légales et règlementaires</td>
        <td>
          <p>Les factures sont archivées pendant une durée de 10 ans.</p>
          <p>Les données relatives à vos transactions (à l'exception des données bancaires) sont conservées pendant 5 ans.</p>
        </td>
      </tr>
      <tr>
        <td>Répondre aux demandes d'exercice de droits par les personnes concernées</td>
        <td>Nous conformer à nos obligations légales et réglementaires</td>
        <td>
          <p>Si nous vous demandons un justificatif d'identité : nous le conservons seulement pendant le temps nécessaire à la vérification d'identité. Une fois la vérification effectuée, le justificatif est supprimé.</p>
          <p>Si vous exercez votre droit d'opposition à recevoir de la prospection : nous conservons cette information pendant 3 ans.</p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

<h2><strong>Qui sont les destinataires de vos données ?</strong></h2>

<p>Auront accès à vos données à caractère personnel :</p>

<ul>
  <li>Le personnel de notre société ;</li>
  <li>Nos sous-traitants : prestataire d'hébergement, prestataire de création de site web, prestataire d'envoi de communication (emails et téléphone), prestataire de mesure et d'analyse d'audience, prestataire de messagerie électronique, prestataire de communication instantanée, prestataire de paiement sécurisé, outil de facturation, outil de gestion des cookies ;</li>
  <li>À toute autorité légalement habilitée à en connaître, en particulier les autorités judiciaires, policières ou administratives, si elles en font la demande.</li>
</ul>

<h2><strong>Vos données sont-elles susceptibles d'être transférées hors de l'Union européenne ?</strong></h2>

<p>Vos données sont conservées et stockées pendant toute la durée des traitements sur les serveurs de la société Supabase, situés dans l'Union européenne.</p>

<p>Dans le cadre des outils que nous utilisons (voir article sur les destinataires concernant nos sous-traitants), vos données sont susceptibles de faire l'objet de transferts hors de l'Union européenne. Le transfert de vos données dans ce cadre est sécurisé au moyen des outils suivants :</p>

<ul>
  <li>soit les données sont transférées dans un pays ayant fait l'objet d'une décision d'adéquation de la Commission européenne, conformément à l'article 45 du RGPD : dans ce cas, ce pays assure un niveau de protection jugé comme suffisant et adéquat aux dispositions du RGPD ;</li>
  <li>soit les données sont transférées dans un pays dont le niveau de protection des données n'a pas été reconnu comme adéquat au RGPD : dans ce cas ces transferts sont fondés sur des garanties appropriées indiquées à l'article 46 du RGPD, adaptées à chaque prestataire, notamment de façon non exhaustive la conclusion de clauses contractuelles types approuvées par la Commission Européenne, l'application de règles d'entreprises contraignantes ou en vertu d'un mécanisme de certification approuvé ;</li>
  <li>soit les données sont transférées sur le fondement de l'une des garanties appropriées décrites au Chapitre V du RGPD.</li>
</ul>

<p>Vous pouvez obtenir la copie des outils permettant les transferts de vos données hors Union européenne en nous contactant aux coordonnées indiquées à l'article « Quels sont vos droits sur vos données ? » ci-après.</p>

<h2><strong>Quels sont vos droits sur vos données ?</strong></h2>

<p>Vous disposez des droits suivants s'agissant de vos données personnelles :</p>

<ul>
  <li><strong>Droit à l'information</strong> : c'est justement la raison pour laquelle nous avons rédigé la présente Politique de Confidentialité. Ce droit est prévu par les articles 13 et 14 du RGPD.</li>
  <li><strong>Droit d'accès</strong> : vous avez le droit d'accéder à tout moment à l'ensemble de vos données personnelles, en vertu de l'article 15 du RGPD.</li>
  <li><strong>Droit de rectification</strong> : vous avez le droit de rectifier à tout moment vos données personnelles inexactes, incomplètes ou obsolètes conformément à l'article 16 du RGPD.</li>
  <li><strong>Droit à la limitation</strong> : vous avez le droit d'obtenir la limitation du traitement de vos données personnelles dans certains cas définis à l'article 18 du RGPD.</li>
  <li><strong>Droit à l'effacement</strong> : vous avez le droit d'exiger que vos données personnelles soient effacées, et d'en interdire toute collecte future pour les motifs énoncés à l'article 17 du RGPD.</li>
  <li><strong>Droit de définir des directives relatives à la conservation, à l'effacement et à la communication de vos données personnelles après votre mort.</strong></li>
  <li><strong>Droit de retirer votre consentement à tout moment</strong> : pour les finalités fondées sur le consentement, l'article 7 du RGPD indique que vous pouvez retirer votre consentement à tout moment. Ce retrait ne remettra pas en cause la légalité du traitement effectué avant le retrait.</li>
  <li><strong>Droit à la portabilité</strong> : selon certaines conditions précisées à l'article 20 du RGPD, vous avez le droit de recevoir les données personnelles que vous nous avez fournies dans un format standard lisible par machine et d'exiger leur transfert au destinataire de votre choix.</li>
  <li><strong>Droit d'opposition</strong> : en vertu de l'article 21 du RGPD, vous avez le droit de vous opposer au traitement de vos données personnelles. Notez toutefois que nous pourrons maintenir leur traitement malgré cette opposition, pour des motifs légitimes ou la défense de droits en justice.</li>
</ul>

<p>Vous pouvez exercer ces droits en nous écrivant à l'adresse suivante : <strong><a href="mailto:privacy@sapiow.com">privacy@sapiow.com</a></strong>.</p>

<p>Nous pourrons vous demander à cette occasion de nous fournir des informations complémentaires en cas de doute raisonnable voire tout document susceptible de justifier votre identité si le doute persiste.</p>

<p>Pour toute question ou requête qui serait restée infructueuse, vous êtes en droit d'introduire une réclamation auprès de l'autorité de contrôle compétente, en France, la Commission Nationale de l'Informatique et des Libertés (« CNIL »), située au 3 Place de Fontenoy - TSA 80715 - 75334 PARIS CEDEX 07.</p>

<h2><strong>Modifications</strong></h2>

<p>Nous pouvons modifier à tout moment la présente Politique de Confidentialité, afin notamment de nous conformer à toutes évolutions réglementaires, jurisprudentielles, éditoriales ou techniques. Ces modifications s'appliqueront à la date d'entrée en vigueur de la version modifiée. Vous êtes donc invité à consulter régulièrement la dernière version de cette politique. Néanmoins, nous vous tiendrons informé(e) de toute modification significative de la présente politique de confidentialité.</p>`,
    licensesContent:
      "Sapiow utilise plusieurs logiciels open source pour son fonctionnement. Nous sommes reconnaissants envers la communauté open source pour son travail remarquable. Notre application est construite avec Next.js sous licence MIT, React sous licence MIT, et utilise plusieurs bibliothèques comme TailwindCSS, React Query, et next-international pour la gestion des traductions. Toutes ces bibliothèques sont utilisées conformément à leurs licences respectives. Les licences complètes de ces logiciels sont disponibles dans notre dépôt de code ou sur demande. Nous nous engageons à respecter les termes des licences open source et à contribuer à la communauté open source lorsque cela est possible. Si vous êtes développeur et souhaitez contribuer à Sapiow, n'hésitez pas à nous contacter. Nous croyons en la puissance de la collaboration et du partage de connaissances pour créer des produits de qualité.",
  },

  // About Page
  about: {
    logoAlt: "Logo Sapiow",
    copyright: "© 2025 Sapiow. Tous droits réservés.",
    contactUs: "Contactez-nous",
    visitWebsite: "Visitez le site web",
  },

  // Support Page
  support: {
    title: "Comment pouvons-nous vous aider ?",
    searchPlaceholder: "Entrez votre mot-clé",
    noResultsFound: "Aucun résultat trouvé pour",
    // FAQ Data
    faq: {
      question1: "Comment créer un compte ?",
      answer1:
        "Ouvrez l'application Tradebase pour commencer et suivez les étapes. Tradebase ne facture pas de frais pour créer ou maintenir votre compte Tradebase.",
      question2: "Comment ajouter un moyen de paiement via cette application ?",
      answer2:
        "Pour ajouter un moyen de paiement, rendez-vous dans les paramètres de votre compte, sélectionnez 'Moyens de paiement' et suivez les instructions pour ajouter votre carte bancaire ou compte PayPal.",
      question3: "Question 3",
      answer3:
        "Réponse à la question 3. Vous pouvez ajouter ici toutes les informations pertinentes pour aider vos utilisateurs.",
      question4: "Question 4",
      answer4:
        "Réponse à la question 4. Cette section peut contenir des détails techniques ou des instructions étape par étape.",
    },
  },

  // Language Page
  languagePage: {
    french: "Français",
    english: "Anglais",
    errorChangingLanguage: "Erreur lors du changement de langue:",
    flagAlt: "Drapeau",
  },

  // Bank Account Section
  bankAccount: {
    title: "Votre Compte bancaire",
    bankAlt: "Banque",
    addRib: "Ajoutez votre RIB",
    add: "Ajouter",
    modify: "Modifier",
    completeConfig: "Compléter la configuration",
    incompleteConfig: "Configuration incomplète",
    bankUpdateError: "Erreur lors de la mise à jour du compte bancaire",
    inProgress: "En cours...",
    preparingRedirect: "Préparation de la redirection...",
    // Add Bank Account Modal
    addBankAccount: "Ajouter un compte bancaire",
    nameMatchId:
      "Assurez-vous que cela correspond au nom figurant sur votre pièce d'identité gouvernementale.",
    iban: "IBAN",
    bicSwift: "Code BIC/SWIFT",
  },

  // Revenue Page
  revenue: {
    totalEarnings: "Total des gains",
    // Filters
    thisMonth: "Ce mois-ci",
    thisQuarter: "Ce trimestre",
    custom: "Personnalisé",
    selectCustomPeriod: "Sélectionner une période personnalisée",
    selectedPeriod: "Période sélectionnée :",
    from: "Du",
    to: "au",
    // Transactions
    lastTransfer: "Dernier virement",
    nextTransfer: "Prochain virement",
    // Payment Status
    paid: "Payé",
    pending: "En attente",
    refunded: "Remboursé",
    // Calendar
    calendarAlt: "Calendrier",
    // Payment History
    noPaymentHistory:
      "Aucun historique de paiement disponible. Configurez votre compte de paiement pour commencer à recevoir des revenus.",
    errorLoadingPayments: "Erreur lors du chargement des paiements",
    noPaymentsFound: "Aucun paiement trouvé",
    unknownSession: "Session inconnue",
    locale: "fr",
  },

  // Offers Page
  offers: {
    // Offer Types
    videoSessions: "Sessions visio",
    monthlyAccompaniment: "Accompagnement mensuel",
    // Features
    oneOnOne: "Session individuelle 1:1",
    videoCall: "Appel vidéo",
    strategicSession: "Session stratégique",
    exclusiveResources: "Ressources exclusives",
    support: "Support client",
    mentorship: "Mentorat",
    webinar: "Webinaire",
    // Interface
    selectOfferToSeeDetails: "Sélectionnez une offre pour voir les détails",
    noOffersConfigured: "Aucune offre configurée",
    whatIsIncluded: "Ce qui est inclus",
    perMonth: "/ Mois",
    serviceFee: "Frais de service",
    discount: "Remise",
    // Actions
    delete: "Supprimer",
    deleting: "Suppression...",
    addOffer: "Ajouter une offre",
    createAccompaniment: "Créer un accompagnement",
    // Empty States
    noMonthlyAccompaniment:
      "Aucun accompagnement mensuel configuré pour le moment.",
    createFirstOffer:
      "Créez votre première offre d'accompagnement pour vos clients.",
    // Default Names
    monthlyAccompanimentDefault: "Accompagnement mensuel",
    // Add/Edit Session Modal
    addSession: "Ajouter une session",
    editSession: "Modifier la session",
    sessionName: "Nom de la session",
    sessionNamePlaceholder: "Ex: Consultation stratégique",
    price: "Prix (€)",
    pricePlaceholder: "Ex: 120",
    euroAlt: "Euro",
    includedFeatures: "Fonctionnalités incluses",
    addFeaturePlaceholder: "Ex: Support prioritaire, Ressources exclusives...",
    add: "Ajouter",
    adding: "Ajout...",
    deleteFeature: "Supprimer cette fonctionnalité",
    loadingFeatures: "Chargement des fonctionnalités...",
    noFeaturesYet: "Aucune fonctionnalité ajoutée. Ajoutez-en une ci-dessus.",
    createSessionFirst:
      "Créez d'abord la session pour ajouter des fonctionnalités.",
    sessionCreatedAddFeatures:
      "✅ Session créée ! Vous pouvez maintenant ajouter des fonctionnalités ci-dessous.",
    creating: "Création...",
    editing: "Modification...",
    // Offer Selection
    chooseOffer: "Choisissez une offre",
    singleSessions: "Sessions uniques",
    quickVideoSession: "Visio 1:1",
    perfectForSpecificQuestions: "Parfait pour des questions spécifiques",
    startingFrom: "À partir de",
    viewTimeSlots: "Voir les créneaux",
    noSlotsAvailable: "Aucun créneau disponible",
    monthlySubscriptions: "Abonnements mensuels",
    chooseAndPay: "Choisir et payer",
    creatingAppointment: "En cours...",
    // Features
    oneOnOneChat: "Chat 1:1",
    oneOnOneVideoCalls: "Appels vidéo 1:1",
    personalizedSupport: "Accompagnement personnalisé",
    strategySessions: "Sessions de stratégie",
  },

  // Expert Details Page
  expertDetails: {
    // Error States
    errorLoadingExpert: "Erreur lors du chargement de l'expert",
    expertNotFound: "Expert introuvable",
    // Expert Info
    about: "À propos",
    seeMore: "Voir plus",
    seeLess: "Voir moins",
    expertiseDomains: "Domaines d'expertise",
    revenueDestination: "La totalité des revenus sera destinée à",
    foundations: "760 fondations.",
    // Questions & Expectations
    questionsToAsk: "Questions à poser",
    expectations: "Attentes",
    visio15min: "Visio 15mn",
    // Sample Questions
    question1:
      "Je pense à créer une entreprise. Quelles sont les prochaines choses sur lesquelles je devrais me concentrer ?",
    question2: "Comment savoir si mon idée d'entreprise va fonctionner ?",
    question3: "Comment aborder vous la croissance de mon entreprise ?",
    question4:
      "Quels indicateurs clés devrais-je viser à différentes étapes pour être une entreprise de premier plan ?",
    // Expectations
    expectation1: "Posez trois questions ou plus",
    expectation2: "Conseils pour démarrer une entreprise prospère",
    expectation3: "Conseils pour obtenir vos 10 000 premiers clients",
    expectation4: "Astuces de croissance et démarrage de la croissance",
    // Empty States
    noQuestionsAvailable: "Aucune question nécessaire pour le moment",
    noExpectationsAvailable: "Aucune attente nécessaire pour le moment",
    // How it works
    howItWorks: "Comment ça marche ?",
    findExpert: "Trouvez un expert",
    findExpertDesc:
      "Découvrez et choisissez parmi notre liste des experts les plus recherchés au monde",
    bookOrSubscribe: "Réservez ou abonnez-vous",
    bookOrSubscribeDesc:
      "Réservez un appel vidéo unique ou choisissez un plan pour accéder à votre expert de manière continue",
    virtualConsultation: "Consultation virtuelle",
    virtualConsultationDesc:
      "Rejoignez l'appel vidéo ou le chat, posez des questions et obtenez des conseils d'expert",
    // Similar Experts
    similarExperts: "Experts similaires",
    noSimilarExperts: "Aucun expert similaire trouvé",
    seeAll: "Tout voir",
    // FAQ
    frequentQuestions: "Questions fréquentes",
    whatIsSapiow: "Qu'est-ce que Sapiow ?",
    whatIsSapiowAnswer:
      "Sapiow est une plateforme en ligne qui permet de réserver des experts pour des consultations vidéo, offrant aux utilisateurs un accès direct à des professionnels qualifiés dans divers domaines.",
    benefitsQuestion:
      "Quels sont les avantages d'utiliser Sapiow pour les utilisateurs ?",
    benefitsAnswer:
      "Sapiow offre un accès direct à des experts qualifiés, des consultations flexibles, et une plateforme sécurisée pour obtenir des conseils professionnels dans de nombreux domaines.",
    expertsTypesQuestion: "Quels types d'experts puis-je réserver sur Sapiow ?",
    expertsTypesAnswer:
      "Vous pouvez réserver des experts dans de nombreux domaines : business, santé, technologie, développement personnel, et bien d'autres spécialités.",
    qualityQuestion:
      "Comment Sapiow garantit-elle la qualité des experts disponibles ?",
    qualityAnswer:
      "Tous nos experts sont vérifiés et sélectionnés selon des critères stricts d'expertise, d'expérience et de qualifications professionnelles.",
    feesQuestion: "Quels sont les frais associés à l'utilisation de Sapiow ?",
    feesAnswer:
      "Les tarifs varient selon l'expert et le type de consultation. Vous pouvez choisir entre des sessions uniques ou des abonnements mensuels.",
    // Success Page
    congratulations: "Félicitations !",
    sessionBookedSuccess: "Votre session a été réservée avec succès !",
    addToCalendar: "Ajouter au calendrier",
  },
  // Session Detail Sheet
  sessionDetail: {
    title: "Détails",
    startVideo: "Commencer la visio",
    sendMessage: "Envoyer un message",
    askQuestion: "Poser une question",
    questionsAndAnswers: "Questions et réponses",
    noQuestions: "Aucune question posée pour le moment",
    noQuestionsDescription: "Posez votre première question à l'expert",
    writeQuestion: "Écrivez votre question...",
    send: "Envoyer",
    cancel: "Annuler",
    questionSubmitError: "Erreur lors de la soumission de la question",
    cancelAppointment: "Annuler le rendez-vous",
    confirmCancel: "Êtes-vous sûr de vouloir annuler ce rendez-vous ?",
    cancelWarning: "Cette action est irréversible.",
    confirmCancelButton: "Confirmer l'annulation",
    cancelling: "Annulation en cours...",
    cancelSuccess: "Rendez-vous annulé avec succès",
    cancelError: "Erreur lors de l'annulation du rendez-vous",
    dateNotAvailable: "Date non disponible",
    timeNotAvailable: "Heure non disponible",
    session: "Session",
    expert: "Expert",
    quickVideoSession: "Visio 1:1",
    bookSession: "Réserver une séance",
    // Alt texts
    congratulationAlt: "Félicitations",
    magnifierAlt: "Loupe",
    calendarAlt: "Calendrier",
    videoCameraAlt: "Caméra vidéo",
    // Questions section
    dontHesitateAskQuestions:
      "N'hésitez pas à poser vos questions avant la session",
    submitQuestionsAdvance:
      "Vous avez la possibilité de soumettre vos questions à l'avance afin que l'expert puisse mieux se préparer pour vous.",
    submitMyQuestions: "Soumettre mes questions",
    typeQuestionHere: "Tapez votre question ici...",
    addAnotherQuestion: "Ajoute une autre question",
    questionsOrComments: "Questions ou commentaires",
    viewDetails: "Voir détail",
    consultationWith: "Consultation avec",
    videoConsultation: "Consultation vidéo avec",
    // Edit/Delete questions
    edit: "Modifier",
    delete: "Supprimer",
    save: "Sauvegarder",
    confirmDeleteQuestion:
      "Êtes-vous sûr de vouloir supprimer cette question ?",
    questionUpdateError: "Erreur lors de la modification de la question",
    questionDeleteError: "Erreur lors de la suppression de la question",
  },

  // Dark Session Card / Upcoming Video Call
  upcomingCall: {
    now: "Maintenant",
    inDays: "Dans",
    day: "jour",
    days: "jours",
    inHours: "Dans",
    hours: "h",
    inMinutes: "Dans",
    minutes: "min",
    calendarAlt: "Calendrier",
    clockAlt: "Horloge",
  },

  // Video Call
  videoCall: {
    callEnded: "Appel terminé",
    error: "Erreur de connexion",
    loading: "Connexion en cours...",
    mute: "Couper le micro",
    unmute: "Activer le micro",
    camera: "Caméra",
    endCall: "Terminer l'appel",
  },

  // Categories
  categories: {
    media: "Médias",
    culture: "Culture",
    business: "Business",
    maison: "Maison",
    artisanat: "Artisanat",
    glow: "Bien-être",
    sport: "Sport",
    specializedIn: "spécialisé en",
  },

  // Calendar
  calendar: {
    // Default values
    defaultClient: "Client",
    defaultDuration: "30 min",
    defaultConsultation: "Consultation",
    // Days of week (array format)
    daysShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
    // Days of week (individual)
    sunday: "Dim",
    monday: "Lun",
    tuesday: "Mar",
    wednesday: "Mer",
    thursday: "Jeu",
    friday: "Ven",
    saturday: "Sam",
    // Months (array format)
    months: [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ],
    // Months (individual)
    january: "Janvier",
    february: "Février",
    march: "Mars",
    april: "Avril",
    may: "Mai",
    june: "Juin",
    july: "Juillet",
    august: "Août",
    september: "Septembre",
    october: "Octobre",
    november: "Novembre",
    december: "Décembre",
    // Status
    blocked: "Bloqué",
    // Planning
    planYourVisio: "Planifier votre visio",
    visioDuration: "Durée de la visio",
    availableSlots: "Créneaux disponibles",
    noSlotsAvailable: "Aucun créneau disponible pour ce jour.",
    selectAnotherDate: "Veuillez sélectionner une autre date.",
    complete: "Complet",
    // Booking
    minutes: "minutes",
    reserving: "Réservation...",
    reserve: "Réserver",
    reservationError: "Erreur lors de la réservation. Veuillez réessayer.",
    guestLoginHint:
      "Vous pourrez confirmer avec votre numéro de téléphone juste après.",
  },

  booking: {
    resume: {
      processing: "Finalisation de votre réservation...",
      slotUnavailable:
        "Ce créneau n'est plus disponible. Merci d'en choisir un autre.",
    },
  },

  // Payment
  payment: {
    success: "Paiement réussi !",
    processing: "Traitement du paiement...",
    failed: "Échec du paiement",
    redirecting: "Redirection en cours...",
  },

  // Home Pages
  home: {
    // Expert Dashboard
    hello: "Bonjour",
    user: "Utilisateur",
    visiosToday: "visio à venir aujourd'hui",
    visiosTodayPlural: "visios à venir aujourd'hui",
    youHave: "Vous avez",
    completedVisios: "Visios complétées",
    earningsSummary: "Résumé de gain",
    pendingRequests: "Demandes en attente",
    seeAll: "Tout voir",
    noPendingRequests: "Aucune demande en attente",
    nextVisio: "Prochaine visio",
    noScheduledVisio: "Aucune visio programmée",
    // Client Dashboard
    loadingExperts: "Chargement des experts...",
    errorLoadingExperts: "Erreur lors du chargement des experts",
    unknownError: "Erreur inconnue",
    yourNextVisio: "Votre prochaine visio",
    accelerateProject: "Accélérez votre projet. Réservez une Visio.",
    noTopExperts: "Aucun top expert disponible pour le moment.",
    // Search Mode
    searchResults: "Résultats de recherche pour",
    noResultsFound: "Aucun résultat trouvé",
    tryDifferentSearch: "Essayez avec d'autres mots-clés",
  },

  sponso: {
    sponsored: "Sponsorisé",
    carouselTitle: "À la une",
    defaultCta: "Réserver une visio",
    previous: "Précédent",
    next: "Suivant",
    membersTitle: "Nos experts",
    noMembers: "Aucun membre actif pour le moment.",
    organizationNotFound: "Organisation introuvable.",
    offeredBy: "Offert par {org}",
  },

  // Share Link Button
  shareLink: {
    defaultText: "Partagez votre lien de réservation",
    copied: "Lien copié !",
    copyError: "Erreur lors de la copie",
  },

  // Header
  header: {
    profileAlt: "Photo de profil",
    expertMode: "Mode expert",
    notifications: "Notifications",
    unreadSingular: "non lue",
    unreadPlural: "non lues",
    noNotifications: "Aucune notification",
    seeAllNotifications: "Voir toutes les notifications",
    markAsReadError: "Erreur lors du marquage de la notification comme lue",
    // Time formatting
    justNow: "À l'instant",
    minutesAgo: "Il y a",
    hoursAgo: "Il y a",
    minutes: "min",
    hours: "h",
  },

  // Header Client
  headerClient: {
    search: "Rechercher",
    searchPlaceholder: "Rechercher",
    searchAlt: "search",
    heartAlt: "heart",
    clientMode: "Mode client",
    becomeExpert: "Devenir un expert",
  },

  // Favorites Page
  favorites: {
    title: "Mes Favoris",
    loading: "Chargement de vos favoris...",
    error: "Erreur lors du chargement des favoris",
    unknownError: "Erreur inconnue",
    noFavorites: "Aucun professionnel en favori pour le moment",
    noFavoritesDescription:
      "Ajoutez des professionnels à vos favoris en cliquant sur le cœur",
  },

  // Payment History Page
  paymentHistory: {
    title: "Historique des paiements",
    loading: "Chargement de l'historique...",
    searchPlaceholder: "Montant, transaction ...",
    filterBy: "Filtrer par",
    allTransactions: "Toutes les transactions",
    completed: "Effectué",
    pending: "En attente",
    failed: "Échoué",
    transactionDetails: "Détails de la transaction",
    backToList: "Retour à la liste",
    amount: "Montant",
    expert: "Expert",
    session: "Session",
    dateTime: "Date et heure",
    status: "Statut",
    transactionId: "ID de transaction",
    noTransactions: "Aucune transaction trouvée",
    noTransactionsDescription:
      "Vos transactions apparaîtront ici une fois effectuées",
    selectTransaction: "Sélectionnez une transaction pour voir les détails",
    sendInvoice: "Envoyer la facture",
    cancelled: "Annulé",
    paymentConsultationWith: "Paiement consultation avec",
  },

  // Subscriptions (patient)
  subscriptions: {
    title: "Abonnements",
    subscriptionLabel: "Abonnement",
    statusLabel: "Statut",
    active: "Actif",
    cancelled: "Annulé",
    stop: "Arrêter",
    empty: "Aucun abonnement pour le moment.",
    modalTitle: "Annuler l’abonnement",
    modalQuestion: "Voulez-vous vraiment annuler cet abonnement ?",
    modalWarning: "Cette action est irréversible.",
    back: "Retour",
    confirmCancel: "Annuler",
    cancelling: "Annulation...",
    errorGeneric: "Une erreur est survenue.",
  },

  // Pro subscriptions (expert)
  proSubscriptions: {
    modalTitleStop: "Arrêter l’abonnement",
    modalTitleCancel: "Annuler l’abonnement",
    modalQuestionStop: "Voulez-vous vraiment arrêter cet abonnement ?",
    modalQuestionCancel: "Voulez-vous vraiment annuler cet abonnement ?",
    modalWarning: "Cette action est irréversible.",
    modalRefundInfo: "Cela rembourse le dernier paiement.",
    back: "Retour",
    confirm: "Confirmer",
    submitting: "Confirmation...",
  },

  // Phone Number Component
  phoneNumber: {
    label: "Numéro de téléphone",
    placeholder: "06 06 06 06 06",
    searchCountry: "Rechercher un pays...",
    noCountryFound: "Aucun pays trouvé",
    invalidNumber: "Numéro de téléphone invalide",
    required: "Ce champ est requis",
  },

  // Search Components
  search: {
    placeholder: "Rechercher",
    searchPlaceholder: "Rechercher",
    noResults: "Aucun résultat trouvé",
    searching: "Recherche en cours...",
  },

  // Page Header & Notifications
  pageHeader: {
    notifications: "Notifications",
    markAsRead: "Marquer comme lu",
    markAllAsRead: "Tout marquer comme lu",
    noNotifications: "Aucune notification",
    seeAllNotifications: "Voir toutes les notifications",
    justNow: "À l'instant",
    minutesAgo: "Il y a",
    hoursAgo: "Il y a",
    minutes: "min",
    hours: "h",
    notificationError: "Erreur lors du marquage de la notification comme lue",
  },

  // Session Details Panel
  sessionDetailsPanel: {
    noSessionToday: "Aucune session n'est prévue pour aujourd'hui.",
    addAvailability: "Ajouter une disponibilité",
    selectDateToView: "Sélectionnez une date pour voir les détails.",
    client: "Client",
    consultation: "Consultation",
  },

  // Toast Messages
  toast: {
    // Questions
    questionSubmitted: "Question soumise avec succès !",
    questionUpdated: "Question mise à jour avec succès !",
    questionSubmitError: "Erreur lors de la soumission de la question",
    questionUpdateError: "Erreur lors de la mise à jour de la question",

    // Appointments
    appointmentCreated: "Rendez-vous créé avec succès !",
    appointmentConfirmed: "Rendez-vous confirmé avec succès !",
    appointmentCancelled: "Rendez-vous annulé avec succès !",
    appointmentCreateError: "Erreur lors de la création du rendez-vous",
    appointmentUpdateError: "Erreur lors de la mise à jour du rendez-vous",
    appointmentCancelError: "Erreur lors de l'annulation du rendez-vous",

    // Date Blocking
    dateBlocked: "Date bloquée avec succès !",
    dateBlockError: "Erreur lors du blocage de la date",
    dateUnblocked: "Date débloquée avec succès !",
    dateUnblockError: "Erreur lors du déblocage de la date",

    // Allow Days (Périodes de disponibilité)
    allowDayCreated: "Période de disponibilité créée avec succès !",
    allowDayUpdated: "Période de disponibilité mise à jour avec succès !",
    allowDayDeleted: "Période de disponibilité supprimée avec succès !",
    allowDayCreateError: "Erreur lors de la création de la période",
    allowDayUpdateError: "Erreur lors de la mise à jour de la période",
    allowDayDeleteError: "Erreur lors de la suppression de la période",

    // Session Features (Fonctionnalités de session)
    sessionFeatureCreated: "Fonctionnalité créée avec succès !",
    sessionFeatureUpdated: "Fonctionnalité mise à jour avec succès !",
    sessionFeatureDeleted: "Fonctionnalité supprimée avec succès !",
    sessionFeatureCreateError:
      "Erreur lors de la création de la fonctionnalité",
    sessionFeatureUpdateError:
      "Erreur lors de la mise à jour de la fonctionnalité",
    sessionFeatureDeleteError:
      "Erreur lors de la suppression de la fonctionnalité",

    // Video Call
    callConnectionError: "Erreur lors de la connexion à l'appel vidéo",
    callTokenError: "Erreur lors de la récupération du token d'appel",
  },

  // Countries
  countries: {
    // Afrique
    DZ: "Algérie",
    AO: "Angola",
    BJ: "Bénin",
    BW: "Botswana",
    BF: "Burkina Faso",
    BI: "Burundi",
    CV: "Cap-Vert",
    CM: "Cameroun",
    CF: "République centrafricaine",
    TD: "Tchad",
    KM: "Comores",
    CG: "Congo",
    CD: "République démocratique du Congo",
    CI: "Côte d'Ivoire",
    DJ: "Djibouti",
    EG: "Égypte",
    GQ: "Guinée équatoriale",
    ER: "Érythrée",
    ET: "Éthiopie",
    GA: "Gabon",
    GM: "Gambie",
    GH: "Ghana",
    GN: "Guinée",
    GW: "Guinée-Bissau",
    KE: "Kenya",
    LS: "Lesotho",
    LR: "Libéria",
    LY: "Libye",
    MG: "Madagascar",
    MW: "Malawi",
    ML: "Mali",
    MR: "Mauritanie",
    MU: "Maurice",
    MA: "Maroc",
    MZ: "Mozambique",
    NA: "Namibie",
    NE: "Niger",
    NG: "Nigéria",
    RW: "Rwanda",
    ST: "Sao Tomé-et-Principe",
    SN: "Sénégal",
    SC: "Seychelles",
    SL: "Sierra Leone",
    SO: "Somalie",
    ZA: "Afrique du Sud",
    SS: "Soudan du Sud",
    SD: "Soudan",
    SZ: "Eswatini",
    TZ: "Tanzanie",
    TG: "Togo",
    TN: "Tunisie",
    UG: "Ouganda",
    ZM: "Zambie",
    ZW: "Zimbabwe",
    // Europe
    AD: "Andorre",
    AL: "Albanie",
    AT: "Autriche",
    BY: "Biélorussie",
    BE: "Belgique",
    BA: "Bosnie-Herzégovine",
    BG: "Bulgarie",
    HR: "Croatie",
    CY: "Chypre",
    CZ: "République tchèque",
    DK: "Danemark",
    EE: "Estonie",
    FI: "Finlande",
    FR: "France",
    DE: "Allemagne",
    GR: "Grèce",
    HU: "Hongrie",
    IS: "Islande",
    IE: "Irlande",
    IT: "Italie",
    LV: "Lettonie",
    LI: "Liechtenstein",
    LT: "Lituanie",
    LU: "Luxembourg",
    MT: "Malte",
    MD: "Moldavie",
    MC: "Monaco",
    ME: "Monténégro",
    NL: "Pays-Bas",
    MK: "Macédoine du Nord",
    NO: "Norvège",
    PL: "Pologne",
    PT: "Portugal",
    RO: "Roumanie",
    RU: "Russie",
    SM: "Saint-Marin",
    RS: "Serbie",
    SK: "Slovaquie",
    SI: "Slovénie",
    ES: "Espagne",
    SE: "Suède",
    CH: "Suisse",
    UA: "Ukraine",
    GB: "Royaume-Uni",
    VA: "Vatican",
    // Asie
    AF: "Afghanistan",
    AM: "Arménie",
    AZ: "Azerbaïdjan",
    BH: "Bahreïn",
    BD: "Bangladesh",
    BT: "Bhoutan",
    BN: "Brunéi",
    KH: "Cambodge",
    CN: "Chine",
    GE: "Géorgie",
    IN: "Inde",
    ID: "Indonésie",
    IR: "Iran",
    IQ: "Irak",
    IL: "Israël",
    JP: "Japon",
    JO: "Jordanie",
    KZ: "Kazakhstan",
    KW: "Koweït",
    KG: "Kirghizistan",
    LA: "Laos",
    LB: "Liban",
    MY: "Malaisie",
    MV: "Maldives",
    MN: "Mongolie",
    MM: "Myanmar",
    NP: "Népal",
    KP: "Corée du Nord",
    OM: "Oman",
    PK: "Pakistan",
    PS: "Palestine",
    PH: "Philippines",
    QA: "Qatar",
    SA: "Arabie saoudite",
    SG: "Singapour",
    KR: "Corée du Sud",
    LK: "Sri Lanka",
    SY: "Syrie",
    TW: "Taïwan",
    TJ: "Tadjikistan",
    TH: "Thaïlande",
    TL: "Timor oriental",
    TR: "Turquie",
    TM: "Turkménistan",
    AE: "Émirats arabes unis",
    UZ: "Ouzbékistan",
    VN: "Viêt Nam",
    YE: "Yémen",
    // Amérique du Nord
    CA: "Canada",
    MX: "Mexique",
    US: "États-Unis",
    // Amérique centrale
    BZ: "Belize",
    CR: "Costa Rica",
    SV: "Salvador",
    GT: "Guatemala",
    HN: "Honduras",
    NI: "Nicaragua",
    PA: "Panama",
    // Amérique du Sud
    AR: "Argentine",
    BO: "Bolivie",
    BR: "Brésil",
    CL: "Chili",
    CO: "Colombie",
    EC: "Équateur",
    FK: "Îles Malouines",
    GF: "Guyane française",
    GY: "Guyana",
    PY: "Paraguay",
    PE: "Pérou",
    SR: "Suriname",
    UY: "Uruguay",
    VE: "Venezuela",
    // Caraïbes
    AG: "Antigua-et-Barbuda",
    BS: "Bahamas",
    BB: "Barbade",
    CU: "Cuba",
    DM: "Dominique",
    DO: "République dominicaine",
    GD: "Grenade",
    HT: "Haïti",
    JM: "Jamaïque",
    KN: "Saint-Christophe-et-Niévès",
    LC: "Sainte-Lucie",
    VC: "Saint-Vincent-et-les Grenadines",
    TT: "Trinité-et-Tobago",
    // Océanie
    AU: "Australie",
    FJ: "Fidji",
    KI: "Kiribati",
    MH: "Îles Marshall",
    FM: "Micronésie",
    NR: "Nauru",
    NZ: "Nouvelle-Zélande",
    PW: "Palaos",
    PG: "Papouasie-Nouvelle-Guinée",
    WS: "Samoa",
    SB: "Îles Salomon",
    TO: "Tonga",
    TV: "Tuvalu",
    VU: "Vanuatu",
  },
} as const;
