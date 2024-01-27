import bcrypt from 'bcrypt';

export class PasswordController {
  static async Create(text: string, saltRounds = 10) {
    try {
      const hash = await bcrypt.hash(text, saltRounds);

      return hash;
    } catch (err) {
      console.error('Error generating hash:', err);
    }
  }
}
