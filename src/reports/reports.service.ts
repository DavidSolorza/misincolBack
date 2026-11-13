import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { FieldReport } from './entities/field-report.entity';
import { CreateFieldReportDto, UpdateFieldReportDto } from './dto/create-field-report.dto';
import { BaseInMemoryService } from '../common/services/base-in-memory.service';

@Injectable()
export class ReportsService extends BaseInMemoryService<FieldReport> {
  protected readonly entityName = 'Informe de campo';

  override findAll(teamId?: string, year?: number): FieldReport[] {
    let result = [...this.items];
    if (teamId) result = result.filter((rep) => rep.teamId === teamId);
    if (year) result = result.filter((rep) => rep.year === Number(year));
    return result;
  }

  findOne(id: string): FieldReport {
    return this.findById(id);
  }

  create(dto: CreateFieldReportDto): FieldReport {
    const now = new Date().toISOString();
    const newReport: FieldReport = {
      id: randomUUID(),
      teamId: dto.teamId,
      year: Number(dto.year),
      firstTimeContacts: dto.firstTimeContacts || 0,
      interestedPeople: dto.interestedPeople || 0,
      heardGospel: dto.heardGospel || 0,
      seekingGodPeople: dto.seekingGodPeople || 0,
      gospelResponseOpportunities: dto.gospelResponseOpportunities || 0,
      believersCount: dto.believersCount || 0,
      baptizedCount: dto.baptizedCount || 0,
      activeBibleStudies: dto.activeBibleStudies || 0,
      personalMentorships: dto.personalMentorships || 0,
      newGroupsMeetingInYear: dto.newGroupsMeetingInYear || 0,
      churchPerspectiveGroups: dto.churchPerspectiveGroups || 0,
      finalChurchesCount: dto.finalChurchesCount || 0,
      churchGenerations: dto.churchGenerations || 0,
      ministerialTrainingCount: dto.ministerialTrainingCount || 0,
      createdAt: now,
      updatedAt: now,
    };

    this.items.push(newReport);
    return newReport;
  }

  update(id: string, dto: UpdateFieldReportDto): FieldReport {
    const report = this.findById(id);
    Object.assign(report, dto, { updatedAt: new Date().toISOString() });
    return report;
  }

  delete(id: string): { success: boolean; message: string } {
    this.removeById(id);
    return { success: true, message: `Informe ${id} eliminado` };
  }

  exportBackupJson() {
    return {
      backupType: 'MASS_BACKUP_JSON',
      generatedAt: new Date().toISOString(),
      totalRecords: this.items.length,
      data: this.items,
    };
  }

  exportBackupExcel() {
    return {
      backupType: 'MASS_BACKUP_EXCEL',
      generatedAt: new Date().toISOString(),
      filename: `respaldo_general_pdm_${Date.now()}.xlsx`,
      totalRecords: this.items.length,
      data: this.items,
    };
  }

  exportToExcel(teamId: string, year?: number) {
    const reports = this.findAll(teamId, year);
    return {
      format: 'excel',
      teamId,
      year: year || 'Todos',
      generatedAt: new Date().toISOString(),
      data: reports,
      filename: `informe_campo_${teamId}_${Date.now()}.xlsx`,
    };
  }

  exportToPdf(teamId: string, year?: number) {
    const reports = this.findAll(teamId, year);
    return {
      format: 'pdf',
      teamId,
      year: year || 'Todos',
      generatedAt: new Date().toISOString(),
      data: reports,
      filename: `informe_campo_${teamId}_${Date.now()}.pdf`,
    };
  }
}
