📄 Social Media Content Analyzer

The Social Media Content Analyzer is a web application that allows users to upload documents (PDFs, Word files, images, and text files), extract readable text from them, and generate AI-powered suggestions to improve social media engagement.
This project demonstrates real-world problem-solving skills across file processing, OCR, API integration, and frontend engineering.

🚀 Features
1. Multi-Format File Upload

Supports uploading the following:

PDF files (.pdf)

Word documents (.docx)

Images (.jpg, .jpeg, .png)

Text files (.txt)

2. Text Extraction

PDF Parsing using pdf-parse

OCR for Images using tesseract.js

DOCX Extraction using docx

Plain text reading for .txt files

3. AI-Powered Analysis

Generates:

Engagement improvement suggestions

Better captions

Trending hashtags

Tone analysis

Readability score

4. Modern UI

Clean, responsive interface

Drag-and-drop upload area

Loading indicators

Error handling

Smooth animations using Framer Motion

🛠 Tech Stack
Frontend

Next.js 14 (App Router)

TypeScript

Tailwind CSS

Framer Motion

React Dropzone

Lucide Icons

Backend

Next.js API Routes

pdf-parse

tesseract.js

docx

OpenAI API / LLM integration

📁 Folder Structure
project/
│
├── app/
│   ├── api/
│   │   ├── extract/route.ts
│   │   └── analyze/route.ts
│   ├── page.tsx
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
├── package.json
├── tailwind.config.ts
└── README.md

⚙️ How It Works
1. Upload File

User uploads a document via drag-and-drop or file picker.

2. Text Extraction

Backend determines file type:

.pdf → extracted using pdf-parse

.docx → read using docx parser

.txt → read directly

Image → OCR using Tesseract

Text is returned as JSON.

3. AI Analysis

The extracted text is sent to the analysis API, which uses an AI model to generate insights and suggestions.

4. Display Results

A clean UI displays:

Improved captions

Hashtags

Engagement tips

Tone

Readability score

▶️ Running the Project Locally
1. Clone the Repository
git clone https://github.com/VedantVaidya21/Social-Media.git
cd Social-Media

2. Install Dependencies
npm install

3. Add Environment Variables

Create .env file:

OPENAI_API_KEY=your_key_here

4. Start Development Server
npm run dev


Project runs at:
👉 http://localhost:3000

🧪 Testing

Upload sample files:

PDF with text

Screenshot of a quote (OCR test)

DOCX document

Plain text file

Verify extracted text + AI analysis.

📦 Deployment

Easily deployable on Vercel (recommended).
Environment variables must be set in project settings.

👨‍💻 Author

Vedant Vaidya
Simply open [Lovable](https://lovable.dev/projects/716b22b4-9e76-4aee-85e5-83bb6444a35a) and click on Share -> Publish
