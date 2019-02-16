import { Injectable } from '@angular/core';

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class IpfsService {

  public ipfs: any;

  constructor() {
    // ...
  }

  public bootstrap(): void {
    this.ipfs = new window.IpfsHttpClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
    //console.log('this.ipfs =>', this.ipfs);
  }
}
