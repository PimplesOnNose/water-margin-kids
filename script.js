// DOM Elements
const langEnBtn = document.getElementById('langEn');
const langCnBtn = document.getElementById('langCn');
const audioToggle = document.getElementById('audioToggle');
const autoPlayToggle = document.getElementById('autoPlayToggle');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentPageSpan = document.getElementById('currentPage');
const totalPagesSpan = document.getElementById('totalPages');

// State
let currentPage = 1;
const totalPages = 10;
let isEnglish = true;
let isAudioPlaying = false;
let isAutoPlay = false;
let currentAudio = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updatePageDisplay();
    setupEventListeners();
    preloadAudio();
});

// Event Listeners
function setupEventListeners() {
    // Language toggle
    langEnBtn.addEventListener('click', () => switchLanguage(true));
    langCnBtn.addEventListener('click', () => switchLanguage(false));
    
    // Audio controls
    audioToggle.addEventListener('click', toggleAudio);
    autoPlayToggle.addEventListener('click', toggleAutoPlay);
    
    // Navigation
    prevBtn.addEventListener('click', goToPreviousPage);
    nextBtn.addEventListener('click', goToNextPage);
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
}

// Language switching
function switchLanguage(toEnglish) {
    isEnglish = toEnglish;
    
    // Update button states
    langEnBtn.classList.toggle('active', isEnglish);
    langCnBtn.classList.toggle('active', !isEnglish);
    
    // Update text visibility
    const allEnText = document.querySelectorAll('.page-text.en, .page-title.en');
    const allCnText = document.querySelectorAll('.page-text.cn, .page-title.cn');
    
    allEnText.forEach(el => el.classList.toggle('hidden', !isEnglish));
    allCnText.forEach(el => el.classList.toggle('hidden', isEnglish));
    
    // Stop current audio if playing
    stopAudio();
    
    // If auto-play is on, play the new language audio
    if (isAutoPlay) {
        setTimeout(() => playCurrentPageAudio(), 300);
    }
}

// Audio controls
function toggleAudio() {
    if (isAudioPlaying) {
        stopAudio();
    } else {
        playCurrentPageAudio();
    }
}

function toggleAutoPlay() {
    isAutoPlay = !isAutoPlay;
    autoPlayToggle.classList.toggle('active', isAutoPlay);
    
    if (isAutoPlay && !isAudioPlaying) {
        playCurrentPageAudio();
    }
}

// Audio playback
function playCurrentPageAudio() {
    const audioFile = getAudioFilePath(currentPage, isEnglish);
    
    // Stop any existing audio
    stopAudio();
    
    // Create and play new audio
    currentAudio = new Audio(audioFile);
    
    currentAudio.addEventListener('play', () => {
        isAudioPlaying = true;
        audioToggle.classList.add('active', 'audio-playing');
        audioToggle.title = 'Pause Audio';
    });
    
    currentAudio.addEventListener('ended', () => {
        isAudioPlaying = false;
        audioToggle.classList.remove('active', 'audio-playing');
        audioToggle.title = 'Play Audio';
        
        // Auto-advance to next page if auto-play is on
        if (isAutoPlay && currentPage < totalPages) {
            setTimeout(() => {
                goToNextPage();
                setTimeout(() => playCurrentPageAudio(), 500);
            }, 1000);
        }
    });
    
    currentAudio.addEventListener('error', () => {
        console.log('Audio file not available:', audioFile);
        isAudioPlaying = false;
        audioToggle.classList.remove('active', 'audio-playing');
    });
    
    // Play the audio
    currentAudio.play().catch(error => {
        console.log('Audio playback failed:', error);
        isAudioPlaying = false;
        audioToggle.classList.remove('active', 'audio-playing');
    });
}

function stopAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
    isAudioPlaying = false;
    audioToggle.classList.remove('active', 'audio-playing');
    audioToggle.title = 'Play Audio';
}

function getAudioFilePath(page, english) {
    const lang = english ? 'en' : 'cn';
    return `audio/page${page}_${lang}.mp3`;
}

function preloadAudio() {
    // Preload first page audio
    const audio = new Audio(getAudioFilePath(1, true));
    audio.preload = 'metadata';
}

// Page navigation
function goToPreviousPage() {
    if (currentPage > 1) {
        currentPage--;
        updatePageDisplay();
        stopAudio();
        
        if (isAutoPlay) {
            setTimeout(() => playCurrentPageAudio(), 500);
        }
    }
}

function goToNextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        updatePageDisplay();
        stopAudio();
        
        if (isAutoPlay) {
            setTimeout(() => playCurrentPageAudio(), 500);
        }
    }
}

function updatePageDisplay() {
    // Update page visibility
    const allPages = document.querySelectorAll('.story-page');
    allPages.forEach(page => {
        const pageNum = parseInt(page.dataset.page);
        page.classList.toggle('active', pageNum === currentPage);
    });
    
    // Update navigation buttons
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    
    // Update page indicator
    currentPageSpan.textContent = currentPage;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Keyboard navigation
function handleKeyboardNavigation(event) {
    // Prevent default for arrow keys
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
    }
    
    switch (event.key) {
        case 'ArrowLeft':
            goToPreviousPage();
            break;
        case 'ArrowRight':
            goToNextPage();
            break;
        case ' ': // Spacebar
            event.preventDefault();
            toggleAudio();
            break;
        case 'l': // 'L' for language
            switchLanguage(!isEnglish);
            break;
        case 'a': // 'A' for auto-play
            toggleAutoPlay();
            break;
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Adjust layout if needed
}, 250));

// Add touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', (event) => {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next page
            goToNextPage();
        } else {
            // Swipe right - previous page
            goToPreviousPage();
        }
    }
}

// Add animation class when page loads
document.addEventListener('DOMContentLoaded', () => {
    const firstPage = document.querySelector('.story-page.active');
    if (firstPage) {
        firstPage.style.animationDelay = '0.2s';
    }
});