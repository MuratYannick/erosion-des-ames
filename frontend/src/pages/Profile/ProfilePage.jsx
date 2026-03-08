import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import SEO from '@/components/common/SEO'
import { useUserProfile, useUserCharacters, useUserTopics, useUserPosts } from '@/hooks'
import { Loader } from '@/components'
import { CharacterCard } from '@/components/characters'
import { ForumPagination } from '@/components/forum'
import ProfileHeader from './components/ProfileHeader'
import ProfileTabs from './components/ProfileTabs'
import ProfileActivityRow from './components/ProfileActivityRow'

const ProfilePage = () => {
  const { id } = useParams()
  const { user: currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState('characters')
  const [page, setPage] = useState(1)

  const { data: profileData, loading, error } = useUserProfile(id)
  const isOwnProfile = currentUser?.id === id

  const { data: charsData, loading: charsLoading } = useUserCharacters(
    id,
    { page, limit: 12 },
    { enabled: activeTab === 'characters' }
  )
  const { data: topicsData, loading: topicsLoading } = useUserTopics(
    id,
    { page, limit: 20 },
    { enabled: activeTab === 'topics' }
  )
  const { data: postsData, loading: postsLoading } = useUserPosts(
    id,
    { page, limit: 20 },
    { enabled: activeTab === 'posts' }
  )

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setPage(1)
  }

  if (loading || (!error && !profileData)) {
    return (
      <div className="flex justify-center py-20">
        <Loader />
      </div>
    )
  }

  if (error || !profileData) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="font-body text-error">Profil introuvable ou erreur de chargement.</p>
      </div>
    )
  }

  const profile = profileData
  const { user } = profile

  if (user.isActive === false) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="font-body text-skin-muted">Ce compte a été désactivé.</p>
      </div>
    )
  }

  // Tab content data
  const characters = charsData?.items || []
  const topics = topicsData?.items || []
  const posts = postsData?.items || []

  const totalPages =
    activeTab === 'characters'
      ? charsData?.totalPages || 1
      : activeTab === 'topics'
      ? topicsData?.totalPages || 1
      : postsData?.totalPages || 1

  const tabLoading =
    activeTab === 'characters'
      ? charsLoading
      : activeTab === 'topics'
      ? topicsLoading
      : postsLoading

  const counts = {
    characters: charsData?.total,
    topics: topicsData?.total,
    posts: postsData?.total,
  }

  return (
    <div>
      <SEO
        title={`Profil de ${user.username}`}
        description={`Profil de ${user.username} sur Erosion des Âmes. Découvrez ses personnages et son activité sur le forum.`}
      />
      <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} />

      <ProfileTabs activeTab={activeTab} onTabChange={handleTabChange} counts={counts} />

      <div className="container mx-auto px-4 py-8">
        {tabLoading ? (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        ) : (
          <>
            {/* Characters tab */}
            {activeTab === 'characters' && (
              <>
                {characters.length === 0 ? (
                  <p className="text-center font-body text-skin-muted py-12">
                    Aucun contenu à afficher.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {characters.map((char) => (
                      <CharacterCard key={char.id} character={char} />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Topics tab */}
            {activeTab === 'topics' && (
              <>
                {topics.length === 0 ? (
                  <p className="text-center font-body text-skin-muted py-12">
                    Aucun contenu à afficher.
                  </p>
                ) : (
                  <div className="bg-surface border border-neutral-200 rounded-lg overflow-hidden">
                    {topics.map((item) => (
                      <ProfileActivityRow key={item.id} item={item} type="topic" />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Posts tab */}
            {activeTab === 'posts' && (
              <>
                {posts.length === 0 ? (
                  <p className="text-center font-body text-skin-muted py-12">
                    Aucun contenu à afficher.
                  </p>
                ) : (
                  <div className="bg-surface border border-neutral-200 rounded-lg overflow-hidden">
                    {posts.map((item) => (
                      <ProfileActivityRow key={item.id} item={item} type="post" />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <ForumPagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

ProfilePage.displayName = 'ProfilePage'
export default ProfilePage
