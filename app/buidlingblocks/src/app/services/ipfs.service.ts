import { Injectable } from '@angular/core';

declare let require: any;

@Injectable({
  providedIn: 'root'
})
export class IpfsService {

  public IPFS = require('ipfs-http-client');
  public ipfs: any;

  constructor() {
    // ...
  }

  public bootstrap(): void {
    this.ipfs = new this.IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
    console.log('this.ipfs =>', this.ipfs);
  }
}
