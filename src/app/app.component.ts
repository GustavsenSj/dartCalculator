import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private router: Router) {}

  // Event Handler for button click
  public goToHome(): void {
    this.router.navigate(['login']);
  }
  title = 'ng-project';
}
