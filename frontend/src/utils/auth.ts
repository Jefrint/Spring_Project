export const saveAuth = (token: string, userId: number, roles?: string[]) => {
  localStorage.setItem('token', token)
  localStorage.setItem('userId', String(userId))
  if (roles) {
    localStorage.setItem('roles', JSON.stringify(roles))
  }
}

export const getUserId = (): number | null => {
  const id = localStorage.getItem('userId')
  return id ? Number(id) : null
}

export const getRoles = (): string[] => {
  const data = localStorage.getItem('roles')
  return data ? JSON.parse(data) : []
}

export const clearAuth = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userId')
}
