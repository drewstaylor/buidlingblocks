import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ContractService } from '../services/contract.service';
import { IpfsService } from '../services/ipfs.service';

@Component({
  selector: 'app-course-creator',
  templateUrl: './course-creator.component.html',
  styleUrls: ['./course-creator.component.css']
})
export class CourseCreatorComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private contractService: ContractService,
    private ipfsService: IpfsService
  ) {
    this.authService.login();
  }

  ngOnInit() {
    // Connect to contract
    this.contractService.bootstrap();
  }

}
