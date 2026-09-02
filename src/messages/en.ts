export default {
  // Common
  hello: "Hello",
  continue: "Continue",
  cancel: "Cancel",
  accept: "Accept",
  loading: "Loading...",
  error: "Error",
  success: "Success",
  today: "Today",
  patient: "Patient",
  session: "Session",
  stripeActionRequiredTitle: "Action required on your Stripe account:",
  stripeCreateAccountRequired: "Create your Stripe account to receive payouts",
  stripeCardPayments: "Card payments",
  stripeTransfers: "Transfers",
  stripeManagedByOrganization:
    "Your organization's payments are managed by the owner.",

  organization: {
    pageTitle: "Organization",
    loading: "Loading...",
    createTitle: "Create an organization",
    createDescription:
      "Become the owner and set up your organization's Stripe account.",
    namePlaceholder: "Organization name",
    createButton: "Create organization",
    joinTitle: "Join an organization",
    joinDescription: "Enter the invite code provided by the owner.",
    codePlaceholder: "Invite code",
    joinButton: "Submit request",
    pendingTitle: "Request pending",
    pendingDescription:
      "Your request to join {name} is awaiting approval.",
    refresh: "Refresh",
    memberPaymentsInfo:
      "Payments for {name} go through the organization's Stripe account.",
    memberRole: "Member",
    ownerRole: "Owner",
    leaveButton: "Leave organization",
    ownerTitle: "My organization",
    save: "Save",
    inviteCode: "Invite code",
    copy: "Copy",
    regenerate: "Regenerate",
    inviteCodeHelp: "Share this code with experts you want to invite.",
    requests: "Pending requests",
    accept: "Accept",
    refuse: "Decline",
    members: "Members",
    remove: "Remove",
    unknownMember: "Expert",
    dissolve: "Dissolve organization",
    dissolveHint: "Remove all members before dissolving the organization.",
    memberRevenueBlocked:
      "Revenue and bank account are managed by the organization owner.",
    creating: "Creating...",
    processing: "Processing...",
    requestPending: "Pending request",
    dissolveConfirmTitle: "Dissolve organization",
    dissolveConfirmMessage:
      "This action cannot be undone. The organization and its invite code will be deleted.",
    dissolveConfirmWarning:
      "All members will lose access to the organization.",
    dissolveCancel: "Cancel",
    dissolveConfirm: "Dissolve",
    leaveConfirmTitle: "Leave organization",
    leaveConfirmMessage:
      "You will no longer be part of this organization. Your payments will go back to your personal account.",
    leaveConfirm: "Leave",
    removeConfirmTitle: "Remove member",
    removeConfirmMessage:
      "Are you sure you want to remove {name} from the organization?",
    removeConfirm: "Remove",
    pendingBadge: "Pending",
    description: "Description",
    descriptionPlaceholder: "Describe your organization...",
    changeImage: "Change image",
    removeImage: "Remove image",
    team: "Team",
    revenueOrganizationTab: "Organization",
    revenuePersonalTab: "Personal",
    dashboardOrganizationTab: "Organization",
    dashboardPersonalTab: "Personal",
    organizationStripeTitle: "Stripe account for {name}",
    organizationStripeBadge: "Organization Stripe",
    personalEarningsTitle: "My earnings",
    personalRevenueOrgPayoutNote:
      "Payouts are centralized on your organization's Stripe account.",
    revenueByMember: "By member",
    organizationStripeStatus: "Stripe status",
    organizationStripeValid: "Account verified",
    organizationStripePending: "Pending verification",
    organizationStripeNotConfigured: "Not configured",
    configureStripe: "Configure Stripe",
    organizationStripeActionRequired:
      "Complete your organization's Stripe setup to receive payments.",
    assignedProWith: "With",
    otherMemberAppointment: "Team member appointment",
  },

  // Login Page
  login: {
    title: "Enter your phone number",
    subtitle: "You will receive a code to log in.",
    sendingCode: "Sending...",
    legalText: "I have read and accept the",
    termsOfService: "Terms of Use",
    and: "and the",
    privacyPolicy: "Privacy Policy",
    ofSapiow: "of Sapiow.",
  },

  // Verify Code Page
  verify: {
    title: "Enter the 6-digit code received by SMS",
    noCodeReceived: "Didn't receive the code?",
    resend: "Resend",
    sending: "Sending...",
    changeNumber: "Change number",
    verifying: "Verifying...",
  },

  // Onboarding
  onboarding: {
    checkingProfile: "Checking your profile...",
    whatDoYouWant: "What do you want to do on Sapiow?",
    lookingForExpert: "I'm looking for an expert",
    iAmExpert: "I am an expert",
    // Common
    letsGetAcquainted: "Let's get acquainted",
    next: "Next",
    confirm: "Confirm",
    registering: "Registering...",
    errorOccurred: "An error occurred during registration",
    // Personal info
    firstName: "Your first name",
    lastName: "Your last name",
    email: "Your email",
    profession: "Your profession",
    // Seeker specific
    personalizeExperience:
      "We need some information to personalize your experience.",
    preferredDomain: "Your preferred domain?",
    highlightExperts: "We will highlight the experts that interest you most.",
    // Expert specific
    createExpertAccount:
      "We need some information to create your Expert account.",
    exerciseDomain: "What domain do you practice in?",
    needDomainInfo:
      "We need to know your domain of expertise to offer you the best opportunities.",
    specialties: "Your specialties",
    chooseSpecialties: "Choose your specialties in the selected domain.",
    chooseYourSpecialties: "Choose your specialties",
    loadingExpertises: "Loading expertises...",
    noExpertisesAvailable: "No expertise available for this domain",
    aboutYou: "Tell us about yourself",
    describeYourself:
      "Describe yourself in a few words so your future clients can get to know you better.",
    aboutMePlaceholder:
      "Tell us about your background, your skills and what you are passionate about in your field...",
    linkedinUrl: "LinkedIn URL (optional)",
    websiteUrl: "Website (optional)",
    profilePhoto: "Profile photo",
    addProfilePhoto:
      "Add a profile photo so your clients can easily identify you.",
    visioConfig: "Video configuration",
    configureServices: "Configure your video consultation services.",
    skipForNow: "Skip for now",
    completeProfile: "Complete my profile",
    later: "Later",
    back: "Back",
    validate: "Validate",
    skip: "Skip",
    finish: "Finish",
    // Visio Configuration
    addFirstVisio: "Add your first video session",
    minutes: "minutes",
    price: "Price",
  },

  // Visios/Appointments
  visios: {
    upcoming: "Upcoming",
    pending: "Pending",
    history: "History",
    noUpcomingVisios: "No upcoming confirmed video calls",
    noPendingRequests: "No pending requests",
    noHistoryVisios: "No video calls in history",
    startVideo: "Start video call",
    duration: "45min",
    cancelled: "Cancelled",
    completed: "Completed",
    // Session Card
    sessionDuration: "Video call of",
    viewDetails: "View details",
    viewRequest: "View request",
    calendarAlt: "calendar",
    clockAlt: "clock",
    // Session Modal
    sessionDetail: "Video call details",
    pendingRequest: "Pending request",
    requestedBy: "Requested by:",
    sessionName: "Session name:",
    questionsComments: "Questions or comments",
    close: "Close",
    refuse: "Decline",
    confirming: "Confirming...",
    cancelling: "Cancelling...",
    // Client page
    myVideoConferences: "My video conferences",
    sessionInProgress: "Session in progress",
    loadingVideoConferences: "Loading your video conferences...",
    imminentAppointment: "Imminent appointment",
    upcomingVideo: "Upcoming video",
    nextVideos: "Next videos",
    noConfirmedUpcoming: "No confirmed upcoming video conferences",
    noOtherScheduled: "No other scheduled video conferences",
  },

  // Navigation
  nav: {
    home: "Home",
    messages: "Messages",
    visios: "Video Calls",
    favorites: "Favorites",
    account: "Account",
  },

  // Messages
  messages: {
    selectConversation: "Select a conversation",
    selectConversationToView: "Select a conversation to view messages",
    loadingConversations: "Loading conversations...",
    errorLoadingMessages: "Error loading messages",
    noMessagesInConversation: "No messages in this conversation",
    today: "Today",
    // Message Input
    messagePlaceholder: "Your message",
    unsupportedFileType: "Unsupported file type",
    fileAttached: "📎",
    imageAttached: "🖼️",
    photoTaken: "📷 Photo taken",
    audioRecording: "🎤 Audio recording",
    cameraAccessError: "Unable to access camera",
    microphoneAccessError: "Unable to access microphone",
    takePhoto: "Take a photo",
    takePhotoButton: "📷 Take photo",
    sendingError: "Error sending message:",
    cameraAccessErrorLog: "Camera access error:",
    microphoneAccessErrorLog: "Microphone access error:",
    // Conversations List
    conversationError: "Error:",
    noConversationsFound: "No conversations found",
  },

  // Availability Buttons
  availabilityButtons: {
    manageAvailability: "Manage my availability",
    syncCalendars: "Sync my calendars",
  },

  // Availability Sheet
  availabilitySheet: {
    title: "Manage my availability",
    availablePeriod: "Available period",
    availability: "Availability",
    availableDays: "Available days",
    startDate: "Start date",
    endDate: "End date",
    selectPeriod: "Select a period",
    unavailable: "Unavailable",
    session: "session",
    sessions: "sessions",
    addSession: "Add session",
    to: "to",
    noPeriodDefined: "No period defined",
    save: "Save",
    saving: "Saving...",
    // Days of the week
    sunday: "Sunday",
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    // Time periods
    oneMonth: "1 month",
    threeMonths: "3 months",
    sixMonths: "6 months",
    oneYear: "1 year",
    month: "month",
    months: "months",
    day: "day",
    days: "days",
  },

  // Time Slots Manager
  timeSlotsManager: {
    selectDatePrompt: "Select a date to manage time slots",
    saving: "Saving...",
    addAvailability: "Add availability",
    to: "to",
    selectStartTime: "Start time",
    selectEndTime: "End time",
  },

  // Block Day Section
  blockDaySection: {
    question: "Availability for this day?",
    blocked: "Blocked",
    unblocked: "Unblocked",
    title: "Block this day?",
    description: "It is not possible to have a session on this date.",
    unblockTitle: "Unblock this day?",
    unblockDescription: "Allow bookings for this date.",
  },

  // Disponibilites Page
  disponibilites: {
    sessionDetails: "Session details",
    googleCalendarSync: "Google Calendar synchronization",
    googleCalendarDescription:
      "Connect your Google account to avoid double bookings.",
    googleCalendar: "Google Calendar",
    connected: "Connected",
    connectedSince: "Connected since",
    notConnected: "Not connected",
    connect: "Connect",
    disconnect: "Disconnect",
    syncAutomatic:
      "Synchronization is automatic! Your appointments are synced every 15 minutes.",
  },

  // Google Calendar Connect
  googleCalendarConnect: {
    connecting: "Connecting...",
    connectButton: "Connect Google Calendar",
  },

  // OAuth Callback
  oauthCallback: {
    connecting: "Connecting to Google Calendar...",
    pleaseWait: "Please wait",
    error: "Error",
    redirecting: "Redirecting to availability page...",
    missingCode: "Authorization code missing",
    connectionError: "Connection error",
    processingError: "Error processing connection",
  },

  // Synced Calendars Sheet
  syncedCalendars: {
    title: "Synced calendars",
    disconnect: "Disconnect",
    disconnecting: "Disconnecting...",
    addCalendar: "Add a calendar",
  },

  // Visio Sessions Config
  visioSessionsConfig: {
    loadingSessions: "Loading sessions...",
    loadingError: "Error loading sessions",
    saving: "Saving...",
    price: "Price",
    expectations: "Expectations",
    questionExamples: "Question examples",
    // Expectations list
    expectation1: "Ask three or more questions",
    expectation2: "Advice for starting a successful business",
    expectation3: "Advice for getting your first 10,000 customers",
    expectation4: "Growth tips and startup scaling",
    // Question examples
    question1:
      "I'm thinking about starting a business. What are the next things I should focus on?",
    question2: "How do I know if my business idea will work?",
    question3: "How should I approach growing my startup?",
    // Editing actions
    add: "Add",
    edit: "Edit",
    finishEditing: "Finish editing",
    // Empty states
    noQuestionsAvailable: "No questions available. Click 'Add' to create one.",
    noExpectationsAvailable:
      "No expectations available. Click 'Add' to create one.",
  },

  // Payment Page
  paymentPage: {
    pay: "Pay",
    loading: "Loading...",
    paymentError: "Payment error",
    orderSummary: "Order Summary",
    sessionWith: "Session with",
    quantity: "Qty",
    subtotal: "Subtotal",
    serviceFee: "Service fee",
    tax: "Tax",
    totalAmount: "Total Amount",
    addPromoCode: "Add promo code",
    payWithoutLink: "Pay without Link",
  },

  // Account Pages
  account: {
    profile: "My Profile",
    availability: "My Availability",
    offers: "My Offers",
    revenue: "Revenue",
    organization: "Organization",
    paymentHistory: "Payment History",
    notifications: "Notifications",
    language: "Language",
    support: "Need Help?",
    about: "About",
    legalMentions: "Legal Mentions",
    logout: "Logout",
    loggingOut: "Logging out...",
    switchToExpert: "Switch to Expert Mode",
    switchToClient: "Switch to Client Mode",
    becomeExpert: "Become an Expert",
    becomeExpertDescription:
      "Become an expert and access our platform to offer video consultations to your audience.",
    learnMore: "Learn More",
    becomeExpertButton: "Become Expert",
  },

  // Profile Pages
  profile: {
    loadingProfile: "Loading profile...",
    errorLoadingProfile: "Error loading profile:",
    errorUpdatingProfile: "Error updating profile:",
    // Form fields
    yourJob: "Your job",
    yourName: "Your name",
    linkedinLink: "LinkedIn link",
    website: "Website",
    expertiseDomain: "Expertise domain",
    noDomains: "No domains available",
    aboutYouPlaceholder: "About you",
    // Expertises
    specialties: "Specialties",
    loadingExpertises: "Loading specialties...",
    noExpertisesAvailable: "No specialties available for this domain",
    specialtiesSelected: "specialty(ies) selected",
    // Actions
    deleteAccount: "Delete my account",
    saving: "Saving...",
    saveChanges: "Save changes",
    // Photo Upload
    deletePhoto: "Delete photo",
    uploading: "Uploading...",
    changePhoto: "Change photo",
    addPhoto: "Add photo",
    profilePhotoAlt: "Profile photo",
    userIconAlt: "User icon",
    uploadIconAlt: "Upload icon",
    // Delete Account Modal
    deleteAccountConfirmation: "Are you sure you want to delete your account?",
    deleteAccountWarning:
      "This action is irreversible. All your data will be permanently deleted.",
    cancelDelete: "Cancel",
    confirmDelete: "Delete",
    deleting: "Deleting...",
    cannotDeleteWithAppointments:
      "Cannot delete your account. You have pending or confirmed appointments. Please cancel or complete all your appointments first.",
  },

  // Notification Settings
  notificationSettings: {
    appointmentNotifications: "Appointment Notifications",
    messageNotifications: "Message Notifications",
    promotionsNotifications: "Promotions & Special Offers",
    errorLoadingSettings: "Error loading notification settings",
    errorUpdatingSettings: "Error updating settings",
    // Page UI
    loadingSettings: "Loading settings...",
    smsNotifications: "SMS Notifications",
    emailNotifications: "Email Notifications",
  },

  // Legal Mentions
  legalMentions: {
    termsOfService: "Terms of Use",
    privacyPolicy: "Privacy Policy",
    openSourceLicenses: "Open Source Licenses",
    termsContent:
      "These Terms of Use govern the use of the Sapiow platform, accessible via our website and mobile application. Sapiow is a platform that allows experts to register and offer their services, and clients to view the list of available experts to schedule appointments with them. By using Sapiow, you agree to comply with these Terms of Use. Sapiow reserves the right to modify these terms at any time, and users will be informed of significant changes. Continued use of the platform after modification of the Terms of Use constitutes acceptance of these changes. Experts commit to providing accurate and up-to-date information regarding their profile, skills, and availability. Clients commit to respecting scheduled appointments and canceling within a reasonable timeframe if necessary. Sapiow is not responsible for the quality of services provided by experts, but strives to maintain a community of qualified experts.",
    privacyContent: `<h1><strong>PRIVACY POLICY</strong></h1>

<p><strong>Effective date:</strong> July 1, 2026</p>

<p>At SAPIOW, respecting your privacy and protecting your personal data is our priority.</p>

<p>This privacy policy (the "Privacy Policy") is intended to inform you about how your personal data is processed when you use the website <a href="https://sapiow.com/">https://sapiow.com/</a> (the "Website") and/or the Sapiow application (the "Application"), in accordance with Regulation (EU) 2016/679 of 27 April 2016 on the protection of natural persons with regard to the processing of personal data and on the free movement of such data (the "GDPR") and French Law No. 78-17 of 6 January 1978 on information technology, data files and civil liberties, as amended (together, the "Applicable Regulations").</p>

<p>This Privacy Policy does not describe how your data is collected and processed via cookies and other trackers ("Cookies") on the Website and/or the Application. For more information, please refer to our Cookie Policy.</p>

<h2><strong>Who is the data controller?</strong></h2>

<p>When you browse and/or register on our Website and/or our Application, or more generally in the context of managing our contractual relationship with you, the data controller is SAPIOW, registered with the Rouen Trade and Companies Register under number 107 277 550, whose registered office is located at La Maison Bleue - 16 rue Alsace Lorraine 76000 Rouen ("We", "Us", "Our").</p>

<h2><strong>What data do we collect?</strong></h2>

<p>Personal data is any information that allows an individual to be identified directly or by cross-referencing with other data.</p>

<p>We collect personal data falling within the following categories:</p>

<ul>
  <li>Identification data (last name, first name, email address, phone number);</li>
  <li>Professional life data (company name, CV, position/job title, LinkedIn URL);</li>
  <li>Social network data (profiles or username);</li>
  <li>Data relating to your purchases on the Website and/or the Application when you are connected with an Expert;</li>
  <li>Connection data (connection logs, encrypted passwords);</li>
  <li>Browsing data (IP address, pages viewed, date and time of connection, browser used, operating system, user ID, MAID);</li>
  <li>Economic and financial data (data relating to your bank cards);</li>
  <li>Any information you wish to send us as part of your contact request;</li>
  <li>Technical data relating to video calls: only connection metadata (duration, network quality) is processed to ensure service maintenance, in compliance with the strictest security standards (SOC2, HIPAA).</li>
</ul>

<p>To enable open conversations and ensure digital hygiene, SAPIOW guarantees the strict confidentiality of your exchanges through the secure infrastructure of its certified technical partner.</p>

<p>SAPIOW formally undertakes never to record the content of your video calls; no audio or video streams and no transcriptions are recorded.</p>

<p>Exchanges are encrypted in transit and are never stored on servers. There is no archive: once the video call has ended, the content permanently ceases to exist.</p>

<p>We have no interest in exploiting your data: it is never analyzed, never sold, nor used to train third-party technologies.</p>

<p>Mandatory data fields are indicated when you provide your data to us. They are marked by any appropriate means.</p>

<h2><strong>Details on the processing of your personal data</strong></h2>

<div class="overflow-x-auto my-4">
  <table>
    <thead>
      <tr>
        <th>Purposes</th>
        <th>Legal bases</th>
        <th>Retention periods</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Providing our services available on our Website and/or our Application through your account</td>
        <td>Performance of the contract you have entered into with Us (i.e., our Terms of Use)</td>
        <td>
          <p>When you have created an account: your data is retained for the entire duration of your account.</p>
          <p>Your connection logs are retained for 6 months or 1 year.</p>
          <p>In the event of an inactive account for 2 years, your personal data will be deleted if you do not respond to our reactivation email.</p>
          <p>In addition, your data may be archived for evidentiary purposes for a period of 5 years.</p>
        </td>
      </tr>
      <tr>
        <td>Carrying out operations relating to the management of our customers concerning purchases and ensuring follow-up of the contractual relationship with our customers</td>
        <td>Performance of the contract you have entered into with Us (i.e., our Terms of Use)</td>
        <td>
          <p>Personal data is retained for the entire duration of the contractual relationship.</p>
          <p>In addition, your data (with the exception of your bank details) is archived for evidentiary purposes for a period of 5 years.</p>
          <p>With regard to data relating to your bank card, it is retained by our payment service provider available on the Website and/or the Application in accordance with its own terms and conditions.</p>
          <p>Data relating to the card security code or CVV2 printed on your bank card is not stored.</p>
        </td>
      </tr>
      <tr>
        <td>Building a prospect database</td>
        <td>Our legitimate interest in developing and promoting our business</td>
        <td>Your data is retained for a period of 3 years from your last contact with us.</td>
      </tr>
      <tr>
        <td>Complying with our legal obligations regarding the reporting of unlawful content on the Website and/or the Application</td>
        <td>Compliance with our legal and regulatory obligations in the context of our Website and/or Application</td>
        <td>
          <p>Data relating to your identity is retained for 5 years from the end of the validity of the Terms of Use, the closure of your account, or the closure of the report.</p>
          <p>Other information provided by the user, in particular payment-related information, is retained for one year from the end of the validity of the Terms of Use, the closure of your account, or the closure of the report.</p>
          <p>Technical data enabling the source of the connection to be identified, or data relating to the terminal equipment used, is retained for a period of one year from the connection or use of the terminal equipment.</p>
        </td>
      </tr>
      <tr>
        <td>Sending newsletters, solicitations and promotional messages by email</td>
        <td>
          <p>For customers: our legitimate interest in retaining and informing our customers of our latest news</p>
          <p>For prospects or customers who have not booked a session with an Expert on the Website and/or the Application: your consent</p>
          <p>For professional Experts: our legitimate interest in retaining and informing our customers and prospects of our latest news</p>
        </td>
        <td>Data is retained for 3 years from your last contact with us or until you withdraw your consent.</td>
      </tr>
      <tr>
        <td>Responding to your requests for information, contact and/or demonstration</td>
        <td>Performance of pre-contractual measures taken at your request</td>
        <td>Data is retained for a period of 3 years from your last contact.</td>
      </tr>
      <tr>
        <td>Retaining administrative information and documents related to our business</td>
        <td>Compliance with our legal and regulatory obligations</td>
        <td>
          <p>Invoices are archived for a period of 10 years.</p>
          <p>Data relating to your transactions (with the exception of banking data) is retained for 5 years.</p>
        </td>
      </tr>
      <tr>
        <td>Responding to requests to exercise rights by data subjects</td>
        <td>Compliance with our legal and regulatory obligations</td>
        <td>
          <p>If we ask you for proof of identity: we retain it only for the time necessary to verify your identity. Once verification is complete, the proof of identity is deleted.</p>
          <p>If you exercise your right to object to receiving marketing communications: we retain this information for 3 years.</p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

<h2><strong>Who are the recipients of your data?</strong></h2>

<p>The following will have access to your personal data:</p>

<ul>
  <li>Our company's staff;</li>
  <li>Our processors: hosting provider, website creation provider, communication sending provider (emails and phone), audience measurement and analytics provider, email messaging provider, instant messaging provider, secure payment provider, invoicing tool, cookie management tool;</li>
  <li>Any legally authorized authority, in particular judicial, police or administrative authorities, if they so request.</li>
</ul>

<h2><strong>Is your data likely to be transferred outside the European Union?</strong></h2>

<p>Your data is stored and kept for the entire duration of processing on the servers of Supabase, located within the European Union.</p>

<p>In the context of the tools we use (see the section on recipients regarding our processors), your data may be subject to transfers outside the European Union. The transfer of your data in this context is secured by means of the following tools:</p>

<ul>
  <li>either the data is transferred to a country that has been subject to an adequacy decision by the European Commission, in accordance with Article 45 of the GDPR: in this case, that country ensures a level of protection deemed sufficient and adequate to the provisions of the GDPR;</li>
  <li>or the data is transferred to a country whose level of data protection has not been recognized as adequate under the GDPR: in this case, these transfers are based on appropriate safeguards indicated in Article 46 of the GDPR, adapted to each provider, including but not limited to the conclusion of standard contractual clauses approved by the European Commission, the application of binding corporate rules, or under an approved certification mechanism;</li>
  <li>or the data is transferred on the basis of one of the appropriate safeguards described in Chapter V of the GDPR.</li>
</ul>

<p>You may obtain a copy of the tools enabling the transfer of your data outside the European Union by contacting us at the details indicated in the section "What are your rights regarding your data?" below.</p>

<h2><strong>What are your rights regarding your data?</strong></h2>

<p>You have the following rights with regard to your personal data:</p>

<ul>
  <li><strong>Right to information</strong>: this is precisely why we have drafted this Privacy Policy. This right is provided for in Articles 13 and 14 of the GDPR.</li>
  <li><strong>Right of access</strong>: you have the right to access all of your personal data at any time, pursuant to Article 15 of the GDPR.</li>
  <li><strong>Right to rectification</strong>: you have the right to rectify inaccurate, incomplete or outdated personal data at any time in accordance with Article 16 of the GDPR.</li>
  <li><strong>Right to restriction</strong>: you have the right to obtain restriction of the processing of your personal data in certain cases defined in Article 18 of the GDPR.</li>
  <li><strong>Right to erasure</strong>: you have the right to require that your personal data be erased, and to prohibit any future collection for the reasons set out in Article 17 of the GDPR.</li>
  <li><strong>Right to define directives relating to the retention, erasure and communication of your personal data after your death.</strong></li>
  <li><strong>Right to withdraw your consent at any time</strong>: for purposes based on consent, Article 7 of the GDPR states that you may withdraw your consent at any time. This withdrawal will not affect the lawfulness of processing carried out before the withdrawal.</li>
  <li><strong>Right to data portability</strong>: subject to certain conditions specified in Article 20 of the GDPR, you have the right to receive the personal data you have provided to us in a standard machine-readable format and to require its transfer to the recipient of your choice.</li>
  <li><strong>Right to object</strong>: pursuant to Article 21 of the GDPR, you have the right to object to the processing of your personal data. Please note, however, that we may continue processing despite this objection, for legitimate reasons or for the defense of legal claims.</li>
</ul>

<p>You may exercise these rights by writing to us at the following address: <strong><a href="mailto:privacy@sapiow.com">privacy@sapiow.com</a></strong>.</p>

<p>We may ask you to provide additional information in the event of reasonable doubt, or any document likely to justify your identity if the doubt persists.</p>

<p>For any question or request that remains unsuccessful, you have the right to lodge a complaint with the competent supervisory authority, in France, the Commission Nationale de l'Informatique et des Libertés ("CNIL"), located at 3 Place de Fontenoy - TSA 80715 - 75334 PARIS CEDEX 07.</p>

<h2><strong>Changes</strong></h2>

<p>We may modify this Privacy Policy at any time, in particular to comply with any regulatory, case law, editorial or technical developments. These changes will apply as of the effective date of the modified version. You are therefore invited to regularly consult the latest version of this policy. Nevertheless, we will inform you of any significant change to this privacy policy.</p>`,
    licensesContent:
      "Sapiow uses several open source software components for its operation. We are grateful to the open source community for their remarkable work. Our application is built with Next.js under the MIT license, React under the MIT license, and uses several libraries such as TailwindCSS, React Query, and next-international for translation management. All these libraries are used in accordance with their respective licenses. The complete licenses for these software components are available in our code repository or upon request. We are committed to respecting the terms of open source licenses and contributing to the open source community when possible. If you are a developer and would like to contribute to Sapiow, please don't hesitate to contact us. We believe in the power of collaboration and knowledge sharing to create quality products.",
  },

  // About Page
  about: {
    logoAlt: "Sapiow Logo",
    copyright: "© 2025 Sapiow. All rights reserved.",
    contactUs: "Contact Us",
    visitWebsite: "Visit Website",
  },

  // Support Page
  support: {
    title: "How can we help you?",
    searchPlaceholder: "Enter your keyword",
    noResultsFound: "No results found for",
    // FAQ Data
    faq: {
      question1: "How to create an account?",
      answer1:
        "Open the Tradebase app to get started and follow the steps. Tradebase does not charge fees to create or maintain your Tradebase account.",
      question2: "How to add a payment method via this application?",
      answer2:
        "To add a payment method, go to your account settings, select 'Payment Methods' and follow the instructions to add your bank card or PayPal account.",
      question3: "Question 3",
      answer3:
        "Answer to question 3. You can add here all relevant information to help your users.",
      question4: "Question 4",
      answer4:
        "Answer to question 4. This section can contain technical details or step-by-step instructions.",
    },
  },

  // Language Page
  languagePage: {
    french: "French",
    english: "English",
    errorChangingLanguage: "Error changing language:",
    flagAlt: "Flag",
  },

  // Bank Account Section
  bankAccount: {
    title: "Your Bank Account",
    bankAlt: "Bank",
    addRib: "Add your bank details",
    add: "Add",
    modify: "Modify",
    completeConfig: "Complete configuration",
    incompleteConfig: "Incomplete configuration",
    bankUpdateError: "Error updating bank account",
    inProgress: "In progress...",
    preparingRedirect: "Preparing redirect...",
    // Add Bank Account Modal
    addBankAccount: "Add a bank account",
    nameMatchId:
      "Make sure this matches the name on your government-issued ID.",
    iban: "IBAN",
    bicSwift: "BIC/SWIFT Code",
  },

  // Revenue Page
  revenue: {
    totalEarnings: "Total Earnings",
    // Filters
    thisMonth: "This Month",
    thisQuarter: "This Quarter",
    custom: "Custom",
    selectCustomPeriod: "Select a custom period",
    selectedPeriod: "Selected period:",
    from: "From",
    to: "to",
    // Transactions
    lastTransfer: "Last Transfer",
    nextTransfer: "Next Transfer",
    // Payment Status
    paid: "Paid",
    pending: "Pending",
    refunded: "Refunded",
    // Calendar
    calendarAlt: "Calendar",
    // Payment History
    noPaymentHistory:
      "No payment history available. Set up your payment account to start receiving revenue.",
    errorLoadingPayments: "Error loading payments",
    noPaymentsFound: "No payments found",
    unknownSession: "Unknown session",
    locale: "en",
  },

  // Offers Page
  offers: {
    // Offer Types
    videoSessions: "Video Sessions",
    monthlyAccompaniment: "Monthly Accompaniment",
    // Features
    oneOnOne: "1:1 Individual Session",
    videoCall: "Video Call",
    strategicSession: "Strategic Session",
    exclusiveResources: "Exclusive Resources",
    support: "Client Support",
    mentorship: "Mentorship",
    webinar: "Webinar",
    // Interface
    selectOfferToSeeDetails: "Select an offer to see details",
    noOffersConfigured: "No offers configured",
    whatIsIncluded: "What's included",
    perMonth: "/ Month",
    serviceFee: "Service fee",
    discount: "Discount",
    // Actions
    delete: "Delete",
    deleting: "Deleting...",
    addOffer: "Add an offer",
    createAccompaniment: "Create accompaniment",
    // Empty States
    noMonthlyAccompaniment: "No monthly accompaniment configured yet.",
    createFirstOffer: "Create your first accompaniment offer for your clients.",
    // Default Names
    monthlyAccompanimentDefault: "Monthly Accompaniment",
    // Add/Edit Session Modal
    addSession: "Add a session",
    editSession: "Edit session",
    sessionName: "Session name",
    sessionNamePlaceholder: "Ex: Strategic consultation",
    price: "Price (€)",
    pricePlaceholder: "Ex: 120",
    euroAlt: "Euro",
    includedFeatures: "Included features",
    addFeaturePlaceholder: "Ex: Priority support, Exclusive resources...",
    add: "Add",
    adding: "Adding...",
    deleteFeature: "Delete this feature",
    loadingFeatures: "Loading features...",
    noFeaturesYet: "No features added yet. Add one above.",
    createSessionFirst: "Create the session first to add features.",
    sessionCreatedAddFeatures:
      "✅ Session created! You can now add features below.",
    creating: "Creating...",
    editing: "Editing...",
    // Offer Selection
    chooseOffer: "Choose an offer",
    singleSessions: "Single sessions",
    quickVideoSession: "Quick video session",
    perfectForSpecificQuestions: "Perfect for specific questions",
    startingFrom: "Starting from",
    viewTimeSlots: "View time slots",
    noSlotsAvailable: "No slots available",
    monthlySubscriptions: "Monthly subscriptions",
    chooseAndPay: "Choose and pay",
    creatingAppointment: "In progress...",
    // Features
    oneOnOneChat: "1:1 Chat",
    oneOnOneVideoCalls: "1:1 Video calls",
    personalizedSupport: "Personalized support",
    strategySessions: "Strategy sessions",
  },

  // Expert Details Page
  expertDetails: {
    // Error States
    errorLoadingExpert: "Error loading expert",
    expertNotFound: "Expert not found",
    // Expert Info
    about: "About",
    seeMore: "See more",
    seeLess: "See less",
    expertiseDomains: "Expertise domains",
    revenueDestination: "All revenue will be donated to",
    foundations: "760 foundations.",
    // Questions & Expectations
    questionsToAsk: "Questions to ask",
    expectations: "Expectations",
    visio15min: "15min Video",
    // Sample Questions
    question1:
      "I'm thinking of starting a business. What are the next things I should focus on?",
    question2: "How do I know if my business idea will work?",
    question3: "How do you approach growing my business?",
    question4:
      "What key metrics should I aim for at different stages to be a leading company?",
    // Expectations
    expectation1: "Ask three or more questions",
    expectation2: "Tips for starting a successful business",
    expectation3: "Tips for getting your first 10,000 customers",
    expectation4: "Growth tips and growth kickstart",
    // Empty States
    noQuestionsAvailable: "No questions necessary at the moment",
    noExpectationsAvailable: "No expectations necessary at the moment",
    // How it works
    howItWorks: "How it works?",
    findExpert: "Find an expert",
    findExpertDesc:
      "Discover and choose from our list of the world's most sought-after experts",
    bookOrSubscribe: "Book or subscribe",
    bookOrSubscribeDesc:
      "Book a one-time video call or choose a plan for continuous access to your expert",
    virtualConsultation: "Virtual consultation",
    virtualConsultationDesc:
      "Join the video call or chat, ask questions and get expert advice",
    // Similar Experts
    similarExperts: "Similar experts",
    noSimilarExperts: "No similar experts found",
    seeAll: "See all",
    // FAQ
    frequentQuestions: "Frequently asked questions",
    whatIsSapiow: "What is Sapiow?",
    whatIsSapiowAnswer:
      "Sapiow is an online platform that allows you to book experts for video consultations, offering users direct access to qualified professionals in various fields.",
    benefitsQuestion: "What are the benefits of using Sapiow for users?",
    benefitsAnswer:
      "Sapiow offers direct access to qualified experts, flexible consultations, and a secure platform to get professional advice in many fields.",
    expertsTypesQuestion: "What types of experts can I book on Sapiow?",
    expertsTypesAnswer:
      "You can book experts in many fields: business, health, technology, personal development, and many other specialties.",
    qualityQuestion:
      "How does Sapiow guarantee the quality of available experts?",
    qualityAnswer:
      "All our experts are verified and selected according to strict criteria of expertise, experience and professional qualifications.",
    feesQuestion: "What are the fees associated with using Sapiow?",
    feesAnswer:
      "Rates vary by expert and type of consultation. You can choose between single sessions or monthly subscriptions.",
    // Success Page
    congratulations: "Congratulations!",
    sessionBookedSuccess: "Your session has been successfully booked!",
    addToCalendar: "Add to calendar",
  },
  // Session Detail Sheet
  sessionDetail: {
    title: "Details",
    startVideo: "Start video call",
    sendMessage: "Send message",
    askQuestion: "Ask a question",
    questionsAndAnswers: "Questions and answers",
    noQuestions: "No questions asked yet",
    noQuestionsDescription: "Ask your first question to the expert",
    writeQuestion: "Write your question...",
    send: "Send",
    cancel: "Cancel",
    questionSubmitError: "Error submitting question",
    cancelAppointment: "Cancel appointment",
    confirmCancel: "Are you sure you want to cancel this appointment?",
    cancelWarning: "This action cannot be undone.",
    confirmCancelButton: "Confirm cancellation",
    cancelling: "Cancelling...",
    cancelSuccess: "Appointment cancelled successfully",
    cancelError: "Error cancelling appointment",
    dateNotAvailable: "Date not available",
    timeNotAvailable: "Time not available",
    session: "Session",
    expert: "Expert",
    quickVideoSession: "Quick video session",
    bookSession: "Book a session",
    // Alt texts
    congratulationAlt: "Congratulations",
    magnifierAlt: "Magnifier",
    calendarAlt: "Calendar",
    videoCameraAlt: "Video camera",
    // Questions section
    dontHesitateAskQuestions:
      "Don't hesitate to ask your questions before the session",
    submitQuestionsAdvance:
      "You have the possibility to submit your questions in advance so that the expert can better prepare for you.",
    submitMyQuestions: "Submit my questions",
    typeQuestionHere: "Type your question here...",
    addAnotherQuestion: "Add another question",
    questionsOrComments: "Questions or comments",
    viewDetails: "View details",
    consultationWith: "Consultation with",
    videoConsultation: "Video consultation with",
    // Edit/Delete questions
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    confirmDeleteQuestion: "Are you sure you want to delete this question?",
    questionUpdateError: "Error updating question",
    questionDeleteError: "Error deleting question",
  },

  // Dark Session Card / Upcoming Video Call
  upcomingCall: {
    now: "Now",
    inDays: "In",
    day: "day",
    days: "days",
    inHours: "In",
    hours: "h",
    inMinutes: "In",
    minutes: "min",
    calendarAlt: "Calendar",
    clockAlt: "Clock",
  },

  // Video Call
  videoCall: {
    callEnded: "Call ended",
    error: "Connection error",
    loading: "Connecting...",
    mute: "Mute",
    unmute: "Unmute",
    camera: "Camera",
    endCall: "End call",
  },

  // Categories
  categories: {
    media: "Media",
    culture: "Culture",
    business: "Business",
    maison: "Home",
    artisanat: "Crafts",
    glow: "Wellness",
    sport: "Sports",
    specializedIn: "specialized in",
  },

  // Calendar
  calendar: {
    // Default values
    defaultClient: "Client",
    defaultDuration: "30 min",
    defaultConsultation: "Consultation",
    // Days of week (array format)
    daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    // Days of week (individual)
    sunday: "Sun",
    monday: "Mon",
    tuesday: "Tue",
    wednesday: "Wed",
    thursday: "Thu",
    friday: "Fri",
    saturday: "Sat",
    // Months (array format)
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    // Months (individual)
    january: "January",
    february: "February",
    march: "March",
    april: "April",
    may: "May",
    june: "June",
    july: "July",
    august: "August",
    september: "September",
    october: "October",
    november: "November",
    december: "December",
    // Status
    blocked: "Blocked",
    // Planning
    planYourVisio: "Plan your video call",
    visioDuration: "Video call duration",
    availableSlots: "Available slots",
    noSlotsAvailable: "No slots available for this day.",
    selectAnotherDate: "Please select another date.",
    complete: "Full",
    // Booking
    minutes: "minutes",
    reserving: "Booking...",
    reserve: "Book",
    reservationError: "Booking error. Please try again.",
    guestLoginHint: "You will confirm with your phone number right after.",
  },

  booking: {
    resume: {
      processing: "Finalizing your booking...",
      slotUnavailable: "This time slot is no longer available. Please pick another one.",
    },
  },

  // Payment
  payment: {
    success: "Payment successful!",
    processing: "Processing payment...",
    failed: "Payment failed",
    redirecting: "Redirecting...",
  },

  // Home Pages
  home: {
    // Expert Dashboard
    hello: "Hello",
    user: "User",
    visiosToday: "video call coming up today",
    visiosTodayPlural: "video calls coming up today",
    youHave: "You have",
    completedVisios: "Completed video calls",
    earningsSummary: "Earnings summary",
    pendingRequests: "Pending requests",
    seeAll: "See all",
    noPendingRequests: "No pending requests",
    nextVisio: "Next video call",
    noScheduledVisio: "No scheduled video calls",
    // Client Dashboard
    loadingExperts: "Loading experts...",
    errorLoadingExperts: "Error loading experts",
    unknownError: "Unknown error",
    yourNextVisio: "Your next video call",
    accelerateProject: "Accelerate your project. Book a Video Call.",
    noTopExperts: "No top experts available at the moment.",
    // Search Mode
    searchResults: "Search results for",
    noResultsFound: "No results found",
    tryDifferentSearch: "Try different keywords",
  },

  sponso: {
    sponsored: "Sponsored",
    carouselTitle: "Featured",
    defaultCta: "Book a video call",
    previous: "Previous",
    next: "Next",
    membersTitle: "Our experts",
    noMembers: "No active members at the moment.",
    organizationNotFound: "Organization not found.",
    offeredBy: "Offered by {org}",
  },

  // Share Link Button
  shareLink: {
    defaultText: "Share your booking link",
    copied: "Link copied!",
    copyError: "Error copying link",
  },

  // Header
  header: {
    profileAlt: "Profile picture",
    expertMode: "Expert mode",
    notifications: "Notifications",
    unreadSingular: "unread",
    unreadPlural: "unread",
    noNotifications: "No notifications",
    seeAllNotifications: "See all notifications",
    markAsReadError: "Error marking notification as read",
    // Time formatting
    justNow: "Just now",
    minutesAgo: "",
    hoursAgo: "",
    minutes: "min ago",
    hours: "h ago",
  },

  // Header Client
  headerClient: {
    search: "Search",
    searchPlaceholder: "Search",
    searchAlt: "search",
    heartAlt: "heart",
    clientMode: "Client mode",
    becomeExpert: "Become an expert",
  },

  // Favorites Page
  favorites: {
    title: "My Favorites",
    loading: "Loading your favorites...",
    error: "Error loading favorites",
    unknownError: "Unknown error",
    noFavorites: "No professionals in favorites yet",
    noFavoritesDescription:
      "Add professionals to your favorites by clicking the heart",
  },

  // Payment History Page
  paymentHistory: {
    title: "Payment History",
    loading: "Loading history...",
    searchPlaceholder: "Amount, transaction ...",
    filterBy: "Filter by",
    allTransactions: "All transactions",
    completed: "Completed",
    pending: "Pending",
    failed: "Failed",
    transactionDetails: "Transaction Details",
    backToList: "Back to list",
    amount: "Amount",
    expert: "Expert",
    session: "Session",
    dateTime: "Date and time",
    status: "Status",
    transactionId: "Transaction ID",
    noTransactions: "No transactions found",
    noTransactionsDescription:
      "Your transactions will appear here once completed",
    selectTransaction: "Select a transaction to view details",
    sendInvoice: "Send invoice",
    cancelled: "Cancelled",
    paymentConsultationWith: "Payment consultation with",
  },

  // Subscriptions (patient)
  subscriptions: {
    title: "Subscriptions",
    subscriptionLabel: "Subscription",
    statusLabel: "Status",
    active: "Active",
    cancelled: "Cancelled",
    stop: "Stop",
    empty: "No subscriptions yet.",
    modalTitle: "Cancel subscription",
    modalQuestion: "Do you really want to cancel this subscription?",
    modalWarning: "This action is irreversible.",
    back: "Back",
    confirmCancel: "Cancel",
    cancelling: "Cancelling...",
    errorGeneric: "An error occurred.",
  },

  // Pro subscriptions (expert)
  proSubscriptions: {
    modalTitleStop: "Stop subscription",
    modalTitleCancel: "Cancel subscription",
    modalQuestionStop: "Do you really want to stop this subscription?",
    modalQuestionCancel: "Do you really want to cancel this subscription?",
    modalWarning: "This action is irreversible.",
    modalRefundInfo: "This will refund the last payment.",
    back: "Back",
    confirm: "Confirm",
    submitting: "Confirming...",
  },

  // Phone Number Component
  phoneNumber: {
    label: "Phone number",
    placeholder: "06 06 06 06 06",
    searchCountry: "Search country...",
    noCountryFound: "No country found",
    invalidNumber: "Invalid phone number",
    required: "This field is required",
  },

  // Search Components
  search: {
    placeholder: "Search",
    searchPlaceholder: "Search",
    noResults: "No results found",
    searching: "Searching...",
  },

  // Page Header & Notifications
  pageHeader: {
    notifications: "Notifications",
    markAsRead: "Mark as read",
    markAllAsRead: "Mark all as read",
    noNotifications: "No notifications",
    seeAllNotifications: "See all notifications",
    justNow: "Just now",
    minutesAgo: "",
    hoursAgo: "",
    minutes: "min ago",
    hours: "h ago",
    notificationError: "Error marking notification as read",
  },

  // Session Details Panel
  sessionDetailsPanel: {
    noSessionToday: "No sessions are scheduled for today.",
    addAvailability: "Add availability",
    selectDateToView: "Select a date to view details.",
    client: "Client",
    consultation: "Consultation",
  },

  // Toast Messages
  toast: {
    // Questions
    questionSubmitted: "Question submitted successfully!",
    questionUpdated: "Question updated successfully!",
    questionSubmitError: "Error submitting question",
    questionUpdateError: "Error updating question",

    // Appointments
    appointmentCreated: "Appointment created successfully!",
    appointmentConfirmed: "Appointment confirmed successfully!",
    appointmentCancelled: "Appointment cancelled successfully!",
    appointmentCreateError: "Error creating appointment",
    appointmentUpdateError: "Error updating appointment",
    appointmentCancelError: "Error cancelling appointment",

    // Date Blocking
    dateBlocked: "Date blocked successfully!",
    dateBlockError: "Error blocking date",
    dateUnblocked: "Date unblocked successfully!",
    dateUnblockError: "Error unblocking date",

    // Allow Days (Availability Periods)
    allowDayCreated: "Availability period created successfully!",
    allowDayUpdated: "Availability period updated successfully!",
    allowDayDeleted: "Availability period deleted successfully!",
    allowDayCreateError: "Error creating availability period",
    allowDayUpdateError: "Error updating availability period",
    allowDayDeleteError: "Error deleting availability period",

    // Session Features
    sessionFeatureCreated: "Feature created successfully!",
    sessionFeatureUpdated: "Feature updated successfully!",
    sessionFeatureDeleted: "Feature deleted successfully!",
    sessionFeatureCreateError: "Error creating feature",
    sessionFeatureUpdateError: "Error updating feature",
    sessionFeatureDeleteError: "Error deleting feature",

    // Video Call
    callConnectionError: "Error connecting to video call",
    callTokenError: "Error retrieving call token",
  },

  // Countries
  countries: {
    // Africa
    DZ: "Algeria",
    AO: "Angola",
    BJ: "Benin",
    BW: "Botswana",
    BF: "Burkina Faso",
    BI: "Burundi",
    CV: "Cape Verde",
    CM: "Cameroon",
    CF: "Central African Republic",
    TD: "Chad",
    KM: "Comoros",
    CG: "Congo",
    CD: "Democratic Republic of the Congo",
    CI: "Ivory Coast",
    DJ: "Djibouti",
    EG: "Egypt",
    GQ: "Equatorial Guinea",
    ER: "Eritrea",
    ET: "Ethiopia",
    GA: "Gabon",
    GM: "Gambia",
    GH: "Ghana",
    GN: "Guinea",
    GW: "Guinea-Bissau",
    KE: "Kenya",
    LS: "Lesotho",
    LR: "Liberia",
    LY: "Libya",
    MG: "Madagascar",
    MW: "Malawi",
    ML: "Mali",
    MR: "Mauritania",
    MU: "Mauritius",
    MA: "Morocco",
    MZ: "Mozambique",
    NA: "Namibia",
    NE: "Niger",
    NG: "Nigeria",
    RW: "Rwanda",
    ST: "Sao Tome and Principe",
    SN: "Senegal",
    SC: "Seychelles",
    SL: "Sierra Leone",
    SO: "Somalia",
    ZA: "South Africa",
    SS: "South Sudan",
    SD: "Sudan",
    SZ: "Eswatini",
    TZ: "Tanzania",
    TG: "Togo",
    TN: "Tunisia",
    UG: "Uganda",
    ZM: "Zambia",
    ZW: "Zimbabwe",
    // Europe
    AD: "Andorra",
    AL: "Albania",
    AT: "Austria",
    BY: "Belarus",
    BE: "Belgium",
    BA: "Bosnia and Herzegovina",
    BG: "Bulgaria",
    HR: "Croatia",
    CY: "Cyprus",
    CZ: "Czech Republic",
    DK: "Denmark",
    EE: "Estonia",
    FI: "Finland",
    FR: "France",
    DE: "Germany",
    GR: "Greece",
    HU: "Hungary",
    IS: "Iceland",
    IE: "Ireland",
    IT: "Italy",
    LV: "Latvia",
    LI: "Liechtenstein",
    LT: "Lithuania",
    LU: "Luxembourg",
    MT: "Malta",
    MD: "Moldova",
    MC: "Monaco",
    ME: "Montenegro",
    NL: "Netherlands",
    MK: "North Macedonia",
    NO: "Norway",
    PL: "Poland",
    PT: "Portugal",
    RO: "Romania",
    RU: "Russia",
    SM: "San Marino",
    RS: "Serbia",
    SK: "Slovakia",
    SI: "Slovenia",
    ES: "Spain",
    SE: "Sweden",
    CH: "Switzerland",
    UA: "Ukraine",
    GB: "United Kingdom",
    VA: "Vatican City",
    // Asia
    AF: "Afghanistan",
    AM: "Armenia",
    AZ: "Azerbaijan",
    BH: "Bahrain",
    BD: "Bangladesh",
    BT: "Bhutan",
    BN: "Brunei",
    KH: "Cambodia",
    CN: "China",
    GE: "Georgia",
    IN: "India",
    ID: "Indonesia",
    IR: "Iran",
    IQ: "Iraq",
    IL: "Israel",
    JP: "Japan",
    JO: "Jordan",
    KZ: "Kazakhstan",
    KW: "Kuwait",
    KG: "Kyrgyzstan",
    LA: "Laos",
    LB: "Lebanon",
    MY: "Malaysia",
    MV: "Maldives",
    MN: "Mongolia",
    MM: "Myanmar",
    NP: "Nepal",
    KP: "North Korea",
    OM: "Oman",
    PK: "Pakistan",
    PS: "Palestine",
    PH: "Philippines",
    QA: "Qatar",
    SA: "Saudi Arabia",
    SG: "Singapore",
    KR: "South Korea",
    LK: "Sri Lanka",
    SY: "Syria",
    TW: "Taiwan",
    TJ: "Tajikistan",
    TH: "Thailand",
    TL: "East Timor",
    TR: "Turkey",
    TM: "Turkmenistan",
    AE: "United Arab Emirates",
    UZ: "Uzbekistan",
    VN: "Vietnam",
    YE: "Yemen",
    // North America
    CA: "Canada",
    MX: "Mexico",
    US: "United States",
    // Central America
    BZ: "Belize",
    CR: "Costa Rica",
    SV: "El Salvador",
    GT: "Guatemala",
    HN: "Honduras",
    NI: "Nicaragua",
    PA: "Panama",
    // South America
    AR: "Argentina",
    BO: "Bolivia",
    BR: "Brazil",
    CL: "Chile",
    CO: "Colombia",
    EC: "Ecuador",
    FK: "Falkland Islands",
    GF: "French Guiana",
    GY: "Guyana",
    PY: "Paraguay",
    PE: "Peru",
    SR: "Suriname",
    UY: "Uruguay",
    VE: "Venezuela",
    // Caribbean
    AG: "Antigua and Barbuda",
    BS: "Bahamas",
    BB: "Barbados",
    CU: "Cuba",
    DM: "Dominica",
    DO: "Dominican Republic",
    GD: "Grenada",
    HT: "Haiti",
    JM: "Jamaica",
    KN: "Saint Kitts and Nevis",
    LC: "Saint Lucia",
    VC: "Saint Vincent and the Grenadines",
    TT: "Trinidad and Tobago",
    // Oceania
    AU: "Australia",
    FJ: "Fiji",
    KI: "Kiribati",
    MH: "Marshall Islands",
    FM: "Micronesia",
    NR: "Nauru",
    NZ: "New Zealand",
    PW: "Palau",
    PG: "Papua New Guinea",
    WS: "Samoa",
    SB: "Solomon Islands",
    TO: "Tonga",
    TV: "Tuvalu",
    VU: "Vanuatu",
  },
} as const;
