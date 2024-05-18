import bcrypt from 'bcrypt';
import { HashUser } from './HashUser';

export class PasswordService {
  static async Create(text: string, saltRounds = 10) {
    try {
      const hash = await bcrypt.hash(text, saltRounds);

      return hash;
    } catch (err) {
      console.error('Error generating hash:', err);
    }
  }

  static ResetPasswordUrl(authId: string) {
    return `${process.env.FRONT_END_BASE_URL}/resetPassword/?token=${HashUser.encrypt(authId)}`;
  }
}
