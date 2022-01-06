import dayjs from 'dayjs';

export function generateArrayOfDates(duration) {
  let dateArr = []
  let today = dayjs()

  for (let i=0; i <= duration; i++)
    dateArr.push(today.add(i, 'days').format('YYYY-MM-DD'))

  return dateArr
}
