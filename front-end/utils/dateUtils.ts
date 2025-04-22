/**
 * Function to get YYYY-MM-DD date from a date
 * @param date 
 * @returns string
 */

export function getDateString(date?: string | Date) {

    const todayDate = date == undefined ? new Date() : new Date(date)

    let todayDay = todayDate.getDate().toString()
    let todayMonth = todayDate.getMonth().toString()
    const todayYear = todayDate.getFullYear().toString()


    if (todayDay.length == 1) {
        todayDay = todayDay.padStart(2, "0")
    }

    if (todayMonth.length == 1) {
        todayMonth = todayMonth.padStart(2, "0")
    }
     

    const dateString = `${todayYear}-${todayMonth}-${todayDay}`

    return dateString
}

export function getTodayString() {
    return new Date().toJSON().slice(0, 10)
}

export function getYesterdayString() {
    return new Date(new Date().setDate(new Date().getDate()-1)).toJSON().slice(0, 10)
}