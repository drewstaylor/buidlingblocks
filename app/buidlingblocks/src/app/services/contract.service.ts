import { Injectable } from '@angular/core';
import bs58 from 'bs58';
import { Buffer } from 'buffer';

declare let Web3: any;
declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  public Contract;
  public web3 = null;
  public web3Enabled: boolean;
  private initialized: boolean = false;

  // Blockchain instance parameters

  private bbContractAddress: string = '0x8e7454c76cAE8BD33C1922EA43BA30096d9A0f34';
  private launchCourseContractAddress: string = '0x18128d6B244fB471D21FD0c298A13Da5668178e1';
  private bbContractInstance;
  public network: string = "rinkeby";
  public rpcEndpoint: string = "https://rinkeby.infura.io/";

  constructor() {
    if (typeof window.web3 !== 'undefined') {
      this.web3Enabled = true;
      this.bootstrap();
    }
  };

  bootstrap(): void {
    if (this.initialized) {
      return;
    }

    // Get contract
    let that = this;
    var data = {
        address: this.bbContractAddress,
        network: this.network,
        endpoint: this.rpcEndpoint,
		abi: [{"constant":false,"inputs":[],"name":"registerTeacher","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"students","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"coursesByTeacher","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCoursesLength","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"teachers","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"recipient","type":"address"},{"name":"value","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"registerStudent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getCourseData","outputs":[{"name":"courseHash","type":"bytes32"},{"name":"courseTitle","type":"string"},{"name":"courseType","type":"uint8"},{"name":"ageGroup","type":"uint8"},{"name":"answers","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"courseHash","type":"bytes32"},{"name":"Name","type":"string"},{"name":"_courseType","type":"uint8"},{"name":"_ageGroup","type":"uint8"},{"name":"answers","type":"bytes32[]"}],"name":"launchCourse","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowed","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getStudent","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"teacher","type":"address"}],"name":"getCoursesByTeacher","outputs":[{"name":"courseList","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isCourse","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isStudent","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"courses","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"sender","type":"address"},{"name":"value","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isTeacher","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getTeacher","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getStudentsLength","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTeacherLength","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"courseTypes","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"teacher","type":"address"}],"name":"teacherRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"student","type":"address"}],"name":"studentRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"courseContract","type":"address"},{"indexed":false,"name":"teacher","type":"address"},{"indexed":false,"name":"courseTitle","type":"string"}],"name":"courseLaunched","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"address"},{"indexed":false,"name":"","type":"uint256"}],"name":"minted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"address"},{"indexed":false,"name":"","type":"uint256"}],"name":"burnt","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}],
		courseLaunchAbi: [{"constant":true,"inputs":[],"name":"courseTitle","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"testScores","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"student","type":"address"}],"name":"getStudentTestScore","outputs":[{"name":"testScore","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"numQuestions","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_responses","type":"bytes32[]"}],"name":"submitResponses","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"ageGroup","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCourseData","outputs":[{"name":"","type":"bytes32"},{"name":"","type":"string"},{"name":"","type":"uint8"},{"name":"","type":"uint8"},{"name":"answers","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"testTakers","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"courseType","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"testID","type":"uint256"}],"name":"getAllTestScores","outputs":[{"name":"Scores","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"teacher","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTestScore","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_teacher","type":"address"},{"name":"_courseHash","type":"bytes32"},{"name":"_courseTitle","type":"string"},{"name":"_courseType","type":"uint8"},{"name":"_ageGroup","type":"uint8"},{"name":"_answers","type":"bytes32[]"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"student","type":"address"},{"indexed":false,"name":"score","type":"uint256"},{"indexed":false,"name":"maxScore","type":"uint256"}],"name":"testTaken","type":"event"}],
    };
    this.Contract = data;
    this.init();
  }

  // Initialize provider bridge
  private init = function (): void {
    if (!this.web3Enabled) {
      return;
    }

    // Create the contract interface using the ABI provided in the configuration.
    this.bbContractInstance = new window.web3.eth.Contract(this.Contract.abi, this.Contract.address);

    this.bbContractInstance.options.from = window.userAccount;
    console.log('BB Contract Instance =>', this.bbContractInstance);

    this.initialized = true;

	  /*
	  (async () => {
		    // XXX: ugly testing -- will run on page load / refresh
			console.log("ugly testing");
			const firstAddr = await this.getCourseHash(0);
			const courseObj = await this.getCourseObject(firstAddr);
			console.log(courseObj);
	  })();
	  */

  };

  // These to/from ipfs hash functions were taken from:
  // https://ethereum.stackexchange.com/questions/17094/how-to-store-ipfs-hash-using-bytes

  // Return bytes32 hex string from base58 encoded ipfs hash,
  // stripping leading 2 bytes from 34 byte IPFS hash
  // Assume IPFS defaults: function:0x12=sha2, size:0x20=256 bits
  // E.g. "QmNSUYVKDSvPUnRLKmuxk9diJ6yS96r1TrAXzjTiBcCLAL" -->
  // "0x017dfd85d4f6cb4dcd715a88101f7b1f06cd1e009b2327a0809d01eb9c91f231"
  public getBytes32FromIpfsHash(ipfsListing) {
    return "0x"+bs58.decode(ipfsListing).slice(2).toString('hex')
  }

  // Return base58 encoded ipfs hash from bytes32 hex string,
  // E.g. "0x017dfd85d4f6cb4dcd715a88101f7b1f06cd1e009b2327a0809d01eb9c91f231"
  // --> "QmNSUYVKDSvPUnRLKmuxk9diJ6yS96r1TrAXzjTiBcCLAL"
  public getIpfsHashFromBytes32(bytes32Hex) {
    // Add our default ipfs values for first 2 bytes:
    // function:0x12=sha2, size:0x20=256 bits
    // and cut off leading "0x"
    const hashHex = "1220" + bytes32Hex.slice(2);
    const hashBytes = Buffer.from(hashHex, 'hex');
    const hashStr = bs58.encode(hashBytes);
    return hashStr;
  }

  /**
   * register / lunch functions
   */
  public async registerStudent() {
    return await this.bbContractInstance.methods.registerStudent().send();
  }
  public async registerTeacher() {
    return await this.bbContractInstance.methods.registerTeacher().send();
  }
  public async launchCourse(ipfsHash, courseTitle, courseType, ageGroup, answerHashes) {
	  // const ipfsHashBytes32 = window.web3.utils.bytesToHex(ipfsHash);
	  // console.log("ipfs hash: "+ ipfsHash +" -> "+ ipfsHashBytes32);
	  const ipfsHashBytes32 = this.getBytes32FromIpfsHash(ipfsHash);
	  const answerHashesByte32 = answerHashes.map(hash => window.web3.utils.bytesToHex(hash));
	  return await this.bbContractInstance.methods.launchCourse(
      ipfsHashBytes32,
      courseTitle.toString(),
      parseInt(courseType),
      parseInt(ageGroup),
		  answerHashesByte32)
		.send();
  }

  /**
   * Utility function to fetch an array.
   *
   * Takes a transaction object on which call() can be performed, this should
   * return the number of items in the array.
   *
   * Also takes an ABI method (also a function call which should accept an index)
   * which should return the value of an item in an array.
   *
   * The resulting transactions will be called with 'from' set to the current user address.
   *
   * example for arg1:
   *     bbContractInstance.methods.getCoursesLength() (returns a txn)
   * example for arg2:
   *     bbContractInstance.methods.courses (returns a function that returns a txn)
   */
  public async listItems(lengthCall, accessorFunction) {
    const size = await lengthCall.call({from: window.userAccount});
    // console.log("size: "+ size);
    const arr = [];

    for (let i=0; i<size; i++) {
      const item = await accessorFunction(i).call({from: window.userAccount});
      // console.log("item["+i"]: " + item);
      arr.push(item);
    }

    return arr;
  }

  /**
   * List functions
   */
  public async listCourses() {
    return this.listItems(
      this.bbContractInstance.methods.getCoursesLength(),
      this.bbContractInstance.methods.courseHashes);
  }
  public async listTeachers() {
    return this.listItems(
      this.bbContractInstance.methods.getTeacherLength(),
      this.bbContractInstance.methods.teachers);
  }
  public async listStudents() {
    return this.listItems(
      this.bbContractInstance.methods.getStudentsLength(),
      this.bbContractInstance.methods.students);
  }

  /**
   * Getters (by index)
   */
  public async getCourse(index) {
    return await this.bbContractInstance.methods.courses(index).call({from: window.userAccount});
  }
  public async getTeacher(index) {
    return await this.bbContractInstance.methods.teachers(index).call({from: window.userAccount});
  }
  public async getStudent(index) {
    return await this.bbContractInstance.methods.students(index).call({from: window.userAccount});
  }

  /**
   * Returns an object representing the state of a course
   *
   * @param address - the address of the deployed course
   */
  public async getCourseObject(address) {

    const courseInstance = new window.web3.eth.Contract(this.Contract.courseAbi, address);

	let obj = { courseHash: null, teacher: null, name: null };

	obj.courseHash = courseInstance.methods.courseHash().call({from: window.userAccount});
	obj.teacher = courseInstance.methods.teacher().call({from: window.userAccount});
	obj.name = courseInstance.methods.name().call({from: window.userAccount});

	return obj;
  }

}
