import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
})
export class ReportesPage {
  
  constructor(
    private router: Router
  ) {}

  logout() {
    this.router.navigateByUrl('/login'); // Redirigir al login
  }
}
