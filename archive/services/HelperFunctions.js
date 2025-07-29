import dayjs from 'dayjs'

export function generateArrayOfDates(duration, startDate = null) {
  let dateArr = []

  // SWF start date is always today || null
  // Fantasy start date can be anything
  startDate = startDate ? dayjs(startDate) : dayjs()

  for (let i = 0; i <= duration; i++)
    dateArr.push(startDate.add(i, 'd').format('YYYY-MM-DD'))

  return dateArr
}

export function firstToLast(a, b) {
  return dayjs(a).isAfter(dayjs(b)) ? 1 : -1
}
