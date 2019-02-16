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
  private launchCourseContractAddress: string = '0x18128d6B244fB471D21FD0c298A13Da5668178e1';
  private contract_instance;
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
        abi: [{"constant":false,"inputs":[],"name":"registerTeacher","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"coursesByTeacher","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"registerStudent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"teacher","type":"address"}],"name":"getCoursesByTeacher","outputs":[{"name":"courses","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"courses","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_ageGroup","type":"uint8"},{"name":"_courseStream","type":"uint8"}],"name":"launchCourse","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}],
        courseLaunchAbi: [{"constant":true,"inputs":[{"name":"testID","type":"uint256"}],"name":"getTestScore","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"questionTexts","type":"string[]"},{"name":"answers","type":"bytes32[]"},{"name":"options","type":"string[][]"}],"name":"addTest","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"textHashes","type":"bytes32[]"},{"name":"imageHashes","type":"bytes32[]"}],"name":"addSteps","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"testID","type":"uint256"}],"name":"getAllTestScores","outputs":[{"name":"testScores","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"teacher","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"testID","type":"uint256"},{"name":"student","type":"address"}],"name":"getStudentTestScore","outputs":[{"name":"testScore","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"answers","type":"bytes32[]"}],"name":"submitAnswers","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"textHash","type":"bytes32"},{"name":"imageHash","type":"bytes32"}],"name":"addStep","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_ageGroup","type":"uint8"},{"name":"_courseStream","type":"uint8"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]
    };
    this.Contract = data;
    this.init();
  }

  // Initialize provider bridge
  init = function (): void {
    if (!this.web3Enabled) {
      return;
    }

    // Create the contract interface using the ABI provided in the configuration.
    this.contract_instance = new window.web3.eth.Contract(this.Contract.abi, this.Contract.address);
    console.log('Contract Instance =>', this.contract_instance);
  };
}
