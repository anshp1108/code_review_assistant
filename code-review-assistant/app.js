// Sample data for demonstrations
const sampleData = {
  languages: {
    python: {
      name: "Python",
      extension: ".py",
      icon: "🐍",
      sample_code: `def calculate_fibonacci(n):
    if n <= 1:
        return n
    else:
        return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

# Usage
for i in range(10):
    print(calculate_fibonacci(i))`
    },
    javascript: {
      name: "JavaScript",
      extension: ".js",
      icon: "🟨",
      sample_code: `function validateEmail(email) {
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

document.getElementById('submit').onclick = function() {
    var email = document.getElementById('email').value;
    if (!validateEmail(email)) {
        alert('Invalid email!');
    }
}`
    },
    java: {
      name: "Java",
      extension: ".java",
      icon: "☕",
      sample_code: `public class Calculator {
    public static void main(String[] args) {
        Calculator calc = new Calculator();
        System.out.println(calc.add(5, 3));
    }
    
    public int add(int a, int b) {
        return a + b;
    }
}`
    }
  },
  
  reviews: {
    python: {
      filename: "fibonacci.py",
      language: "Python",
      size: "240 bytes",
      metrics: {
        total_lines: 8,
        code_lines: 6,
        comment_lines: 1,
        functions: 1,
        complexity: "Medium"
      },
      issues: {
        high: 1,
        medium: 2,
        low: 1
      },
      suggestions: [
        "Consider using memoization to optimize the recursive Fibonacci calculation",
        "Add input validation to handle negative numbers",
        "Include type hints for better code documentation",
        "Consider using iterative approach for better performance"
      ],
      review_text: `**Code Structure Analysis:**
The code implements a classic recursive Fibonacci function. While functionally correct, there are several areas for improvement.

**Performance Issues:**
- The recursive implementation has exponential time complexity O(2^n)
- No memoization leads to redundant calculations
- For large inputs, this will cause stack overflow

**Best Practice Recommendations:**
- Add type hints: \`def calculate_fibonacci(n: int) -> int:\`
- Implement input validation for edge cases
- Consider iterative or memoized approach for better performance
- Add docstring to explain the function's purpose`
    },
    
    javascript: {
      filename: "email_validation.js",
      language: "JavaScript",
      size: "320 bytes",
      metrics: {
        total_lines: 10,
        code_lines: 8,
        comment_lines: 0,
        functions: 1,
        complexity: "Low"
      },
      issues: {
        high: 0,
        medium: 3,
        low: 2
      },
      suggestions: [
        "Use const instead of var for better scoping",
        "Add null checks before accessing DOM elements",
        "Consider using more user-friendly error handling",
        "Implement proper event listener management"
      ],
      review_text: `**Code Quality Assessment:**
This JavaScript code provides basic email validation functionality. The implementation is straightforward but could benefit from modern JS practices.

**Security & Reliability:**
- Email regex is reasonable but could be more robust
- Missing null checks for DOM elements could cause runtime errors
- No error handling for edge cases

**Modern JavaScript Improvements:**
- Replace \`var\` with \`const\` for immutable variables
- Use arrow functions for cleaner syntax
- Implement proper event delegation
- Add input sanitization and validation feedback`
    },
    
    java: {
      filename: "Calculator.java",
      language: "Java",
      size: "180 bytes",
      metrics: {
        total_lines: 9,
        code_lines: 7,
        comment_lines: 0,
        functions: 2,
        complexity: "Low"
      },
      issues: {
        high: 0,
        medium: 1,
        low: 2
      },
      suggestions: [
        "Add JavaDoc comments for public methods",
        "Consider using more descriptive variable names",
        "Implement error handling for potential overflow",
        "Add unit tests for validation"
      ],
      review_text: `**Code Structure Analysis:**
This Java code demonstrates a basic calculator class with simple addition functionality. The structure is clean but minimal.

**Documentation & Best Practices:**
- Missing JavaDoc comments for public methods
- Class and method structure follows Java conventions
- No input validation or error handling

**Improvement Recommendations:**
- Add comprehensive documentation
- Implement input validation and exception handling
- Consider expanding functionality with more operations
- Add unit tests to verify correct behavior`
    }
  }
};

// Global variables for state management
let currentAnalysis = null;
let analysisProgress = 0;
let progressInterval = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeEventListeners();
  showSection('home');
});

function initializeEventListeners() {
  // Upload tab switching
  const uploadTabs = document.querySelectorAll('.upload-tab');
  uploadTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      switchUploadTab(this.dataset.tab);
    });
  });
  
  // File input handling
  const fileInput = document.getElementById('fileInput');
  const dropZone = document.getElementById('dropZone');
  
  fileInput.addEventListener('change', handleFileUpload);
  
  // Drag and drop functionality
  dropZone.addEventListener('dragover', handleDragOver);
  dropZone.addEventListener('dragleave', handleDragLeave);
  dropZone.addEventListener('drop', handleFileDrop);
  dropZone.addEventListener('click', () => fileInput.click());
}

function showSection(sectionName) {
  // Hide all sections
  const sections = ['home', 'features', 'demo', 'results'];
  sections.forEach(section => {
    const element = document.getElementById(section);
    if (element) {
      element.classList.add('hidden');
    }
  });
  
  // Show the target section
  const targetSection = document.getElementById(sectionName);
  if (targetSection) {
    targetSection.classList.remove('hidden');
  }
  
  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showDemo() {
  showSection('demo');
  // Reset demo state
  document.getElementById('loading').classList.add('hidden');
  document.getElementById('results').classList.add('hidden');
}

function showFeatures() {
  showSection('features');
}

function switchUploadTab(tabName) {
  // Update tab styling
  document.querySelectorAll('.upload-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  
  // Show/hide panels
  document.querySelectorAll('.upload-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  document.getElementById(`${tabName}-panel`).classList.add('active');
}

function handleDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
}

function handleFileDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    processFile(files[0]);
  }
}

function handleFileUpload(e) {
  const file = e.target.files[0];
  if (file) {
    processFile(file);
  }
}

function processFile(file) {
  // Determine language from file extension
  const extension = '.' + file.name.split('.').pop().toLowerCase();
  let language = 'unknown';
  
  // Map extensions to languages
  const extensionMap = {
    '.py': 'python',
    '.js': 'javascript', 
    '.java': 'java',
    '.cpp': 'cpp',
    '.ts': 'javascript', // Use JavaScript analysis for TypeScript
    '.rb': 'python'     // Use Python-style analysis for Ruby
  };
  
  language = extensionMap[extension] || 'javascript';
  
  // Start analysis simulation
  startAnalysis(file.name, language);
}

function selectSample(language) {
  const sample = sampleData.languages[language];
  if (sample) {
    // Create a mock file name
    const fileName = language === 'python' ? 'fibonacci.py' : 
                    language === 'javascript' ? 'email_validation.js' :
                    'Calculator.java';
    
    startAnalysis(fileName, language);
  }
}

function startAnalysis(fileName, language) {
  // Hide demo section and show loading
  document.querySelector('.upload-section').style.display = 'none';
  document.getElementById('loading').classList.remove('hidden');
  
  // Reset progress
  analysisProgress = 0;
  updateProgress();
  
  // Simulate analysis steps
  const steps = [
    { message: "Parsing file structure...", duration: 800 },
    { message: "Analyzing code patterns...", duration: 1200 },
    { message: "Running security scans...", duration: 1000 },
    { message: "Generating AI insights...", duration: 1500 },
    { message: "Compiling report...", duration: 700 }
  ];
  
  let currentStep = 0;
  
  function runAnalysisStep() {
    if (currentStep < steps.length) {
      const step = steps[currentStep];
      document.getElementById('loadingStatus').textContent = step.message;
      
      // Simulate progress for this step
      const stepProgress = (currentStep + 1) / steps.length * 100;
      animateProgressTo(stepProgress, step.duration);
      
      setTimeout(() => {
        currentStep++;
        runAnalysisStep();
      }, step.duration);
    } else {
      // Analysis complete - show results
      setTimeout(() => {
        showAnalysisResults(fileName, language);
      }, 500);
    }
  }
  
  runAnalysisStep();
}

function animateProgressTo(targetProgress, duration) {
  const startProgress = analysisProgress;
  const progressDiff = targetProgress - startProgress;
  const startTime = Date.now();
  
  function updateProgressAnimation() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const currentProgress = startProgress + (progressDiff * progress);
    analysisProgress = currentProgress;
    updateProgress();
    
    if (progress < 1) {
      requestAnimationFrame(updateProgressAnimation);
    }
  }
  
  updateProgressAnimation();
}

function updateProgress() {
  document.getElementById('progressFill').style.width = analysisProgress + '%';
  document.getElementById('progressText').textContent = Math.round(analysisProgress) + '%';
}

function showAnalysisResults(fileName, language) {
  // Hide loading and show results
  document.getElementById('loading').classList.add('hidden');
  document.getElementById('results').classList.remove('hidden');
  
  // Get review data for the language
  const reviewData = sampleData.reviews[language] || sampleData.reviews.javascript;
  
  // Update file information
  document.getElementById('fileName').textContent = fileName;
  document.getElementById('fileLanguage').textContent = reviewData.language;
  document.getElementById('fileSize').textContent = reviewData.size;
  
  // Update metrics
  document.getElementById('totalLines').textContent = reviewData.metrics.total_lines;
  document.getElementById('codeLines').textContent = reviewData.metrics.code_lines;
  document.getElementById('functions').textContent = reviewData.metrics.functions;
  document.getElementById('complexity').textContent = reviewData.metrics.complexity;
  
  // Update issues
  document.getElementById('highIssues').textContent = reviewData.issues.high;
  document.getElementById('mediumIssues').textContent = reviewData.issues.medium;
  document.getElementById('lowIssues').textContent = reviewData.issues.low;
  
  // Update review content
  const reviewContent = document.getElementById('reviewContent');
  reviewContent.innerHTML = formatReviewText(reviewData.review_text);
  
  // Update suggestions
  const suggestionsList = document.getElementById('suggestionsList');
  suggestionsList.innerHTML = '';
  
  reviewData.suggestions.forEach((suggestion, index) => {
    const suggestionItem = document.createElement('div');
    suggestionItem.className = 'suggestion-item';
    suggestionItem.innerHTML = `
      <div class="suggestion-icon">💡</div>
      <p class="suggestion-text">${suggestion}</p>
    `;
    suggestionsList.appendChild(suggestionItem);
  });
  
  // Store current analysis
  currentAnalysis = {
    fileName,
    language,
    reviewData
  };
  
  // Scroll to results
  document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

function formatReviewText(text) {
  // Convert markdown-style formatting to HTML
  return text
    .replace(/\*\*(.*?)\*\*/g, '<h4>$1</h4>')
    .replace(/- (.*?)\n/g, '<li>$1</li>\n')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.)/g, '<p>$1')
    .replace(/(.)$/g, '$1</p>')
    .replace(/<p><h4>/g, '<h4>')
    .replace(/<\/h4><\/p>/g, '</h4>')
    .replace(/<p>(<li>.*?<\/li>\n?)+<\/p>/gs, (match) => {
      const items = match.replace(/<\/?p>/g, '');
      return `<ul>${items}</ul>`;
    });
}

function downloadReport() {
  if (!currentAnalysis) return;
  
  const report = generateReport(currentAnalysis);
  const blob = new Blob([report], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `code-review-${currentAnalysis.fileName.replace(/\.[^/.]+$/, '')}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function generateReport(analysis) {
  const { fileName, language, reviewData } = analysis;
  
  return `
CODE REVIEW REPORT
==================

File: ${fileName}
Language: ${language}
Generated: ${new Date().toLocaleString()}

METRICS
-------
Total Lines: ${reviewData.metrics.total_lines}
Code Lines: ${reviewData.metrics.code_lines}
Functions: ${reviewData.metrics.functions}
Complexity: ${reviewData.metrics.complexity}

ISSUES SUMMARY
--------------
High Priority: ${reviewData.issues.high}
Medium Priority: ${reviewData.issues.medium}
Low Priority: ${reviewData.issues.low}

AI REVIEW
---------
${reviewData.review_text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/`([^`]+)`/g, '$1')}

SUGGESTIONS
-----------
${reviewData.suggestions.map((suggestion, index) => `${index + 1}. ${suggestion}`).join('\n')}

---
Generated by CodeReview AI
`;
}

function shareResults() {
  if (!currentAnalysis) return;
  
  // Create shareable summary
  const summary = `🔍 Code Review Results for ${currentAnalysis.fileName}:\n\n` +
    `📊 Metrics: ${currentAnalysis.reviewData.metrics.total_lines} lines, ` +
    `${currentAnalysis.reviewData.metrics.functions} functions\n` +
    `🚨 Issues: ${currentAnalysis.reviewData.issues.high} high, ` +
    `${currentAnalysis.reviewData.issues.medium} medium, ` +
    `${currentAnalysis.reviewData.issues.low} low\n\n` +
    `Generated by CodeReview AI`;
  
  // Use Web Share API if available, otherwise copy to clipboard
  if (navigator.share) {
    navigator.share({
      title: 'Code Review Results',
      text: summary,
      url: window.location.href
    }).catch(console.error);
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(summary).then(() => {
      // Show temporary notification
      showNotification('Results copied to clipboard!');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = summary;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showNotification('Results copied to clipboard!');
    });
  }
}

function showNotification(message) {
  // Create and show a temporary notification
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--color-primary);
    color: var(--color-btn-primary-text);
    padding: var(--space-12) var(--space-16);
    border-radius: var(--radius-base);
    box-shadow: var(--shadow-lg);
    z-index: 1000;
    font-weight: var(--font-weight-medium);
    animation: slideIn 0.3s ease-out;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in forwards';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Add CSS for notification animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(notificationStyles);

// Smooth scrolling for navigation links
document.addEventListener('click', function(e) {
  const link = e.target.closest('a[href^="#"]');
  if (link) {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
});