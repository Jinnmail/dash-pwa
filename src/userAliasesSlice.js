import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUser } from './app-helper';

export const fetchUserAliases = createAsyncThunk('userAliases/fetchUserAliases', async () => {
  const res = await fetch(`${process.env.REACT_APP_API}/alias`, 
    {headers: {'Authorization': localStorage.getItem('jinnmailToken')}
  });
  const json = await res.json();
  const userAliases = json.data;

  userAliases.forEach(userAlias => {
    userAlias.nameTextReadOnly = true
    userAlias.editDisabled = false
    userAlias.nameButtonText = 'edit'
  }); 

  return userAliases;
});

export const fetchUser = createAsyncThunk('userAliases/fetchUser', async (userId) => {
  const res = await getUser(userId);
  const user = await res.json();

  return user
})

export const updateName = createAsyncThunk('userAliases/updateName', async ({aliasId, name}) => {
  const res = await fetch(`${process.env.REACT_APP_API}/alias/${aliasId}`, 
    {
      method: 'PUT', 
      headers: {
        'Content-type': 'application/json', 
        'Authorization': localStorage.getItem('jinnmailToken')
      }, 
      body: JSON.stringify({aliasId: aliasId, name: name})
    }
  )
  const json = await res.json()
  const userAlias = json.data;

  const res2 = await fetch(`${process.env.REACT_APP_API}/alias/alias/${aliasId}`, {
    method: 'GET', 
    headers: {'Authorization': localStorage.getItem('jinnmailToken')}
  });
  const json2 = await res2.json();
  const userAlias2 = json2.data;

  return userAlias2;
})

export const deleteAlias = createAsyncThunk('userAliases/deleteAlias', async aliasId => {
  const res = await fetch(`${process.env.REACT_APP_API}/alias/${aliasId}`, {
      method: 'DELETE', 
      headers: {
        'Content-type': 'application/json', 
        'Authorization': localStorage.getItem('jinnmailToken')},
    })
  const json = await res.json();

  return aliasId;
})

export const setToggle = createAsyncThunk('userAliases/setToggle', async ({aliasId, newStatus}) => {
  const res = await fetch(`${process.env.REACT_APP_API}/alias/status`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json', 
        'Authorization': localStorage.getItem('jinnmailToken')
      }, 
      body: JSON.stringify({aliasId: aliasId, status: newStatus}), 
  });
  const json = await res.json();
  
  const res2 = await fetch(`${process.env.REACT_APP_API}/alias/alias/${aliasId}`, {
    method: 'GET', 
    headers: {'Authorization': localStorage.getItem('jinnmailToken')}
  });
  const json2 = await res2.json();
  const userAlias2 = json2.data;

  return userAlias2;
})

export const aliasCreated = createAsyncThunk('userAliases/aliasCreated', async aliasId => {
  const res = await fetch(`${process.env.REACT_APP_API}/alias/alias/${aliasId}`, {
    method: 'GET', 
    headers: {'Authorization': localStorage.getItem('jinnmailToken')}
  });
  const json = await res.json();
  const userAlias = json.data

  return userAlias;
});

export const fetchUserInvitesArr = createAsyncThunk('userAliases/fetchUserInvites', async userId => {
  const res = await fetch(`${process.env.REACT_APP_API}/invite/user/${userId}`, 
    {headers: {'Authorization': localStorage.getItem('jinnmailToken')}
  });
  const userInvitesArr = await res.json();

  return userInvitesArr
})

const userAliasesSlice = createSlice({
  name: 'userAliases', 
  initialState: {
    status: 'idle', 
    error: null, 
    user: null, 
    userAliases: [], 
    userInvitesArr: []
  }, 
  reducers: {
    setNameTextReadOnly: (state, action) => {
      const {aliasId, readOnly} = action.payload;
      const existingUserAlias = state.userAliases.find(userAlias => userAlias.aliasId === aliasId)
      if (existingUserAlias) {
        existingUserAlias.nameTextReadOnly = readOnly;
      } 
    }, 
    setNameButtonText: (state, action) => {
      const {aliasId, buttonText} = action.payload
      const existingUserAlias = state.userAliases.find(userAlias => userAlias.aliasId === aliasId)
      if (existingUserAlias) {
        existingUserAlias.nameButtonText = buttonText;
      }
    }, 
    nameChanged2: (state, action) => {
      const {aliasId, refferedUrl} = action.payload
      const existingUserAlias = state.userAliases.find(userAlias => userAlias.aliasId === aliasId)
      if (existingUserAlias) {
        existingUserAlias.refferedUrl = refferedUrl;
      }
    }, 
    setUserAliasesStatus: (state, action) => {
      state.status = action.payload
    }
  }, 
  extraReducers: {
    [fetchUserAliases.pending]: (state, action) => {
      state.status = 'loading';
    }, 
    [fetchUserAliases.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.userAliases = state.userAliases.concat(action.payload);
      // state.userInvites = 5;
    }, 
    [fetchUserAliases.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    }, 
    [updateName.fulfilled]: (state, action) => {
      let existingUserAlias = state.userAliases.find(userAlias => userAlias.aliasId === action.payload.aliasId)
      if (existingUserAlias) {
        existingUserAlias.refferedUrl = action.payload.refferedUrl;
      }
    }, 
    [deleteAlias.fulfilled]: (state, action) => {
       state.userAliases = state.userAliases.filter(userAlias => userAlias.aliasId !== action.payload);
    }, 
    [setToggle.fulfilled]: (state, action) => {
      let existingUserAlias = state.userAliases.find(userAlias => userAlias.aliasId === action.payload.aliasId)
      if (existingUserAlias) {
        existingUserAlias.status = action.payload.status;
      }
    }, 
    [aliasCreated.fulfilled]: (state, action) => {
      let userAlias = action.payload;
      userAlias.nameTextReadOnly = true
      userAlias.editDisabled = false
      userAlias.nameButtonText = 'edit'
      state.userAliases.push(userAlias);
    }, 
    [fetchUser.fulfilled]: (state, action) => {
      state.user = action.payload;
    }, 
    [fetchUserInvitesArr.fulfilled]: (state, action) => {
      state.userInvitesArr = action.payload;
    }, 
  }
});

export const {
  setNameTextReadOnly, 
  setNameButtonText,
  nameChanged2,  
  updateUserAlias, 
  setUserAliasesStatus, 
} = userAliasesSlice.actions;

export const selectUserAliases = state => state.userAliases.userAliases;

export default userAliasesSlice.reducer;
