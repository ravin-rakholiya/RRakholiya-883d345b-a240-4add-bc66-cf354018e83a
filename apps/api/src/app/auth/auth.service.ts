import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload, JwtTokenResult } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async validateUser(email: string, plainPassword: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const isMatch = await bcrypt.compare(plainPassword, user.passwordHash);
    if (!isMatch) return null;
    const { passwordHash: _, ...result } = user;
    return result;
  }

  async login(email: string, password: string): Promise<JwtTokenResult> {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('Account is disabled');
    }
    await this.auditLogService.logLogin(user.id, user.organizationId ?? null);
    return this.issueTokens(user.id, user.email, user.role.name);
  }

  async register(dto: RegisterDto): Promise<JwtTokenResult> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new UnauthorizedException('Email already registered');
    }
    const user = await this.usersService.createUser(dto);
    return this.issueTokens(user.id, user.email, user.role.name);
  }

  private issueTokens(
    userId: string,
    email: string,
    role: string
  ): JwtTokenResult {
    const payload: JwtPayload = { sub: userId, email, role };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      expiresIn: 900,
      user: { id: userId, email, role },
    };
  }
}
