// Form action state shape. Lives outside the "use server" module because a
// server-actions file may export async functions only.
export type FormState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  errors?: Record<string, string>
}

export const emptyFormState: FormState = { status: 'idle' }
