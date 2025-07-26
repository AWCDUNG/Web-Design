// Survey Form - Optimized Version
document.addEventListener('DOMContentLoaded', function() {
    
    const form = document.getElementById('surveyForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Initialize core functionality
    initializeSurvey();
    
    function initializeSurvey() {
        setupFormValidation();
        setupProgressTracking();
        setupFormSubmission();
        setupAutoSave();
    }
    
    // 1. Form Validation
    function setupFormValidation() {
        form.addEventListener('input', function(e) {
            validateField(e.target);
        });
        
        function validateField(field) {
            const fieldGroup = field.closest('.form-group');
            const existingError = fieldGroup.querySelector('.error-message');
            
            // Remove existing error
            if (existingError) {
                existingError.remove();
            }
            
            // Validate required radio groups
            if (field.type === 'radio') {
                const radioGroup = fieldGroup.querySelectorAll('input[type="radio"]');
                const isSelected = Array.from(radioGroup).some(radio => radio.checked);
                
                if (!isSelected) {
                    showFieldError(fieldGroup, 'Please select an option');
                    return false;
                }
            }
            
            return true;
        }
        
        function showFieldError(fieldGroup, message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.cssText = 'color: #e74c3c; font-size: 0.9em; margin-top: 5px;';
            errorDiv.textContent = message;
            fieldGroup.appendChild(errorDiv);
        }
    }
    
    // 2. Progress Tracking
    function setupProgressTracking() {
        createProgressBar();
        
        function createProgressBar() {
            const progressContainer = document.createElement('div');
            progressContainer.className = 'progress-container';
            progressContainer.innerHTML = `
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
                <div class="progress-text">Progress: <span id="progress-percentage">0%</span></div>
            `;
            
            // Add CSS for progress bar
            const style = document.createElement('style');
            style.textContent = `
                .progress-container {
                    position: sticky;
                    top: 0;
                    background: white;
                    padding: 15px 30px;
                    border-bottom: 2px solid #e9ecef;
                    z-index: 100;
                }
                .progress-bar {
                    width: 100%;
                    height: 8px;
                    background: #e9ecef;
                    border-radius: 4px;
                    overflow: hidden;
                    margin-bottom: 10px;
                }
                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #3498db, #2980b9);
                    width: 0%;
                    transition: width 0.3s ease;
                }
                .progress-text {
                    text-align: center;
                    font-weight: 600;
                    color: #2c3e50;
                }
            `;
            document.head.appendChild(style);
            
            form.insertBefore(progressContainer, form.firstChild);
            
            // Update progress on form changes
            form.addEventListener('input', updateProgress);
            updateProgress();
        }
        
        function updateProgress() {
            const totalQuestions = 17; // Number of required radio questions
            const completedQuestions = document.querySelectorAll('input[type="radio"]:checked').length;
            const progress = Math.round((completedQuestions / totalQuestions) * 100);
            
            document.querySelector('.progress-fill').style.width = `${progress}%`;
            document.getElementById('progress-percentage').textContent = `${progress}%`;
        }
    }
    
    // 3. Form Submission
    function setupFormSubmission() {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate required fields
            if (!validateRequiredFields()) {
                alert('Please fill in all required information!');
                return;
            }
            
            // Show loading state
            showLoadingState();
            
            // Process submission
            setTimeout(() => {
                processFormSubmission();
            }, 1500);
        });
        
        function validateRequiredFields() {
            const requiredFields = [
                'userType', 'frequency', 'ui_overall', 'ui_buttons', 
                'response_speed', 'device_compatibility', 'realtime_tracking',
                'alert_system', 'alert_accuracy', 'route_optimization',
                'history_tracking', 'reporting', 'safety_improvement',
                'efficiency', 'recommendation'
            ];
            
            return requiredFields.every(fieldName => {
                const field = form.querySelector(`input[name="${fieldName}"]:checked`);
                return field !== null;
            });
        }
        
        function showLoadingState() {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span style="display: inline-block; animation: spin 1s linear infinite;">⏳</span>
                Processing...
            `;
            
            // Add spinner animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        function processFormSubmission() {
            // Collect form data
            const formData = new FormData(form);
            const responses = {};
            
            for (let [key, value] of formData.entries()) {
                responses[key] = value;
            }
            
            // Calculate satisfaction score
            const satisfactionScore = calculateSatisfactionScore(responses);
            
            // Show results
            showSubmissionResults(satisfactionScore);
            
            // Hide form and show thank you
            form.style.display = 'none';
            document.querySelector('.thank-you').style.display = 'block';
            
            // Clear saved data
            delete window.surveyData;
        }
        
        function calculateSatisfactionScore(responses) {
            const ratingFields = [
                'ui_overall', 'ui_buttons', 'response_speed', 'device_compatibility',
                'realtime_tracking', 'alert_system', 'alert_accuracy', 'route_optimization',
                'history_tracking', 'reporting', 'safety_improvement', 'efficiency'
            ];
            
            let total = 0;
            let count = 0;
            
            ratingFields.forEach(field => {
                if (responses[field]) {
                    total += parseInt(responses[field]);
                    count++;
                }
            });
            
            return count > 0 ? (total / count).toFixed(1) : 0;
        }
        
        function showSubmissionResults(score) {
            const resultDiv = document.createElement('div');
            resultDiv.className = 'submission-results';
            resultDiv.innerHTML = `
                <h3>Survey Results</h3>
                <div class="score-display">
                    <span style="font-size: 2em; font-weight: bold; color: #3498db;">${score}</span>
                    <span style="font-size: 1.2em; color: #7f8c8d;">/ 5.0</span>
                </div>
                <p><strong>${getScoreDescription(score)}</strong></p>
                <p>Thank you for taking the time to evaluate our system!</p>
            `;
            
            resultDiv.style.cssText = `
                background: white;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                margin-bottom: 20px;
                text-align: center;
                border: 2px solid #3498db;
            `;
            
            const thankYouSection = document.querySelector('.thank-you');
            thankYouSection.parentNode.insertBefore(resultDiv, thankYouSection);
        }
        
        function getScoreDescription(score) {
            if (score >= 4.5) return 'Excellent! You are very satisfied with the system.';
            if (score >= 4.0) return 'Good! You are quite satisfied with the system.';
            if (score >= 3.0) return 'Fair! The system meets basic needs.';
            if (score >= 2.0) return 'Needs improvement! There are many areas to enhance.';
            return 'Needs significant improvement! We will strive to do better.';
        }
    }
    
    // 4. Auto-save (Simple version)
    function setupAutoSave() {
        let autoSaveTimer;
        
        form.addEventListener('input', function() {
            clearTimeout(autoSaveTimer);
            autoSaveTimer = setTimeout(saveFormData, 3000);
        });
        
        // Load saved data on page load
        loadFormData();
        
        function saveFormData() {
            const formData = new FormData(form);
            const data = {};
            
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            // Using in-memory storage
            window.surveyData = data;
            showAutoSaveMessage();
        }
        
        function loadFormData() {
            try {
                const savedData = window.surveyData;
                if (savedData) {
                    Object.keys(savedData).forEach(key => {
                        const field = form.querySelector(`[name="${key}"]`);
                        if (field) {
                            if (field.type === 'radio') {
                                const radio = form.querySelector(`input[name="${key}"][value="${savedData[key]}"]`);
                                if (radio) radio.checked = true;
                            } else {
                                field.value = savedData[key];
                            }
                        }
                    });
                }
            } catch (error) {
                console.log('Unable to load saved data');
            }
        }
        
        function showAutoSaveMessage() {
            const message = document.createElement('div');
            message.textContent = '✓ Auto-saved';
            message.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #27ae60;
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                font-size: 0.9em;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            document.body.appendChild(message);
            
            setTimeout(() => message.style.opacity = '1', 100);
            setTimeout(() => {
                message.style.opacity = '0';
                setTimeout(() => message.remove(), 300);
            }, 2000);
        }
    }
    
    console.log('✅ Survey form initialized successfully!');
});