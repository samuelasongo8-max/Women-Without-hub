import { readFileSync, writeFileSync } from 'node:fs'
const p = 'src/locales/en.json'
const o = JSON.parse(readFileSync(p, 'utf8'))
o.about.heading = 'About'
o.about.paragraph = 'Women Without Borders Hub is a community-led organization in Kakuma, Turkana County, Kenya, creating opportunities for vulnerable girls, teenage mothers and young women.'
o.about.missionTitle = 'Our mission'
o.about.visionTitle = 'Our vision'
o.about.whoWeServe = 'Who we serve'
o.about.coreValues = 'Our core values'
o.about.whereWeWork = 'Where we work'
o.about.partnersText = 'We partner with schools, training institutions, health providers, NGOs, development organizations, donors and private-sector partners — adapting each programme to local needs while holding consistent standards for quality and safeguarding.'
o.about.getToKnowUs = 'Get to know us better'
o.about.exploreText = 'Explore our programs, read our impact or get involved.'
o.about.actionsHeading = 'Ways to support'
o.about.card1Label = "Sponsor a Girl's Education"
o.about.card1Desc = "Help fund a girl's education journey"
o.about.card2Label = 'Support Menstrual Health Education'
o.about.card2Desc = 'Provide menstrual health resources'
o.about.card3Label = 'Fund Digital and Practical Skills'
o.about.card3Desc = 'Support digital skills training'
o.about.card4Label = 'Partner With Us'
o.about.card4Desc = 'Collaborate with us to empower more girls'
writeFileSync(p, JSON.stringify(o, null, 2))
console.log('en.json about keys:', Object.keys(o.about).join(', '))
