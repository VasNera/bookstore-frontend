import { useEffect } from 'react'

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | BookstoreApp`
    return () => {
      document.title = 'BookstoreApp'
    }
  }, [title])
}