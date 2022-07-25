import React, { FunctionComponent, useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import { getErrorMessage } from "../helper/error/index";
import { deleteShiftById, getWeeklyShifts} from "../helper/api/shift";
import { executePublishWeek, getWeekData } from "../helper/api/week";
import DataTable from "react-data-table-component";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { useHistory } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog";
import Alert from "@material-ui/lab/Alert";
import { Link as RouterLink } from "react-router-dom";
import { getWeekBoundariesDate, parseWeekPickerDate } from "../helper/week";
import { Box, Button, Typography } from "@material-ui/core";
import { WeekPicker } from "../components/WeekPicker";
import { CheckCircleOutline } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
  },
  fab: {
    position: "absolute",
    bottom: 40,
    right: 40,
    backgroundColor: 'white',
    color: theme.color.turquoise
  },
  addShiftBtn:{
    outline: theme.color.turqouise,
    color: theme.color.turqouise,
    borderColor: theme.color.turqouise,
    marginRight:20
  },
  publishBtn:{
    color: "white",
    backgroundColor: theme.color.turqouise
  },
  wrapIcon: {
    verticalAlign: 'middle',
    display: 'inline-flex',
    marginRight:30,
    color:theme.color.turqouise,
    fontSize:14
   }
}));

interface ActionButtonProps {
  id: string;
  onDelete: () => void;
  weekPublished:boolean
}

const ActionButton: FunctionComponent<ActionButtonProps> = ({
  id,
  onDelete,
  weekPublished
}) => {
  return (
    <div>
      <IconButton
        size="small"
        aria-label="delete"
        component={RouterLink}
        to={`/shift/${id}/edit`}
        disabled={weekPublished?true:false}
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" aria-label="delete" onClick={() => onDelete()}  disabled={weekPublished?true:false}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </div>
  );
};

const Shift = () => {
  const classes = useStyles();
  const history = useHistory();

  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [weekData, setWeekData] = useState<any>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const [showPublishConfirm, setShowPublishConfirm] = useState<boolean>(false);
  const [publishLoading, setPublishLoading] = useState<boolean>(false);


  const [weekPublished, setWeekPublished] = useState<boolean>(false);


  //Get week boundaries (starting with current week)
  const {start,end} = getWeekBoundariesDate()
  const [weekStartDate, setWeekStartDate] = useState(start)
  const [weekEndDate, setWeekEndDate] = useState(end)
  const [parsedWeekStart, setParsedWeekStart] = useState(parseWeekPickerDate(weekStartDate))
  const [parsedWeekEnd, setParsedWeekEnd] = useState(parseWeekPickerDate(weekEndDate))


  const changeWeekBoundaries = (operation:String)=>{

    let changedStartDate = weekStartDate;
    let changedEndDate = weekEndDate;
    let incrementBy= operation === "ADD" ? 7 : -7;
    changedStartDate.setDate(changedStartDate.getDate() + incrementBy);
    changedEndDate.setDate(changedEndDate.getDate() + incrementBy);

    setWeekStartDate(changedStartDate)
    setWeekEndDate(changedEndDate)

    setParsedWeekStart(parseWeekPickerDate(changedStartDate))
    setParsedWeekEnd(parseWeekPickerDate(changedEndDate))
    getData();
  }

  const onDeleteClick = (id: string) => {
    if(weekPublished){
      setErrMsg("Week is already published!");
      return;
    }
    setSelectedId(id);
    setShowDeleteConfirm(true);
  };

  const onPublishClick = ()=>{
    setShowPublishConfirm(true)
  }

  const onCloseDeleteDialog = () => {
    setSelectedId(null);
    setShowDeleteConfirm(false);
  };

  const onClosePublishDialog = ()=>{
    setShowPublishConfirm(false);
  }
  
   const getData = async () => {
      try {
        setIsLoading(true);
        setErrMsg("");
        const { results } = await getWeeklyShifts(weekStartDate.toISOString().split("T")[0], weekEndDate.toISOString().split("T")[0]);
        setRows(results);
        const {results:week} = await getWeekData(weekStartDate.toISOString().split("T")[0], weekEndDate.toISOString().split("T")[0]);
        
        if(!week){
          setWeekPublished(false)
        }else{
          setWeekData(week)
          setWeekPublished(true)
        }
      } catch (error) {
        const message = getErrorMessage(error);
        setErrMsg(message);
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
 
    getData();
  }, [weekStartDate, weekEndDate]);

  const columns = [
    {
      name: "Name",
      selector: "name",
      sortable: true,
    },
    {
      name: "Date",
      selector: "date",
      sortable: true,
    },
    {
      name: "Start Time",
      selector: "startTime",
      sortable: true,
    },
    {
      name: "End Time",
      selector: "endTime",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: any) => (
        <ActionButton id={row.id} onDelete={() => onDeleteClick(row.id)} weekPublished={weekPublished}/>
      ),
    },
  ];

  const deleteDataById = async () => {
    try {
      setDeleteLoading(true);
      setErrMsg("");

      if (selectedId === null) {
        throw new Error("ID is null");
      }

      console.log(deleteDataById);

      await deleteShiftById(selectedId);

      const tempRows = [...rows];
      const idx = tempRows.findIndex((v: any) => v.id === selectedId);
      tempRows.splice(idx, 1);
      setRows(tempRows);
    } catch (error) {
      const message = getErrorMessage(error);
      setErrMsg(message);
    } finally {
      setDeleteLoading(false);
      onCloseDeleteDialog();
    }
  };

  const publishWeek = async () =>{
    try{
      setErrMsg("");

      const payload = {
        startDate: weekStartDate.toISOString().split("T")[0],
        endDate:  weekEndDate.toISOString().split("T")[0]
      };

      await executePublishWeek(payload)

      getData()
    } catch (error) {
      const message = getErrorMessage(error);
      setErrMsg(message);
    } finally {
      setPublishLoading(false);
      onClosePublishDialog();
    }
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card className={classes.root}>
         
          <CardContent>
            {errMsg.length > 0 ? (
              <Alert severity="error">{errMsg}</Alert>
            ) : (
              <></>
            )}


            <Box sx={{display:'flex', justifyContent:'space-between'}}>
              <WeekPicker parsedWeekStart={parsedWeekStart} 
                          parsedWeekEnd={parsedWeekEnd} 
                          changeWeekBoundaries={changeWeekBoundaries}/>

              <Box sx={{display:'flex', justifyContent:'flex-start',alignItems:"center"}}>
                    {weekPublished 
                                  ? 
                                <Typography variant="subtitle1" className={classes.wrapIcon}>
                                  <CheckCircleOutline /> Week published on ${weekData.createdAt}
                                </Typography>
                                  : 
                                  null
                    }
                    <Button variant="outlined" 
                      component={RouterLink}
                      className={classes.addShiftBtn}
                      to={`/shift/add`}
                      disabled={weekPublished}
                    >
                        ADD SHIFT
                    </Button>
                    <Button
                      variant="contained" 
                      className={classes.publishBtn}
                      disabled={weekPublished}
                    >
                        PUBLISH
                    </Button>
              </Box>
            </Box>

            <DataTable
         
              columns={columns}
              data={rows}
              pagination
              progressPending={isLoading}
            />
          </CardContent>
        </Card>
      </Grid>
      <Fab
        size="medium"
        aria-label="add"
        className={classes.fab}
        onClick={() => history.push("/shift/add")}
      >
        <AddIcon />
      </Fab>
      <ConfirmDialog
        title="Delete Confirmation"
        description={`Do you want to delete this data ?`}
        onClose={onCloseDeleteDialog}
        open={showDeleteConfirm}
        onYes={deleteDataById}
        loading={deleteLoading}
      />

      <ConfirmDialog
        title="Publish Confirmation"
        description={`Do you want to publish this week's shift ?`}
        onClose={onClosePublishDialog}
        open={showPublishConfirm}
        onYes={publishWeek}
        loading={publishLoading}
      />
    </Grid>
  );
};

export default Shift;
