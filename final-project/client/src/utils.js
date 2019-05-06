export const dateObjDisplayFormatter = dateObj => {
  return dateObj.getUTCFullYear() +
    '-' + (dateObj.getUTCMonth() + 1) +
    '-' + dateObj.getUTCDate() +
    ' ' + dateObj.getUTCHours() +
    ':' + dateObj.getUTCMinutes() +
    ':' + dateObj.getUTCSeconds() +
    ' UTC';
}
