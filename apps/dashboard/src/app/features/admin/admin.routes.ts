import { Route } from '@angular/router';

export const ADMIN_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./admin-layout/admin-layout.component').then(
        (m) => m.AdminLayoutComponent
      ),
    children: [
      { path: '', redirectTo: 'audit', pathMatch: 'full' },
      {
        path: 'audit',
        loadComponent: () =>
          import('./admin-dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent
          ),
      },
      {
        path: 'organizations/new',
        loadComponent: () =>
          import('./create-organization/create-organization.component').then(
            (m) => m.CreateOrganizationComponent
          ),
      },
      {
        path: 'users/new',
        loadComponent: () =>
          import('./create-user/create-user.component').then(
            (m) => m.CreateUserComponent
          ),
      },
    ],
  },
];
