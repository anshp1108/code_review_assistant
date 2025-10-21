// Upload Page JavaScript - Code Review Assistant

document.addEventListener('DOMContentLoaded', function() {
    initializeUpload();
});

function initializeUpload() {
    setupFileUpload();
    setupFormSubmission();
    setupDragAndDrop();
}

function setupFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const dropZone = document.getElementById('dropZone');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const removeFileBtn = document.getElementById('removeFile');
    const submitBtn = document.getElementById('submitBtn');

    if (!fileInput) return;

    fileInput.addEventListener('change', handleFileSelect);
    removeFileBtn?.addEventListener('click', clearFile);

    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            displayFileInfo(file);
            enableSubmitButton();
        }
    }

    function displayFileInfo(file) {
        if (fileName) {
            fileName.textContent = file.name;
        }

        // Hide upload area and show file info
        const uploadContent = dropZone.querySelector('.upload-content');
        if (uploadContent) {
            uploadContent.style.display = 'none';
        }
        if (fileInfo) {
            fileInfo.style.display = 'flex';
        }

        // Validate file
        if (!validateFile(file)) {
            clearFile();
            return;
        }
    }

    function clearFile() {
        fileInput.value = '';

        // Show upload area and hide file info
        const uploadContent = dropZone.querySelector('.upload-content');
        if (uploadContent) {
            uploadContent.style.display = 'block';
        }
        if (fileInfo) {
            fileInfo.style.display = 'none';
        }

        disableSubmitButton();
    }

    function enableSubmitButton() {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-disabled');
        }
    }

    function disableSubmitButton() {
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add('btn-disabled');
        }
    }
}

function setupDragAndDrop() {
    const dropZone = document.getElementById('dropZone');
    if (!dropZone) return;

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop zone when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    // Handle dropped files
    dropZone.addEventListener('drop', handleDrop, false);

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(e) {
        dropZone.classList.add('drag-over');
    }

    function unhighlight(e) {
        dropZone.classList.remove('drag-over');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;

        if (files.length > 0) {
            const fileInput = document.getElementById('fileInput');
            fileInput.files = files;

            // Trigger change event
            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);
        }
    }
}

function setupFormSubmission() {
    const form = document.getElementById('uploadForm');
    const loadingSection = document.getElementById('loadingSection');
    const errorSection = document.getElementById('errorSection');
    const errorMessage = document.getElementById('errorMessage');
    const retryBtn = document.getElementById('retryBtn');

    if (!form) return;

    form.addEventListener('submit', handleFormSubmit);
    retryBtn?.addEventListener('click', hideError);

    async function handleFormSubmit(e) {
        e.preventDefault();

        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];

        if (!file) {
            showError('Please select a file to upload.');
            return;
        }

        if (!validateFile(file)) {
            return;
        }

        // Show loading state
        showLoading();

        // Prepare form data
        const formData = new FormData();
        formData.append('file', file);

        // Add options
        const options = form.querySelectorAll('input[type="checkbox"]:checked');
        options.forEach(option => {
            formData.append(option.name, 'true');
        });

        try {
            // Simulate progress steps
            updateProgressStep(1);

            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            updateProgressStep(2);

            const result = await response.json();

            updateProgressStep(3);

            if (response.ok && result.success) {
                updateProgressStep(4);

                // Show success and redirect
                setTimeout(() => {
                    showNotification('Code review completed successfully!', 'success');
                    // You could redirect to results page or display results inline
                    displayResults(result.report);
                }, 1000);
            } else {
                throw new Error(result.error || 'Upload failed');
            }

        } catch (error) {
            console.error('Upload error:', error);
            showError(error.message || 'An error occurred while processing your file.');
            hideLoading();
        }
    }

    function showLoading() {
        form.style.display = 'none';
        if (loadingSection) {
            loadingSection.style.display = 'block';
        }
        hideError();
    }

    function hideLoading() {
        form.style.display = 'block';
        if (loadingSection) {
            loadingSection.style.display = 'none';
        }
        resetProgressSteps();
    }

    function showError(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
        }
        if (errorSection) {
            errorSection.style.display = 'block';
        }
        hideLoading();
    }

    function hideError() {
        if (errorSection) {
            errorSection.style.display = 'none';
        }
    }

    function updateProgressStep(step) {
        const steps = document.querySelectorAll('.progress-step');
        steps.forEach((stepEl, index) => {
            if (index < step) {
                stepEl.classList.add('active');
            }
        });
    }

    function resetProgressSteps() {
        const steps = document.querySelectorAll('.progress-step');
        steps.forEach((stepEl, index) => {
            if (index > 0) {
                stepEl.classList.remove('active');
            }
        });
    }
}

function validateFile(file) {
    const maxSize = 16 * 1024 * 1024; // 16MB
    const allowedTypes = [
        'py', 'js', 'java', 'cpp', 'c', 'h', 'hpp', 'cs', 'php', 'rb', 'go',
        'rs', 'swift', 'kt', 'scala', 'ts', 'jsx', 'tsx', 'vue', 'html', 'css'
    ];

    // Check file size
    if (file.size > maxSize) {
        showNotification('File is too large. Maximum size is 16MB.', 'error');
        return false;
    }

    // Check file type
    const extension = file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(extension)) {
        showNotification(`File type '.${extension}' is not supported.`, 'error');
        return false;
    }

    return true;
}

function displayResults(report) {
    // Create a results display or redirect to results page
    // For now, let's create a simple inline display
    const resultsHTML = createResultsHTML(report);

    const container = document.querySelector('.upload-section');
    if (container) {
        container.innerHTML = resultsHTML;
    }
}

function createResultsHTML(report) {
    return `
        <div class="results-container">
            <h2><i class="fas fa-check-circle"></i> Analysis Complete</h2>
            <div class="results-summary">
                <div class="summary-card">
                    <h3>File: ${report.filename}</h3>
                    <p>Total Lines: ${report.analysis.basic_metrics.total_lines}</p>
                    <p>Code Lines: ${report.analysis.basic_metrics.code_lines}</p>
                    <p>Functions: ${report.analysis.language_specific.function_count || 0}</p>
                </div>

                <div class="review-preview">
                    <h3>AI Review Summary</h3>
                    <div class="review-text">
                        ${report.llm_review.error ? 
                            `<p class="error">Error: ${report.llm_review.error}</p>` :
                            `<p>${report.llm_review.review_text.substring(0, 300)}...</p>`
                        }
                    </div>
                </div>
            </div>

            <div class="action-buttons">
                <button onclick="downloadReport()" class="btn btn-primary">
                    <i class="fas fa-download"></i> Download Full Report
                </button>
                <a href="/upload" class="btn btn-secondary">
                    <i class="fas fa-upload"></i> Review Another File
                </a>
            </div>
        </div>
    `;
}

// Make functions available globally
window.uploadFile = {
    validateFile,
    displayResults
};

function showNotification(message, type) {
    if (window.CodeReviewApp) {
        window.CodeReviewApp.showNotification(message, type);
    }
}

function downloadReport() {
    // This would be implemented to download the current report
    showNotification('Download functionality would be implemented here.', 'info');
}