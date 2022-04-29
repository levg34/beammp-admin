const LOCALE = process.env.NEXT_PUBLIC_LOCALE ?? 'en-GB'

function logDateToDate(logDate: string): Date {
    return new Date(logDateToISODate(logDate).replace(/_/,' '))
}

function logDateToISODate(logDate: string): string {
    return '20'+logDate.split(' ').map((e,i) => i === 0 ? e.split('/').reverse().join('-') : e).join('_')
}

function isoDateToLocalDate(isoDate: string): string {
    const date = new Date(isoDate)
    return new Intl.DateTimeFormat(LOCALE, { dateStyle: 'long', timeStyle: 'short' }).format(date)
}

export { logDateToDate, logDateToISODate, isoDateToLocalDate }
