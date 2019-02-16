import { Component, OnInit } from '@angular/core';
import { ContractService } from '../services/contract.service';

@Component({
  selector: 'app-course-creator',
  templateUrl: './course-creator.component.html',
  styleUrls: ['./course-creator.component.css']
})
export class CourseCreatorComponent implements OnInit {

  constructor(private contractService: ContractService) {
    // Connect to contract
    this.contractService.bootstrap();
  }

  ngOnInit() {
  }

}
