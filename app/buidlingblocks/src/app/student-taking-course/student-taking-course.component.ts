import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ContractService } from '../services/contract.service';
import { IpfsService } from '../services/ipfs.service';
import { Http, ResponseContentType } from '@angular/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

declare let window: any;

@Component({
  selector: 'app-student-taking-course',
  templateUrl: './student-taking-course.component.html',
  styleUrls: ['./student-taking-course.component.css']
})
export class StudentTakingCourseComponent implements OnInit {

  public courseData: any;
  public courseIndex;
  public courseAddress;
  public ipfs;
  public courseMaterial: any;

  private routerContext: Array<any> = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private contractService: ContractService,
    private ipfsService: IpfsService,
    private sanitizer: DomSanitizer
  ) {
    this.authService.login(false);
    this.routerContext = this.route.snapshot.url;
    this.courseIndex = this.routerContext[2].path;
  }

  async ngOnInit() {
    this.courseData = await this.contractService.getCourseData(this.courseIndex);
    console.log('courseData',this.courseData);

    let stream = this.ipfsService.readFileAsStream(this.courseData.ipfsHash);

    stream.on('data', (file) => {
      // write the file's path and contents to standard out
      console.log(file.path)
      if(file.type !== 'dir') {
        file.content.on('data', (data) => {
          this.courseMaterial = JSON.parse(data.toString());
          console.log('courseMaterial', this.courseMaterial);
          this.createImage(this.courseMaterial.steps[0].file)
        })
        file.content.resume()
      }
    });
  }

  createImage(ipfsHash: string) {
    // ...
  }

}
