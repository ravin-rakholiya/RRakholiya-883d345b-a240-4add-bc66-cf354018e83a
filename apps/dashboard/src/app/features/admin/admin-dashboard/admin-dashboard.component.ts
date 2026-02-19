import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import type { AuditLogEntry } from '@turbo-vets/data';
import { AuditLogService } from '../../../core/services/audit-log.service';
import { SkeletonComponent } from '../../../shared/skeleton/skeleton.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, SkeletonComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  private readonly auditLogService = inject(AuditLogService);

  logs: AuditLogEntry[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.auditLogService.getAuditLogs().subscribe({
      next: (entries) => {
        this.logs = entries;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Failed to load audit log';
        this.loading = false;
      },
    });
  }

  formatDetails(details: Record<string, unknown> | null): string {
    if (!details || typeof details !== 'object') return '—';
    try {
      return JSON.stringify(details);
    } catch {
      return '—';
    }
  }
}
