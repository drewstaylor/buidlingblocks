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
  private initialized: boolean = false;

  // Blockchain instance parameters
  private bbContractAddress: string = '0xb95955c36155533B94B14A0EF29F257a9C5d9089';
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
        abi: [{"constant":false,"inputs":[],"name":"registerTeacher","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"students","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getCourse","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"coursesByTeacher","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCoursesLength","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"teachers","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"registerStudent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getStudent","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"teacher","type":"address"}],"name":"getCoursesByTeacher","outputs":[{"name":"courses","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"courses","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getTeacher","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getStudentsLength","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_ageGroup","type":"uint8"},{"name":"_courseStream","type":"uint8"}],"name":"launchCourse","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getTeacherLength","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"teacher","type":"address"}],"name":"teacherRegistered","type":"event"}],
        courseLaunchAbi: [{"constant":true,"inputs":[{"name":"testID","type":"uint256"}],"name":"getTestScore","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"questionTexts","type":"string[]"},{"name":"answers","type":"bytes32[]"},{"name":"options","type":"string[][]"}],"name":"addTest","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"textHashes","type":"bytes32[]"},{"name":"imageHashes","type":"bytes32[]"}],"name":"addSteps","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"testID","type":"uint256"}],"name":"getAllTestScores","outputs":[{"name":"testScores","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"teacher","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"testID","type":"uint256"},{"name":"student","type":"address"}],"name":"getStudentTestScore","outputs":[{"name":"testScore","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"answers","type":"bytes32[]"}],"name":"submitAnswers","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"textHash","type":"bytes32"},{"name":"imageHash","type":"bytes32"}],"name":"addStep","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_ageGroup","type":"uint8"},{"name":"_courseStream","type":"uint8"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]
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

    this.Initialize = true;
  };

  /**
   * register / lunch functions
   */
  public async registerStudent() {
    return await this.bbContractInstance.methods.registerStudent().send();
  }
  public async registerTeacher() {
    return await this.bbContractInstance.methods.registerTeacher().send();
  }
  public async launchCourse(ageGroup, courseStream) {
    return await this.bbContractInstance.methods.launchCourse(ageGroup, courseStream).send();
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
      this.bbContractInstance.methods.courses);
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
    return await this.bbContractInstance.methods.getCourse(index).call({from: window.userAccount});
  }
  public async getTeacher(index) {
    return await this.bbContractInstance.methods.getTeacher(index).call({from: window.userAccount});
  }
  public async getStudent(index) {
    return await this.bbContractInstance.methods.getStudent(index).call({from: window.userAccount});
  }

}
