import dayjs from 'dayjs';

export function generateArrayOfDates(duration) {
  console.log('duration', duration)
  let dateArr = []
  let today = dayjs()

  for (let i=0; i <= duration; i++)
    dateArr.push(today.add(i, 'd').format('YYYY-MM-DD'))

  console.log('dateArr', dateArr)
  return dateArr
}

export function generateDatesBetween() {
  //dates between
}
