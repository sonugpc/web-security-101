// Global variables
let currentSlide = 1;
const totalSlides = 20;
let pollResults = {
    skillRating: {},
    whoWouldClick: 0,
    stayLoggedIn: 0
};

// Initialize presentation
document.addEventListener('DOMContentLoaded', function() {
    updateSlideCounter();
    updateNavigationButtons();
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            previousSlide();
        } else if (e.key === 'Escape') {
            // Toggle fullscreen
            toggleFullscreen();
        }
    });
    
    // Add click navigation on slides
    document.querySelectorAll('.slide').forEach(slide => {
        slide.addEventListener('click', function(e) {
            if (e.target === slide) {
                nextSlide();
            }
        });
    });
});

// Navigation functions
function nextSlide() {
    if (currentSlide < totalSlides) {
        document.querySelector(`[data-slide="${currentSlide}"]`).classList.remove('active');
        currentSlide++;
        document.querySelector(`[data-slide="${currentSlide}"]`).classList.add('active');
        updateSlideCounter();
        updateNavigationButtons();
        
        // Add entrance animation
        const activeSlide = document.querySelector('.slide.active');
        activeSlide.classList.add('fade-in');
        setTimeout(() => {
            activeSlide.classList.remove('fade-in');
        }, 800);
    }
}

function previousSlide() {
    if (currentSlide > 1) {
        document.querySelector(`[data-slide="${currentSlide}"]`).classList.remove('active');
        currentSlide--;
        document.querySelector(`[data-slide="${currentSlide}"]`).classList.add('active');
        updateSlideCounter();
        updateNavigationButtons();
        
        // Add entrance animation
        const activeSlide = document.querySelector('.slide.active');
        activeSlide.classList.add('fade-in');
        setTimeout(() => {
            activeSlide.classList.remove('fade-in');
        }, 800);
    }
}

function goToSlide(slideNumber) {
    if (slideNumber >= 1 && slideNumber <= totalSlides) {
        document.querySelector(`[data-slide="${currentSlide}"]`).classList.remove('active');
        currentSlide = slideNumber;
        document.querySelector(`[data-slide="${currentSlide}"]`).classList.add('active');
        updateSlideCounter();
        updateNavigationButtons();
    }
}

function updateSlideCounter() {
    document.getElementById('current-slide').textContent = currentSlide;
    document.getElementById('total-slides').textContent = totalSlides;
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    prevBtn.disabled = currentSlide === 1;
    nextBtn.disabled = currentSlide === totalSlides;
}

// Interactive functions for polls and demos
function rateSkill(rating) {
    if (!pollResults.skillRating[rating]) {
        pollResults.skillRating[rating] = 0;
    }
    pollResults.skillRating[rating]++;
    
    // Show result
    const resultElement = document.getElementById('poll-result');
    const total = Object.values(pollResults.skillRating).reduce((a, b) => a + b, 0);
    const average = Object.entries(pollResults.skillRating)
        .reduce((sum, [rating, count]) => sum + (rating * count), 0) / total;
    
    resultElement.innerHTML = `
        <p>📊 ${total} votes • Average: ${average.toFixed(1)}/5</p>
        <p>Thanks for your honesty! 😄</p>
    `;
    
    // Add animation
    resultElement.classList.add('slide-up');
    setTimeout(() => {
        resultElement.classList.remove('slide-up');
    }, 600);
}

// XSS Demo Functions
function submitReview() {
    const movieTitle = document.getElementById('movie-title').value;
    const reviewText = document.getElementById('review-text').value;
    const reviewsDisplay = document.getElementById('reviews-display');
    
    if (!movieTitle && !reviewText) return;
    
    // INTENTIONALLY VULNERABLE - FOR DEMO ONLY!
    const reviewHTML = `
        <div class="review-item" style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px;">
            <h5>Movie: ${movieTitle}</h5>
            <p>${reviewText}</p>
            <small>Posted just now</small>
        </div>
    `;
    
    // This is the vulnerable line - innerHTML allows script execution
    reviewsDisplay.innerHTML += reviewHTML;
    
    // Clear form
    document.getElementById('movie-title').value = '';
    document.getElementById('review-text').value = '';
    
    // Show warning after XSS attempt
    if (reviewText.includes('<script>') || reviewText.includes('onerror=')) {
        setTimeout(() => {
            alert('🎉 Congratulations! You just performed an XSS attack!\n\nIn a real application, this could:\n• Steal user cookies\n• Redirect to malicious sites\n• Steal personal information\n• Take control of user accounts');
        }, 500);
    }
}

function insertPayload(payload) {
    // Decode HTML entities for display
    const decodedPayload = payload.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    document.getElementById('review-text').value = decodedPayload;
    
    // Add visual feedback
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Payload Inserted! 💉';
    button.style.background = '#4ecdc4';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '#ff6b35';
    }, 2000);
}

// CSRF Demo Functions
function triggerCSRF() {
    // Simulate the CSRF attack
    const maliciousForm = document.getElementById('malicious-form');
    
    // Show what's happening
    alert('🐶 Loading cute puppies...\n\n*Meanwhile, hidden form submits in background*');
    
    setTimeout(() => {
        // Simulate form submission
        const bankBalance = document.querySelector('.account-balance');
        bankBalance.innerHTML = '💸 Balance: $9,000 <span style="color: #ff4444;">(Transfer of $1,000 to attacker@evil.com completed)</span>';
        bankBalance.style.background = 'rgba(255, 68, 68, 0.2)';
        
        // Show the reveal
        setTimeout(() => {
            alert('🚨 CSRF ATTACK SUCCESSFUL!\n\nWhat happened:\n• You clicked an innocent link\n• Hidden form auto-submitted to bank\n• Your money was transferred\n• You never saw it coming!\n\nThis is why CSRF tokens are crucial!');
        }, 1000);
    }, 2000);
}

function pollWhoWouldClick() {
    pollResults.whoWouldClick++;
    updatePollResults('who-would-click', `${pollResults.whoWouldClick} people would click the puppy link! 🐶`);
}

function pollStayLoggedIn() {
    pollResults.stayLoggedIn++;
    updatePollResults('stay-logged-in', `${pollResults.stayLoggedIn} people stay logged into banking sites! 😱`);
}

function updatePollResults(pollType, message) {
    const resultsElement = document.getElementById('poll-results');
    const existingResult = resultsElement.querySelector(`[data-poll="${pollType}"]`);
    
    if (existingResult) {
        existingResult.textContent = message;
    } else {
        const resultDiv = document.createElement('div');
        resultDiv.setAttribute('data-poll', pollType);
        resultDiv.textContent = message;
        resultDiv.style.padding = '10px';
        resultDiv.style.margin = '10px 0';
        resultDiv.style.background = 'rgba(76, 205, 196, 0.2)';
        resultDiv.style.borderRadius = '10px';
        resultsElement.appendChild(resultDiv);
    }
    
    // Add animation
    resultsElement.classList.add('slide-up');
    setTimeout(() => {
        resultsElement.classList.remove('slide-up');
    }, 600);
}

// Utility functions
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('Fullscreen not supported');
        });
    } else {
        document.exitFullscreen();
    }
}

// Add some Easter eggs
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up Up Down Down Left Right Left Right B A

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.keyCode);
    if (konamiCode.length > 10) {
        konamiCode.shift();
    }
    
    if (konamiCode.toString() === konamiSequence.toString()) {
        // Easter egg: Matrix effect
        createMatrixEffect();
        konamiCode = [];
    }
});

function createMatrixEffect() {
    const matrixContainer = document.createElement('div');
    matrixContainer.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: black; z-index: 9999; pointer-events: none;">
            <div style="color: #00ff00; font-family: 'Fira Code', monospace; font-size: 20px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
                <p>🎉 KONAMI CODE ACTIVATED! 🎉</p>
                <p>You've unlocked the Matrix!</p>
                <p style="font-size: 14px; margin-top: 20px;">You're clearly ready for advanced security training! 😄</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(matrixContainer);
    
    setTimeout(() => {
        matrixContainer.remove();
    }, 3000);
}

// Add slide progress indicator
function createProgressIndicator() {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    progressContainer.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 5px;
        z-index: 1000;
    `;
    
    for (let i = 1; i <= totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'progress-dot';
        dot.style.cssText = `
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        if (i === currentSlide) {
            dot.style.background = '#ff6b35';
            dot.style.transform = 'scale(1.2)';
        }
        
        dot.addEventListener('click', () => goToSlide(i));
        progressContainer.appendChild(dot);
    }
    
    document.body.appendChild(progressContainer);
    
    // Update progress dots when slide changes
    const originalUpdateButtons = updateNavigationButtons;
    updateNavigationButtons = function() {
        originalUpdateButtons();
        
        document.querySelectorAll('.progress-dot').forEach((dot, index) => {
            if (index + 1 === currentSlide) {
                dot.style.background = '#ff6b35';
                dot.style.transform = 'scale(1.2)';
            } else {
                dot.style.background = 'rgba(255, 255, 255, 0.3)';
                dot.style.transform = 'scale(1)';
            }
        });
    };
}

// Initialize progress indicator
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(createProgressIndicator, 1000);
});

// Add presenter notes (press 'N' to toggle)
document.addEventListener('keydown', function(e) {
    if (e.key === 'n' || e.key === 'N') {
        togglePresenterNotes();
    }
});

function togglePresenterNotes() {
    let notesPanel = document.getElementById('presenter-notes');
    
    if (!notesPanel) {
        notesPanel = document.createElement('div');
        notesPanel.id = 'presenter-notes';
        notesPanel.style.cssText = `
            position: fixed;
            top: 0;
            right: -400px;
            width: 380px;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 20px;
            z-index: 2000;
            transition: right 0.3s ease;
            overflow-y: auto;
            font-size: 14px;
            border-left: 3px solid #ff6b35;
        `;
        
        document.body.appendChild(notesPanel);
    }
    
    if (notesPanel.style.right === '0px') {
        notesPanel.style.right = '-400px';
    } else {
        notesPanel.style.right = '0px';
        updatePresenterNotes();
    }
}

function updatePresenterNotes() {
    const notesPanel = document.getElementById('presenter-notes');
    const notes = getPresenterNotes(currentSlide);
    
    notesPanel.innerHTML = `
        <h3 style="color: #ff6b35; margin-bottom: 15px;">Slide ${currentSlide} Notes</h3>
        <div style="line-height: 1.6;">${notes}</div>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #333;">
            <small style="color: #888;">Press 'N' to hide notes</small>
        </div>
    `;
}

function getPresenterNotes(slideNumber) {
    const notes = {
        1: `
            <p><strong>Opening Energy:</strong> Start with high energy, make eye contact</p>
            <p><strong>Hook:</strong> Emphasize the fun learning approach</p>
            <p><strong>Timing:</strong> 2-3 minutes max</p>
        `,
        2: `
            <p><strong>Menu Analogy:</strong> Use food metaphors throughout</p>
            <p><strong>Engagement:</strong> Ask "Who's hungry for security knowledge?"</p>
            <p><strong>Transition:</strong> "Let's start with appetizers!"</p>
        `,
        3: `
            <p><strong>Shock Value:</strong> Let the numbers sink in</p>
            <p><strong>Poll Interaction:</strong> Encourage honest answers</p>
            <p><strong>Energy Shift:</strong> Move from serious to playful</p>
        `,
        4: `
            <p><strong>Visual Focus:</strong> Point out the falling code animation</p>
            <p><strong>Analogy:</strong> Emphasize the Trojan horse concept</p>
            <p><strong>Audience Prep:</strong> "Get ready to become hackers!"</p>
        `,
        7: `
            <p><strong>Demo Time:</strong> This is the key interaction moment</p>
            <p><strong>Safety:</strong> Remind it's educational only</p>
            <p><strong>Encourage:</strong> "Everyone try the payloads!"</p>
        `,
        12: `
            <p><strong>Role Play:</strong> Make it dramatic and fun</p>
            <p><strong>Timing:</strong> Build suspense before the reveal</p>
            <p><strong>Interaction:</strong> Get real responses to polls</p>
        `,
        20: `
            <p><strong>Energy:</strong> End on high note</p>
            <p><strong>Action Items:</strong> Make commitments specific</p>
            <p><strong>Follow-up:</strong> Exchange contact info</p>
        `
    };
    
    return notes[slideNumber] || `
        <p><strong>General Notes:</strong></p>
        <p>• Maintain eye contact with audience</p>
        <p>• Use hand gestures to emphasize points</p>
        <p>• Check for questions regularly</p>
        <p>• Keep energy level high</p>
    `;
}