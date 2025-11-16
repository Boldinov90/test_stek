export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  registrationDate: string;
  lastActivity: string;
  avatar: string | null
  loginCount: number;
  postsCount: number;
  commentsCount: number;
}
export interface AddUserForm {
  name: string;
  email: string;
  role: User['role']
}
export interface Option {
  value: string | number
  label: string | number
}
export interface NewUser {
  name: string
  email: string
  role: string,
  sendWelcomeEmail?: boolean
}
export interface NewUserErrors {
  name: string
  email: string
}
export interface filterButton {
  name: string
  value: string
}