import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import type { Organization } from '@turbo-vets/data';
import { OrganizationsService } from '../../../core/services/organizations.service';
import { SkeletonComponent } from '../../../shared/skeleton/skeleton.component';

@Component({
  selector: 'app-create-organization',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SkeletonComponent],
  templateUrl: './create-organization.component.html',
  styleUrls: ['./create-organization.component.css'],
})
export class CreateOrganizationComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly orgsService = inject(OrganizationsService);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    parentId: null as string | null,
  });

  rootOrgs: Organization[] = [];
  loadingOrgs = true;
  submitting = false;
  error: string | null = null;
  success: string | null = null;

  ngOnInit(): void {
    this.orgsService.getOrganizations().subscribe({
      next: (orgs) => {
        this.rootOrgs = orgs.filter((o) => !o.parentId);
        this.loadingOrgs = false;
      },
      error: () => {
        this.loadingOrgs = false;
        this.error = 'Failed to load organizations';
      },
    });
  }

  onSubmit(): void {
    this.error = null;
    this.success = null;
    this.submitting = true;
    const { name, parentId } = this.form.getRawValue();
    this.orgsService.createOrganization(name, parentId ?? undefined).subscribe({
      next: () => {
        this.success = 'Organization created.';
        this.form.patchValue({ name: '' });
        this.submitting = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Failed to create organization';
        this.submitting = false;
      },
    });
  }
}
