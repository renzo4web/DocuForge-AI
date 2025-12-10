# DocuForge AI 

Transform unstructured documents into structured data using AI. Process handwritten notes, PDFs, or images into JSON, CSV, or TXT formats in 3 simple steps.

## Features

- **Multimodal Document Support**: Upload handwritten notes, PDFs, or images
- **Custom Data Schema**: Define exactly what fields to extract (e.g., titles, dates, summaries)
- **AI-Powered Extraction**: Uses **Gemini 3.0 Pro** multimodal AI for accurate data extraction
- **Export Options**: Download results as JSON, CSV, or plain text

## Installation & Setup

1. Clone repository:
   ```bash
   git clone https://github.com/renzo4web/docuforge-ai.git
   cd docuforge-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm start
   ```

## How It Works

### Step 1: Upload Document
Upload any document type (PDF, image, or scan). Supported formats:
- PDF files
- Images (JPEG/PNG with text)
- Scanned documents

### Step 2: Define Schema
Specify the data fields you want extracted:
- Add custom fields (e.g., "Meeting Notes", "Client ID")
- Choose data types (text, numbers, dates)

### Step 3: Get Results
- AI processes document using **Gemini 3.0 Pro**
- Get structured output in your preferred format:
  - JSON ⚡ (for developers)
  - CSV 📊 (for spreadsheets)
  - TXT 📄 (for quick reading)

## Tech Stack

| Frontend           | Backend/Processing      | Design      |
|--------------------|-------------------------|-------------|
| React (TypeScript) | Gemini 3.0 Pro API     | Tailwind CSS |
| Vite               | Client-side encryption | Lucide Icons |

## Privacy & Security

- **Zero Storage**: Documents processed client-side, never stored on servers
- **Secure Transfer**: End-to-end encrypted API communication
- **Local Processing**: Sensitive data never leaves your device

## Live Demo

[View Deployment](your-deployment-link-here) *(Update after deployment)*

## Contact & Support

- **Documentation**: Click "Documentation" button in the app header
- **Developer**: [Renzo Barrios](https://github.com/renzo4web)
