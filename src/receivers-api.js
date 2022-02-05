import { fetchData } from './receivers-slice';
import { fetchUserAliases } from './userAliasesSlice';

export const receiverAPI = {
  async fetchData() {
    const masterAlias = await fetchMasterAlias()
    const proxymails = await fetchProxymails(masterAlias.aliasId)
    const rows = await fetchReceiverAliases(proxymails)
    return {masterAlias, rows}
  },

  async updateStatus(aliasId, newStatus) {
    await fetch(`${process.env.REACT_APP_API}/alias/status`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        'Authorization': localStorage.getItem('jinnmailToken')
      },
      body: JSON.stringify({ aliasId: aliasId, status: newStatus }),
    });
  },

  async fetchUserAliases(aliasId) {
    const res = await fetch(`${process.env.REACT_APP_API}/alias/alias/${aliasId}`, {
      method: 'GET',
      headers: { 'Authorization': localStorage.getItem('jinnmailToken') }
    });
    const json = await res.json();
    return json.data;
  }
}

async function fetchMasterAlias() {
  const userId = JSON.parse(atob(localStorage.getItem("jinnmailToken").split('.')[1])).userId
  const res = await fetch(`${process.env.REACT_APP_API}/alias/master/${userId}`,
    {headers: {'Authorization': localStorage.getItem('jinnmailToken')}}
  );
  const json = await res.json()
  return json.data
}

async function fetchProxymails(masterAliasId) {
  const res = await fetch(
    `${process.env.REACT_APP_API}/proxymail/${masterAliasId}`,
    {headers: {'Authorization': localStorage.getItem('jinnmailToken')}}
  );
  const json = await res.json();
  return json.data
}

async function fetchReceiverAliases(proxymails) {
  const rows = []
  const rawRows = await Promise.all(
    proxymails?.map(async (proxymail) => {
      const response = await fetch(`${process.env.REACT_APP_API}/alias/alias/${proxymail.senderAliasId}`, {
        method: 'GET',
        headers: { 'Authorization': localStorage.getItem('jinnmailToken') }
      });
      const receiverAlias = await response.json()
      return {proxymail: proxymail, receiver: receiverAlias?.data}
    })
  );
  rawRows.forEach(row => {
    rows.push({
      aliasId: row.receiver.aliasId,
      alias: row.receiver.alias,
      status: row.receiver.status,
      receiver: row.proxymail.proxyMail
    });
  }); 
  return rows
}
