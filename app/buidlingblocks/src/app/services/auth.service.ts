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
	private fortmatic = null;
	private web3 = null;

	constructor() {
		this.fmApiKey = FM_API_KEY_RINKEBY;

		this.initWeb3();
	}

	public getWeb3() { return this.web3; };
	public getFortmatic() { return this.fortmatic; };

	/**
	 * Initialize web3 with Fortmatic as provider.
	 */
	private initWeb3() {
		this.fortmatic = new Fortmatic(this.fmApiKey);
		this.web3 = new Web3(this.fortmatic.getProvider());

		this.web3.eth.getAccounts((error, accounts) => {
			if (error) {
				console.log(error);
			}
			console.log(accounts);

			/*
			 * Notice that we set from to 0x0. Fortmatic will replace this with the appropriate address.
			 *
			web3.eth.sendTransaction({
				// From address will automatically be replaced by the address of current user
				from: '0x0000000000000000000000000000000000000000',
				to: "FIXME",
				value: web3.utils.toWei("1", 'milliether')
			});
			*/
		});
	}
}
