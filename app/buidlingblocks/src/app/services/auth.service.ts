import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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

	constructor(private router: Router) {
		this.fmApiKey = FM_API_KEY_RINKEBY;
		this.initWeb3();
	}

	public login(): boolean {
		try {
			let attempt = this.fortmatic.user.login().then(() => {
				this.web3.eth.getAccounts().then(console.log);
				this.router.navigate(['/choose-your-own-adventure']);
			});
		} catch (err) {
			return false;
		}
	}

	public logout(): boolean {
		try {
			this.fortmatic.user.logout();
			return true;
		} catch (err) {
			console.log('Error logging our user with fortmatic', err);
			return false;
		}
	}

	/**
	 * Initialize web3 with Fortmatic as provider.
	 */
	private initWeb3() {
		this.fortmatic = new Fortmatic(this.fmApiKey);
		this.web3 = new Web3(this.fortmatic.getProvider());
	}
}
