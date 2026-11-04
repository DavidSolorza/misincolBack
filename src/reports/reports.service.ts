import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { FieldReport } from './entities/field-report.entity';
import { CreateFieldReportDto, UpdateFieldReportDto } from './dto/create-field-report.dto';

@Injectable()
export class ReportsService {
  private reports: FieldReport[] = [];

  findAll(teamId?: string): FieldReport[] {
    if (teamId) {
      return this.reports.filter((rep) => rep.teamId === teamId);
    }
    return [...this.reports];
  }

  findOne(id: string): FieldReport {
    const report = this.reports.find((rep) => rep.id === id);
    if (!report) {
      throw new NotFoundException(`Informe de campo ${id} no encontrado`);
    }
    return report;
  }

  create(dto: CreateFieldReportDto): FieldReport {
    const now = new Date().toISOString();
    const newReport: FieldReport = {
      id: randomUUID(),
      teamId: dto.teamId,
      year: dto.year,
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

    this.reports.push(newReport);
    return newReport;
  }

  update(id: string, dto: UpdateFieldReportDto): FieldReport {
    const report = this.findOne(id);
    Object.assign(report, dto, { updatedAt: new Date().toISOString() });
    return report;
  }

  delete(id: string): { success: boolean; message: string } {
    const initialLen = this.reports.length;
    this.reports = this.reports.filter((rep) => rep.id !== id);
    if (this.reports.length === initialLen) {
      throw new NotFoundException(`Informe de campo ${id} no encontrado`);
    }
    return { success: true, message: `Informe ${id} eliminado` };
  }

  exportToExcel(teamId: string) {
    const reports = this.findAll(teamId);
    return {
      format: 'excel',
      teamId,
      generatedAt: new Date().toISOString(),
      data: reports,
      filename: `informe_campo_${teamId}_${Date.now()}.xlsx`,
    };
  }

  exportToPdf(teamId: string) {
    const reports = this.findAll(teamId);
    return {
      format: 'pdf',
      teamId,
      generatedAt: new Date().toISOString(),
      data: reports,
      filename: `informe_campo_${teamId}_${Date.now()}.pdf`,
    };
  }
}
