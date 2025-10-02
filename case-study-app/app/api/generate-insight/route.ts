import { NextResponse } from 'next/server'
import { groq } from '@/lib/groqClient'

// Define expected request body
interface InsightRequest {
  data: { name: string }[]
  stats: {
    rowCount: number
    uniqueNames: number
  }
  frequencies: Record<string, number>
}

export async function POST(req: Request) {
  try {
    const { data, stats, frequencies }: InsightRequest = await req.json()

    // Prepare a prompt for the AI
    const prompt = `
You are a data analyst.

Dataset Summary:
- Total rows: ${stats.rowCount}
- Unique names: ${stats.uniqueNames}
- Name frequencies: ${JSON.stringify(frequencies, null, 2)}

Preview of first 20 rows:
${JSON.stringify(data.slice(0, 20), null, 2)}

Task: Provide a detailed analysis highlighting repeated names, patterns, trends, and any insights you can infer from this dataset.
`

    // Call the AI model
    const chat = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile', // recommended free model
      messages: [
        { role: 'system', content: 'You are a helpful data analyst.' },
        { role: 'user', content: prompt },
      ],
    })

    return NextResponse.json({
      insight: chat.choices[0].message?.content || 'No response from AI',
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
