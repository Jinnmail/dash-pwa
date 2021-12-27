import React, {useState} from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import {FileCopy as FileCopyIcon} from '@material-ui/icons'

function CopiedTooltip(alias) {
  const [openCopyAliasTooltip, setOpenCopyAliasTooltip] = useState('Copy alias');

  const copyAliasClicked = () => {
    var aux = document.createElement("input");
    aux.setAttribute("value", alias.alias);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    setOpenCopyAliasTooltip('Copied!');
  };

  const closeAliasTooltip = () => {
    setOpenCopyAliasTooltip('Copy alias');
  };

  return (
    <Tooltip title={openCopyAliasTooltip} onClose={closeAliasTooltip} enterDelay={100} leaveDelay={1000}>
      <IconButton onClick={copyAliasClicked}><FileCopyIcon color="primary" /></IconButton>
    </Tooltip>
  )
}

export default CopiedTooltip;
