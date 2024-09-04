export interface AuthDTO {
  email: string
  password: string
}

export interface RegisterDTO extends AuthDTO {
  name: string
  role?: "user" | "admin"
}
