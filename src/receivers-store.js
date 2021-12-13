import { ForwardSharp } from '@material-ui/icons';
import { observable, action, runInAction } from 'mobx';
import { randomString } from './functions';

export class ReceiversStore {
  @observable realEmailAddresses = ['john@doe.com', 'jane@doe.com'];
  @observable masterAlias;
  @observable proxymails = [];
  @observable disabledMaster;
  @observable rows = observable.array([]);
  @observable generalErrorText = '';
  @observable error;

  userId = '';

  @action.bound
  setRows(rows) {
    this.rows = rows;
  }

  async fetchMasterAlias() {
    try {
      this.userId = JSON.parse(atob(localStorage.getItem("jinnmailToken").split('.')[1])).userId
      const res = await fetch(`${process.env.REACT_APP_API}/alias/master/${this.userId}`,
        {headers: {'Authorization': localStorage.getItem('jinnmailToken')}}
      );
      const json = await res.json();
      if (json.data) {
        runInAction(() => {
          this.masterAlias = json.data;
          this.disabledMaster = true;
        });
      } else {
        runInAction(() => {
          this.disabledMaster = true; // todo: james s set to false when ready so not disabled
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
      rows.push({alias: row.receiver.alias, receiver: row.proxymail.proxyMail});
    });
    this.setRows(rows);
  }

  generateAlias = () => {
    const randStr = randomString(6);
    this.masterAlias = randStr;
    this.generalErrorText = '';
    this.masterAliasError = false;
    this.masterAliasErrorText = '';
  }
}