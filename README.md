📄 Social Media Content Analyzer

A web-based application that allows users to upload documents (PDFs, Word files, text files, images) and extracts text using PDF parsing and OCR.
The extracted content is analyzed by an AI model to generate engagement-focused improvements suitable for social media posts.

This project demonstrates real-world skills in:

File processing

OCR

AI model integration

Frontend engineering

API development

Deployment

🌐 Live Demo

Your project is deployed here:

👉 https://social-media-content-analyser-npgmdbrb5.vercel.app

🚀 Features
✅ Multi-format File Upload

Supports the following file types:

PDF (.pdf)

Word Files (.docx)

Text Files (.txt)

Images (.jpg, .jpeg, .png)

✅ Intelligent Text Extraction

PDF text extraction using pdf-parse

Word file text extraction using docx

OCR for images using Tesseract.js

Plain text file reading

✅ AI-Powered Social Media Analysis

After extracting text, the AI suggests:

Better captions

Trending hashtags

Engagement improvements

Tone classification

Readability score

✅ Modern Frontend

Next.js 14 (App Router)

React + TypeScript

Tailwind CSS

Framer Motion animations

Drag-and-drop upload

Clean, responsive interface

🛠️ Tech Stack
Frontend

Next.js 14

React

TypeScript

Tailwind CSS

Framer Motion

React Dropzone

Lucide Icons

Backend

Next.js API Routes

pdf-parse

docx

tesseract.js

OpenAI API

Deployment

Vercel (recommended and used)

📁 Folder Structure
project/
│
├── app/
│   ├── api/
│   │   ├── extract/route.ts   # Text extraction logic
│   │   └── analyze/route.ts   # AI analysis logic
│   ├── page.tsx               # UI
│   └── globals.css
│
├── components/
│   ├── UploadBox.tsx
│   ├── TextPreview.tsx
│   ├── AnalysisResult.tsx
│   └── ui/
│       └── shape-landing-hero.tsx
│
├── public/
├── lib/
│   └── utils.ts
├── .env.example
├── .gitignore
├── package.json
├── tailwind.config.ts
└── README.md

⚙️ How It Works
1️⃣ Upload a file

User can drag & drop or select any supported file.

2️⃣ Text is extracted

Backend API:

Detects file type

Extracts the text (PDF parser / Word parser / OCR)

Cleans and returns the text

3️⃣ AI Analysis

Extracted text is forwarded to an AI model which generates:

Improved caption

Hashtags

Tone

Engagement tips

Readability score

4️⃣ Display results

Frontend animates and displays results cleanly.

▶️ Run Locally
1. Clone the repository
git clone https://github.com/VedantVaidya21/Social-Media.git
cd Social-Media

2. Install dependencies
npm install

3. Add environment variables

Create .env file:

OPENAI_API_KEY=your_key_here

4. Start development server
npm run dev


Project opens at:
👉 http://localhost:3000

🧪 Testing Instructions

Upload any of these:

PDF with paragraphs

DOCX file

A screenshot with text (OCR test)

Text post in .txt file

Verify:

Extracted text accuracy

AI suggestions

Formatting

Loading states

☁️ Deployment

Easiest method: Vercel

Steps:

npm i -g vercel
vercel
vercel --prod


Set OPENAI_API_KEY in Vercel Environment Variables.

👤 Author

Vedant Vaidya
