export function safeSessionStorage(): Storage | null {
  try {
    return window.sessionStorage
  } catch {
    return null // Safari modo privado bloqueia sessionStorage
  }
}
