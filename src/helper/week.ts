const jsDaysObject:any = {
    '0' : 'Sun',
    '1' : 'Mon',
    '2' : 'Tue',
    '3' : 'Wed',
    '4' : 'Thu',
    '5' : 'Fri',
    '6' : 'Sat'
}

const staffAnyDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const getWeekStartAndEndDifferences = (date:any)=>{
    const currentDayIndex = staffAnyDays.indexOf(jsDaysObject[date.getDay().toString()]);
    return {
        startDifference: currentDayIndex - staffAnyDays.indexOf('Mon'),
        endDifference : staffAnyDays.indexOf('Sun') - currentDayIndex
    }
}

export const getWeekBoundariesDate =()=>{
    const today = new Date();
     const {startDifference, endDifference}:any = getWeekStartAndEndDifferences(today);
    const [startWeek, endWeek] = [
      new Date(today),
      new Date(today)
    ];

    startWeek.setDate(startWeek.getDate() - startDifference);
    endWeek.setDate(endWeek.getDate() + endDifference);
    
    return {start:startWeek, end:endWeek}
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];


const getMonthName = (date:Date)=>{
    return monthNames[date.getMonth()]
}

export const parseWeekPickerDate = (date:Date) => {
    return `${getMonthName(date)} ${date.toISOString().split("T")[0].split("-")[2]}`
}