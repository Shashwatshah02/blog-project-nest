import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly hardcodedUsername = 'admin';
  private readonly hardcodedPassword = '1234';

  async validateUser(username: string, password: string): Promise<any> {
    if (username === this.hardcodedUsername && password === this.hardcodedPassword) {
      return { username: this.hardcodedUsername }; // Return user data on successful match
    }
    throw new UnauthorizedException('Invalid credentials'); // Error if credentials don't match
  }
}
