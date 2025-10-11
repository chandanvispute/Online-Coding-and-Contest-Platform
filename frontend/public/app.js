// API Configuration
const API_BASE = 'http://localhost:8080';

// Global State
let currentUser = null;
let problems = [];
let languages = [];
let currentProblem = null;
let submissions = [];

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing app...');
    
    // Wait for DOM to be fully ready
    setTimeout(() => {
        initializeApp();
        setupEventListeners();
        loadInitialData();
    }, 100);
});

function initializeApp() {
    console.log('Initializing app...');
    
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
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            showPage(page);
            updateActiveNavLink(link);
        });
    });
    
    // Authentication buttons
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    
    if (loginBtn) loginBtn.addEventListener('click', () => showModal('login'));
    if (registerBtn) registerBtn.addEventListener('click', () => showModal('register'));
    
    // Modal close buttons
    const closeLogin = document.getElementById('closeLogin');
    const closeRegister = document.getElementById('closeRegister');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    
    if (closeLogin) closeLogin.addEventListener('click', () => hideModal('login'));
    if (closeRegister) closeRegister.addEventListener('click', () => hideModal('register'));
    
    if (showRegister) {
        showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            hideModal('login');
            showModal('register');
        });
    }
    
    if (showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            hideModal('register');
            showModal('login');
        });
    }
    
    // Forms
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    
    // Problem Detail
    const backBtn = document.getElementById('backBtn');
    const runBtn = document.getElementById('runBtn');
    const submitBtn = document.getElementById('submitBtn');
    const debugBtn = document.getElementById('debugBtn');
    const languageSelect = document.getElementById('languageSelect');
    
    if (backBtn) backBtn.addEventListener('click', () => showPage('problems'));
    if (runBtn) runBtn.addEventListener('click', runCode);
    if (submitBtn) submitBtn.addEventListener('click', submitCode);
    if (debugBtn) debugBtn.addEventListener('click', debugAPI);
    if (languageSelect) languageSelect.addEventListener('change', loadBoilerplate);
    
    // Filters
    const difficultyFilter = document.getElementById('difficultyFilter');
    const searchInput = document.getElementById('searchInput');
    
    if (difficultyFilter) difficultyFilter.addEventListener('change', filterProblems);
    if (searchInput) searchInput.addEventListener('input', filterProblems);
    
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
        showToast('Failed to load problems', 'error');
        
        // Show error message in problems list
        const problemsList = document.getElementById('problemsList');
        if (problemsList) {
            problemsList.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Failed to load problems</p>
                    <p>Please check if the backend server is running.</p>
                </div>
            `;
        }
    }
}

async function loadLanguages() {
    try {
        languages = await apiCall('/api/languages');
        renderLanguageOptions();
    } catch (error) {
        console.error('Error loading languages:', error);
        showToast('Failed to load languages', 'error');
    }
}

// Rendering Functions
function renderProblems(problemsToRender) {
    console.log('Rendering problems:', problemsToRender);
    
    const problemsList = document.getElementById('problemsList');
    if (!problemsList) {
        console.error('Problems list element not found!');
        return;
    }
    
    console.log('Problems list element found:', problemsList);
    
    problemsList.innerHTML = '';
    
    if (problemsToRender.length === 0) {
        problemsList.innerHTML = '<div class="no-results">No problems found</div>';
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
        
        problemsList.appendChild(problemCard);
    });
    
    console.log('Problems rendered successfully');
}

function renderLanguageOptions() {
    const languageSelect = document.getElementById('languageSelect');
    if (!languageSelect) return;
    
    languageSelect.innerHTML = '';
    languages.forEach(language => {
        const option = document.createElement('option');
        option.value = language.id;
        option.textContent = language.name;
        languageSelect.appendChild(option);
    });
}

// Page Navigation
function showPage(pageName) {
    console.log('Showing page:', pageName);
    
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    switch (pageName) {
        case 'problems':
            const problemsPage = document.getElementById('problemsPage');
            if (problemsPage) problemsPage.classList.add('active');
            break;
        case 'problemDetail':
            const problemDetailPage = document.getElementById('problemDetailPage');
            if (problemDetailPage) problemDetailPage.classList.add('active');
            break;
        case 'contests':
            const contestsPage = document.getElementById('contestsPage');
            if (contestsPage) contestsPage.classList.add('active');
            break;
        case 'submissions':
            const submissionsPage = document.getElementById('submissionsPage');
            if (submissionsPage) submissionsPage.classList.add('active');
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
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// Modal Functions
function showModal(modalName) {
    const modal = document.getElementById(`${modalName}Modal`);
    if (modal) modal.classList.add('active');
}

function hideModal(modalName) {
    const modal = document.getElementById(`${modalName}Modal`);
    if (modal) modal.classList.remove('active');
}

// Utility Functions
function showLoading(show) {
    const loadingSpinner = document.getElementById('loadingSpinner');
    if (loadingSpinner) {
        loadingSpinner.style.display = show ? 'flex' : 'none';
    }
}

function showToast(message, type = 'info') {
    console.log(`Toast: ${type} - ${message}`);
    
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    }, 3000);
}

// Filter Functions
function filterProblems() {
    const difficultyFilter = document.getElementById('difficultyFilter');
    const searchInput = document.getElementById('searchInput');
    
    if (!difficultyFilter || !searchInput) return;
    
    const difficulty = difficultyFilter.value;
    const searchTerm = searchInput.value.toLowerCase();
    
    const filteredProblems = problems.filter(problem => {
        const matchesDifficulty = !difficulty || problem.difficulty === difficulty;
        const matchesSearch = !searchTerm || problem.title.toLowerCase().includes(searchTerm);
        return matchesDifficulty && matchesSearch;
    });
    
    renderProblems(filteredProblems);
}

// Authentication Functions (simplified)
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
        await apiCall('/api/users/register', {
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

function updateUserInterface() {
    const navUser = document.getElementById('navUser');
    if (!navUser) return;
    
    if (currentUser) {
        navUser.innerHTML = `
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
        const userProfile = navUser.querySelector('.user-profile');
        const userDropdown = document.getElementById('userDropdown');
        if (userProfile && userDropdown) {
            userProfile.addEventListener('click', () => {
                userDropdown.classList.toggle('active');
            });
        }
    } else {
        navUser.innerHTML = `
            <button class="btn-login" id="loginBtn">Login</button>
            <button class="btn-register" id="registerBtn">Register</button>
        `;
        
        // Re-attach event listeners
        const newLoginBtn = document.getElementById('loginBtn');
        const newRegisterBtn = document.getElementById('registerBtn');
        if (newLoginBtn) newLoginBtn.addEventListener('click', () => showModal('login'));
        if (newRegisterBtn) newRegisterBtn.addEventListener('click', () => showModal('register'));
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUserInterface();
    showToast('Logged out successfully', 'info');
    showPage('problems');
}

// Problem Detail Functions
async function loadProblemDetail(problemId) {
    try {
        showLoading(true);
        console.log('Loading problem detail for ID:', problemId);
        
        currentProblem = await apiCall(`/api/problems/${problemId}`);
        console.log('Problem detail loaded:', currentProblem);
        
        renderProblemDetail(currentProblem);
        await loadBoilerplate();
        showPage('problemDetail');
        
    } catch (error) {
        console.error('Error loading problem detail:', error);
        showToast('Failed to load problem details', 'error');
    } finally {
        showLoading(false);
    }
}

function renderProblemDetail(problem) {
    console.log('Rendering problem detail:', problem);
    
    // Update problem header
    const problemTitle = document.getElementById('problemTitle');
    const problemDifficulty = document.getElementById('problemDifficulty');
    
    if (problemTitle) problemTitle.textContent = problem.title;
    if (problemDifficulty) {
        problemDifficulty.textContent = problem.difficulty;
        problemDifficulty.className = `difficulty-badge ${problem.difficulty}`;
    }
    
    // Update problem description
    const problemDescription = document.getElementById('problemDescription');
    if (problemDescription) {
        problemDescription.innerHTML = `
            <div class="problem-description">
                ${problem.description ? problem.description.replace(/\n/g, '<br>') : 'Problem description not available.'}
            </div>
        `;
    }
    
    // Update constraints
    const problemConstraints = document.getElementById('problemConstraints');
    if (problemConstraints) {
        problemConstraints.innerHTML = `
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
    }
    
    // Update examples
    const problemExamples = document.getElementById('problemExamples');
    if (problemExamples) {
        problemExamples.innerHTML = '<div class="examples-section"><h3><i class="fas fa-play-circle"></i> Examples</h3></div>';
        
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
                problemExamples.appendChild(exampleDiv);
            });
        } else {
            problemExamples.innerHTML += '<div class="no-examples">No examples available.</div>';
        }
    }
}

async function loadBoilerplate() {
    if (!currentProblem) return;
    
    const languageSelect = document.getElementById('languageSelect');
    const codeEditor = document.getElementById('codeEditor');
    
    if (!languageSelect || !codeEditor) return;
    
    const selectedLanguageId = languageSelect.value;
    
    try {
        // Check if boilerplate exists in the problem data
        if (currentProblem.boilerplates && currentProblem.boilerplates[selectedLanguageId]) {
            codeEditor.value = currentProblem.boilerplates[selectedLanguageId];
        } else {
            // Try to fetch from API
            const boilerplate = await apiCall(`/api/problems/${currentProblem.id}/boilerplate/${selectedLanguageId}`);
            codeEditor.value = boilerplate || getDefaultBoilerplate(selectedLanguageId);
        }
    } catch (error) {
        // If no boilerplate found, use default
        console.log('Using default boilerplate for language:', selectedLanguageId);
        codeEditor.value = getDefaultBoilerplate(selectedLanguageId);
    }
}

function getDefaultBoilerplate(languageId) {
    const language = languages.find(lang => lang.id == languageId);
    if (!language) return '';
    
    switch (language.name) {
        case 'Java':
            return `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        // Read input here
        
        // Write your solution here
        
        // Print output here
        
        sc.close();
    }
}`;
        case 'Python':
            return `# Read input here

# Write your solution here

# Print output here`;
        case 'C++':
            return `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

int main() {
    // Read input here
    
    // Write your solution here
    
    // Print output here
    
    return 0;
}`;
        default:
            return '// Write your code here';
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
    
    const codeEditor = document.getElementById('codeEditor');
    if (!codeEditor) return;
    
    const code = codeEditor.value.trim();
    if (!code) {
        showToast('Please write some code first', 'error');
        return;
    }
    
    try {
        showLoading(true);
        const testResults = document.getElementById('testResults');
        const resultsContent = document.getElementById('resultsContent');
        
        if (testResults) testResults.style.display = 'block';
        if (resultsContent) {
            resultsContent.innerHTML = '<div class="loading-message"><i class="fas fa-spinner fa-spin"></i> Running sample test cases...</div>';
        }
        
        // Run sample test cases using the API
        const languageSelect = document.getElementById('languageSelect');
        if (!languageSelect) return;
        
        const formData = new URLSearchParams();
        formData.append('problemId', currentProblem.id);
        formData.append('languageId', parseInt(languageSelect.value));
        formData.append('code', code);
        
        const response = await fetch(`${API_BASE}/api/submissions/run-sample`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const sampleResults = await response.json();
        console.log('Sample test results:', sampleResults);
        console.log('Test case results:', sampleResults.testCaseResults);
        
        // Debug each test case
        if (sampleResults.testCaseResults) {
            sampleResults.testCaseResults.forEach((testCase, index) => {
                console.log(`Test Case ${index + 1}:`, {
                    input: testCase.input,
                    expectedOutput: testCase.expectedOutput,
                    actualOutput: testCase.actualOutput,
                    isSample: testCase.isSample,
                    passed: testCase.passed
                });
            });
        }
        
        displaySampleTestResults(sampleResults, resultsContent);
        
        if (sampleResults.status === 'Sample Tests Passed') {
            showToast('✅ All sample test cases passed!', 'success');
        } else {
            showToast(`❌ ${sampleResults.output}`, 'warning');
        }
        
        showLoading(false); // Hide loading after successful execution
        
    } catch (error) {
        const resultsContent = document.getElementById('resultsContent');
        if (resultsContent) {
            resultsContent.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-triangle"></i> Execution failed: ${error.message}</div>`;
        }
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

function displaySampleTestResults(submission, container) {
    if (!container) return;
    
    const testCaseResults = submission.testCaseResults || [];
    const passedCount = submission.passedTestCases || 0;
    const totalCount = submission.totalTestCases || 0;
    const isPassed = submission.status === 'Sample Tests Passed' || submission.status === 'Accepted';
    
    let html = `
        <div class="sample-results-summary ${isPassed ? 'passed' : 'failed'}">
            <div class="summary-header">
                <div class="status-badge ${isPassed ? 'passed' : 'failed'}">
                    <i class="fas fa-${isPassed ? 'check-circle' : 'times-circle'}"></i>
                    ${submission.status}
                </div>
                <div class="success-rate">${submission.successRate?.toFixed(1) || 0}% Success Rate</div>
            </div>
            <div class="summary-stats">
                <div class="stat-item">
                    <i class="fas fa-check-circle"></i>
                    <span>${passedCount}/${totalCount} test cases passed</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-clock"></i>
                    <span>Avg: ${submission.executionTime}ms</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-memory"></i>
                    <span>Max: ${submission.memoryUsed}MB</span>
                </div>
            </div>
        </div>
    `;
    
    if (testCaseResults.length > 0) {
        html += '<div class="test-cases-list">';
        
        testCaseResults.forEach(result => {
            const passed = result.passed;
            const isSample = result.isSample;
            
            html += `
                <div class="test-case-result ${passed ? 'passed' : 'failed'}">
                    <div class="test-case-header">
                        <span class="test-case-title">
                            <i class="fas fa-${isSample ? 'eye' : 'lock'}"></i>
                            ${isSample ? 'Sample' : 'Hidden'} Test Case ${result.testCaseNumber}
                            <span class="test-case-type ${isSample ? 'sample' : 'hidden'}">${isSample ? 'VISIBLE' : 'HIDDEN'}</span>
                        </span>
                        <span class="test-case-status ${passed ? 'passed' : 'failed'}">
                            <i class="fas fa-${passed ? 'check' : 'times'}"></i>
                            ${passed ? 'Passed' : 'Failed'}
                        </span>
                    </div>
                    <div class="test-case-details">
                        <div class="io-section">
                            <div class="input-section">
                                <strong>Input:</strong>
                                <pre class="code-block">${isSample ? (result.input || 'No input provided') : 'Hidden'}</pre>
                            </div>
                            <div class="output-section">
                                <div class="expected-output">
                                    <strong>Expected Output:</strong>
                                    <pre class="code-block expected">${isSample ? (result.expectedOutput || 'No expected output') : 'Hidden'}</pre>
                                </div>
                                <div class="actual-output">
                                    <strong>Your Output:</strong>
                                    <pre class="code-block ${passed ? 'correct' : 'incorrect'}">${isSample ? (result.actualOutput || result.expectedOutput || 'Your code output will appear here') : (passed ? 'Correct' : 'Incorrect')}</pre>
                                </div>
                            </div>
                        </div>
                        <div class="execution-stats">
                            <span><i class="fas fa-clock"></i> ${result.executionTime}ms</span>
                            <span><i class="fas fa-memory"></i> ${result.memoryUsed}MB</span>
                            <span><i class="fas fa-${passed ? 'check-circle' : 'times-circle'}"></i> ${result.status}</span>
                        </div>
                        ${result.error && isSample ? `<div class="error-message"><i class="fas fa-exclamation-triangle"></i> ${result.error}</div>` : ''}
                        ${!isSample && !passed ? `<div class="error-message"><i class="fas fa-exclamation-triangle"></i> Failed on hidden test case</div>` : ''}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
    }
    
    container.innerHTML = html;
}

async function debugAPI() {
    if (!currentProblem) {
        showToast('No problem selected', 'error');
        return;
    }
    
    const testResults = document.getElementById('testResults');
    const resultsContent = document.getElementById('resultsContent');
    
    if (testResults) testResults.style.display = 'block';
    if (resultsContent) {
        resultsContent.innerHTML = '<div class="loading-message"><i class="fas fa-spinner fa-spin"></i> Debugging API...</div>';
    }
    
    try {
        // Test the submission API with simple code
        const submissionData = {
            problemId: currentProblem.id,
            languageId: 1,
            userId: 1,
            code: `public class Solution {
    public static void main(String[] args) {
        System.out.println("0 1");
    }
}`
        };
        
        const response = await fetch(`${API_BASE}/api/submissions/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submissionData)
        });
        
        const result = await response.json();
        console.log('DEBUG - Full API Response:', result);
        
        let debugHtml = `
            <div class="debug-info" style="background: #1a1a1a; padding: 15px; border-radius: 5px; margin: 10px 0;">
                <h3 style="color: #dc3545;">🐛 Debug Information</h3>
                <p><strong>Status:</strong> ${result.status}</p>
                <p><strong>Total Test Cases:</strong> ${result.totalTestCases}</p>
                <p><strong>Passed Test Cases:</strong> ${result.passedTestCases}</p>
                <p><strong>Test Case Results Length:</strong> ${result.testCaseResults ? result.testCaseResults.length : 'null'}</p>
                
                <h4>Raw API Response:</h4>
                <pre style="background: #000; padding: 10px; border-radius: 3px; overflow-x: auto; font-size: 12px;">${JSON.stringify(result, null, 2)}</pre>
            </div>
        `;
        
        if (result.testCaseResults && result.testCaseResults.length > 0) {
            debugHtml += '<h4 style="color: #dc3545;">Test Case Details:</h4>';
            result.testCaseResults.forEach((testCase, index) => {
                debugHtml += `
                    <div style="border: 1px solid #333; margin: 5px 0; padding: 10px; border-radius: 3px;">
                        <p><strong>Test Case ${testCase.testCaseNumber}:</strong></p>
                        <p>Is Sample: ${testCase.isSample}</p>
                        <p>Passed: ${testCase.passed}</p>
                        <p>Input: "${testCase.input}"</p>
                        <p>Expected: "${testCase.expectedOutput}"</p>
                        <p>Actual: "${testCase.actualOutput}"</p>
                        <p>Status: ${testCase.status}</p>
                    </div>
                `;
            });
        }
        
        resultsContent.innerHTML = debugHtml;
        
    } catch (error) {
        resultsContent.innerHTML = `<div style="color: #dc3545; padding: 20px;">Debug Error: ${error.message}</div>`;
    }
}

function displayTestResults(results, container) {
    if (!container || results.length === 0) {
        if (container) container.innerHTML = '<div class="no-results">No test cases available</div>';
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
    
    const codeEditor = document.getElementById('codeEditor');
    const languageSelect = document.getElementById('languageSelect');
    
    if (!codeEditor || !languageSelect) return;
    
    const code = codeEditor.value.trim();
    if (!code) {
        showToast('Please write some code first', 'error');
        return;
    }
    
    try {
        showLoading(true);
        const testResults = document.getElementById('testResults');
        const resultsContent = document.getElementById('resultsContent');
        
        if (testResults) testResults.style.display = 'block';
        if (resultsContent) {
            resultsContent.innerHTML = '<div class="loading-message"><i class="fas fa-spinner fa-spin"></i> Submitting code...</div>';
        }
        
        console.log('Submitting code:', {
            problemId: currentProblem.id,
            languageId: parseInt(languageSelect.value),
            userId: currentUser.id,
            codeLength: code.length
        });
        
        const submission = await apiCall('/api/submissions/submit', {
            method: 'POST',
            body: JSON.stringify({
                problemId: currentProblem.id,
                languageId: parseInt(languageSelect.value),
                code: code,
                userId: currentUser.id
            })
        });
        
        console.log('Submission response:', submission);
        
        // Display actual submission results
        if (resultsContent) {
            displayActualSubmissionResults(submission, resultsContent);
        }
        
        // Show appropriate toast message
        if (submission.status === 'Accepted') {
            showToast('🎉 Solution accepted! All test cases passed!', 'success');
        } else if (submission.status === 'Wrong Answer') {
            showToast(`Wrong Answer: ${submission.testCaseFailed}`, 'warning');
        } else if (submission.status === 'Runtime Error') {
            showToast(`Runtime Error: ${submission.error}`, 'error');
        } else if (submission.status === 'Time Limit Exceeded') {
            showToast('Time Limit Exceeded', 'warning');
        } else {
            showToast(`Submission result: ${submission.status}`, 'info');
        }
        
        // Refresh submissions if on submissions page
        const submissionsPage = document.getElementById('submissionsPage');
        if (submissionsPage && submissionsPage.classList.contains('active')) {
            loadSubmissions();
        }
        
    } catch (error) {
        console.error('Submission error:', error);
        const resultsContent = document.getElementById('resultsContent');
        if (resultsContent) {
            resultsContent.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-triangle"></i> Submission failed: ${error.message}</div>`;
        }
        showToast(`Submission failed: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

function displayActualSubmissionResults(submission, container) {
    if (!container) return;
    
    const isAccepted = submission.status === 'Accepted';
    const testCaseResults = submission.testCaseResults || [];
    const passedCount = submission.passedTestCases || 0;
    const totalCount = submission.totalTestCases || 0;
    
    let html = `
        <div class="submission-summary ${isAccepted ? 'accepted' : 'rejected'}">
            <div class="summary-header">
                <div class="status-badge ${isAccepted ? 'accepted' : 'rejected'}">
                    <i class="fas fa-${isAccepted ? 'check-circle' : 'times-circle'}"></i>
                    ${submission.status}
                </div>
                ${submission.submissionId ? `<div class="submission-id">Submission #${submission.submissionId}</div>` : ''}
            </div>
            <div class="summary-stats">
                <div class="stat-item">
                    <i class="fas fa-check-circle"></i>
                    <span>${passedCount}/${totalCount} test cases passed</span>
                </div>
                ${submission.successRate !== undefined ? `
                <div class="stat-item">
                    <i class="fas fa-percentage"></i>
                    <span>${submission.successRate.toFixed(1)}% success rate</span>
                </div>
                ` : ''}
                ${submission.executionTime ? `
                <div class="stat-item">
                    <i class="fas fa-clock"></i>
                    <span>Avg: ${submission.executionTime}ms</span>
                </div>
                ` : ''}
                ${submission.memoryUsed ? `
                <div class="stat-item">
                    <i class="fas fa-memory"></i>
                    <span>Max: ${submission.memoryUsed}MB</span>
                </div>
                ` : ''}
            </div>
        </div>
    `;
    
    if (isAccepted) {
        html += `
            <div class="success-details">
                <div class="success-message">
                    <i class="fas fa-trophy"></i>
                    <span>🎉 Congratulations! Your solution passed all test cases.</span>
                </div>
            </div>
        `;
    } else {
        html += `
            <div class="error-details">
                <h4><i class="fas fa-exclamation-triangle"></i> Submission Failed</h4>
                ${submission.output ? `<div><strong>Summary:</strong> ${submission.output}</div>` : ''}
                ${submission.error ? `<div><strong>Error:</strong> ${submission.error}</div>` : ''}
                ${submission.testCaseFailed ? `<div><strong>Failed Test Case:</strong> ${submission.testCaseFailed}</div>` : ''}
            </div>
        `;
    }
    
    // Display detailed test case results if available
    if (testCaseResults.length > 0) {
        html += '<div class="detailed-results-section">';
        html += '<h4><i class="fas fa-list"></i> Detailed Test Case Results</h4>';
        html += '<div class="test-cases-list">';
        
        testCaseResults.forEach(result => {
            const passed = result.passed;
            const isSample = result.isSample;
            
            html += `
                <div class="test-case-result ${passed ? 'passed' : 'failed'}">
                    <div class="test-case-header">
                        <span class="test-case-title">
                            <i class="fas fa-${isSample ? 'eye' : 'lock'}"></i>
                            ${isSample ? 'Sample' : 'Hidden'} Test Case ${result.testCaseNumber}
                        </span>
                        <span class="test-case-status ${passed ? 'passed' : 'failed'}">
                            <i class="fas fa-${passed ? 'check' : 'times'}"></i>
                            ${passed ? 'Passed' : 'Failed'}
                        </span>
                    </div>
                    <div class="test-case-details">
                        ${isSample ? `
                        <div class="io-section">
                            <div class="input-section">
                                <strong>Input:</strong>
                                <pre class="code-block">${result.input || 'No input'}</pre>
                            </div>
                            <div class="output-section">
                                <div class="expected-output">
                                    <strong>Expected Output:</strong>
                                    <pre class="code-block expected">${result.expectedOutput}</pre>
                                </div>
                                <div class="actual-output">
                                    <strong>Your Output:</strong>
                                    <pre class="code-block ${passed ? 'correct' : 'incorrect'}">${result.actualOutput || 'No output'}</pre>
                                </div>
                            </div>
                        </div>
                        ` : `
                        <div class="hidden-test-case">
                            <i class="fas fa-lock"></i>
                            <span>Test case details are hidden</span>
                            ${!passed ? `<div class="error-hint">Your output didn't match the expected result</div>` : ''}
                        </div>
                        `}
                        <div class="execution-stats">
                            <span><i class="fas fa-clock"></i> ${result.executionTime}ms</span>
                            <span><i class="fas fa-memory"></i> ${result.memoryUsed}MB</span>
                            <span><i class="fas fa-${passed ? 'check-circle' : 'times-circle'}"></i> ${result.status}</span>
                        </div>
                        ${result.error ? `<div class="error-message"><i class="fas fa-exclamation-triangle"></i> ${result.error}</div>` : ''}
                    </div>
                </div>
            `;
        });
        
        html += '</div></div>';
    }
    
    container.innerHTML = html;
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
    if (!container) return;
    
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
}

async function loadSubmissions() {
    if (!currentUser) {
        const submissionsList = document.getElementById('submissionsList');
        if (submissionsList) {
            submissionsList.innerHTML = '<div class="no-results">Please login to view submissions</div>';
        }
        return;
    }
    
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
            },
            {
                id: 3,
                problemTitle: 'Reverse Integer',
                language: 'Java',
                status: 'Accepted',
                submittedAt: new Date(Date.now() - 7200000).toISOString(),
                runtime: '1ms',
                memory: '38.5MB'
            }
        ];
        renderSubmissions();
    } catch (error) {
        showToast('Failed to load submissions', 'error');
    }
}

function renderSubmissions() {
    const submissionsList = document.getElementById('submissionsList');
    if (!submissionsList) return;
    
    if (submissions.length === 0) {
        submissionsList.innerHTML = '<div class="no-results">No submissions yet</div>';
        return;
    }
    
    let html = '';
    submissions.forEach(submission => {
        const submittedDate = new Date(submission.submittedAt).toLocaleDateString();
        const submittedTime = new Date(submission.submittedAt).toLocaleTimeString();
        
        html += `
            <div class="submission-card">
                <div class="submission-header">
                    <h3 class="submission-problem">${submission.problemTitle}</h3>
                    <span class="submission-status ${submission.status.toLowerCase().replace(' ', '-')}">${submission.status}</span>
                </div>
                <div class="submission-details">
                    <div class="submission-info">
                        <span><i class="fas fa-code"></i> ${submission.language}</span>
                        <span><i class="fas fa-clock"></i> ${submission.runtime}</span>
                        <span><i class="fas fa-memory"></i> ${submission.memory}</span>
                    </div>
                    <div class="submission-date">
                        <i class="fas fa-calendar"></i> ${submittedDate} at ${submittedTime}
                    </div>
                </div>
            </div>
        `;
    });
    
    submissionsList.innerHTML = html;
}