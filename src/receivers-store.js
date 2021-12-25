import { observable, action, runInAction } from 'mobx';

import { randomString } from './functions';
import ConfirmAliasDeletion from './ConfirmAliasDeletion';

export class ReceiversStore {
  static TOKEN = Symbol('RecieverStore');

  @observable realEmailAddresses = ['john@doe.com', 'jane@doe.com'];
  @observable masterAlias = observable.object({});
  @observable proxymails = [];
  @observable disabledMaster;
  @observable rows = observable.array([]);
  @observable generalErrorText = '';
  @observable error;

  userId = '';

  @action.bound
  setMasterAlias(masterAlias) {
    this.masterAlias = masterAlias;
  }

  @action.bound
  setRows(rows) {
    this.rows = rows;
  }

  async fetchData() {
    await this.fetchMasterAlias();
    await this.fetchProxymails();
    await this.fetchReceiverAliases();
  };

  async fetchMasterAlias() {
    try {
      this.userId = JSON.parse(atob(localStorage.getItem("jinnmailToken").split('.')[1])).userId
      const res = await fetch(`${process.env.REACT_APP_API}/alias/master/${this.userId}`,
        {headers: {'Authorization': localStorage.getItem('jinnmailToken')}}
      );
      const json = await res.json();
      if (json.data) {
        runInAction(() => {
          this.setMasterAlias(json.data);
          this.disabledMaster = true;
        });
      } else {
        runInAction(() => {
          this.disabledMaster = false;
        });
      }
    } catch(e) {
      runInAction(() => {
        this.disabledMaster = true;
      });
    }
  }

  async fetchProxymails() {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API}/proxymail/${this.masterAlias.aliasId}`,
        {headers: {'Authorization': localStorage.getItem('jinnmailToken')}}
      );
      const json = await res.json();
      runInAction(() => {
        this.proxymails = json.data;
      });
    } catch (e) {
      runInAction(() => {
        this.error = "error"
      });
    }
  }

  async onToggleChange(aliasId, newStatus) {
    const res = await fetch(`${process.env.REACT_APP_API}/alias/status`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        'Authorization': localStorage.getItem('jinnmailToken')
      },
      body: JSON.stringify({ aliasId: aliasId, status: newStatus }),
    });
    const json = await res.json();

    const res2 = await fetch(`${process.env.REACT_APP_API}/alias/alias/${aliasId}`, {
      method: 'GET',
      headers: { 'Authorization': localStorage.getItem('jinnmailToken') }
    });
    const json2 = await res2.json();
    const userAlias2 = json2.data;

    const rows = this.rows.map(row => {
      if (row.aliasId === aliasId) {
        return {
          ...row,
          status: userAlias2.status
        }
      } 
      return row;
    });

    runInAction(() => {
      this.setRows(rows);
    });
  }

  async fetchReceiverAliases() {
    this.realEmailAddresses = [];
    const rawRows = await Promise.all(
      this.proxymails?.map(async (proxymail) => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API}/alias/alias/${proxymail.senderAliasId}`, {
            method: 'GET',
            headers: { 'Authorization': localStorage.getItem('jinnmailToken') }
          });
          const receiverAlias = await response.json()
          return {proxymail: proxymail, receiver: receiverAlias?.data}
        } catch(e) {

        }
      })
    );
    const rows = []
    rawRows.forEach(row => {
      rows.push({
        aliasId: row.receiver.aliasId,
        alias: row.receiver.alias,
        status: row.receiver.status,
        receiver: row.proxymail.proxyMail
      });
    });

    runInAction(() => {
      this.setRows(rows);
    });
  }

  generateAlias = () => {
    const randStr = randomString(6);
    this.setMasterAlias({alias: randStr});
    this.generalErrorText = '';
    this.masterAliasError = false;
    this.masterAliasErrorText = '';
  }
}