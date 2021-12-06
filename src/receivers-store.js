import { observable, IObservableArray, action, runInAction } from 'mobx';
import { randomString } from './functions';

export class ReceiversStore {
  @observable realEmailAddresses = ['john@doe.com', 'jane@doe.com'];
  @observable masterAlias;
  @observable proxymails;
  @observable disabledMaster;
  @observable generalErrorText = '';
  @observable error;

  userId = '';

  async fetchMasterAlias() {
    try {
      this.userId = JSON.parse(atob(localStorage.getItem("jinnmailToken").split('.')[1])).userId
      const res = await fetch(`${process.env.REACT_APP_API}/alias/master/${this.userId}`,
        {headers: {'Authorization': localStorage.getItem('jinnmailToken')}}
      );
      const json = await res.json();
      if (json.data) {
        runInAction(() => {
          this.masterAlias = json.data.alias;
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
    this.realEmailAddresses = [];
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API}/proxymail/${this.masterAliasId}`,
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

  generateAlias = () => {
    const randStr = randomString(6);
    this.masterAlias = randStr;
    this.generalErrorText = '';
    this.masterAliasError = false;
    this.masterAliasErrorText = '';
  }
}