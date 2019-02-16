import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})

export class AuthenticationComponent implements OnInit {
  // Public
  public isLoading: boolean = true;
  // Private
  private routerContext: Array<any> = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    // Current route
    this.routerContext = this.route.snapshot.url;
  }

  ngOnInit() {
    let workflow = this.routerContext[0].path;
    switch (workflow) {
      case 'login':
        this.login();
        break;
      case 'logout':
        this.logout();
        break;
    }
  }

  private login(): void {
    console.log("Attempting user login...");
    this.authService.login(true);
    this.isLoading = false;
  }

  private logout(): void {
    console.log("Logging out...");
    let logoutState = this.authService.logout();
    if (logoutState) {
      this.router.navigate(['/']);
    }
  }

}
