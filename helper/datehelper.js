import { parse, lightFormat, isValid } from 'date-fns'

export function validateDateInCorrectFormat(myDate) {
  var parsedDate = parse(myDate, 'dd/MM/yyyy', new Date())
  if (isValid(parsedDate)) {
    return { status: true, date: parsedDate }
  } else {
    //throw new Error('Invalid date format, should be in DD/MM/YYYY format')
    return { status: false, message: 'Invalid date format, should be in DD/MM/YYYY format' }
  }
}

export function formatMatchDate(myDate) {
  if (isValid(new Date(myDate))) {
    return { status: true, date: new Date(myDate) }
  } else {
    return { status: false, date: 'No Date' }
  }
}

export function convertDateObjToDDMMYYYY(Date) {
  return lightFormat(Date, 'dd/MM/yyyy')
}
