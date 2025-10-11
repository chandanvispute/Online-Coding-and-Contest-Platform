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
    const languageSelect = document.getElementById('languageSelect');
    
    if (backBtn) backBtn.addEventListener('click', () => showPage('problems'));
    if (runBtn) runBtn.addEventListener('click', runCode);
    if (submitBtn) submitBtn.addEventListener('click', submitCode);
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

// Placeholder functions for features not yet implemented
async function loadProblemDetail(problemId) {
    showToast('Problem detail view coming soon!', 'info');
}

async function loadBoilerplate() {
    // Placeholder
}

async function runCode() {
    showToast('Code execution coming soon!', 'info');
}

async function submitCode() {
    showToast('Code submission coming soon!', 'info');
}

async function loadSubmissions() {
    showToast('Submissions view coming soon!', 'info');
}