import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getApiStatus() {
    return {
      success: true,
      status: 'ONLINE',
      app: 'MISINCOL PDM Backend API',
      version: '2026.4.0',
      timestamp: new Date().toISOString(),
      availableModules: [
        '/api/auth/login',
        '/api/users',
        '/api/teams',
        '/api/objectives',
        '/api/activities',
        '/api/reports',
        '/api/change-requests',
        '/api/notifications',
      ],
    };
  }
}
