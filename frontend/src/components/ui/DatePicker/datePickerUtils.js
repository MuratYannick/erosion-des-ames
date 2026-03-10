/**
 * French month names
 */
export const MONTHS_FR = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre'
]

/**
 * French weekday abbreviations (starting Monday)
 */
export const WEEKDAYS_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

/**
 * Format date according to format string
 */
export const formatDate = (date, format = 'dd/MM/yyyy') => {
  if (!date || !(date instanceof Date) || isNaN(date)) return ''

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return format
    .replace('dd', day)
    .replace('MM', month)
    .replace('yyyy', year)
}

/**
 * Parse date string according to format
 */
export const parseDate = (str, format = 'dd/MM/yyyy') => {
  if (!str) return null

  const parts = str.match(/\d+/g)
  if (!parts || parts.length < 3) return null

  let day, month, year

  if (format === 'dd/MM/yyyy') {
    [day, month, year] = parts
  } else if (format === 'MM/dd/yyyy') {
    [month, day, year] = parts
  } else if (format === 'yyyy-MM-dd') {
    [year, month, day] = parts
  } else {
    // Default to dd/MM/yyyy
    [day, month, year] = parts
  }

  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  return isNaN(date) ? null : date
}

/**
 * Check if two dates are the same day
 */
export const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  )
}

/**
 * Check if date is today
 */
export const isToday = (date) => {
  return isSameDay(date, new Date())
}

/**
 * Get calendar days for a given month
 * Returns array of day objects with date, dayNumber, and isOtherMonth flag
 */
export const getCalendarDays = (year, month) => {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  // Get day of week (0 = Sunday, 1 = Monday, etc.)
  // Convert to Monday-based (0 = Monday, 6 = Sunday)
  let firstDayOfWeek = firstDay.getDay() - 1
  if (firstDayOfWeek === -1) firstDayOfWeek = 6

  const daysInMonth = lastDay.getDate()
  const days = []

  // Previous month padding
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, prevMonthLastDay - i),
      dayNumber: prevMonthLastDay - i,
      isOtherMonth: true
    })
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      date: new Date(year, month, day),
      dayNumber: day,
      isOtherMonth: false
    })
  }

  // Next month padding (complete the last week)
  const remainingDays = 7 - (days.length % 7)
  if (remainingDays < 7) {
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        dayNumber: day,
        isOtherMonth: true
      })
    }
  }

  return days
}
