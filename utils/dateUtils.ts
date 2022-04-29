const LOCALE = process.env.NEXT_PUBLIC_LOCALE ?? 'en-GB'

function logDateToDate(logDate: string): Date {
    const date = new Date(logDateToISODate(logDate).replace(/_/,' '))
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),date.getHours(), date.getMinutes(), date.getSeconds()))
}

function logDateToISODate(logDate: string): string {
    return '20'+logDate.split(' ').map((e,i) => i === 0 ? e.split('/').reverse().join('-') : e).join('_')
}

function isoDateToLocalDate(isoDate: string): string {
    const date = new Date(isoDate)
    return new Intl.DateTimeFormat(LOCALE, { dateStyle: 'long', timeStyle: 'short' }).format(date)
}

export { logDateToDate, logDateToISODate, isoDateToLocalDate }
