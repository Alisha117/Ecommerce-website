/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { NextStudio } from 'next-sanity/studio'
import config from '../../../sanity.config'

export const dynamic = 'force-dynamic'

export { metadata, viewport } from 'next-sanity/studio'

export default async function StudioPage() {
  const { userId, sessionClaims } = await auth()

  // User must be logged in
  if (!userId) {
    redirect('/')
  }

  // Check admin role
  const publicMetadata = sessionClaims?.public_metadata as
    | { role?: string }
    | undefined

  const legacyMetadata = sessionClaims?.metadata as
    | { role?: string }
    | undefined

  const role = publicMetadata?.role || legacyMetadata?.role

  // Only admin can access Sanity Studio
  if (role !== 'admin') {
    redirect('/')
  }

  return <NextStudio config={config} />
}
