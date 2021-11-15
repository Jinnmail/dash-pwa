import { forwardRef, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Grid, InputAdornment, TextField } from '@material-ui/core';
import MaterialTable from "material-table";
import {
  AddBox,
  ArrowDownward,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  DeleteOutline,
  Edit,
  FilterList,
  FirstPage,
  LastPage,
  Remove,
  SaveAlt,
  Search,
  ViewColumn,
  DeleteForever as DeleteForeverIcon,
  ExitToApp as ExitToAppIcon,
  FileCopy as FileCopyIcon,
  Favorite as FavoriteIcon,
  MailOutline as MailOutlineIcon,
  Refresh as RefreshIcon,
} from '@material-ui/icons';

import NavBar from './NavBar';
import { loggedIn } from './LoginUtil';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

function Receivers() {
  const [disabledMaster, setDisabledMaster] = useState(true);
const userId = 1;
  useEffect(() => {
    async function fetchMasterAlias() {
      const res = await fetch(`${process.env.REACT_APP_API}/alias/master/${userId}`,
        {
          headers: { 'Authorization': localStorage.getItem('jinnmailToken') }
        });
      const json = await res.json();
      if (!json.data) {
        setDisabledMaster(true); // todo: james s, set to false when ready to accept master aliases
      }
    }
    fetchMasterAlias();
  }, [])

  const data = [];
  data.push({receiver: 'john@doe.com', alias: 'johndoe@receiver.jinnmail.com'});
  data.push({receiver: 'jane@doe.com', alias: 'janedoe@receiver.jinnmail.com'});
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {loggedIn() && <NavBar />}
      </Grid>
      <Grid item xs={12}>
        <h3 style={{ color: 'gray' }}>Receiver aliases is a new feature slowly being rolled out.</h3>
        <h3 style={{ color: 'gray' }}>Jinnmail users will be able to email someone with their master alias directly.</h3>
      </Grid>
      <Grid item xs={12}>
        <b style={{ color: 'gray' }}>All messages will appear to be from your master alias.</b>
      </Grid>
      <Grid item xs={4}>
        <TextField
          label="Master alias"
          variant="outlined"
          fullWidth
          disabled={disabledMaster}
          // onChange={onEmailChanged}
          error={false}
          helperText="example: johndoe@jinnmail.com"
          value="xxxxxx@jinnmail.com"
          InputProps={{
            startAdornment: <InputAdornment position="start"></InputAdornment>,
          }}
        />
      </Grid>
      <Grid item xs={4}>&nbsp;</Grid>
      <Grid item xs={4}>&nbsp;</Grid>
      <Grid item xs={4}>
        <Button 
          variant="contained" 
          color="primary"
          fullWidth
          disabled={disabledMaster}
        >
          Create
        </Button>
      </Grid>
      <Grid item xs={12}>
        <MaterialTable
          title=''
          icons={tableIcons}
          columns={[
            {
              title: "Receiver Real",
              field: "receiver",
            },
            {
              title: "Receiver Alias",
              field: 'alias',
            }
          ]}
          data={data}
        />
      </Grid>
    </Grid>
  )
}

export default withRouter(Receivers);