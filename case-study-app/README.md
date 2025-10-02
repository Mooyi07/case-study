# 📊 Case Study App – CSV Upload & AI Insight 🚀

This project is a **Next.js + Supabase + Recharts** dashboard that allows you to:

- Upload CSV files
- Parse and clean the data with PapaParse
- Store data in Supabase
- Display the uploaded records in a styled table
- Generate insights using AI (via `/api/generate-insight`)
- Visualize name frequencies with interactive bar charts

---

## 🛠️ Tech Stack

- **Next.js (App Router)** – Frontend framework
- **Supabase** – Database & authentication
- **PapaParse** – CSV parsing
- **Recharts** – Data visualization
- **Tailwind CSS** – UI styling

---

## ⚙️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/case-study-app.git
   cd case-study-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the project root with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```
app/
  components/
    FileUpload.tsx     # Handles CSV upload, parsing, charting, insights
  page.tsx             # Dashboard layout (data display + upload panel)
  api/
    generate-insight/  # AI insight API route
lib/
  supabaseClient.ts    # Supabase client config
public/
  ...
README.md              # You're here
```

---

## 🖼️ Features

- **Dashboard Layout:** Split into two halves
  - Left: Database records + report
  - Right: File upload & AI insights
- **Table View:** Displays `id` and `name` columns from CSV
- **Bar Chart:** Frequency of names (using Recharts)
- **Styled File Input:** Custom file picker with Tailwind
- **AI Insight:** Summarizes uploaded data

---

## 🚀 Deployment

This app works out-of-the-box with **Vercel**.

```bash
npm run build
npm run start
```

---

## ✅ To-Do / Future Improvements

- Add support for multiple CSV schemas
- Add authentication (Supabase Auth)
- Export insights to PDF
- Improve AI insight with deeper analytics
