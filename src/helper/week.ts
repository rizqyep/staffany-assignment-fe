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

export const prettyDate = (date:string) => {
    const monthName = getMonthName(new Date(date));
    const dateOnly = date.split("T")[0].split("-")
    const day = dateOnly[2];
    const year = dateOnly[0];
    const timeOnly = date.split("T")[1].split(".")[0].split(":")
    const hour = timeOnly[0];
    const minute = timeOnly[1];

    const prefix = parseInt(hour) > 12 ? "PM" : "AM";

    return `${monthName} ${day} ${year} at ${hour}:${minute} ${prefix}`
}