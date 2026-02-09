const TopicIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
)

const PostIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
)

const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
)

const NewUserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </svg>
)

const StatItem = ({ icon, value, label }) => (
  <div className="flex items-center gap-2 px-4 py-2">
    <span className="text-secondary-500" aria-hidden="true">
      {icon}
    </span>
    <div>
      <div className="font-heading text-lg text-skin-base leading-none">{value}</div>
      <div className="font-ui text-xs text-skin-muted">{label}</div>
    </div>
  </div>
)

const ForumStats = ({
  topicCount = 0,
  postCount = 0,
  memberCount = 0,
  newestMember,
  className = '',
}) => {
  return (
    <div
      className={[
        'flex flex-wrap items-center justify-center gap-2',
        'bg-primary-50/50 border border-neutral-200 rounded-stone',
        'py-2 px-2',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <StatItem icon={<TopicIcon />} value={topicCount} label="Sujets" />
      <span className="hidden sm:block h-8 border-r border-neutral-200" aria-hidden="true" />
      <StatItem icon={<PostIcon />} value={postCount} label="Messages" />
      <span className="hidden sm:block h-8 border-r border-neutral-200" aria-hidden="true" />
      <StatItem icon={<UsersIcon />} value={memberCount} label="Membres" />
      {newestMember && (
        <>
          <span
            className="hidden sm:block h-8 border-r border-neutral-200"
            aria-hidden="true"
          />
          <StatItem
            icon={<NewUserIcon />}
            value={newestMember.username}
            label="Dernier inscrit"
          />
        </>
      )}
    </div>
  )
}

ForumStats.displayName = 'ForumStats'
export default ForumStats
