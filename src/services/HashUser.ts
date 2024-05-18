export class HashUser {
  static encrypt(id: string) {
    return btoa(id);
  }

  static decrypt(hash: string) {
    return atob(hash);
  }
}
