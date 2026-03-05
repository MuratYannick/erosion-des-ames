const TABS = [
  { value: 'characters', label: 'Personnages' },
  { value: 'topics', label: 'Sujets' },
  { value: 'posts', label: 'Messages' },
]

const ProfileTabs = ({ activeTab, onTabChange, counts = {} }) => {
  return (
    <div className="border-b border-neutral-200 bg-surface">
      <div className="container mx-auto px-4">
        <div className="flex gap-1 py-3">
          {TABS.map((tab) => {
            const count = counts[tab.value]
            const isActive = activeTab === tab.value
            return (
              <button
                key={tab.value}
                onClick={() => onTabChange(tab.value)}
                className={[
                  'px-4 py-1.5 rounded-full font-button text-sm transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-skin-muted hover:text-skin-base hover:bg-primary-50',
                ].join(' ')}
              >
                {tab.label}
                {count !== undefined && (
                  <span className={`ml-1.5 text-xs ${isActive ? 'text-white/70' : 'text-skin-muted'}`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

ProfileTabs.displayName = 'ProfileTabs'
export default ProfileTabs
