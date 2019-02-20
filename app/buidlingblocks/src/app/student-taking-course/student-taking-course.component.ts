import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ContractService } from '../services/contract.service';
import { IpfsService } from '../services/ipfs.service';
//import { Http, ResponseContentType, RequestOptions } from '@angular/http';
import { HttpClient } from "@angular/common/http";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { map } from "rxjs/operators";

declare let window: any;

@Component({
  selector: 'app-student-taking-course',
  templateUrl: './student-taking-course.component.html',
  styleUrls: ['./student-taking-course.component.css']
})
export class StudentTakingCourseComponent implements OnInit {

  public courseData: any = {
    name: null,
    ageGroup: null,
    courseType: null
  };

  public courseMaterial: any = {
    steps: null,
    exams: null
  };

  public courseIndex;
  public courseAddress;
  public ipfs;

  private routerContext: Array<any> = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private contractService: ContractService,
    private ipfsService: IpfsService,
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {
    this.authService.login(false);
    this.routerContext = this.route.snapshot.url;
    this.courseIndex = this.routerContext[2].path;
  }

  async ngOnInit() {
    let fileHash = null;
    let context = null;
    this.courseData = await this.contractService.getCourseData(this.courseIndex);
    console.log('courseData',this.courseData);

    let stream = this.ipfsService.readFileAsStream(this.courseData.ipfsHash);

    stream.on('data', (file) => {
      // write the file's path and contents to standard out
      if(file.type !== 'dir') {
        file.content.on('data', (data) => {
          this.courseMaterial = JSON.parse(data.toString());
          console.log('courseMaterial', this.courseMaterial);
          // Generate steps images
          for (var i = 0; i < this.courseMaterial.steps.length; i++) {
            fileHash = this.courseMaterial.steps[i].file;
            context = 'steps';
            this.createImage(fileHash, context, i);
          }
          // Generate exam images
          for (var j = 0; j < this.courseMaterial.exams.length; j++) {
            fileHash = this.courseMaterial.exams[j].file;
            context = 'exams';
            this.createImage(fileHash, context, j);
          }
        })
        file.content.resume()
      }
    });
  }

  createImage(ipfsHash: string, context: string, index: number) {
    let blob = null;
    let img = null;
    let url = null;
    let stream = this.ipfsService.readFileAsStream(ipfsHash);
    stream.on('data', (file) => {
      if(file.type !== 'dir') {
        file.content.on('data', (data) => {
          switch (context) {
            case 'steps':
              // Declare blob
              blob = new window.Blob([data]);
              // Declare URL for data blob
              url = window.URL.createObjectURL(blob);
              // Create image / document blob
              img = new Image();
              img.src = url;
              window.setTimeout(() => {
                this.courseMaterial.steps[index].img = this.getSantizeUrl(img.src);
              }, 0);
              break;
            case 'exams':
              // Declare blob
              blob = new window.Blob([data], {type: "octet/stream"});
              // Declare URL for data blob
              url = window.URL.createObjectURL(blob);
              window.setTimeout(() => {
                this.courseMaterial.exams[index].file = this.getSantizeUrl(url);
              }, 0);
              break;
          }
        })
        file.content.resume()
      }
    });
  }

  public downloadPDF (filePath) {
    console.log('download?', filePath);
    return this.http.get(filePath, { responseType: 'blob' });
  }

  private getSantizeUrl(url : string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
