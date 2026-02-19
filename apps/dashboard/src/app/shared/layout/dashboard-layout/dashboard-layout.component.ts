import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthFacade } from '../../../core/store/auth/auth.facade';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css'],
})
export class DashboardLayoutComponent {
  private readonly auth = inject(AuthFacade);
  readonly theme = inject(ThemeService);
  user$ = this.auth.user$;

  logout(): void {
    this.auth.logout();
  }
}
