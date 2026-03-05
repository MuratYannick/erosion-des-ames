import { useEffect } from 'react'
import TableOfContents from '../../components/ui/TableOfContents'
import { ScrollToTop } from '../../components/ui/ScrollToTop'
import { TribalDivider } from '../../components/ui/Card/TribalDivider'
import { TribalCorner } from '../../components/ui/Card/TribalCorner'
import SEO from '@/components/common/SEO'

const sections = [
  { id: 'introduction', title: 'Introduction & Bienvenue', level: 1 },
  { id: 'regles-generales', title: 'Règles générales de conduite', level: 1 },
  { id: 'respect', title: 'Respect mutuel', level: 2 },
  { id: 'langage', title: 'Langage approprié', level: 2 },
  { id: 'regles-roleplay', title: 'Règles du roleplay', level: 1 },
  { id: 'metagaming', title: 'Interdiction du metagaming', level: 2 },
  { id: 'godmodding', title: 'Interdiction du godmodding', level: 2 },
  { id: 'coherence', title: 'Cohérence narrative', level: 2 },
  { id: 'creation-personnage', title: 'Création de personnage', level: 1 },
  { id: 'fiche', title: 'Remplir sa fiche', level: 2 },
  { id: 'validation', title: 'Processus de validation', level: 2 },
  { id: 'systeme-jeu', title: 'Système de jeu', level: 1 },
  { id: 'actions', title: 'Résolution des actions', level: 2 },
  { id: 'combat', title: 'Système de combat', level: 2 },
  { id: 'moderation', title: 'Modération et sanctions', level: 1 },
  { id: 'mentions-legales', title: 'Mentions légales', level: 1 }
]

const Foreword = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-primary-50/30">
      <SEO
        title="Avant-propos"
        description="Règles de conduite, charte du roleplay et mentions légales du forum Erosion des Âmes."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3">
            <TableOfContents sections={sections} />
          </aside>

          <main className="lg:col-span-9">
            <article className="bg-surface shadow-lg rounded-stone border-2 border-primary-200 overflow-hidden">
              <div className="relative p-6 sm:p-8 lg:p-12 bg-primary-50/20">
                <TribalCorner position="top-left" size="lg" className="text-primary-300 opacity-40" />
                <TribalCorner position="top-right" size="lg" className="text-primary-300 opacity-40" />

                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-center text-primary-900 mb-4">
                  Avant-Propos
                </h1>
                <p className="font-accent text-center text-secondary-600 text-lg sm:text-xl">
                  Les règles du royaume oublié
                </p>

                <TribalDivider className="text-primary-400 my-8" variant="ornate" />
              </div>

              <div className="prose prose-lg max-w-none px-6 sm:px-8 lg:px-12 py-8">
                <Section id="introduction">
                  <SectionTitle>Introduction & Bienvenue</SectionTitle>
                  <p className="font-body text-primary-800 leading-relaxed">
                    Bienvenue dans le monde d'<span className="font-accent text-secondary-600">Érosion des Âmes</span>,
                    un univers de dark fantasy tribale où les ruines du passé côtoient les lueurs d'espoir d'un futur incertain.
                  </p>
                  <p className="font-body text-primary-800 leading-relaxed">
                    Ce document établit les règles fondamentales qui régissent notre communauté et nos sessions de jeu de rôle.
                    Leur respect garantit une expérience agréable et immersive pour tous les participants.
                  </p>
                </Section>

                <TribalDivider className="text-primary-300 my-8" variant="simple" />

                <Section id="regles-generales">
                  <SectionTitle>Règles générales de conduite</SectionTitle>

                  <Subsection id="respect">
                    <SubsectionTitle>Respect mutuel</SubsectionTitle>
                    <ul className="font-body text-primary-800 space-y-2">
                      <li>Traitez tous les membres avec courtoisie et bienveillance</li>
                      <li>Les propos discriminatoires, harcelants ou offensants sont strictement interdits</li>
                      <li>Respectez les limites personnelles de chacun en matière de thématiques sensibles</li>
                    </ul>
                  </Subsection>

                  <Subsection id="langage">
                    <SubsectionTitle>Langage approprié</SubsectionTitle>
                    <p className="font-body text-primary-800 leading-relaxed">
                      Le langage vulgaire excessif est découragé en dehors du roleplay contextuel.
                      Maintenez un niveau de langue adapté au contexte dark fantasy mature du jeu.
                    </p>
                  </Subsection>
                </Section>

                <TribalDivider className="text-primary-300 my-8" variant="simple" />

                <Section id="regles-roleplay">
                  <SectionTitle>Règles du roleplay</SectionTitle>

                  <Subsection id="metagaming">
                    <SubsectionTitle>Interdiction du metagaming</SubsectionTitle>
                    <p className="font-body text-primary-800 leading-relaxed">
                      Votre personnage ne peut utiliser que les informations qu'il a réellement découvertes en jeu.
                      Les connaissances acquises hors-jeu ne doivent pas influencer ses décisions.
                    </p>
                  </Subsection>

                  <Subsection id="godmodding">
                    <SubsectionTitle>Interdiction du godmodding</SubsectionTitle>
                    <p className="font-body text-primary-800 leading-relaxed">
                      Ne contrôlez jamais les actions ou réactions du personnage d'un autre joueur.
                      Laissez toujours à votre interlocuteur la possibilité de réagir.
                    </p>
                  </Subsection>

                  <Subsection id="coherence">
                    <SubsectionTitle>Cohérence narrative</SubsectionTitle>
                    <p className="font-body text-primary-800 leading-relaxed">
                      Maintenez la cohérence de votre personnage avec sa fiche, son background et l'univers établi.
                      Les actions doivent être justifiées par le contexte narratif.
                    </p>
                  </Subsection>
                </Section>

                <TribalDivider className="text-primary-300 my-8" variant="simple" />

                <Section id="creation-personnage">
                  <SectionTitle>Création de personnage</SectionTitle>

                  <Subsection id="fiche">
                    <SubsectionTitle>Remplir sa fiche</SubsectionTitle>
                    <ul className="font-body text-primary-800 space-y-2">
                      <li>Nom, origine tribale et historique détaillé</li>
                      <li>Traits de personnalité et motivations</li>
                      <li>Compétences et capacités (selon le système de jeu)</li>
                      <li>Relations avec d'autres personnages (si applicable)</li>
                    </ul>
                  </Subsection>

                  <Subsection id="validation">
                    <SubsectionTitle>Processus de validation</SubsectionTitle>
                    <p className="font-body text-primary-800 leading-relaxed">
                      Chaque fiche de personnage doit être validée par un membre de l'équipe de modération
                      avant de pouvoir participer aux sessions de roleplay.
                    </p>
                  </Subsection>
                </Section>

                <TribalDivider className="text-primary-300 my-8" variant="simple" />

                <Section id="systeme-jeu">
                  <SectionTitle>Système de jeu</SectionTitle>

                  <Subsection id="actions">
                    <SubsectionTitle>Résolution des actions</SubsectionTitle>
                    <p className="font-body text-primary-800 leading-relaxed">
                      Les actions incertaines ou risquées sont résolues par lancer de dés (système à déterminer).
                      Le maître du jeu arbitre les situations ambiguës.
                    </p>
                  </Subsection>

                  <Subsection id="combat">
                    <SubsectionTitle>Système de combat</SubsectionTitle>
                    <p className="font-body text-primary-800 leading-relaxed">
                      Les combats suivent un système structuré basé sur l'initiative et les jets d'attaque/défense.
                      Les détails complets seront fournis dans un document dédié.
                    </p>
                  </Subsection>
                </Section>

                <TribalDivider className="text-primary-300 my-8" variant="simple" />

                <Section id="moderation">
                  <SectionTitle>Modération et sanctions</SectionTitle>
                  <p className="font-body text-primary-800 leading-relaxed">
                    Le non-respect des règles peut entraîner des sanctions graduées :
                  </p>
                  <ol className="font-body text-primary-800 space-y-2 list-decimal list-inside">
                    <li>Avertissement verbal</li>
                    <li>Avertissement officiel</li>
                    <li>Suspension temporaire</li>
                    <li>Bannissement définitif (cas graves)</li>
                  </ol>
                  <p className="font-body text-primary-800 leading-relaxed mt-4">
                    L'équipe de modération se réserve le droit d'adapter les sanctions selon la gravité et le contexte.
                  </p>
                </Section>

                <TribalDivider className="text-primary-300 my-8" variant="simple" />

                <Section id="mentions-legales">
                  <SectionTitle>Mentions légales</SectionTitle>
                  <p className="font-body text-primary-700 text-sm leading-relaxed">
                    Ce projet est une création communautaire à but non lucratif. Tous les contenus originaux
                    (textes, illustrations, systèmes de jeu) sont la propriété de leurs auteurs respectifs.
                  </p>
                  <p className="font-body text-primary-700 text-sm leading-relaxed">
                    L'utilisation d'éléments tiers (polices, icônes, images d'illustration) respecte les licences
                    appropriées. Pour toute question concernant les droits d'auteur, contactez l'équipe d'administration.
                  </p>
                </Section>
              </div>

              <div className="relative px-6 sm:px-8 lg:px-12 py-8 bg-primary-50/20 border-t-2 border-primary-200">
                <TribalCorner position="bottom-left" size="lg" className="text-primary-300 opacity-40" />
                <TribalCorner position="bottom-right" size="lg" className="text-primary-300 opacity-40" />

                <p className="font-accent text-center text-primary-600 italic">
                  Que le feu sacré guide vos pas dans les ruines...
                </p>
              </div>
            </article>
          </main>
        </div>
      </div>

      <ScrollToTop />
    </div>
  )
}

const Section = ({ id, children }) => (
  <section id={id} className="scroll-mt-24 mb-10">
    {children}
  </section>
)

const Subsection = ({ id, children }) => (
  <div id={id} className="scroll-mt-24 ml-4 mb-6">
    {children}
  </div>
)

const SectionTitle = ({ children }) => (
  <h2 className="font-heading text-3xl text-primary-900 mb-4 flex items-center gap-3">
    <TribalBullet />
    {children}
  </h2>
)

const SubsectionTitle = ({ children }) => (
  <h3 className="font-subheading text-xl text-primary-800 mb-3">
    {children}
  </h3>
)

const TribalBullet = () => (
  <svg
    className="w-6 h-6 text-secondary-500 flex-shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 4 L20 12 L12 20 L4 12 Z" fill="currentColor" fillOpacity="0.6" />
    <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.9" />
  </svg>
)

export default Foreword
