import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { AuditService } from './audit.service';
import { QueryAuditDto } from './dto/query-audit.dto';

@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ROLE_NACIONAL)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('logs')
  findAll(@Query() query: QueryAuditDto) {
    return this.auditService.findAll(query);
  }

  @Get('changes')
  findChanges(@Query() query: QueryAuditDto) {
    return this.auditService.findChanges(query);
  }

  @Get('logins')
  findLogins(@Query() query: QueryAuditDto) {
    return this.auditService.findLogins(query);
  }
}

