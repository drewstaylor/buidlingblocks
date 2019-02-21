import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class HasherService {

  constructor() { }

  public hash(plainText): string {
    let hashRaw = CryptoJS.HmacSHA256(plainText, environment.seed);
    let hashInBase64 = CryptoJS.enc.Base64.stringify(hashRaw);
    // truncate to 32 bytes to make Ethereum happy
	  return (hashInBase64.substring(0,32));
  }
}
