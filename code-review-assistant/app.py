"""
Code Review Assistant - Main Flask Application
An AI-powered code review system that analyzes code for structure, readability, and best practices.
"""

import os
import tempfile
from flask import Flask, request, render_template, jsonify, redirect, url_for
from werkzeug.utils import secure_filename
from models.code_analyzer import CodeAnalyzer
from models.llm_integration import LLMIntegration
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Configuration
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['REPORTS_FOLDER'] = 'reports'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['SECRET_KEY'] = 'your-secret-key-here'

# Allowed file extensions
ALLOWED_EXTENSIONS = {
    'py', 'js', 'java', 'cpp', 'c', 'h', 'hpp', 'cs', 'php', 'rb', 'go',
    'rs', 'swift', 'kt', 'scala', 'ts', 'jsx', 'tsx', 'vue', 'html', 'css'
}

def allowed_file(filename):
    """Check if the uploaded file has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def ensure_directories():
    """Ensure upload and reports directories exist."""
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(app.config['REPORTS_FOLDER'], exist_ok=True)

# Initialize components
ensure_directories()
code_analyzer = CodeAnalyzer()
llm_integration = LLMIntegration()

@app.route('/')
def index():
    """Main dashboard page."""
    return render_template('index.html')

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    """Handle file upload and code review."""
    if request.method == 'GET':
        return render_template('upload.html')

    # Check if file is in request
    if 'file' not in request.files:
        return jsonify({'error': 'No file selected'}), 400

    file = request.files['file']

    # Check if file was selected
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    # Validate file type
    if not allowed_file(file.filename):
        return jsonify({'error': 'File type not supported'}), 400

    try:
        # Secure the filename
        filename = secure_filename(file.filename)

        # Save the uploaded file
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # Read file content
        with open(filepath, 'r', encoding='utf-8') as f:
            code_content = f.read()

        # Analyze the code
        analysis_result = code_analyzer.analyze_code(code_content, filename)

        # Get LLM review
        llm_review = llm_integration.get_code_review(code_content, filename)

        # Combine results
        review_result = {
            'filename': filename,
            'analysis': analysis_result,
            'llm_review': llm_review,
            'timestamp': code_analyzer.get_timestamp()
        }

        # Save report
        report_filename = f"review_{filename}_{code_analyzer.get_timestamp()}.json"
        report_path = os.path.join(app.config['REPORTS_FOLDER'], report_filename)

        import json
        with open(report_path, 'w') as f:
            json.dump(review_result, f, indent=2)

        # Clean up uploaded file
        os.remove(filepath)

        return jsonify({'success': True, 'report': review_result})

    except Exception as e:
        logger.error(f"Error processing file: {str(e)}")
        return jsonify({'error': f'Error processing file: {str(e)}'}), 500

@app.route('/review/<filename>')
def view_review(filename):
    """View a specific review report."""
    try:
        report_path = os.path.join(app.config['REPORTS_FOLDER'], filename)
        if not os.path.exists(report_path):
            return jsonify({'error': 'Report not found'}), 404

        import json
        with open(report_path, 'r') as f:
            report_data = json.load(f)

        return render_template('results.html', report=report_data)

    except Exception as e:
        logger.error(f"Error loading report: {str(e)}")
        return jsonify({'error': 'Error loading report'}), 500

@app.route('/api/health')
def health_check():
    """Health check endpoint."""
    return jsonify({'status': 'healthy', 'service': 'Code Review Assistant'})

@app.errorhandler(413)
def too_large(e):
    """Handle file too large error."""
    return jsonify({'error': 'File too large. Maximum size is 16MB.'}), 413

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
