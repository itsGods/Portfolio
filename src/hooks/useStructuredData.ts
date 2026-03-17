import { useEffect } from 'react'

export const useStructuredData = (schema: object | object[]): void => {
  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = 'structured-data'
    script.textContent = JSON.stringify(schema)
    document.head.appendChild(script)
    return () => {
      document.getElementById('structured-data')?.remove()
    }
  }, [schema])
}
