import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useCreateCharacter, useSubmitCharacter, useReferenceData } from '@/hooks'
import { useToast, Loader, ScrollToTop } from '@/components'

const MyCharacterCreate = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToast } = useToast()

  const { data: refData, loading: refLoading } = useReferenceData()

  const [formData, setFormData] = useState({
    name: '',
    ethnicityId: '',
    factionId: '',
    clanId: '',
    age: '',
    appearance: '',
    personality: '',
    background: '',
    goals: '',
  })

  const [errors, setErrors] = useState({})

  const { mutate: createCharacter, loading: creating } = useCreateCharacter({
    onSuccess: (data) => {
      addToast({
        variant: 'success',
        title: 'Personnage créé',
        description: 'Votre personnage a été sauvegardé.',
      })
      navigate(`/mes-personnages/${data.character.id}`)
    },
    onError: (err) => {
      addToast({
        variant: 'error',
        title: 'Erreur',
        description: err.message || 'Impossible de créer le personnage.',
      })
    },
  })

  const { mutate: submitCharacter, loading: submitting } = useSubmitCharacter({
    onSuccess: () => {
      addToast({
        variant: 'success',
        title: 'Personnage soumis',
        description: 'Votre personnage a été soumis pour validation.',
      })
    },
    onError: (err) => {
      addToast({
        variant: 'error',
        title: 'Erreur',
        description: err.message || 'Impossible de soumettre le personnage.',
      })
    },
  })

  // Calculate form completion percentage
  const completionPercentage = useMemo(() => {
    const fields = [
      formData.name,
      formData.ethnicityId,
      formData.factionId,
      formData.clanId,
      formData.age,
      formData.appearance,
      formData.personality,
      formData.background,
      formData.goals,
    ]
    const filledFields = fields.filter((field) => field && field.toString().trim() !== '').length
    return Math.round((filledFields / fields.length) * 100)
  }, [formData])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis'
    } else if (formData.name.length > 50) {
      newErrors.name = 'Le nom ne peut pas dépasser 50 caractères'
    }

    if (!formData.ethnicityId) {
      newErrors.ethnicityId = 'L\'ethnicité est requise'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveDraft = async () => {
    if (!validate()) return

    const characterData = {
      ...formData,
      userId: user.id,
      ethnicityId: parseInt(formData.ethnicityId) || null,
      factionId: formData.factionId ? parseInt(formData.factionId) : null,
      clanId: formData.clanId ? parseInt(formData.clanId) : null,
      age: formData.age ? parseInt(formData.age) : null,
      status: 'draft',
    }

    createCharacter(characterData)
  }

  const handleSubmitForValidation = async () => {
    if (!validate()) return

    const characterData = {
      ...formData,
      userId: user.id,
      ethnicityId: parseInt(formData.ethnicityId) || null,
      factionId: formData.factionId ? parseInt(formData.factionId) : null,
      clanId: formData.clanId ? parseInt(formData.clanId) : null,
      age: formData.age ? parseInt(formData.age) : null,
      status: 'draft',
    }

    // Create then submit
    createCharacter(characterData, {
      onSuccess: (data) => {
        submitCharacter(data.character.id, {
          onSuccess: () => {
            navigate(`/mes-personnages/${data.character.id}`)
          },
        })
      },
    })
  }

  if (refLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  const ethnicities = refData?.ethnicities || []
  const factions = refData?.factions || []
  const clans = refData?.clans || []

  const isProcessing = creating || submitting

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-gradient-to-b from-surface to-primary-50 pb-24">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary-800 to-primary-900 text-primary-50 py-8 md:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl mb-4">
              Forger une nouvelle âme
            </h1>

            {/* Progress Bar */}
            <div className="max-w-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-ui text-sm text-primary-200">Progression</span>
                <span className="font-ui text-sm text-primary-200 font-semibold">{completionPercentage}%</span>
              </div>
              <div className="h-2 bg-primary-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary-500 transition-all duration-300 ease-out"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Section 1: Identité */}
            <div className="bg-surface rounded-lg border-2 border-primary-300 p-6 md:p-8 shadow-md">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-secondary-500 text-primary-900 font-subheading text-xl flex items-center justify-center shadow-glow flex-shrink-0">
                  1
                </div>
                <h2 className="font-heading text-2xl md:text-3xl text-primary-900">Identité</h2>
              </div>

              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block font-ui text-sm md:text-base text-primary-800 mb-2">
                    Nom <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    maxLength={50}
                    className={`w-full px-4 py-3 bg-surface border-2 ${
                      errors.name ? 'border-error' : 'border-primary-400'
                    } rounded-lg font-body text-base focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20 transition-all`}
                    placeholder="Entrez le nom du personnage"
                  />
                  <div className="flex justify-between mt-1">
                    {errors.name && <p className="font-ui text-sm text-error">{errors.name}</p>}
                    <p className={`font-ui text-xs ${errors.name ? 'text-error' : 'text-primary-600'} ${!errors.name ? 'ml-auto' : ''}`}>
                      {formData.name.length}/50
                    </p>
                  </div>
                </div>

                {/* Ethnicity */}
                <div>
                  <label htmlFor="ethnicityId" className="block font-ui text-sm md:text-base text-primary-800 mb-2">
                    Ethnicité <span className="text-error">*</span>
                  </label>
                  <select
                    id="ethnicityId"
                    value={formData.ethnicityId}
                    onChange={(e) => handleChange('ethnicityId', e.target.value)}
                    className={`w-full px-4 py-3 bg-surface border-2 ${
                      errors.ethnicityId ? 'border-error' : 'border-primary-400'
                    } rounded-lg font-body text-base cursor-pointer focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20 transition-all`}
                  >
                    <option value="">Sélectionnez une ethnicité</option>
                    {ethnicities.map((ethnicity) => (
                      <option key={ethnicity.id} value={ethnicity.id}>
                        {ethnicity.name}
                      </option>
                    ))}
                  </select>
                  {errors.ethnicityId && <p className="font-ui text-sm text-error mt-1">{errors.ethnicityId}</p>}
                </div>

                {/* Faction */}
                <div>
                  <label htmlFor="factionId" className="block font-ui text-sm md:text-base text-primary-800 mb-2">
                    Faction
                  </label>
                  <select
                    id="factionId"
                    value={formData.factionId}
                    onChange={(e) => handleChange('factionId', e.target.value)}
                    className="w-full px-4 py-3 bg-surface border-2 border-primary-400 rounded-lg font-body text-base cursor-pointer focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20 transition-all"
                  >
                    <option value="">Aucune faction</option>
                    {factions.map((faction) => (
                      <option key={faction.id} value={faction.id}>
                        {faction.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clan */}
                <div>
                  <label htmlFor="clanId" className="block font-ui text-sm md:text-base text-primary-800 mb-2">
                    Clan
                  </label>
                  <select
                    id="clanId"
                    value={formData.clanId}
                    onChange={(e) => handleChange('clanId', e.target.value)}
                    className="w-full px-4 py-3 bg-surface border-2 border-primary-400 rounded-lg font-body text-base cursor-pointer focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20 transition-all"
                  >
                    <option value="">Aucun clan</option>
                    {clans.map((clan) => (
                      <option key={clan.id} value={clan.id}>
                        {clan.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Age */}
                <div>
                  <label htmlFor="age" className="block font-ui text-sm md:text-base text-primary-800 mb-2">
                    Âge
                  </label>
                  <input
                    type="number"
                    id="age"
                    value={formData.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    min="0"
                    max="150"
                    className="w-full px-4 py-3 bg-surface border-2 border-primary-400 rounded-lg font-body text-base focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20 transition-all"
                    placeholder="Âge du personnage"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Apparence */}
            <div className="bg-surface rounded-lg border-2 border-primary-300 p-6 md:p-8 shadow-md">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-secondary-500 text-primary-900 font-subheading text-xl flex items-center justify-center shadow-glow flex-shrink-0">
                  2
                </div>
                <h2 className="font-heading text-2xl md:text-3xl text-primary-900">Apparence</h2>
              </div>

              <div>
                <label htmlFor="appearance" className="block font-ui text-sm md:text-base text-primary-800 mb-2">
                  Décrivez l'apparence physique de votre personnage
                </label>
                <textarea
                  id="appearance"
                  value={formData.appearance}
                  onChange={(e) => handleChange('appearance', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 bg-surface border-2 border-primary-400 rounded-lg font-body text-base focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20 transition-all resize-y"
                  placeholder="Traits physiques, vêtements, cicatrices, particularités..."
                />
              </div>
            </div>

            {/* Section 3: Personnalité */}
            <div className="bg-surface rounded-lg border-2 border-primary-300 p-6 md:p-8 shadow-md">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-secondary-500 text-primary-900 font-subheading text-xl flex items-center justify-center shadow-glow flex-shrink-0">
                  3
                </div>
                <h2 className="font-heading text-2xl md:text-3xl text-primary-900">Personnalité</h2>
              </div>

              <div>
                <label htmlFor="personality" className="block font-ui text-sm md:text-base text-primary-800 mb-2">
                  Décrivez les traits de caractère
                </label>
                <textarea
                  id="personality"
                  value={formData.personality}
                  onChange={(e) => handleChange('personality', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 bg-surface border-2 border-primary-400 rounded-lg font-body text-base focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20 transition-all resize-y"
                  placeholder="Tempérament, qualités, défauts, manières de parler..."
                />
              </div>
            </div>

            {/* Section 4: Histoire */}
            <div className="bg-surface rounded-lg border-2 border-primary-300 p-6 md:p-8 shadow-md">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-secondary-500 text-primary-900 font-subheading text-xl flex items-center justify-center shadow-glow flex-shrink-0">
                  4
                </div>
                <h2 className="font-heading text-2xl md:text-3xl text-primary-900">Histoire</h2>
              </div>

              <div>
                <label htmlFor="background" className="block font-ui text-sm md:text-base text-primary-800 mb-2">
                  Racontez le passé de votre personnage
                </label>
                <textarea
                  id="background"
                  value={formData.background}
                  onChange={(e) => handleChange('background', e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 bg-surface border-2 border-primary-400 rounded-lg font-body text-base focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20 transition-all resize-y"
                  placeholder="Origine, événements marquants, relations importantes..."
                />
              </div>
            </div>

            {/* Section 5: Objectifs */}
            <div className="bg-surface rounded-lg border-2 border-primary-300 p-6 md:p-8 shadow-md">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-secondary-500 text-primary-900 font-subheading text-xl flex items-center justify-center shadow-glow flex-shrink-0">
                  5
                </div>
                <h2 className="font-heading text-2xl md:text-3xl text-primary-900">Objectifs</h2>
              </div>

              <div>
                <label htmlFor="goals" className="block font-ui text-sm md:text-base text-primary-800 mb-2">
                  Quelles sont ses motivations ?
                </label>
                <textarea
                  id="goals"
                  value={formData.goals}
                  onChange={(e) => handleChange('goals', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 bg-surface border-2 border-primary-400 rounded-lg font-body text-base focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20 transition-all resize-y"
                  placeholder="Ambitions, désirs, quêtes personnelles..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Footer with Actions */}
        <div className="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-sm border-t-2 border-primary-300 shadow-lg z-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={() => navigate('/mes-personnages')}
                disabled={isProcessing}
                className="px-6 py-3 bg-primary-200 text-primary-900 font-button text-base rounded-lg hover:bg-primary-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveDraft}
                disabled={isProcessing}
                className="px-6 py-3 bg-primary-600 text-white font-button text-base rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating && !submitting ? 'Sauvegarde...' : 'Sauvegarder brouillon'}
              </button>
              <button
                onClick={handleSubmitForValidation}
                disabled={isProcessing}
                className="px-6 py-3 bg-secondary-500 text-primary-900 font-button text-base rounded-lg shadow-glow hover:bg-secondary-600 hover:shadow-glow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating || submitting ? 'Traitement...' : 'Soumettre pour validation'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MyCharacterCreate
