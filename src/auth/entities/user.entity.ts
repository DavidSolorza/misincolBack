export class User {
  id: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'team';
  teamId?: string;
}
