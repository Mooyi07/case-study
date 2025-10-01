'use client'
import { useState } from 'react'
import Papa from 'papaparse'
import { supabase } from '@/lib/supabaseClient'

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (!file) return
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results: any) => {
        const data = results.data
        console.log('Parsed CSV:', data)

        // Insert into Supabase
        const { error } = await supabase.from('test').insert(data)
        if (error) {
          setMessage(`Error: ${error.message}`)
        } else {
          setMessage('Data uploaded successfully! Generating report...')

          // 🔄 Trigger report generation API
          try {
            const res = await fetch('/api/generate-report', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ table: 'test' }), // or your table name
            })

            const result = await res.json()
            if (res.ok) {
              setMessage(
                `Report generated! Rows: ${result.rowCount}, Unique Names: ${result.uniqueNames}`
              )
            } else {
              setMessage(`Report error: ${result.error}`)
            }
          } catch (err: any) {
            setMessage(`Failed to generate report: ${err.message}`)
          }
        }
      },
    })
  }

  return (
    <div className="p-4 border rounded-md space-y-2">
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Upload CSV
      </button>
      <p>{message}</p>
    </div>
  )
}
