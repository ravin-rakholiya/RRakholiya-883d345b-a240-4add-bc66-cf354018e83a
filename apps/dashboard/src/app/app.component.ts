import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { ThemeService } from './core/services/theme.service';
import { ToastComponent } from './shared/toast/toast.component';
import * as AuthActions from './core/store/auth/auth.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private readonly theme = inject(ThemeService);
  private readonly store = inject(Store);

  constructor() {
    this.theme.init();
  }

  ngOnInit(): void {
    this.store.dispatch(AuthActions.loadUserFromStorage());
  }
}
