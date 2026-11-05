import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateFieldReportDto, UpdateFieldReportDto } from './dto/create-field-report.dto';
import { FieldReport } from './entities/field-report.entity';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  findAll(@Query('teamId') teamId?: string, @Query('year') year?: number): FieldReport[] {
    return this.reportsService.findAll(teamId, year);
  }

  @Get('backup/json')
  @Roles(UserRole.ROLE_NACIONAL)
  backupJson() {
    return this.reportsService.exportBackupJson();
  }

  @Get('backup/excel')
  @Roles(UserRole.ROLE_NACIONAL)
  backupExcel() {
    return this.reportsService.exportBackupExcel();
  }

  @Get('export/excel/:teamId')
  exportExcel(@Param('teamId') teamId: string, @Query('year') year?: number) {
    return this.reportsService.exportToExcel(teamId, year);
  }

  @Get('export/pdf/:teamId')
  exportPdf(@Param('teamId') teamId: string, @Query('year') year?: number) {
    return this.reportsService.exportToPdf(teamId, year);
  }

  @Get(':id')
  findOne(@Param('id') id: string): FieldReport {
    return this.reportsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateFieldReportDto): FieldReport {
    return this.reportsService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFieldReportDto): FieldReport {
    return this.reportsService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): { success: boolean; message: string } {
    return this.reportsService.delete(id);
  }
}
