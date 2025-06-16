declare module "#auth-utils" {
  interface User {
    role: "admin"
  }

  interface UserSession {
    registered: boolean
    registration: number
  }
}

export {}
