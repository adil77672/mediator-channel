'use client'

import useSWR from 'swr'

const fetcher = (url: string) =>
  fetch(url).then(async (res) => {
    if (!res.ok) {
      throw new Error('unauthorized')
    }
    return res.json()
  })

export function useSession() {
  const { data, error, isLoading, mutate } = useSWR('/api/auth/me', fetcher, {
    revalidateOnFocus: false
  })

  return {
    user: data?.user,
    loading: isLoading,
    error,
    refresh: mutate
  }
}

