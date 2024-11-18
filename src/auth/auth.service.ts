import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as passport from 'passport';

@Injectable()
export class AuthService {
  private readonly hardcodedUsername = 'admin';
  private readonly hardcodedPassword = '1234';

  private readonly users = new Map<string, any>(); // Simple in-memory store for the user

  constructor() {
    // Preload a mock user into the in-memory store (if needed)
    this.users.set(this.hardcodedUsername, { username: this.hardcodedUsername });
  }

  // Validate user credentials
  async validateUser(username: string, password: string): Promise<any> {
    if (username === this.hardcodedUsername && password === this.hardcodedPassword) {
      return { username: this.hardcodedUsername }; // Return user data on successful match
    }
    throw new UnauthorizedException('Invalid credentials'); // Error if credentials don't match
  }

  // Serialize the user (what to store in the session)
  serializeUser(user: any, done: Function) {
    console.log('Serializing user:', user);
    done(null, user.username); // Storing the username (or user ID) in the session
  }

  // Deserialize the user (what to fetch from the session)
  async deserializeUser(username: string, done: Function) {
    console.log('Deserializing user with username:', username);
    const user = this.users.get(username); // Retrieve the user from the in-memory store
    if (!user) {
      done(new Error('User not found'), null); // If user not found, return error
    }
    done(null, user); // Return the user object
  }
}
