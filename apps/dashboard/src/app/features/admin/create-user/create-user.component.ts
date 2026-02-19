import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import type { Organization, Role } from '@turbo-vets/data';
import { AdminUsersService } from '../../../core/services/admin-users.service';
import { OrganizationsService } from '../../../core/services/organizations.service';
import { RolesService } from '../../../core/services/roles.service';
import { SkeletonComponent } from '../../../shared/skeleton/skeleton.component';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SkeletonComponent],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
})
export class CreateUserComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly adminUsers = inject(AdminUsersService);
  private readonly orgsService = inject(OrganizationsService);
  private readonly rolesService = inject(RolesService);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    organizationId: ['', Validators.required],
    roleId: ['', Validators.required],
  });

  organizations: Organization[] = [];
  roles: Role[] = [];
  loading = true;
  submitting = false;
  error: string | null = null;
  success: string | null = null;

  private loaded = 0;

  ngOnInit(): void {
    this.orgsService.getOrganizations().subscribe({
      next: (orgs) => {
        this.organizations = orgs;
        this.maybeDone();
      },
      error: () => this.maybeDone(),
    });
    this.rolesService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        this.maybeDone();
      },
      error: () => this.maybeDone(),
    });
  }

  private maybeDone(): void {
    this.loaded++;
    if (this.loaded >= 2) this.loading = false;
  }

  onSubmit(): void {
    this.error = null;
    this.success = null;
    this.submitting = true;
    const body = this.form.getRawValue();
    this.adminUsers.createUser(body).subscribe({
      next: () => {
        this.success = 'User created.';
        this.form.reset();
        this.submitting = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Failed to create user';
        this.submitting = false;
      },
    });
  }
}
