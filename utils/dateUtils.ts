function logDateToDate(logDate: string): Date {
    return new Date(logDateToISODate(logDate).replace(/_/,' '))
}

function logDateToISODate(logDate: string): string {
    return '20'+logDate.split(' ').map((e,i) => i === 0 ? e.split('/').reverse().join('-') : e).join('_')
}

export { logDateToDate, logDateToISODate }
