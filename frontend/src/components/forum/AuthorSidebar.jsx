import { Link } from 'react-router-dom'
import Avatar from '@/components/ui/Avatar/Avatar'
import Badge from '@/components/ui/Badge/Badge'

const roleBadgeConfig = {
  ADMIN: { label: 'Admin', variant: 'error' },
  MODERATOR: { label: 'Modérateur', variant: 'success' },
  GAME_MASTER: { label: 'Maître du Jeu', variant: 'info' },
  PLAYER: { label: 'Joueur', variant: 'primary' },
}

const AuthorSidebar = ({ author, character, className = '' }) => {
  if (!author) return null

  const roleConfig = roleBadgeConfig[author.role] || roleBadgeConfig.PLAYER
  const memberSince = author.createdAt
    ? new Date(author.createdAt).toLocaleDateString('fr-FR', {
        month: 'short',
        year: 'numeric',
      })
    : null

  return (
    <div
      className={['flex flex-col items-center text-center p-3 min-w-[140px]', className]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Avatar */}
      <Avatar
        src={character?.avatarUrl || author.avatarUrl}
        name={character?.name || author.username}
        size="xl"
        ring
      />

      {/* Username */}
      <Link
        to={`/profil/${author.id}`}
        className="font-heading text-sm text-skin-base mt-2 truncate max-w-full hover:text-secondary-600 transition-colors"
      >
        {author.username}
      </Link>

      {/* Role badge */}
      <Badge variant={roleConfig.variant} size="sm" dot className="mt-1">
        {roleConfig.label}
      </Badge>

      {/* Character name if RP */}
      {character && (
        <div className="mt-2 px-2 py-1 bg-secondary-50 rounded-stone w-full">
          <div className="font-ui text-xs text-skin-muted">Personnage</div>
          <div className="font-body text-sm text-secondary-700 truncate">{character.name}</div>
        </div>
      )}

      {/* Stats */}
      <div className="mt-3 w-full space-y-1 text-left">
        {memberSince && (
          <div className="font-ui text-xs text-skin-muted">Membre depuis {memberSince}</div>
        )}
        {author.postCount !== undefined && (
          <div className="font-ui text-xs text-skin-muted">{author.postCount} messages</div>
        )}
      </div>
    </div>
  )
}

AuthorSidebar.displayName = 'AuthorSidebar'
export default AuthorSidebar
