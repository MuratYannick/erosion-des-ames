import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useToast, Avatar } from '@/components'
import { useUpdateProfile } from '@/hooks'
import * as authService from '@/services/authService'
import AvatarUpload from '@/components/ui/FileUpload/AvatarUpload'
import api from '@/services/api'
import SEO from '@/components/common/SEO'

const SectionTitle = ({ children }) => (
  <h2 className="font-heading text-xl text-primary-800 mb-4 pb-2 border-b border-neutral-200">
    {children}
  </h2>
)

const ProfileSettings = () => {
  const { user, updateUser } = useAuth()
  const { addToast } = useToast()

  // --- Identity ---
  const [username, setUsername] = useState(user?.username || '')
  const [usernameError, setUsernameError] = useState('')

  // --- Avatar ---
  const [avatarUploading, setAvatarUploading] = useState(false)

  // --- Password ---
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  })
  const [passwordError, setPasswordError] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)

  const { mutate: updateProfile, loading: profileLoading } = useUpdateProfile({
    onSuccess: (data) => {
      if (data?.user) updateUser(data.user)
      setUsernameError('')
      addToast({ variant: 'success', title: 'Profil mis à jour', description: 'Vos informations ont été sauvegardées.' })
    },
    onError: (err) => {
      // Afficher les erreurs de validation par champ retournées par le serveur
      const serverErrors = err?.response?.data?.errors
      if (serverErrors && serverErrors.length > 0) {
        const usernameErr = serverErrors.find((e) => (e.path || e.param) === 'username')
        if (usernameErr) {
          setUsernameError(usernameErr.msg)
          return
        }
      }
      const serverMessage = err?.response?.data?.message || err.message
      addToast({ variant: 'error', title: 'Erreur', description: serverMessage || 'Impossible de mettre à jour le profil.' })
    },
  })

  const handleUsernameSubmit = async (e) => {
    e.preventDefault()
    const trimmed = username.trim()
    if (!trimmed) {
      setUsernameError('Le nom d\'utilisateur est requis')
      return
    }
    if (trimmed.length < 5) {
      setUsernameError('Le nom d\'utilisateur doit contenir au moins 5 caractères')
      return
    }
    if (trimmed.length > 50) {
      setUsernameError('Le nom d\'utilisateur ne doit pas dépasser 50 caractères')
      return
    }
    if (!/^[a-zA-Z0-9]([a-zA-Z0-9]|[_ -](?=[a-zA-Z0-9]))*$/.test(trimmed)) {
      setUsernameError('Le nom d\'utilisateur doit commencer et finir par un caractère alphanumérique. Les underscores, espaces et tirets doivent être entre deux caractères alphanumériques')
      return
    }
    setUsernameError('')
    await updateProfile({ username: trimmed })
  }

  const handleAvatarChange = async (file) => {
    try {
      setAvatarUploading(true)
      const formData = new FormData()
      formData.append('avatar', file)
      const response = await api.post('/upload/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const { url } = response.data.data
      await updateProfile({ avatar: url })
      if (user) updateUser({ ...user, avatar: url })
    } catch (err) {
      addToast({
        variant: 'error',
        title: 'Erreur upload',
        description: err.message || "Impossible d'envoyer l'image.",
      })
    } finally {
      setAvatarUploading(false)
    }
  }

  const handlePasswordChange = (e) => {
    setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setPasswordError('')
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    const { currentPassword, newPassword, confirmNewPassword } = passwordForm
    if (!currentPassword) {
      setPasswordError('Le mot de passe actuel est requis.')
      return
    }
    if (!newPassword) {
      setPasswordError('Le nouveau mot de passe est requis.')
      return
    }
    if (newPassword.length < 8) {
      setPasswordError('Le nouveau mot de passe doit contenir au moins 8 caractères.')
      return
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/.test(newPassword)) {
      setPasswordError('Le nouveau mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.')
      return
    }
    if (!confirmNewPassword) {
      setPasswordError('La confirmation du nouveau mot de passe est requise.')
      return
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError('Les nouveaux mots de passe ne correspondent pas.')
      return
    }
    if (newPassword === currentPassword) {
      setPasswordError('Le nouveau mot de passe doit être différent de l\'ancien.')
      return
    }
    try {
      setPasswordLoading(true)
      await authService.changePassword(currentPassword, newPassword, confirmNewPassword)
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' })
      addToast({ variant: 'success', title: 'Mot de passe modifié', description: 'Votre mot de passe a été mis à jour.' })
    } catch (err) {
      // Afficher le message précis retourné par le serveur si disponible
      const serverMessage = err?.response?.data?.errors?.[0]?.msg || err?.response?.data?.message || err.message
      setPasswordError(serverMessage || 'Impossible de modifier le mot de passe.')
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <SEO
        title="Paramètres du compte"
        description="Gérez votre profil, votre avatar et votre mot de passe sur Erosion des Âmes."
      />
      <h1 className="font-display text-3xl text-primary-900 mb-8">Paramètres du compte</h1>

      {/* Identité */}
      <section className="mb-8">
        <SectionTitle>Identité</SectionTitle>
        <form onSubmit={handleUsernameSubmit} className="space-y-4">
          <div>
            <label className="block font-ui text-sm text-skin-base mb-1" htmlFor="username">
              Nom d'utilisateur
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); if (usernameError) setUsernameError('') }}
              className={`w-full px-3 py-2 border rounded-lg font-body text-sm focus:outline-none focus:border-primary-500 ${usernameError ? 'border-error' : 'border-neutral-300'}`}
            />
            {usernameError && (
              <p className="font-ui text-sm text-error mt-1">{usernameError}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={profileLoading || !username.trim()}
            className="px-4 py-2 bg-primary-700 hover:bg-primary-800 disabled:opacity-50 text-white font-button text-sm rounded-lg transition-colors"
          >
            {profileLoading ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </form>
      </section>

      {/* Avatar */}
      <section className="mb-8">
        <SectionTitle>Avatar</SectionTitle>
        <div className="flex items-center gap-6">
          <AvatarUpload
            currentAvatar={user?.avatar || null}
            onChange={handleAvatarChange}
            size="lg"
            disabled={avatarUploading || profileLoading}
          />
          <div className="font-ui text-sm text-skin-muted">
            {avatarUploading
              ? 'Upload en cours…'
              : 'Cliquez sur l\'image pour changer votre avatar. Formats acceptés : JPG, PNG, WebP (max 2 Mo).'}
          </div>
        </div>
      </section>

      {/* Mot de passe */}
      <section className="mb-8">
        <SectionTitle>Mot de passe</SectionTitle>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {passwordError && (
            <p className="font-ui text-sm text-error">{passwordError}</p>
          )}
          <div>
            <label className="block font-ui text-sm text-skin-base mb-1" htmlFor="currentPassword">
              Mot de passe actuel
            </label>
            <input
              id="currentPassword"
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-body text-sm focus:outline-none focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block font-ui text-sm text-skin-base mb-1" htmlFor="newPassword">
              Nouveau mot de passe
            </label>
            <input
              id="newPassword"
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-body text-sm focus:outline-none focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block font-ui text-sm text-skin-base mb-1" htmlFor="confirmNewPassword">
              Confirmer le nouveau mot de passe
            </label>
            <input
              id="confirmNewPassword"
              type="password"
              name="confirmNewPassword"
              value={passwordForm.confirmNewPassword}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-body text-sm focus:outline-none focus:border-primary-500"
            />
          </div>
          <button
            type="submit"
            disabled={passwordLoading}
            className="px-4 py-2 bg-primary-700 hover:bg-primary-800 disabled:opacity-50 text-white font-button text-sm rounded-lg transition-colors"
          >
            {passwordLoading ? 'Modification…' : 'Modifier le mot de passe'}
          </button>
        </form>
      </section>

      {/* Email */}
      <section className="mb-8">
        <SectionTitle>Email</SectionTitle>
        <div className="flex items-center gap-3">
          <span className="font-body text-sm text-skin-base">{user?.email}</span>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-button ${
              user?.emailVerified
                ? 'bg-success/15 text-success-dark'
                : 'bg-warning/15 text-warning-dark'
            }`}
          >
            {user?.emailVerified ? 'Vérifié' : 'Non vérifié'}
          </span>
        </div>
        <p className="font-ui text-xs text-skin-muted mt-1">
          La modification de l'email n'est pas disponible pour le moment.
        </p>
      </section>

      {/* Danger Zone */}
      <section>
        <h2 className="font-heading text-xl text-error mb-4 pb-2 border-b border-error/30">
          Zone de danger
        </h2>
        <p className="font-body text-sm text-skin-muted mb-4">
          La suppression de compte est permanente et irréversible.
        </p>
        {/* TODO: requires DELETE /auth/account endpoint */}
        <button
          type="button"
          disabled
          className="px-4 py-2 bg-error/10 text-error font-button text-sm rounded-lg border border-error/30 opacity-50 cursor-not-allowed"
        >
          Supprimer mon compte
        </button>
      </section>
    </div>
  )
}

ProfileSettings.displayName = 'ProfileSettings'
export default ProfileSettings
