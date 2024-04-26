const addDays = (date: Date, days: number): Date =>{
    let newDate = new Date(date)
    newDate.setDate(date.getDate() + 1)
    return newDate
}

const subtractDays = (date: Date, days: number): Date =>{
    let newDate = new Date(date)
    newDate.setDate(date.getDate() - 1)
    return newDate
}

export {addDays, subtractDays}