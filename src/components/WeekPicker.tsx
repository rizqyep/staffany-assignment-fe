import React from "react";

export interface WeekPickerProps{
    changeWeekBoundaries: (operations:string) => void
}

export const WeekPicker = ({changeWeekBoundaries}:WeekPickerProps)=> {
    
    
    return (
        <div>
            <span className="backward" onClick={()=>{changeWeekBoundaries("MIN")}}></span>
            
            <span className="backward" onClick={()=>{changeWeekBoundaries("ADD")}}></span>
        </div>
    )
}