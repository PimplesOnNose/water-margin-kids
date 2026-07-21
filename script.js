// DOM Elements
const langEnBtn = document.getElementById('langEn');
const langCnBtn = document.getElementById('langCn');
const audioToggle = document.getElementById('audioToggle');
const autoPlayToggle = document.getElementById('autoPlayToggle');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentPageSpan = document.getElementById('currentPage');
const totalPagesSpan = document.getElementById('totalPages');
const gridToggle = document.getElementById('gridToggle');
const pageGrid = document.getElementById('pageGrid');
const gridClose = document.getElementById('gridClose');
const pageGridItems = document.getElementById('pageGridItems');
const audioProgressContainer = document.getElementById('audioProgressContainer');
const audioProgressBar = document.getElementById('audioProgressBar');
const charTooltip = document.getElementById('charTooltip');

// State
let currentPage = 1;
const totalPages = 10;
let isEnglish = true;
let isAudioPlaying = false;
let isAudioLoading = false;
let isAutoPlay = false;
let currentAudio = null;

// Page metadata for navigator
const PAGE_TITLES = [
    { en: "The Marshes of Liangshan", cn: "梁山泊" },
    { en: "Wu Song and the Tiger", cn: "武松打虎" },
    { en: "Lu Zhishen and the Willow Tree", cn: "鲁智深倒拔垂杨柳" },
    { en: "Lin Chong's Journey", cn: "林冲发配" },
    { en: "Li Kui's Two Axes", cn: "李逵双斧" },
    { en: "The Heroes' Feast", cn: "英雄宴会" },
    { en: "Defending Liangshan", cn: "保卫梁山" },
    { en: "The Heroes' Code", cn: "英雄准则" },
    { en: "The Legend Lives On", cn: "传说永存" },
    { en: "The End", cn: "结束" }
];

// Character info for tooltips
const CHARACTER_INFO = {
    "武松": { en: "Wu Song — A brave warrior known for killing a tiger with his bare hands", cn: "武松 — 一位以赤手空拳打虎闻名的勇士" },
    "林冲": { en: "Lin Chong — A skilled military instructor who was wrongfully exiled", cn: "林冲 — 一位武艺高强的教头，被冤枉发配" },
    "鲁智深": { en: "Lu Zhishen — A strong monk who fights for justice", cn: "鲁智深 — 一位力大无穷、路见不平的和尚" },
    "李逵": { en: "Li Kui — A fierce but loyal warrior who wields two axes", cn: "李逵 — 一位凶猛但忠心耿耿的双斧好汉" },
    "梁山": { en: "Liangshan — The mountain fortress where the 108 heroes gathered", cn: "梁山 — 一百零八位好汉聚义的山寨" },
    "好汉": { en: "Hero / Righteous man — What the 108 heroes called themselves", cn: "好汉 — 一百零八位英雄的自称，意为勇敢正义的人" },
    "宋江": { en: "Song Jiang — The leader of the 108 heroes of Liangshan", cn: "宋江 — 梁山一百零八位好汉的首领" },
    "皇帝": { en: "Emperor — The ruler of China during the Song Dynasty", cn: "皇帝 — 宋朝的统治者" }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updatePageDisplay();
    setupEventListeners();
    buildPageGrid();
    preloadAudio();
    setupCharHighlights();
    addSwipeHint();
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
    
    // Grid navigator
    gridToggle.addEventListener('click', togglePageGrid);
    gridClose.addEventListener('click', togglePageGrid);
    pageGrid.addEventListener('click', (e) => {
        if (e.target === pageGrid) togglePageGrid();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Close tooltip on click anywhere
    document.addEventListener('click', (e) => {
        if (!e.target.classList.contains('char-highlight')) {
            hideTooltip();
        }
    });
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
    } else if (isAudioLoading) {
        // Do nothing while loading
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
    
    // Show loading state
    isAudioLoading = true;
    audioToggle.classList.add('audio-loading');
    
    // Create and play new audio
    currentAudio = new Audio(audioFile);
    
    currentAudio.addEventListener('canplaythrough', () => {
        isAudioLoading = false;
        audioToggle.classList.remove('audio-loading');
    }, { once: true });
    
    currentAudio.addEventListener('play', () => {
        isAudioPlaying = true;
        audioToggle.classList.add('active');
        audioToggle.title = 'Pause Audio';
        audioProgressContainer.style.display = 'block';
    });
    
    currentAudio.addEventListener('timeupdate', () => {
        if (currentAudio.duration) {
            const pct = (currentAudio.currentTime / currentAudio.duration) * 100;
            audioProgressBar.style.width = pct + '%';
        }
    });
    
    currentAudio.addEventListener('ended', () => {
        isAudioPlaying = false;
        audioToggle.classList.remove('active');
        audioToggle.title = 'Play Audio';
        audioProgressBar.style.width = '0%';
        audioProgressContainer.style.display = 'none';
        isAudioLoading = false;
        audioToggle.classList.remove('audio-loading');
        
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
        isAudioLoading = false;
        audioToggle.classList.remove('active', 'audio-loading');
        audioProgressContainer.style.display = 'none';
    });
    
    // Play the audio
    currentAudio.play().catch(error => {
        console.log('Audio playback failed:', error);
        isAudioPlaying = false;
        isAudioLoading = false;
        audioToggle.classList.remove('active', 'audio-loading');
    });
}

function stopAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
    isAudioPlaying = false;
    isAudioLoading = false;
    audioToggle.classList.remove('active', 'audio-loading');
    audioToggle.title = 'Play Audio';
    audioProgressBar.style.width = '0%';
    audioProgressContainer.style.display = 'none';
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
function goToPage(pageNum) {
    if (pageNum < 1 || pageNum > totalPages) return;
    if (pageNum === currentPage && pageGrid.style.display !== 'none') {
        togglePageGrid();
        return;
    }
    currentPage = pageNum;
    updatePageDisplay();
    stopAudio();
    // Close grid if open
    if (pageGrid.style.display !== 'none') togglePageGrid();
    
    if (isAutoPlay) {
        setTimeout(() => playCurrentPageAudio(), 500);
    }
}

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
    
    // Update grid active state
    document.querySelectorAll('.grid-item').forEach(item => {
        item.classList.toggle('active-page', parseInt(item.dataset.page) === currentPage);
    });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Page Grid Navigator
function buildPageGrid() {
    pageGridItems.innerHTML = '';
    PAGE_TITLES.forEach((title, index) => {
        const pageNum = index + 1;
        const item = document.createElement('div');
        item.className = 'grid-item' + (pageNum === currentPage ? ' active-page' : '');
        item.dataset.page = pageNum;
        item.innerHTML = `
            <div class="page-num">${pageNum}</div>
            <div class="page-label-en">${title.en}</div>
            <div class="page-label-cn">${title.cn}</div>
        `;
        item.addEventListener('click', () => goToPage(pageNum));
        pageGridItems.appendChild(item);
    });
}

function togglePageGrid() {
    const isOpen = pageGrid.style.display !== 'none';
    pageGrid.style.display = isOpen ? 'none' : 'block';
    document.body.style.overflow = isOpen ? '' : 'hidden';
    if (!isOpen) {
        // Update active state
        document.querySelectorAll('.grid-item').forEach(item => {
            item.classList.toggle('active-page', parseInt(item.dataset.page) === currentPage);
        });
    }
}

// Character Tooltips
function setupCharHighlights() {
    // Highlight known character names in Chinese text
    const hanziElements = document.querySelectorAll('.hanzi');
    hanziElements.forEach(el => {
        let html = el.innerHTML;
        for (const [name, info] of Object.entries(CHARACTER_INFO)) {
            const regex = new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            html = html.replace(regex, `<span class="char-highlight" data-char="${name}">${name}</span>`);
        }
        el.innerHTML = html;
    });
    
    // Add click handlers
    document.querySelectorAll('.char-highlight').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            const name = el.dataset.char;
            const info = CHARACTER_INFO[name];
            if (info) {
                const text = isEnglish ? info.en : info.cn;
                showTooltip(e, text);
            }
        });
    });
}

function showTooltip(event, text) {
    charTooltip.textContent = text;
    charTooltip.style.display = 'block';
    
    const rect = event.target.getBoundingClientRect();
    let top = rect.top - charTooltip.offsetHeight - 10;
    let left = rect.left + (rect.width / 2) - (charTooltip.offsetWidth / 2);
    
    // Keep tooltip within viewport
    if (top < 10) top = rect.bottom + 10;
    if (left < 10) left = 10;
    if (left + charTooltip.offsetWidth > window.innerWidth - 10) {
        left = window.innerWidth - charTooltip.offsetWidth - 10;
    }
    
    charTooltip.style.top = top + 'px';
    charTooltip.style.left = left + 'px';
}

function hideTooltip() {
    charTooltip.style.display = 'none';
}

// Swipe hint
function addSwipeHint() {
    const hint = document.createElement('div');
    hint.className = 'swipe-hint';
    hint.textContent = '◀ Swipe to navigate ▶';
    const nav = document.querySelector('.page-navigation');
    if (nav) nav.parentNode.insertBefore(hint, nav);
    // Hide hint after a few seconds
    setTimeout(() => { hint.style.display = 'none'; }, 5000);
}

// Keyboard navigation
function handleKeyboardNavigation(event) {
    // Prevent default for arrow keys
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'Escape') {
        event.preventDefault();
    }
    
    switch (event.key) {
        case 'ArrowLeft':
            goToPreviousPage();
            break;
        case 'ArrowRight':
            goToNextPage();
            break;
        case 'Escape':
            if (pageGrid.style.display !== 'none') togglePageGrid();
            hideTooltip();
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
        case 'g': // 'G' for grid
            togglePageGrid();
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
    if (charTooltip.style.display !== 'none') hideTooltip();
}, 250));

// Add touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (event) => {
    // Don't capture touches on grid overlay
    if (pageGrid.style.display !== 'none') return;
    touchStartX = event.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', (event) => {
    if (pageGrid.style.display !== 'none') return;
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            goToNextPage();
        } else {
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