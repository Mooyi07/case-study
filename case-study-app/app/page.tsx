'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Home() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('test').select('*')
      setData(data || [])
    }
    fetchData()
  }, [])

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">Case Study App 🚀</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  )
}
