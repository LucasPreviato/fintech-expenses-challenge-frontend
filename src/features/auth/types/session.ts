export interface AppUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthSession {
  user: AppUser | null;
  accessToken: string | null;
}
