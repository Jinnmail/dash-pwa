

import {IconButton, InputAdornment, TextField} from '@mui/material'
import {Refresh as RefreshIcon} from '@mui/icons-material'

export const Receivers = () => {
  return (
      <TextField
        label="Hit ⟳ to generate"
        variant="outlined"
        fullWidth
        // disabled={receiverStore.disabledMaster}
        // onChange={e => onMasterAliasChanged(e.target.value)}
        // error={masterAliasError}
        // helperText={masterAliasErrorText}
        // value={receiverStore?.masterAlias?.alias ? receiverStore?.masterAlias.alias : ''}
        inputProps={{ maxLength: 30 }}
        InputProps={{
          startAdornment: <InputAdornment position="start" />,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton 
                // onClick={receiverStore.generateAlias} disabled={receiverStore.disabledMaster}
              >
                <RefreshIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
  );
}