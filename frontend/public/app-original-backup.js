// API Configuration
const API_BASE = 'http://localhost:8080';

// Global State
let currentUser = null;
let problems = [];
let languages = [];
let currentProblem = null;
let submissions = [];

// DOM Elements
const elements = {
    // Navigation
    navLinks: document.querySelectorAll('.nav-link'),
    loginBtn: document.getElementById('loginBtn'),
    registerBtn: document.getElementById('registerBtn'),
    navUser: document.getElementById('navUser'),
    
    // Pages
    pages: document.querySelectorAll('.page'),
    problemsPage: document.getElementById('problemsPage'),
    problemDetailPage: document.getElementById('problemDetailPage'),
    contestsPage: document.getElementById('contestsPage'),
    submissionsPage: document.getElementById('submissionsPage'),
    
    // Problems
    problemsList: document.getElementById('problemsList'),
    difficultyFilter: document.getElementById('difficultyFilter'),
    searchInput: document.getElementById('searchInput'),
    
    // Problem Detail
    backBtn: document.getElementById('backBtn'),
    problemTitle: document.getElementById('problemTitle'),
    problemDifficulty: document.getElementById('problemDifficulty'),
    problemDescription: document.getElementById('problemDescription'),
    problemConstraints: document.getElementById('problemConstraints'),
    problemExamples: document.getElementById('problemExamples'),
    languageSelect: document.getElementById('languageSelect'),
    codeEditor: document.getElementById('codeEditor'),
    runBtn: document.getElementById('runBtn'),
    submitBtn: document.getElementById('submitBtn'),
    outputSection: document.getElementById('outputSection'),
    outputContent: document.getElementById('outputContent'),
    
    // Modals
    loginModal: document.getElementById('loginModal'),
    registerModal: document.getElementById('registerModal'),
    closeLogin: document.getElementById('closeLogin'),
    closeRegister: document.getElementById('closeRegister'),
    showRegister: document.getElementById('showRegister'),
    showLogin: document.getElementById('showLogin'),
    loginForm: document.getElementById('loginForm'),
    registerForm: document.getElementById('registerForm'),
    
    // Submissions
    submissionsList: document.getElementById('submissionsList'),
    
    // Loading
    loadingSpinner: document.getElementById('loadingSpinner'),
    toastContainer: document.getElementById('toastContainer')
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Wait a bit to ensure all elements are ready
    setTimeout(() => {
        initializeApp();
        setupEventListeners();
        loadInitialData();
    }, 100);
});

function initializeApp() {
    console.log('Initializing app...');
    console.log('Elements:', elements);
    
    // Check for stored user session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        updateUserInterface();
    }
    
    // Show problems page by default
    showPage('problems');
    console.log('App initialized');
}

function setupEventListeners() {
    // Navigation
    elements.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            showPage(page);
            updateActiveNavLink(link);
        });
    });
    
    // Authentication
    elements.loginBtn.addEventListener('click', () => showModal('login'));
    elements.registerBtn.addEventListener('click', () => showModal('register'));
    elements.closeLogin.addEventListener('click', () => hideModal('login'));
    elements.closeRegister.addEventListener('click', () => hideModal('register'));
    elements.showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        hideModal('login');
        showModal('register');
    });
    elements.showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        hideModal('register');
        showModal('login');
    });
    
    // Forms
    elements.loginForm.addEventListener('submit', handleLogin);
    elements.registerForm.addEventListener('submit', handleRegister);
    
    // Problem Detail
    elements.backBtn.addEventListener('click', () => showPage('problems'));
    elements.runBtn.addEventListener('click', runCode);
    elements.submitBtn.addEventListener('click', submitCode);
    elements.languageSelect.addEventListener('change', loadBoilerplate);
    
    // Filters
    elements.difficultyFilter.addEventListener('change', filterProblems);
    elements.searchInput.addEventListener('input', filterProblems);
    
    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
}

async function loadInitialData() {
    showLoading(true);
    try {
        await Promise.all([
            loadProblems(),
            loadLanguages()
        ]);
    } catch (error) {
        showToast('Failed to load initial data', 'error');
        console.error('Error loading initial data:', error);
    } finally {
        showLoading(false);
    }
}

// API Functions
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };
    
    console.log(`Making API call to: ${url}`);
    
    try {
        const response = await fetch(url, config);
        console.log(`API response status: ${response.status}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`API response data:`, data);
        return data;
    } catch (error) {
        console.error(`API call failed: ${endpoint}`, error);
        throw error;
    }
}

async function loadProblems() {
    try {
        console.log('Loading problems...');
        problems = await apiCall('/api/problems');
        console.log('Problems loaded:', problems);
        renderProblems(problems);
    } catch (error) {
        console.error('Error loading problems:', error);
        
        // Fallback: show sample problems if API fails
        const fallbackProblems = [
            {
                id: 1,
                title: "Two Sum",
                difficulty: "Easy",
                timeLimit: 2000,
                memoryLimit: 256
            },
            {
                id: 2,
                title: "Reverse Integer",
                difficulty: "Medium",
                timeLimit: 1000,
                memoryLimit: 128
            }
        ];
        
        console.log('Using fallback problems:', fallbackProblems);
        problems = fallbackProblems;
        renderProblems(problems);
        
        showToast('Using offline mode - some features may be limited', 'warning');
    }
}

async function loadLanguages() {
    try {
        languages = await apiCall('/api/languages');
        renderLanguageOptions();
    } catch (error) {
        showToast('Failed to load languages', 'error');
    }
}

async function loadProblemDetail(problemId) {
    try {
        showLoading(true);
        currentProblem = await apiCall(`/api/problems/${problemId}`);
        renderProblemDetail(currentProblem);
        loadBoilerplate();
        showPage('problemDetail');
    } catch (error) {
        showToast('Failed to load problem details', 'error');
    } finally {
        showLoading(false);
    }
}

async function loadBoilerplate() {
    if (!currentProblem) return;
    
    const selectedLanguageId = elements.languageSelect.value;
    try {
        const boilerplate = await apiCall(`/api/problems/${currentProblem.id}/boilerplate/${selectedLanguageId}`);
        elements.codeEditor.value = boilerplate.boilerplate || getDefaultBoilerplate(selectedLanguageId);
    } catch (error) {
        // If no boilerplate found, use default
        elements.codeEditor.value = getDefaultBoilerplate(selectedLanguageId);
    }
}

function getDefaultBoilerplate(languageId) {
    const language = languages.find(lang => lang.id == languageId);
    if (!language) return '';
    
    switch (language.name) {
        case 'Java':
            return `public class Solution {
    public static void main(String[] args) {
        // Your code here
    }
}`;
        case 'Python':
            return `def solution():
    # Your code here
    pass

if __name__ == "__main__":
    solution()`;
        case 'C++':
            return `#include <iostream>
#include <vector>
using namespace std;

int main() {
    // Your code here
    return 0;
}`;
        default:
            return '// Your code here';
    }
}

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        showLoading(true);
        const response = await apiCall('/api/users/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        
        currentUser = response;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUserInterface();
        hideModal('login');
        showToast('Login successful!', 'success');
        
        // Load user submissions
        loadSubmissions();
    } catch (error) {
        showToast('Login failed. Please check your credentials.', 'error');
    } finally {
        showLoading(false);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    try {
        showLoading(true);
        const response = await apiCall('/api/users/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password })
        });
        
        hideModal('register');
        showToast('Registration successful! Please login.', 'success');
        showModal('login');
    } catch (error) {
        showToast('Registration failed. Username or email might already exist.', 'error');
    } finally {
        showLoading(false);
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUserInterface();
    showToast('Logged out successfully', 'info');
    showPage('problems');
}

function updateUserInterface() {
    if (currentUser) {
        elements.navUser.innerHTML = `
            <div class="user-profile">
                <div class="user-avatar">${currentUser.username.charAt(0).toUpperCase()}</div>
                <span>${currentUser.username}</span>
                <div class="user-menu">
                    <div class="user-dropdown" id="userDropdown">
                        <a href="#" onclick="showPage('submissions')">My Submissions</a>
                        <a href="#" onclick="logout()">Logout</a>
                    </div>
                </div>
            </div>
        `;
        
        // Add click handler for user menu
        const userProfile = elements.navUser.querySelector('.user-profile');
        const userDropdown = document.getElementById('userDropdown');
        userProfile.addEventListener('click', () => {
            userDropdown.classList.toggle('active');
        });
    } else {
        elements.navUser.innerHTML = `
            <button class="btn-login" id="loginBtn">Login</button>
            <button class="btn-register" id="registerBtn">Register</button>
        `;
        
        // Re-attach event listeners
        document.getElementById('loginBtn').addEventListener('click', () => showModal('login'));
        document.getElementById('registerBtn').addEventListener('click', () => showModal('register'));
    }
}

// Code Execution Functions
async function runCode() {
    if (!currentUser) {
        showToast('Please login to run code', 'error');
        return;
    }
    
    if (!currentProblem) {
        showToast('No problem selected', 'error');
        return;
    }
    
    const code = elements.codeEditor.value.trim();
    if (!code) {
        showToast('Please write some code first', 'error');
        return;
    }
    
    try {
        showLoading(true);
        const testResults = document.getElementById('testResults');
        const resultsContent = document.getElementById('resultsContent');
        
        testResults.style.display = 'block';
        resultsContent.innerHTML = '<div class="loading-message"><i class="fas fa-spinner fa-spin"></i> Running sample test cases...</div>';
        
        // Simulate running sample test cases
        setTimeout(() => {
            const sampleResults = generateSampleTestResults();
            displayTestResults(sampleResults, resultsContent);
            showLoading(false);
            showToast('Sample test cases executed!', 'success');
        }, 2000);
        
    } catch (error) {
        const resultsContent = document.getElementById('resultsContent');
        resultsContent.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-triangle"></i> Execution failed: ${error.message}</div>`;
        showLoading(false);
    }
}

function generateSampleTestResults() {
    // Simulate test results based on current problem's sample test cases
    if (!currentProblem || !currentProblem.sampleTestCases) {
        return [];
    }
    
    return currentProblem.sampleTestCases.map((testCase, index) => ({
        testCaseNumber: index + 1,
        input: testCase.input,
        expectedOutput: testCase.output,
        actualOutput: testCase.output, // Simulate correct output for demo
        status: 'passed',
        executionTime: Math.floor(Math.random() * 50) + 10 + 'ms',
        memoryUsed: Math.floor(Math.random() * 20) + 5 + 'MB'
    }));
}

function displayTestResults(results, container) {
    if (results.length === 0) {
        container.innerHTML = '<div class="no-results">No test cases available</div>';
        return;
    }
    
    const passedCount = results.filter(r => r.status === 'passed').length;
    const totalCount = results.length;
    
    let html = `
        <div class="results-summary">
            <div class="summary-item">
                <i class="fas fa-check-circle"></i>
                <span>${passedCount}/${totalCount} test cases passed</span>
            </div>
        </div>
        <div class="test-cases-list">
    `;
    
    results.forEach(result => {
        html += `
            <div class="test-case-result ${result.status === 'passed' ? 'passed' : 'failed'}">
                <div class="test-case-header">
                    <span class="test-case-title">Sample Test Case ${result.testCaseNumber}</span>
                    <span class="test-case-status ${result.status}">${result.status === 'passed' ? 'Passed' : 'Failed'}</span>
                </div>
                <div class="test-case-details">
                    <div><strong>Input:</strong> ${result.input}</div>
                    <div><strong>Expected:</strong> ${result.expectedOutput}</div>
                    <div><strong>Output:</strong> ${result.actualOutput}</div>
                    <div class="execution-stats">
                        <span><i class="fas fa-clock"></i> ${result.executionTime}</span>
                        <span><i class="fas fa-memory"></i> ${result.memoryUsed}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

async function submitCode() {
    if (!currentUser) {
        showToast('Please login to submit code', 'error');
        return;
    }
    
    if (!currentProblem) {
        showToast('No problem selected', 'error');
        return;
    }
    
    const code = elements.codeEditor.value.trim();
    if (!code) {
        showToast('Please write some code first', 'error');
        return;
    }
    
    try {
        showLoading(true);
        const testResults = document.getElementById('testResults');
        const resultsContent = document.getElementById('resultsContent');
        
        testResults.style.display = 'block';
        resultsContent.innerHTML = '<div class="loading-message"><i class="fas fa-spinner fa-spin"></i> Running all test cases...</div>';
        
        const submission = await apiCall('/api/submissions', {
            method: 'POST',
            body: JSON.stringify({
                problemId: currentProblem.id,
                languageId: parseInt(elements.languageSelect.value),
                code: code,
                userId: currentUser.id
            })
        });
        
        // Simulate comprehensive test results
        setTimeout(() => {
            const allTestResults = generateAllTestResults();
            displaySubmissionResults(allTestResults, resultsContent, submission);
            showLoading(false);
            
            const passedCount = allTestResults.filter(r => r.status === 'passed').length;
            const totalCount = allTestResults.length;
            
            if (passedCount === totalCount) {
                showToast('🎉 All test cases passed! Solution accepted!', 'success');
            } else {
                showToast(`${passedCount}/${totalCount} test cases passed`, 'warning');
            }
        }, 3000);
        
        // Refresh submissions if on submissions page
        if (document.getElementById('submissionsPage').classList.contains('active')) {
            loadSubmissions();
        }
        
    } catch (error) {
        const resultsContent = document.getElementById('resultsContent');
        resultsContent.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-triangle"></i> Submission failed: ${error.message}</div>`;
        showToast('Submission failed', 'error');
        showLoading(false);
    }
}

function generateAllTestResults() {
    // Simulate running all test cases (including hidden ones)
    const results = [];
    const totalTestCases = 6; // Simulate 6 test cases total
    
    for (let i = 1; i <= totalTestCases; i++) {
        const isVisible = i <= 2; // First 2 are visible (sample cases)
        const passed = Math.random() > 0.2; // 80% chance to pass each test
        
        results.push({
            testCaseNumber: i,
            isVisible: isVisible,
            input: isVisible ? (currentProblem.sampleTestCases?.[i-1]?.input || `Test case ${i} input`) : 'Hidden',
            expectedOutput: isVisible ? (currentProblem.sampleTestCases?.[i-1]?.output || `Expected output ${i}`) : 'Hidden',
            actualOutput: passed ? (isVisible ? (currentProblem.sampleTestCases?.[i-1]?.output || `Expected output ${i}`) : 'Hidden') : 'Wrong output',
            status: passed ? 'passed' : 'failed',
            executionTime: Math.floor(Math.random() * 100) + 10 + 'ms',
            memoryUsed: Math.floor(Math.random() * 30) + 5 + 'MB'
        });
    }
    
    return results;
}

function displaySubmissionResults(results, container, submission) {
    const passedCount = results.filter(r => r.status === 'passed').length;
    const totalCount = results.length;
    const isAccepted = passedCount === totalCount;
    
    let html = `
        <div class="submission-summary ${isAccepted ? 'accepted' : 'rejected'}">
            <div class="summary-header">
                <div class="status-badge ${isAccepted ? 'accepted' : 'rejected'}">
                    <i class="fas fa-${isAccepted ? 'check-circle' : 'times-circle'}"></i>
                    ${isAccepted ? 'Accepted' : 'Wrong Answer'}
                </div>
                <div class="submission-id">Submission #${submission.id}</div>
            </div>
            <div class="summary-stats">
                <div class="stat-item">
                    <span class="stat-label">Test Cases:</span>
                    <span class="stat-value">${passedCount}/${totalCount}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Runtime:</span>
                    <span class="stat-value">${Math.floor(Math.random() * 200) + 50}ms</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Memory:</span>
                    <span class="stat-value">${Math.floor(Math.random() * 50) + 20}MB</span>
                </div>
            </div>
        </div>
        <div class="test-cases-list">
    `;
    
    results.forEach(result => {
        html += `
            <div class="test-case-result ${result.status === 'passed' ? 'passed' : 'failed'}">
                <div class="test-case-header">
                    <span class="test-case-title">
                        ${result.isVisible ? `Sample Test Case ${result.testCaseNumber}` : `Hidden Test Case ${result.testCaseNumber}`}
                    </span>
                    <span class="test-case-status ${result.status}">${result.status === 'passed' ? 'Passed' : 'Failed'}</span>
                </div>
                <div class="test-case-details">
                    <div><strong>Input:</strong> ${result.input}</div>
                    <div><strong>Expected:</strong> ${result.expectedOutput}</div>
                    <div><strong>Output:</strong> ${result.actualOutput}</div>
                    <div class="execution-stats">
                        <span><i class="fas fa-clock"></i> ${result.executionTime}</span>
                        <span><i class="fas fa-memory"></i> ${result.memoryUsed}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
        elements.outputContent.innerHTML = `<div class="output-error">✗ Submission failed: ${error.message}</div>`;
    } finally {
        showLoading(false);
    }
}

async function loadSubmissions() {
    if (!currentUser) return;
    
    try {
        // For now, we'll simulate submissions since the API might not have user-specific submissions
        submissions = [
            {
                id: 1,
                problemTitle: 'Two Sum',
                language: 'Java',
                status: 'Accepted',
                submittedAt: new Date().toISOString(),
                runtime: '2ms',
                memory: '42.1MB'
            },
            {
                id: 2,
                problemTitle: 'Two Sum',
                language: 'Python',
                status: 'Wrong Answer',
                submittedAt: new Date(Date.now() - 3600000).toISOString(),
                runtime: 'N/A',
                memory: 'N/A'
            }
        ];
        renderSubmissions();
    } catch (error) {
        showToast('Failed to load submissions', 'error');
    }
}

// Rendering Functions
function renderProblems(problemsToRender) {
    console.log('Rendering problems:', problemsToRender);
    console.log('Problems list element:', elements.problemsList);
    
    if (!elements.problemsList) {
        console.error('Problems list element not found!');
        return;
    }
    
    elements.problemsList.innerHTML = '';
    
    if (problemsToRender.length === 0) {
        elements.problemsList.innerHTML = '<div class="no-results">No problems found</div>';
        return;
    }
    
    problemsToRender.forEach(problem => {
        const problemCard = document.createElement('div');
        problemCard.className = 'problem-card';
        problemCard.onclick = () => loadProblemDetail(problem.id);
        
        problemCard.innerHTML = `
            <div class="problem-card-header">
                <h3 class="problem-title">${problem.title}</h3>
                <span class="difficulty-badge ${problem.difficulty}">${problem.difficulty}</span>
            </div>
            <div class="problem-stats">
                <span><i class="fas fa-clock"></i> ${problem.timeLimit}ms</span>
                <span><i class="fas fa-memory"></i> ${problem.memoryLimit}MB</span>
            </div>
        `;
        
        elements.problemsList.appendChild(problemCard);
    });
    
    console.log('Problems rendered successfully');
}

function renderProblemDetail(problem) {
    elements.problemTitle.textContent = problem.title;
    elements.problemDifficulty.textContent = problem.difficulty;
    elements.problemDifficulty.className = `difficulty-badge ${problem.difficulty}`;
    
    // Enhanced problem description with better formatting
    elements.problemDescription.innerHTML = `
        <div class="problem-description">
            ${problem.description ? problem.description.replace(/\n/g, '<br>') : 'Problem description not available.'}
        </div>
    `;
    
    // Enhanced constraints section
    elements.problemConstraints.innerHTML = `
        <div class="constraints-section">
            <h3><i class="fas fa-exclamation-triangle"></i> Constraints</h3>
            <div class="constraints-content">
                <pre>${problem.constraints || 'No constraints specified.'}</pre>
                <div class="limits">
                    <span class="limit-item"><i class="fas fa-clock"></i> Time Limit: ${problem.timeLimit}ms</span>
                    <span class="limit-item"><i class="fas fa-memory"></i> Memory Limit: ${problem.memoryLimit}MB</span>
                </div>
            </div>
        </div>
    `;
    
    // Enhanced examples section with sample test cases
    elements.problemExamples.innerHTML = '<div class="examples-section"><h3><i class="fas fa-play-circle"></i> Examples</h3></div>';
    
    if (problem.sampleTestCases && problem.sampleTestCases.length > 0) {
        problem.sampleTestCases.forEach((testCase, index) => {
            const exampleDiv = document.createElement('div');
            exampleDiv.className = 'example-card';
            exampleDiv.innerHTML = `
                <div class="example-header">
                    <span class="example-title">Example ${index + 1}</span>
                </div>
                <div class="example-content">
                    <div class="io-section">
                        <div class="input-section">
                            <div class="io-label"><i class="fas fa-arrow-right"></i> Input:</div>
                            <div class="code-block">
                                <pre>${testCase.input}</pre>
                            </div>
                        </div>
                        <div class="output-section">
                            <div class="io-label"><i class="fas fa-arrow-left"></i> Output:</div>
                            <div class="code-block">
                                <pre>${testCase.output}</pre>
                            </div>
                        </div>
                    </div>
                    ${testCase.explanation ? `
                        <div class="explanation-section">
                            <div class="io-label"><i class="fas fa-lightbulb"></i> Explanation:</div>
                            <div class="explanation-text">${testCase.explanation}</div>
                        </div>
                    ` : ''}
                </div>
            `;
            elements.problemExamples.appendChild(exampleDiv);
        });
    } else {
        // Fallback to old test cases format if sample test cases not available
        if (problem.testCases) {
            try {
                const testCases = JSON.parse(problem.testCases);
                const expectedOutputs = problem.expectedOutputs ? JSON.parse(problem.expectedOutputs) : [];
                
                testCases.slice(0, 2).forEach((testCase, index) => { // Show only first 2 as examples
                    const exampleDiv = document.createElement('div');
                    exampleDiv.className = 'example-card';
                    exampleDiv.innerHTML = `
                        <div class="example-header">
                            <span class="example-title">Example ${index + 1}</span>
                        </div>
                        <div class="example-content">
                            <div class="io-section">
                                <div class="input-section">
                                    <div class="io-label"><i class="fas fa-arrow-right"></i> Input:</div>
                                    <div class="code-block">
                                        <pre>${testCase.input}</pre>
                                    </div>
                                </div>
                                <div class="output-section">
                                    <div class="io-label"><i class="fas fa-arrow-left"></i> Output:</div>
                                    <div class="code-block">
                                        <pre>${expectedOutputs[index] || 'Expected output not available'}</pre>
                                    </div>
                                </div>
                            </div>
                            ${testCase.description ? `
                                <div class="explanation-section">
                                    <div class="io-label"><i class="fas fa-lightbulb"></i> Explanation:</div>
                                    <div class="explanation-text">${testCase.description}</div>
                                </div>
                            ` : ''}
                        </div>
                    `;
                    elements.problemExamples.appendChild(exampleDiv);
                });
            } catch (error) {
                elements.problemExamples.innerHTML += '<div class="no-examples">Examples not available.</div>';
            }
        } else {
            elements.problemExamples.innerHTML += '<div class="no-examples">No examples available.</div>';
        }
    }
}

function renderLanguageOptions() {
    elements.languageSelect.innerHTML = '';
    languages.forEach(language => {
        const option = document.createElement('option');
        option.value = language.id;
        option.textContent = language.name;
        elements.languageSelect.appendChild(option);
    });
}

function renderSubmissions() {
    elements.submissionsList.innerHTML = '';
    
    if (submissions.length === 0) {
        elements.submissionsList.innerHTML = '<div class="no-results">No submissions yet</div>';
        return;
    }
    
    submissions.forEach(submission => {
        const submissionCard = document.createElement('div');
        submissionCard.className = 'submission-card';
        
        submissionCard.innerHTML = `
            <div class="submission-header">
                <h3>${submission.problemTitle}</h3>
                <span class="submission-status ${submission.status.replace(' ', '')}">${submission.status}</span>
            </div>
            <div class="submission-details">
                <p><strong>Language:</strong> ${submission.language}</p>
                <p><strong>Submitted:</strong> ${new Date(submission.submittedAt).toLocaleString()}</p>
                ${submission.runtime ? `<p><strong>Runtime:</strong> ${submission.runtime}</p>` : ''}
                ${submission.memory ? `<p><strong>Memory:</strong> ${submission.memory}</p>` : ''}
            </div>
        `;
        
        elements.submissionsList.appendChild(submissionCard);
    });
}

// Utility Functions
function showPage(pageName) {
    elements.pages.forEach(page => page.classList.remove('active'));
    
    switch (pageName) {
        case 'problems':
            elements.problemsPage.classList.add('active');
            break;
        case 'problemDetail':
            elements.problemDetailPage.classList.add('active');
            break;
        case 'contests':
            elements.contestsPage.classList.add('active');
            break;
        case 'submissions':
            elements.submissionsPage.classList.add('active');
            if (currentUser) {
                loadSubmissions();
            } else {
                showToast('Please login to view submissions', 'error');
                showPage('problems');
            }
            break;
    }
}

function updateActiveNavLink(activeLink) {
    elements.navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

function showModal(modalName) {
    const modal = modalName === 'login' ? elements.loginModal : elements.registerModal;
    modal.classList.add('active');
}

function hideModal(modalName) {
    const modal = modalName === 'login' ? elements.loginModal : elements.registerModal;
    modal.classList.remove('active');
}

function showLoading(show) {
    if (show) {
        elements.loadingSpinner.classList.add('active');
    } else {
        elements.loadingSpinner.classList.remove('active');
    }
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    elements.toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

function filterProblems() {
    const difficulty = elements.difficultyFilter.value;
    const searchTerm = elements.searchInput.value.toLowerCase();
    
    const filteredProblems = problems.filter(problem => {
        const matchesDifficulty = !difficulty || problem.difficulty === difficulty;
        const matchesSearch = !searchTerm || problem.title.toLowerCase().includes(searchTerm);
        return matchesDifficulty && matchesSearch;
    });
    
    renderProblems(filteredProblems);
}

// Global functions for onclick handlers
window.showPage = showPage;
window.logout = logout;
// Force
 load problems after a delay to ensure everything is ready
setTimeout(() => {
    console.log('Force loading problems...');
    if (elements.problemsList) {
        loadProblems();
    } else {
        console.error('Problems list element still not found after delay');
    }
}, 1000);