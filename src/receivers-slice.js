import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { receiverAPI } from './receivers-api'
import { randomString } from './functions';
import { BuildRounded } from '@mui/icons-material';
import { fetchUserAliases } from './userAliasesSlice';

export const fetchData = createAsyncThunk('receivers/fetchData', async () => {
  return await receiverAPI.fetchData()
})

export const fetchMasterAlias = createAsyncThunk('receivers/fetchMasterAlias', async () => {
  return await receiverAPI.fetchMasterAlias()
})

export const deleteProxymail = createAsyncThunk('receivers/deleteProxymail', async aliasId => {
  const res = await fetch(`${process.env.REACT_APP_API}/proxymail/${aliasId}`, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
      'Authorization': localStorage.getItem('jinnmailToken')
    },
  })
  return await receiverAPI.fetchData()
})

export const onToggleChange = createAsyncThunk('receivers/onToggleChange', async (aliasId, newStatus) => {
  await receiverAPI.updateStatus(aliasId, newStatus)
  return await receiverAPI.fetchUserAlias(aliasId)
})

const receiverSlice = createSlice({
  name: 'receiver',
  initialState: {
    realEmailAddress: ['john@doe.com', 'jane@doe.com'],
    masterAlias: {},
    proxymails: [],
    disableMaster: true,
    rows: [], 
    generalErrorText: '',
    error: '',
    proxymailSenderAliasId: '',
    masterAliasError: false, 
    masterAliasErrorText: ''
  },
  reducers: {
    generateMasterAlias: (state, action) => {
      const randStr = randomString(6)
      state.masterAlias = {alias: randStr}
      state.generalErrorText = ''
      state.masterAliasError = false
      state.masterAliasErrorText = '' 
    },
    setDisabledMaster: (state, action) => {
      state.disabledMaster = action.payload
    },
    setMasterAlias: (state, action) => {
      state.masterAlias = action.payload
    },
    setMasterAliasError: (state, action) => {
      state.masterAliasError = action.payload
    },
    setMasterAliasErrorText: (state, action) => {
      state.masterAliasErrorText = action.payload
    }, 
    setGeneralErrorText: (state, action) => {
      state.generalErrorText = action.payload
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.masterAlias = action.payload.masterAlias
      state.rows = action.payload.rows
      state.disabledMaster = true
    })
    builder.addCase(fetchData.rejected, (state, action) => {
      state.disabledMaster = false
    })
    builder.addCase(fetchMasterAlias.fulfilled, (state, action) => {
      state.masterAlias = action.payload
    })
    builder.addCase(deleteProxymail.fulfilled, (state, action) => {
      state.masterAlias = action.payload.masterAlias
      state.rows = action.payload.rows
    })
    builder.addCase(onToggleChange.fulfilled, (state, action) => {
      const userAlias = action.payload
      const rows = state.rows.map(row => {
        if (row.aliasId === userAlias.aliasId) {
          return {
            ...row,
            status: userAlias.status
          }
        } 
        return row;
      });
      state.rows = rows;
    })
  }
})

export const {
  generateMasterAlias,
  setDisabledMaster,
  setGeneralErrorText,
  setMasterAlias,
  setMasterAliasError, 
  setMasterAliasErrorText
} = receiverSlice.actions;

export const selectMasterAlias = state => state.receiver.masterAlias
export const selectRows = state => state.receiver.rows
export const selectDisabledMaster = state => state.receiver.disabledMaster
export const selectMasterAliasError = state => state.receiver.masterAliasError
export const selectMasterAliasErrorText = state => state.receiver.masterAliasErrorText
export const selectGeneralErrorText = state => state.receiver.generalErrorText

export default receiverSlice.reducer
