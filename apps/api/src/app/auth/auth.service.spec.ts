import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    passwordHash: '$2b$12$hashed',
    firstName: 'Test',
    lastName: 'User',
    role: { name: 'Viewer' },
    isActive: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            findById: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('jwt-token') },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should throw UnauthorizedException when user not found', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null as never);
      await expect(
        service.login('unknown@example.com', 'password')
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return tokens when credentials are valid', async () => {
      const { passwordHash: _, ...userWithoutPassword } = mockUser;
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue({
        ...mockUser,
        passwordHash: '$2b$12$hashed',
      } as never);
      const bcrypt = await import('bcrypt');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      const result = await service.login('test@example.com', 'password');
      expect(result).toHaveProperty('accessToken', 'jwt-token');
      expect(result.user.email).toBe('test@example.com');
    });
  });
});
