import { Injectable } from '@angular/core';
import { HasherService } from './hasher.service';
import bs58 from 'bs58';

declare let Web3: any;
declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class ChildContractService {

  public Contract;
  public web3 = null;
  public web3Enabled: boolean;
  private initialized: boolean = false;

  // Blockchain instance parameters
  private ContractAddress: string = null;
  private ContractInstance: any;
  public network: string = "rinkeby";
  public rpcEndpoint: string = "https://rinkeby.infura.io/";

  constructor() {
    if (typeof window.web3 !== 'undefined') {
      this.web3Enabled = true;
      if (this.ContractAddress) {
        this.bootstrap();
      }
    }
  };

  bootstrap(): void {
    if (this.initialized) {
      return;
    }

    // Get contract
    const data = {
      address: this.ContractAddress,
      network: this.network,
      endpoint: this.rpcEndpoint,
      abi: [{"constant":true,"inputs":[],"name":"courseTitle","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"testScores","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"student","type":"address"}],"name":"getStudentTestScore","outputs":[{"name":"testScore","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"numQuestions","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_responses","type":"bytes32[]"}],"name":"submitResponses","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"ageGroup","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCourseData","outputs":[{"name":"","type":"bytes32"},{"name":"","type":"string"},{"name":"","type":"uint8"},{"name":"","type":"uint8"},{"name":"answers","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"testTakers","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"courseType","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"testID","type":"uint256"}],"name":"getAllTestScores","outputs":[{"name":"Scores","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"teacher","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTestScore","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_teacher","type":"address"},{"name":"_courseHash","type":"bytes32"},{"name":"_courseTitle","type":"string"},{"name":"_courseType","type":"uint8"},{"name":"_ageGroup","type":"uint8"},{"name":"_answers","type":"bytes32[]"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"student","type":"address"},{"indexed":false,"name":"score","type":"uint256"},{"indexed":false,"name":"maxScore","type":"uint256"}],"name":"testTaken","type":"event"}],
    };
    this.Contract = data;
    this.init();
  };

  // Contract calls

  /**
   * Submit test answers for a student to be graded by contract
   * @param {String} contractAddress: The current course being evaluated
   */
  public async submitTestAnswers (contractAddress: string, answers: Array<string>) {
    this.setContractAddress(contractAddress);
    // Create SHA256 hashes
    let answersSha256 = [];
    for (var i = 0; i < answers.length; i++) {
      // Hash a toLowerCase() version of the answer
      // to promote consistency of test answers
      let answerRaw = answers[i].toLowerCase();
      let answerHashed = new HasherService().hash(answerRaw);
      answersSha256.push(answerHashed);
    }
    // Truncate SHA256 hashes as Byte32
    const answerHashesByte32 = answersSha256.map(hash => window.web3.utils.bytesToHex(hash));
    // Compare test score with master answers record 
    // stored on the contract 
    return await this.ContractInstance
                    .methods.submitResponses(answerHashesByte32)
                    .call({from: window.userAccount});
  }

  /**
   * Get test scores for user
   * @param {String} contractAddress: The current course being evaluated
   * @return {}: uint representing number of correct test answers
   */
  public async getTestScore (contractAddress: string) {
    this.setContractAddress(contractAddress);
    return await this.ContractInstance
                    .methods.getStudentTestScore(window.userAccount)
                    .call({from: window.userAccount});
  }

  // Initialize provider bridge
  private init = function (): void {
    if (!this.web3Enabled) {
      return;
    }

    // Create the contract interface using the ABI provided in the configuration.
    this.ContractInstance = new window.web3.eth.Contract(this.Contract.abi, this.Contract.address);
    this.ContractInstance.options.from = window.userAccount;

    this.initialized = true;
  };

  // Utility helper: set child contract address
  private setContractAddress = function (contractAddress: string): void {
    this.ContractAddress = contractAddress;
    this.bootstrap();
  };

  // These to/from ipfs hash functions were taken from:
  // https://ethereum.stackexchange.com/questions/17094/how-to-store-ipfs-hash-using-bytes

  // Return bytes32 hex string from base58 encoded ipfs hash,
  // stripping leading 2 bytes from 34 byte IPFS hash
  // Assume IPFS defaults: function:0x12=sha2, size:0x20=256 bits
  // E.g. "QmNSUYVKDSvPUnRLKmuxk9diJ6yS96r1TrAXzjTiBcCLAL" -->
  // "0x017dfd85d4f6cb4dcd715a88101f7b1f06cd1e009b2327a0809d01eb9c91f231"
  private getBytes32FromIpfsHash(ipfsListing) {
    return "0x" + bs58.decode(ipfsListing).slice(2).toString('hex');
  }
}
