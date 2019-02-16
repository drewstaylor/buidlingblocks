import { Injectable } from '@angular/core';
import Web3 from "web3";
import Fortmatic from 'fortmatic';

const FM_API_KEY_RINKEBY = "pk_test_1053F6E4E00EB469";

// tell typescript to be more tolerant of Web3
// note that we also include this in index.html
declare let Web3: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

	private fmApiKey: string = null;
	public fortmatic = null;
	public web3 = null;

	constructor() {
		this.fmApiKey = FM_API_KEY_RINKEBY;
		this.initWeb3();
	}

	public login() {
		this.fortmatic.user.login().then(() => {
			this.web3.eth.getAccounts().then(console.log);
		});
	}

	public logout() {
		this.fortmatic.user.logout();
	}

	/**
	 * Initialize web3 with Fortmatic as provider.
	 */
	private initWeb3() {
		this.fortmatic = new Fortmatic(this.fmApiKey);
		this.web3 = new Web3(this.fortmatic.getProvider());
	}
}
