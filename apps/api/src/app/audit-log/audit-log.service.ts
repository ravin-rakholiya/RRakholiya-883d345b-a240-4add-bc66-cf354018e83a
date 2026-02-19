import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog, AuditAction } from '../entities/audit-log.entity';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly repo: Repository<AuditLog>,
  ) {}

  async log(params: {
    userId: string;
    organizationId: string | null;
    action: AuditAction;
    resource: string;
    resourceId?: string | null;
    details?: Record<string, unknown> | null;
  }): Promise<AuditLog> {
    const log = this.repo.create({
      userId: params.userId,
      organizationId: params.organizationId,
      action: params.action,
      resource: params.resource,
      resourceId: params.resourceId ?? null,
      details: params.details ?? null,
    });
    return this.repo.save(log);
  }

  async logLogin(userId: string, organizationId: string | null): Promise<AuditLog> {
    return this.log({
      userId,
      organizationId,
      action: 'LOGIN',
      resource: 'auth',
      resourceId: null,
      details: null,
    });
  }

  /** Filter by allowed org IDs. Parent Owners see parent + children; others see their org only. */
  async findAll(allowedOrgIds: string[]): Promise<AuditLog[]> {
    const qb = this.repo
      .createQueryBuilder('a')
      .orderBy('a.createdAt', 'DESC')
      .take(500);
    if (allowedOrgIds.length > 0) {
      qb.andWhere('a.organizationId IN (:...allowedOrgIds)', { allowedOrgIds });
    } else {
      qb.andWhere('1 = 0'); // No org access: return nothing
    }
    return qb.getMany();
  }
}
