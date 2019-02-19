import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ContractService } from '../services/contract.service';
import { GraphService } from '../services/graph.service';

@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.css']
})
export class CoursesListComponent implements OnInit {

  public courseList: Array<any> = [];
  public courses: Array<any> = [];

  constructor(
    private authService: AuthService,
    private contractService: ContractService
  ) { 
    this.authService.login(false);
  }

  async ngOnInit() {
    this.courseList = await this.contractService.listNamesAndTypes();
    
    console.log('this.courseList =>', this.courseList);

    //for (var i = 0; i < this.courseList.length; i++) {
    //  this.courses[i] = await this.contractService.getCourse(i);
    //}
    //console.log('this.courses =>', this.courses);
    
  }

}
