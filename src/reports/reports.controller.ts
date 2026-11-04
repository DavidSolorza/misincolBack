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
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateFieldReportDto, UpdateFieldReportDto } from './dto/create-field-report.dto';
import { FieldReport } from './entities/field-report.entity';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  findAll(@Query('teamId') teamId?: string): FieldReport[] {
    return this.reportsService.findAll(teamId);
  }

  @Get('export/excel/:teamId')
  exportExcel(@Param('teamId') teamId: string) {
    return this.reportsService.exportToExcel(teamId);
  }

  @Get('export/pdf/:teamId')
  exportPdf(@Param('teamId') teamId: string) {
    return this.reportsService.exportToPdf(teamId);
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

