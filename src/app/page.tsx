import { redirect } from 'next/navigation'

import { getCurrentUser, homePathFor } from '@/lib/dal'

/**
 * The root has no page of its own: an admin belongs on the dashboard, a member
 * on their open loans, and anyone else on the login form.
 */
export default async function Home() {
  const user = await getCurrentUser()
  redirect(user ? homePathFor(user.role) : '/login')
}
