/**
 * Form Handler Class
 * Handles contact form submissions and validation
 */
class FormHandler {
    constructor(formId = 'contactForm') {
        this.form = document.getElementById(formId);
        if (!this.form) {
            // Try alternative form ID
            this.form = document.getElementById('quoteForm');
        }
        
        if (this.form) {
            this.statusDiv = this.form.querySelector('.form-status') || document.getElementById('formStatus');
            this.apiEndpoint = '/api/send-email';
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.setupValidation();
    }

    setupValidation() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;

        // Check required fields
        if (field.hasAttribute('required') && !value) {
            isValid = false;
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
        }

        // Phone validation (if value exists)
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\d\s\-\(\)\+]+$/;
            isValid = phoneRegex.test(value);
        }

        // Date validation (if value exists) - prevent past dates
        if (field.type === 'date' && value) {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            isValid = selectedDate >= today;
        }

        // Update field styling
        if (!isValid) {
            field.classList.add('error');
            field.style.borderColor = 'var(--error)';
        } else {
            field.classList.remove('error');
            field.style.borderColor = '';
        }

        return isValid;
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Validate form
        if (!this.validateForm()) {
            this.showStatus('error', 'Please fill in all required fields correctly.');
            return;
        }

        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());

        // Show loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                this.showStatus('success', result.message || 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.');
                this.form.reset();
                
                // Track conversion (if you use analytics)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submission', {
                        'event_category': 'contact',
                        'event_label': 'contact_form'
                    });
                }
            } else {
                this.showStatus('error', result.error || 'Something went wrong. Please try again or contact us directly.');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showStatus('error', 'Network error. Please check your connection and try again.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    showStatus(type, message) {
        this.statusDiv.className = `form-status ${type}`;
        this.statusDiv.textContent = message;
        this.statusDiv.style.display = 'block';

        // Auto-hide after 7 seconds
        setTimeout(() => {
            this.statusDiv.style.display = 'none';
        }, 7000);

        // Scroll to status message
        this.statusDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

/**
 * Assessment Form Handler
 * Specific handler for the premium assessment form
 */
class AssessmentHandler {
    constructor() {
        this.form = document.getElementById('assessmentForm');
        this.statusDiv = document.getElementById('assessmentStatus');
        this.endpoint = '/api/submit-assessment';
        this.selectedFiles = []; // Store selected files
        
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add visual selection for bite cards
        const biteOptions = this.form.querySelectorAll('input[name="biteType"]');
        biteOptions.forEach(option => {
            option.addEventListener('change', () => {
                // Remove selected class from all cards
                document.querySelectorAll('.bite-card').forEach(card => {
                    card.classList.remove('selected');
                    card.style.borderColor = 'transparent';
                    card.style.transform = '';
                    card.style.boxShadow = '';
                });
                
                // Add selected class to checked card
                if (option.checked) {
                    const card = option.parentElement.querySelector('.bite-card');
                    card.classList.add('selected');
                    // Inline styles for immediate feedback
                    card.style.borderColor = 'var(--primary)';
                    card.style.transform = 'translateY(-5px)';
                    card.style.boxShadow = '0 10px 25px rgba(89, 144, 174, 0.4)';
                }
            });
        });

        // Additive File Upload UI
        const fileInput = document.getElementById('smilePhoto');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files.length > 0) {
                    Array.from(e.target.files).forEach(file => {
                        // Prevent duplicates based on name and size
                        if (!this.selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
                            this.selectedFiles.push(file);
                        }
                    });
                    this.renderPreviews();
                    // Reset input to allow selecting the same file again if needed (or more files)
                    fileInput.value = '';
                }
            });
        }
    }

    renderPreviews() {
        const container = document.getElementById('imagePreviews');
        if (!container) return;

        container.innerHTML = ''; // Clear current previews

        this.selectedFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const item = document.createElement('div');
                item.className = 'preview-item';
                
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = file.name;
                
                const removeBtn = document.createElement('div');
                removeBtn.className = 'preview-remove';
                removeBtn.innerHTML = '×';
                removeBtn.onclick = () => {
                    this.selectedFiles.splice(index, 1);
                    this.renderPreviews();
                };
                
                item.appendChild(img);
                item.appendChild(removeBtn);
                container.appendChild(item);
            };
            reader.readAsDataURL(file);
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        
        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Analyzing... <span class="spinner"></span>';
            
            const formData = new FormData(this.form);
            
            // Remove the file input field from FormData (it might be empty or contain only last selection)
            formData.delete('smilePhotos');
            
            // Append all selected files
            this.selectedFiles.forEach(file => {
                formData.append('smilePhotos', file);
            });
            
            // Send FormData directly (multipart/form-data)
            const response = await fetch(this.endpoint, {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (response.ok) {
                this.showStatus('success', 'Assessment received! We will be in touch shortly with your results.');
                this.form.reset();
                this.selectedFiles = []; // Clear files
                this.renderPreviews(); // Clear previews
                
                // Reset visual selection
                document.querySelectorAll('.bite-card').forEach(card => {
                    card.classList.remove('selected');
                    card.style.borderColor = 'transparent';
                    card.style.transform = '';
                    card.style.boxShadow = '';
                });
            } else {
                throw new Error(result.error || 'Submission failed');
            }
            
        } catch (error) {
            console.error('Assessment Error:', error);
            this.showStatus('error', error.message || 'Something went wrong. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = originalText;
        }
    }

    showStatus(type, message) {
        if (!this.statusDiv) return;
        
        this.statusDiv.className = `form-status ${type}`;
        this.statusDiv.textContent = message;
        this.statusDiv.style.display = 'block';
        this.statusDiv.style.padding = '15px';
        this.statusDiv.style.borderRadius = '8px';
        this.statusDiv.style.textAlign = 'center';
        
        if (type === 'success') {
            this.statusDiv.style.backgroundColor = 'rgba(16, 185, 129, 0.2)';
            this.statusDiv.style.color = '#10b981';
            this.statusDiv.style.border = '1px solid #10b981';
        } else {
            this.statusDiv.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
            this.statusDiv.style.color = '#ef4444';
            this.statusDiv.style.border = '1px solid #ef4444';
        }
        
        setTimeout(() => {
            this.statusDiv.style.display = 'none';
        }, 5000);
    }
}


// Initialize when DOM is ready
const initHandlers = () => {
    new FormHandler();
    new AssessmentHandler();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHandlers);
} else {
    initHandlers();
}
