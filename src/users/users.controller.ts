import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ROLE_NACIONAL)
  create(@Body() dto: CreateUserDto, @Req() req: any) {
    const creatorEmail = req.user?.email || 'ROLE_NACIONAL';
    return this.usersService.create(dto, creatorEmail);
  }

  @Get()
  @Roles(UserRole.ROLE_NACIONAL)
  findAll(@Query('role') role?: UserRole, @Query('teamId') teamId?: string) {
    return this.usersService.findAll(role, teamId);
  }

  @Patch(':id/role')
  @Roles(UserRole.ROLE_NACIONAL)
  updateRole(@Param('id') id: string, @Body() dto: UpdateUserRoleDto, @Req() req: any) {
    const updaterEmail = req.user?.email || 'ROLE_NACIONAL';
    return this.usersService.updateRole(id, dto.role, updaterEmail);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const { passwordHash, ...user } = this.usersService.findById(id);
    return user;
  }
}

