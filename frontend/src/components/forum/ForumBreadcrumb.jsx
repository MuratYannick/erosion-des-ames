import Breadcrumb from '@/components/content/Breadcrumb'

const ForumBreadcrumb = ({ category, topic, className = '' }) => {
  const items = [{ label: 'Forum', href: '/forum' }]

  if (category) {
    items.push({
      label: category.name,
      href: `/forum/${category.slug}`,
    })
  }

  if (topic) {
    items.push({
      label: topic.title,
    })
  }

  return <Breadcrumb items={items} showHome className={className} />
}

ForumBreadcrumb.displayName = 'ForumBreadcrumb'
export default ForumBreadcrumb
