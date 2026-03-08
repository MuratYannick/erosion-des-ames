import { Link } from 'react-router-dom'
import { Avatar, Badge } from '@/components'

const roleBadgeConfig = {
  ADMIN: { label: 'Admin', variant: 'error' },
  MODERATOR: { label: 'Modérateur', variant: 'success' },
  GAME_MASTER: { label: 'Maître du Jeu', variant: 'info' },
  PLAYER: { label: 'Joueur', variant: 'primary' },
}

const ProfileHeader = ({ profile, isOwnProfile }) => {
  const { user, stats } = profile
  const roleConfig = roleBadgeConfig[user.role] || roleBadgeConfig.PLAYER

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <div className="bg-gradient-to-br from-primary-800 to-primary-900 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <Avatar
              src={user.avatar}
              name={user.username}
              size="xl"
              ring
              className="w-24 h-24 sm:w-32 sm:h-32 text-3xl"
            />
          </div>

          {/* Info block */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="font-display text-3xl sm:text-4xl text-white leading-tight">
                {user.username}
              </h1>
              <Badge variant={roleConfig.variant} size="sm" dot>
                {roleConfig.label}
              </Badge>
            </div>

            {memberSince && (
              <p className="font-ui text-sm text-primary-300">
                Membre depuis {memberSince}
              </p>
            )}

            <p className="font-ui text-sm text-primary-200">
              {stats.topicCount} sujets · {stats.postCount} messages
            </p>

            {/* Active character */}
            {user.selectedCharacter && (
              <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-white/10 rounded-lg">
                <Avatar
                  src={user.selectedCharacter.avatar}
                  name={user.selectedCharacter.name}
                  size="xs"
                />
                <span className="font-ui text-sm text-primary-100">
                  {user.selectedCharacter.name}
                </span>
                {user.selectedCharacter.faction && (
                  <span className="font-ui text-xs text-primary-300">
                    · {user.selectedCharacter.faction.name}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Edit button */}
          {isOwnProfile && (
            <div className="flex-shrink-0">
              <Link
                to="/profil/parametres"
                className="inline-flex items-center px-4 py-2 bg-white/15 hover:bg-white/25 text-white font-button text-sm rounded-lg transition-colors border border-white/20"
              >
                Modifier mon profil
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

ProfileHeader.displayName = 'ProfileHeader'
export default ProfileHeader
