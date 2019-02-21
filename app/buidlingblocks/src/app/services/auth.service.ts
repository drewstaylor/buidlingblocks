import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Web3 from "web3";
import Fortmatic from 'fortmatic';

const FM_API_KEY_RINKEBY = "pk_test_1053F6E4E00EB469";

// tell typescript to be more tolerant of Web3
// note that we also include this in index.html
declare let Web3: any;
declare let window: any;

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

	/**
	 * Logs a user in if neccesary, otherwise just logs their wallet address
	 * @param redirect {Boolean}: If set to true, user will be redirected to /choose-your-own-adventure
	 */
	public login(redirect): void {
		if (!redirect || typeof redirect === "undefined") {
			redirect = false;
		}
		try {
			let attempt = this.fortmatic.user.login().then(() => {
				this.web3.eth.getAccounts().then((accounts) => {
					window.userAccount = accounts[0]; // TODO: review
					console.log("!!!! setting window.userAccount: "+ window.userAccount);
					if (redirect)
						this.router.navigate(['/choose-your-own-adventure']);
				});
			});
		} catch (err) {
			console.log('error authenticating user', err);
		}
	}

	public loginAsPromise() {
		let authPromise = new Promise((resolve, reject) => {
			try {
				let attempt = this.fortmatic.user.login().then(() => {
					this.web3.eth.getAccounts().then((accounts) => {
						window.userAccount = accounts[0]; // TODO: review
						console.log("!!!! setting window.userAccount: "+ window.userAccount);
						// Declare resolution
						resolve(accounts[0])
					});
				});
			} catch (err) {
				console.log('error authenticating user', err);
			}
		});
		// Return resolvable Promise
		return authPromise;
	}

	public logout(): boolean {
		try {
			this.fortmatic.user.logout();
			window.userAccount = null; // TODO: review
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
		window.web3 = this.web3;
	}
}
