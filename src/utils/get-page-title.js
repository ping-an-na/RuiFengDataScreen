import defaultSettings from '@/settings'

const title = defaultSettings.title || 'ioc vue template'

export default function getPageTitle(pageTitle) {
  if (pageTitle && defaultSettings.showRouteTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
