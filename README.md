# 🤖 AI-Powered Code Review Assistant

An intelligent web application that automates code reviews by analyzing source code for structure, readability, security vulnerabilities, and best practices using Large Language Models (LLMs). Built with Flask backend and modern JavaScript frontend.

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-2.3+-green.svg)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5-orange.svg)


## 📋 Table of Contents
- [Features](#features)
- [Demo](#demo)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- 🔍 **Smart Code Analysis** - Advanced parsing with language-specific insights
- 🤖 **AI-Powered Reviews** - Intelligent suggestions using OpenAI GPT-3.5-turbo
- 🛡️ **Security Scanning** - Identify potential vulnerabilities and security issues
- ⚡ **Performance Analysis** - Optimization recommendations for better code efficiency
- 📊 **Detailed Reports** - Comprehensive metrics with actionable insights
- 🌐 **Multi-Language Support** - Python, JavaScript, Java, C++, C#, PHP, Ruby, Go, Rust, TypeScript, and more
- 🎨 **Modern UI** - Responsive design with drag-and-drop file upload
- 💾 **Report Storage** - Save and download analysis reports in JSON format

## 🎥 Demo

[Live Demo](https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/2bd1fdaf0d02304f64827de7e18c9052/fe574afe-3b05-4d77-a121-c48ac3ee3f30/index.html)

## 🏗️ Architecture

```
┌─────────────┐     HTTP      ┌──────────────┐
│   Browser   │ ◄──────────► │ Flask Server │
│  (Frontend) │   REST API    │   (Backend)  │
└─────────────┘               └──────┬───────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
              ┌─────▼─────┐   ┌─────▼──────┐   ┌────▼─────┐
              │   Code    │   │    LLM     │   │  Report  │
              │ Analyzer  │   │Integration │   │ Storage  │
              └───────────┘   └────────────┘   └──────────┘
                                     │
                              ┌──────▼───────┐
                              │  OpenAI API  │
                              │ GPT-3.5-turbo│
                              └──────────────┘
```

## 🛠️ Tech Stack

### Backend
- **Flask** - Python web framework
- **OpenAI SDK** - LLM integration for code analysis
- **Python AST** - Abstract Syntax Tree parsing for Python code
- **Regex Parsers** - Pattern matching for other languages

### Frontend
- **HTML5** - Structure and semantic markup
- **CSS3** - Modern styling with Flexbox and Grid
- **Vanilla JavaScript** - Interactive features without frameworks
- **Font Awesome** - Icon library

### DevOps
- **Gunicorn** - WSGI HTTP server for production
- **python-dotenv** - Environment variable management

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8 or higher** - [Download Python](https://www.python.org/downloads/)
- **pip** - Python package installer (comes with Python)
- **OpenAI API Key** - [Get API Key](https://platform.openai.com/account/api-keys)
- **Git** - [Download Git](https://git-scm.com/downloads) (for cloning repository)

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/code-review-assistant.git
cd code-review-assistant
```

Or download the ZIP file and extract it.

### Step 2: Create Virtual Environment

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

You should see `(venv)` in your terminal prompt.

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- Flask 2.3.3
- openai 0.28.1
- werkzeug 2.3.7
- python-dotenv 1.0.0

### Step 4: Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.template .env
```

Edit the `.env` file and add your OpenAI API key:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your-actual-api-key-here

# Flask Configuration
FLASK_APP=app.py
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-here

# File Upload Configuration
UPLOAD_FOLDER=uploads
REPORTS_FOLDER=reports
```

**Important:** Never commit your `.env` file to version control!

### Step 5: Create Required Directories

```bash
mkdir -p uploads reports static/css static/js templates models
```

### Step 6: Run the Application

```bash
python app.py
```

The server will start on `http://localhost:5001`

**Note:** Port 5001 is used to avoid conflicts with macOS AirPlay Receiver on port 5000.

### Step 7: Access the Application

Open your web browser and navigate to:
```
http://localhost:5001
```

You should see the Code Review Assistant dashboard!

## 📁 Project Structure

```
code-review-assistant/
│
├── app.py                      # Main Flask application
├── config.py                   # Configuration settings
├── requirements.txt            # Python dependencies
├── .env.template              # Environment variables template
├── .gitignore                 # Git ignore rules
├── README.md                  # This file
│
├── models/                    # Backend logic modules
│   ├── __init__.py           # Package initializer
│   ├── code_analyzer.py      # Code parsing and analysis
│   └── llm_integration.py    # OpenAI API integration
│
├── templates/                 # HTML templates
│   ├── base.html             # Base layout template
│   ├── index.html            # Dashboard/homepage
│   ├── upload.html           # File upload interface
│   └── results.html          # Analysis results page
│
├── static/                    # Static assets
│   ├── css/
│   │   └── style.css         # Main stylesheet
│   └── js/
│       ├── script.js         # Main JavaScript
│       └── upload.js         # Upload handling logic
│
├── uploads/                   # Temporary file storage (gitignored)
└── reports/                   # Generated reports (gitignored)
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | Required |
| `FLASK_ENV` | Environment mode | `development` |
| `FLASK_DEBUG` | Enable debug mode | `True` |
| `SECRET_KEY` | Flask secret key | Auto-generated |
| `UPLOAD_FOLDER` | Upload directory | `uploads` |
| `REPORTS_FOLDER` | Reports directory | `reports` |

### Supported File Types

The application supports the following file extensions:

- Python (`.py`)
- JavaScript (`.js`, `.jsx`, `.ts`, `.tsx`)
- Java (`.java`)
- C/C++ (`.c`, `.cpp`, `.h`, `.hpp`)
- C# (`.cs`)
- PHP (`.php`)
- Ruby (`.rb`)
- Go (`.go`)
- Rust (`.rs`)
- Swift (`.swift`)
- Kotlin (`.kt`)
- Scala (`.scala`)
- Vue (`.vue`)
- HTML (`.html`)
- CSS (`.css`)

## 📖 Usage

### Basic Workflow

1. **Navigate to Upload Page**
   - Click "Upload Code" in the navigation menu
   - Or visit `http://localhost:5001/upload`

2. **Select Your Code File**
   - Drag and drop a file into the upload area
   - Or click "Choose File" to browse

3. **Configure Review Options**
   - Select analysis types: Security, Performance, Best Practices
   - Click "Start Analysis"

4. **View Results**
   - Wait for AI analysis (typically 5-10 seconds)
   - Review comprehensive feedback
   - Download report as JSON if needed

### Advanced Features

#### Fallback Mode
If OpenAI API is unavailable, the system automatically provides basic static analysis including:
- Line count metrics
- Code complexity
- Long line detection
- TODO comment tracking

#### Report Storage
All analysis reports are saved in `reports/` directory with timestamps:
```
reports/review_filename_20251021_132500.json
```

## 🔌 API Documentation

### POST /upload

Upload and analyze a code file.

**Request:**
```http
POST /upload HTTP/1.1
Content-Type: multipart/form-data

file: <code_file>
```

**Response:**
```json
{
  "success": true,
  "report": {
    "filename": "example.py",
    "timestamp": "20251021_132500",
    "analysis": {
      "basic_metrics": {
        "total_lines": 100,
        "code_lines": 85,
        "comment_lines": 10,
        "blank_lines": 5,
        "average_line_length": 42.5
      },
      "language_specific": {
        "function_count": 12,
        "class_count": 3,
        "import_count": 8
      }
    },
    "llm_review": {
      "review_text": "Detailed AI analysis...",
      "suggestions": [...],
      "severity_levels": {
        "high": 1,
        "medium": 3,
        "low": 2
      }
    }
  }
}
```

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "Code Review Assistant"
}
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Port 5000 Already in Use (macOS)

**Problem:** AirPlay Receiver uses port 5000

**Solution:**
- The app is configured to use port 5001
- Or disable AirPlay: System Preferences → Sharing → Uncheck "AirPlay Receiver"

#### 2. OpenAI API Key Not Found

**Problem:** `WARNING: OpenAI API key not found`

**Solution:**
```bash
# Ensure .env file exists with your API key
echo "OPENAI_API_KEY=sk-your-key-here" >> .env

# Verify it's loaded
cat .env | grep OPENAI_API_KEY
```

#### 3. Module Not Found Error

**Problem:** `ModuleNotFoundError: No module named 'models'`

**Solution:**
```bash
# Create __init__.py in models directory
touch models/__init__.py

# Verify project structure
ls -la models/
```

#### 4. Template Not Found

**Problem:** `TemplateNotFound: index.html`

**Solution:**
```bash
# Ensure templates directory exists
mkdir -p templates

# Verify templates are present
ls templates/
```

#### 5. File Upload Not Working

**Problem:** Clicking "Start Analysis" does nothing

**Solution:**
- Check browser console for JavaScript errors (F12)
- Verify file size is under 16MB
- Check file extension is supported
- Ensure Flask server is running without errors

#### 6. LibreSSL Warning on macOS

**Problem:** `urllib3 v2 only supports OpenSSL 1.1.1+`

**Solution:**
```bash
# Downgrade urllib3 (optional, warning is harmless)
pip install urllib3==1.26.16
```

### Debug Mode

Enable detailed logging:

```python
# In app.py
import logging
logging.basicConfig(level=logging.DEBUG)
```

Then check terminal output for detailed error messages.

## 🧪 Testing

### Manual Testing

1. **Test Basic Upload**
   ```bash
   # Create a simple test file
   echo "print('Hello World')" > test.py
   # Upload via web interface
   ```

2. **Test Large File Rejection**
   ```bash
   # Create a file > 16MB
   dd if=/dev/zero of=large.py bs=1M count=20
   # Should show error message
   ```

3. **Test Invalid File Type**
   ```bash
   # Try uploading .txt or .pdf
   # Should show "File type not supported"
   ```

### Automated Testing (Future)

```bash
# Install test dependencies
pip install pytest pytest-flask

# Run tests
pytest tests/
```

## 🌐 Deployment

### Production Setup

1. **Use Gunicorn**
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:8000 app:app
   ```

2. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host $host;
       }
   }
   ```

3. **Use Environment Variables**
   ```bash
   export FLASK_ENV=production
   export FLASK_DEBUG=False
   ```

4. **Enable HTTPS**
   - Use Let's Encrypt for free SSL certificates
   - Configure SSL in Nginx

### Docker Deployment

```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5001
CMD ["python", "app.py"]
```

Build and run:
```bash
docker build -t code-review-assistant .
docker run -p 5001:5001 --env-file .env code-review-assistant
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 for Python code
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed



## 🙏 Acknowledgments

- [OpenAI](https://openai.com) for GPT-3.5-turbo API
- [Flask](https://flask.palletsprojects.com) for the web framework
- [Font Awesome](https://fontawesome.com) for icons
- Community contributors and testers


---

**Made with ❤️ by Your Name**

**⭐ Star this repo if you find it helpful!**
