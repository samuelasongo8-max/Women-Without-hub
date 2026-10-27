// Add approved FAQ entries here. Keep answers factual and add localized
// wording and keywords to the matching chatbot keys in each locale file.
import { ORG_NAME } from '../config/site.js'

export const CHAT_CONTACT = {
  name: 'Fatuma Abdulahi',
  photo: '/images/fatuma-abdulahi.jpg',
  alt: `Fatuma Abdulahi, ${ORG_NAME} team`,
  initials: 'FA',
}

export const knowledge = [
  {
    id: 'welcome',
    keywords: ['hello', 'hi', 'welcome', 'good morning', 'good afternoon'],
    question: 'Welcome',
    answer:
      `Welcome to ${ORG_NAME}. I’m an automated assistant. Ask me about our programmes, how to join, donate, volunteer or partner with us.`,
  },
  {
    id: 'about',
    keywords: ['about us', 'what do you do', 'who are you', 'organization', 'organisation'],
    question: `About ${ORG_NAME}`,
    answer:
      `${ORG_NAME} is a community-based organization in Kakuma Refugee Camp, Kenya. It was founded in 2024 by MaLua Lugazo to create opportunities for vulnerable girls, teenage mothers and young women.`,
    link: '/about/',
  },
  {
    id: 'founder',
    keywords: ['founder', 'who founded', 'who started', 'malua', 'leadership'],
    question: `Who founded ${ORG_NAME}?`,
    answer:
      `${ORG_NAME} was founded in 2024 by MaLua Lugazo.`,
    link: '/about/our-team/malua-lugazo/',
  },
  {
    id: 'location',
    keywords: ['where are you', 'location', 'where is the hub', 'kakuma', 'address'],
    question: `Where is ${ORG_NAME}?`,
    answer: `${ORG_NAME} is in Kakuma Refugee Camp, Kenya.`,
    link: '/contact/',
  },
  {
    id: 'programmes',
    keywords: ['programmes', 'programs', 'what programmes', 'what programs', 'services'],
    question: 'What programmes do you have?',
    answer: 'Our programmes include:',
  },
  {
    id: 'education',
    keywords: [
      'education',
      'school',
      'literacy',
      'scholarship',
      'reading',
      'second chance',
      'remedial',
      'Education & Literacy',
    ],
    question: 'Second Chance Education',
    answer:
      'Scholarships, literacy circles, remedial and second-chance education that keep girls in school and open educational opportunities for vulnerable girls in Kakuma.',
    link: '/programs/second-chance-education/',
  },
  {
    id: 'digital',
    keywords: ['digital', 'computer', 'skills', 'tailoring', 'fashion', 'beauty', 'hairdressing', 'vocational', 'training'],
    question: 'Digital & Technical Skills',
    answer:
      'Computer literacy and digital skills bootcamps alongside vocational training in tailoring, fashion, beauty and hairdressing for young women.',
    link: '/programs/digital-technical-skills/',
  },
  {
    id: 'mentorship',
    keywords: ['mentor', 'mentorship', 'life skills', 'leadership', 'career', 'goals', 'confidence'],
    question: 'Mentorship & Life Skills',
    answer:
      'Mentorship, life skills, leadership, career guidance, goal setting and financial literacy that build confidence and self-reliance.',
    link: '/programs/mentorship-life-skills/',
  },
  {
    id: 'health',
    keywords: ['health', 'menstrual', 'period', 'pads', 'products', 'referral'],
    question: 'Health & Menstrual Dignity',
    answer:
      'Menstrual health education, menstrual products, health awareness and health referrals so no one misses school or work.',
    link: '/programs/health-menstrual-dignity/',
  },
  {
    id: 'srhr',
    keywords: ['reproductive', 'sexual health', 'srhr', 'peer education', 'awareness'],
    question: 'Sexual & Reproductive Health and Rights (SRHR)',
    answer:
      'Age-appropriate, culturally sensitive SRHR education, peer education and community awareness built on respect and choice.',
    link: '/programs/srhr/',
  },
  {
    id: 'livelihood',
    keywords: ['livelihood', 'business', 'entrepreneurship', 'job', 'employment', 'apprenticeship', 'income', 'money skills'],
    question: 'Livelihood & Economic Empowerment',
    answer:
      'Entrepreneurship, business mentorship, apprenticeships, market linkages and employment referrals for women’s economic empowerment.',
    link: '/programs/livelihood-economic-empowerment/what-we-do/',
  },
  {
    id: 'activities',
    keywords: ['activities', 'schedule', 'opening hours', 'when', 'time', 'monday', 'friday', 'center', 'centre'],
    question: 'When and where do activities take place?',
    answer:
      'Our activities take place Monday to Friday, from 4pm to 6pm, at the Women Without Borders Center in Kakuma 3.',
    link: '/contact/',
  },
  {
    id: 'join',
    keywords: ['join', 'register', 'registration', 'who can join', 'free', 'enroll', 'enrol'],
    question: 'How can I join?',
    answer:
      'To join one of our programmes, please contact our team and they will guide you through the next steps. You can email us at marwalugazo@gmail.com or use our Contact page.',
    link: '/contact/',
  },
  {
    id: 'donate',
    keywords: ['donate', 'donation', 'give money', 'mpesa', 'm-pesa', 'bank account'],
    question: 'How can I donate?',
    answer:
      'You can donate through M-Pesa. We don’t have a bank account at this time. To get the M-Pesa details, please email marwalugazo@gmail.com.',
    link: '/get-involved/donate/',
  },
  {
    id: 'volunteer',
    keywords: ['volunteer', 'volunteering', 'help out', 'give time'],
    question: 'How can I volunteer?',
    answer:
      'To volunteer or share your skills, complete our volunteer application form. Our team will contact you within 2 business days.',
    link: '/get-involved/volunteer/',
  },
  {
    id: 'partner',
    keywords: ['partner', 'partnership', 'collaborate', 'organization', 'foundation', 'business'],
    question: 'How can we partner?',
    answer:
      'We welcome partnerships with donors, NGOs, foundations, schools, training institutions, health partners and businesses. Partners can support us through funding, technical expertise, training, mentorship, resources or joint programmes. Please send your enquiry through our Contact page or email marwalugazo@gmail.com, and our team will reply within 2 business days.',
    link: '/contact/',
  },
  {
    id: 'skills',
    keywords: ['share skills', 'offer skills', 'teach', 'mentor', 'training', 'professional skills'],
    question: 'Can I share my skills?',
    answer:
      'Yes, you can offer mentorship, training or professional skills. Please contact our team and they will discuss how you can help. You can email us at marwalugazo@gmail.com.',
    link: '/contact/',
  },
  {
    id: 'contact',
    keywords: ['contact', 'email', 'phone number', 'get in touch', 'reach the team'],
    question: 'How can I contact the team?',
    answer:
      'You can reach our team at marwalugazo@gmail.com. We usually reply within 2 business days.',
    link: '/contact/',
  },
  {
    id: 'responseTime',
    keywords: ['response time', 'reply', 'how long', 'when will you respond'],
    question: 'When will the team reply?',
    answer: 'Our team usually replies within 2 business days.',
    link: '/contact/',
  },
  {
    id: 'donations',
    keywords: ['where donations go', 'use donations', 'donation money', 'funds'],
    question: 'Where do donations go?',
    answer: 'Donations go to our programmes.',
  },
  {
    id: 'emergency',
    keywords: ['emergency', 'danger', 'abuse', 'violence', 'unsafe'],
    question: 'What should I do in an emergency?',
    answer:
      'I’m sorry you are going through this. If you or someone else is in danger, please call +254113947398 now.',
  },
  {
    id: 'thanks',
    keywords: ['thanks', 'thank you', 'appreciate'],
    question: 'Thanks',
    answer: 'You’re welcome. Is there anything else I can help you with?',
  },
  {
    id: 'goodbye',
    keywords: ['goodbye', 'bye', 'see you', 'take care'],
    question: 'Goodbye',
    answer: `Thank you for visiting ${ORG_NAME}. Take care.`,
  },
]

export const QUICK_REPLIES = [
  { id: 'programmes', label: 'Our programmes' },
  { id: 'join', label: 'How can I join?' },
  { id: 'donate', label: 'How can I donate?' },
  { id: 'volunteer', label: 'Volunteer' },
  { id: 'partner', label: 'Partner with us' },
  { id: 'contact', label: 'Contact the team' },
]

export const PROGRAMME_IDS = [
  'education',
  'digital',
  'mentorship',
  'health',
  'srhr',
  'livelihood',
]

export const LANGUAGE_CODES = [
  'en',
  'fr',
  'ar',
  'sw',
  'so',
  'es',
  'de',
  'pt',
  'ru',
  'it',
  'pl',
]

export const RISK_KEYWORDS = {
  en: {
    emergency: ['abuse', 'violence', 'danger', 'emergency', 'unsafe', 'threatened', 'hurt'],
    personal: ['personal information', 'private details', 'phone number of', 'address of', 'where does she live', 'staff home', 'participant name'],
    advice: ['medical advice', 'legal advice', 'counselling', 'therapy', 'diagnose', 'medicine for'],
  },
  fr: {
    emergency: ['abus', 'violence', 'danger', 'urgence', 'en danger', 'menacée', 'blessée'],
    personal: ['informations personnelles', 'données privées', 'numéro personnel', 'adresse personnelle', 'où habite-t-elle'],
    advice: ['conseil médical', 'conseil juridique', 'conseil psychologique', 'diagnostiquer', 'quel médicament'],
  },
  ar: {
    emergency: ['عنف', 'إساءة', 'خطر', 'طارئ', 'حالة طوارئ', 'مهدد', 'مصاب'],
    personal: ['معلومات شخصية', 'بيانات خاصة', 'رقم هاتفها', 'عنوان منزلها', 'أين تسكن'],
    advice: ['نصيحة طبية', 'نصيحة قانونية', 'استشارة نفسية', 'تشخيص', 'دواء'],
  },
  sw: {
    emergency: ['unyanyasaji', 'ukatili', 'vurugu', 'hatari', 'dharura', 'kutokuwa salama', 'kutishiwa'],
    personal: ['taarifa binafsi', 'maelezo ya faragha', 'namba yake ya simu', 'anapoishi'],
    advice: ['ushauri wa kitabibu', 'ushauri wa kisheria', 'ushauri nasaha', 'kutambua ugonjwa', 'dawa gani'],
  },
  so: {
    emergency: ['xadgudub', 'rabshad', 'khatar', 'xaalad degdeg', 'aan ammaan ahayn', 'hanjabaad'],
    personal: ['xog shakhsiyeed', 'xog gaar ah', 'lambarkeeda telefoonka', 'cinwaankeeda', 'halkee ayay degan tahay'],
    advice: ['talo caafimaad', 'talo sharci', 'la-talin nafsi', 'ogaanshaha cudur', 'daawo noocee'],
  },
  es: {
    emergency: ['abuso', 'violencia', 'peligro', 'emergencia', 'no estoy a salvo', 'amenazada', 'herida'],
    personal: ['información personal', 'datos privados', 'número personal', 'dirección de su casa', 'dónde vive'],
    advice: ['consejo médico', 'asesoría legal', 'consejería', 'diagnosticar', 'qué medicamento'],
  },
  de: {
    emergency: ['missbrauch', 'gewalt', 'gefahr', 'notfall', 'nicht sicher', 'bedroht', 'verletzt'],
    personal: ['persönliche informationen', 'private daten', 'ihre telefonnummer', 'ihre adresse', 'wo wohnt sie'],
    advice: ['medizinischer rat', 'rechtsberatung', 'psychologische beratung', 'diagnose', 'welches medikament'],
  },
  pt: {
    emergency: ['abuso', 'violência', 'perigo', 'emergência', 'não estou segura', 'ameaçada', 'ferida'],
    personal: ['informações pessoais', 'dados privados', 'número pessoal', 'endereço da casa', 'onde ela mora'],
    advice: ['aconselhamento médico', 'aconselhamento jurídico', 'aconselhamento psicológico', 'diagnosticar', 'qual medicamento'],
  },
  ru: {
    emergency: ['насилие', 'жестокое обращение', 'опасность', 'чрезвычайная ситуация', 'мне небезопасно', 'угрожают', 'ранена'],
    personal: ['личная информация', 'личные данные', 'ее номер телефона', 'ее адрес', 'где она живет'],
    advice: ['медицинский совет', 'юридическая консультация', 'психологическая помощь', 'диагноз', 'какое лекарство'],
  },
  it: {
    emergency: ['abuso', 'violenza', 'pericolo', 'emergenza', 'non sono al sicuro', 'minacciata', 'ferita'],
    personal: ['informazioni personali', 'dati privati', 'numero personale', 'indirizzo di casa', 'dove vive'],
    advice: ['consiglio medico', 'consulenza legale', 'consulenza psicologica', 'diagnosticare', 'quale farmaco'],
  },
  pl: {
    emergency: ['nadużycie', 'przemoc', 'niebezpieczeństwo', 'nagły wypadek', 'nie czuję się bezpiecznie', 'grożą mi', 'zraniona'],
    personal: ['dane osobowe', 'prywatne informacje', 'jej numer telefonu', 'jej adres', 'gdzie mieszka'],
    advice: ['porada medyczna', 'porada prawna', 'porada psychologiczna', 'diagnoza', 'jaki lek'],
  },
}
