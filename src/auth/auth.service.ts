import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async validateAndLogin(dto: LoginDto) {
    const rawIdentifier = dto.identifier || dto.email;
    const rawPassword = dto.pin || dto.password;

    if (!rawIdentifier || !rawPassword) {
      throw new BadRequestException('Debe ingresar usuario/correo y contraseña/PIN');
    }

    const cleanId = rawIdentifier.trim().toLowerCase();
    const cleanSecret = rawPassword.trim();

    let user = this.usersService.findByEmail(cleanId);
    if (!user) {
      const all = this.usersService.findAll();
      const matched = all.find((u) => u.teamId && u.teamId.toLowerCase() === cleanId);
      if (matched) user = this.usersService.findById(matched.id);
    }

    if (!user) {
      if (cleanId === 'admin' || cleanId === 'director') {
        user = this.usersService.findByEmail('admin@misincol.org') || this.usersService.findByEmail('director@misincol.org');
      }
    }

    const isValid = user ? this.usersService.verifyPassword(user, cleanSecret) : false;
    if (!user || !isValid) {
      throw new UnauthorizedException('Credenciales incorrectas. Verifique el usuario y el PIN de acceso.');
    }

    const payload = { sub: user.id, email: user.email, role: user.role, teamId: user.teamId };
    const accessToken = this.jwtService.sign(payload);

    return {
      success: true,
      token: accessToken,
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        teamId: user.teamId,
      },
    };
  }
}
