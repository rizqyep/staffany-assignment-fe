import { Box, IconButton, makeStyles, Typography } from "@material-ui/core";
import { ArrowBackIosOutlined, ArrowForwardIosOutlined } from "@material-ui/icons";
import React from "react";

export interface WeekPickerProps{
    parsedWeekStart:string;
    parsedWeekEnd:string;
    changeWeekBoundaries: (operations:string) => void;
}



const useStyles = makeStyles((theme) => ({
   icon:{
        marginRight:20,
        marginLeft:20
    },
    weekDate:{
        fontWeight:"bold",
        fontSize:18
    }
}));

export const WeekPicker: React.FC<WeekPickerProps> = ({parsedWeekStart, parsedWeekEnd, changeWeekBoundaries}:WeekPickerProps)=> {
    const classes = useStyles()
    
    return (
        <Box sx={{display:'flex',justifyContent:'start',alignItems:"center"}}>

            <IconButton onClick={()=>{changeWeekBoundaries("MIN")}} className={classes.icon}>
                <ArrowBackIosOutlined/>
            </IconButton>
            <Typography className={classes.weekDate}>{parsedWeekStart} - {parsedWeekEnd}</Typography>
            <IconButton onClick={()=>{changeWeekBoundaries("ADD")}} className={classes.icon}>
                <ArrowForwardIosOutlined/>
            </IconButton>
        </Box>
    )
}