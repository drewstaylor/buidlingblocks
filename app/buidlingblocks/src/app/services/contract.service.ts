import { Injectable } from '@angular/core';

declare let Web3: any;
declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  public Contract;
  public web3 = null;
  public web3Enabled: boolean;

  // Blockchain instance parameters
  private contractAddress: string = '0xeFf3764E3fb9BF6Ee2c0af9b1cbccbd07f064B5b';
  public network: string = "rinkeby";
  public rpcEndpoint: string = "https://rinkeby.infura.io/";

  constructor() {
    if (typeof window.web3 !== 'undefined') {
      this.web3Enabled = true;
      this.bootstrap();
    }
  };

  bootstrap(): void {
    // Get contract
    let that = this;
    var data = {
        address: this.contractAddress,
        network: this.network,
        endpoint: this.rpcEndpoint,
        abi: [{"constant":false,"inputs":[],"name":"registerTeacher","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"coursesByTeacher","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"registerStudent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"teacher","type":"address"}],"name":"getCoursesByTeacher","outputs":[{"name":"courses","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"courses","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_ageGroup","type":"uint8"},{"name":"_courseStream","type":"uint8"}],"name":"launchCourse","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]
    };
    this.Contract = data;
    this.init();
  }

  // Initialize provider bridge
  init = function (): void {
    if (!this.web3Enabled) {
      return;
    }

    // Create a new Web3 instance
    this.web3 = new Web3(
        (window.web3 && window.web3.currentProvider) ||
        new Web3.providers.HttpProvider(this.Contract.endpoint));

    // Create the contract interface using the ABI provided in the configuration.
    var contract_interface = this.web3.eth.contract(this.Contract.abi);

    // Create the contract instance for the specific address provided in the configuration.
    this.instance = contract_interface.at(this.Contract.address);
    console.log('Contract Instance =>', this.instance);
  };
}