/**
 * XSS Playground - JavaScript
 * Interactive functionality for the XSS demonstration page
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize tab functionality
    initTabs();
    
    // Initialize XSS demos
    initReflectedXSSDemo();
    initStoredXSSDemo();
    initDOMXSSDemo();
    
    // Add hacker meme
    addHackerMeme();
    
    // Add sound effects
    initSoundEffects();
});

/**
 * Initialize tab functionality
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // Play sound effect
            playHackerSound('click');
        });
    });
}

/**
 * Initialize Reflected XSS Demo
 */
function initReflectedXSSDemo() {
    const vulnerableSearchBtn = document.getElementById('vulnerable-search-btn');
    const vulnerableSearchInput = document.getElementById('vulnerable-search');
    const vulnerableResult = document.getElementById('vulnerable-result');
    
    const secureSearchBtn = document.getElementById('secure-search-btn');
    const secureSearchInput = document.getElementById('secure-search');
    const secureResult = document.getElementById('secure-result');
    
    // Vulnerable implementation
    vulnerableSearchBtn.addEventListener('click', () => {
        const query = vulnerableSearchInput.value;
        
        // Add attack animation
        vulnerableResult.classList.add('xss-attack');
        setTimeout(() => {
            vulnerableResult.classList.remove('xss-attack');
        }, 1000);
        
        // Play sound effect
        playHackerSound('attack');
        
        // Vulnerable: Using a method that will execute scripts
        // This is intentionally vulnerable for demonstration purposes
        setTimeout(() => {
            // Create a temporary div
            const tempDiv = document.createElement('div');
            
            // Set the HTML content
            tempDiv.innerHTML = `
                <h3>Search results for: ${query}</h3>
                <p>No results found.</p>
            `;
            
            // Clear previous content
            vulnerableResult.innerHTML = '';
            
            // Append the content
            vulnerableResult.appendChild(tempDiv);
            
            // Execute any scripts in the query using eval
            // WARNING: This is extremely dangerous in real applications!
            // Only doing this for demonstration purposes
            try {
                if (query.includes('<script>')) {
                    const scriptContent = query.match(/<script>([\s\S]*?)<\/script>/i);
                    if (scriptContent && scriptContent[1]) {
                        // Execute the script content
                        setTimeout(() => {
                            // Using eval is dangerous and should never be used in real applications
                            // This is only for demonstration purposes
                            eval(scriptContent[1]);
                        }, 100);
                    }
                }
            } catch (e) {
                console.error('Error executing script:', e);
            }
        }, 500);
    });
    
    // Secure implementation
    secureSearchBtn.addEventListener('click', () => {
        const query = secureSearchInput.value;
        
        // Play sound effect
        playHackerSound('secure');
        
        // Secure: Escaping user input before inserting into the DOM
        const escapedQuery = escapeHTML(query);
        secureResult.innerHTML = `
            <h3>Search results for: ${escapedQuery}</h3>
            <p>No results found.</p>
        `;
    });
}

/**
 * Initialize Stored XSS Demo
 */
function initStoredXSSDemo() {
    const vulnerableCommentBtn = document.getElementById('vulnerable-comment-btn');
    const vulnerableName = document.getElementById('vulnerable-name');
    const vulnerableComment = document.getElementById('vulnerable-comment');
    const vulnerableComments = document.querySelector('#vulnerable-comments .comments-list');
    
    const secureCommentBtn = document.getElementById('secure-comment-btn');
    const secureName = document.getElementById('secure-name');
    const secureComment = document.getElementById('secure-comment');
    const secureComments = document.querySelector('#secure-comments .comments-list');
    
    // Vulnerable implementation
    vulnerableCommentBtn.addEventListener('click', () => {
        const name = vulnerableName.value || 'Anonymous';
        const comment = vulnerableComment.value || 'No comment';
        
        // Add attack animation
        vulnerableComments.classList.add('xss-attack');
        setTimeout(() => {
            vulnerableComments.classList.remove('xss-attack');
        }, 1000);
        
        // Play sound effect
        playHackerSound('attack');
        
        // Vulnerable: Using a method that will execute scripts
        // This is intentionally vulnerable for demonstration purposes
        setTimeout(() => {
            // Create a new comment element
            const commentDiv = document.createElement('div');
            commentDiv.className = 'comment';
            
            // Set the HTML content
            commentDiv.innerHTML = `
                <h4>${name} says:</h4>
                <p>${comment}</p>
            `;
            
            // Append the comment
            vulnerableComments.appendChild(commentDiv);
            
            // Execute any scripts in the comment using eval
            // WARNING: This is extremely dangerous in real applications!
            // Only doing this for demonstration purposes
            try {
                if (comment.includes('<script>')) {
                    const scriptContent = comment.match(/<script>([\s\S]*?)<\/script>/i);
                    if (scriptContent && scriptContent[1]) {
                        // Execute the script content
                        setTimeout(() => {
                            // Using eval is dangerous and should never be used in real applications
                            // This is only for demonstration purposes
                            eval(scriptContent[1]);
                        }, 100);
                    }
                }
                
                if (name.includes('<script>')) {
                    const scriptContent = name.match(/<script>([\s\S]*?)<\/script>/i);
                    if (scriptContent && scriptContent[1]) {
                        // Execute the script content
                        setTimeout(() => {
                            // Using eval is dangerous and should never be used in real applications
                            // This is only for demonstration purposes
                            eval(scriptContent[1]);
                        }, 100);
                    }
                }
            } catch (e) {
                console.error('Error executing script:', e);
            }
            
            // Clear inputs
            vulnerableName.value = '';
            vulnerableComment.value = '';
        }, 500);
    });
    
    // Secure implementation
    secureCommentBtn.addEventListener('click', () => {
        const name = secureName.value || 'Anonymous';
        const comment = secureComment.value || 'No comment';
        
        // Play sound effect
        playHackerSound('secure');
        
        // Secure: Escaping user input before inserting into the DOM
        const escapedName = escapeHTML(name);
        const escapedComment = escapeHTML(comment);
        
        const commentHTML = `
            <div class="comment">
                <h4>${escapedName} says:</h4>
                <p>${escapedComment}</p>
            </div>
        `;
        
        secureComments.innerHTML += commentHTML;
        
        // Clear inputs
        secureName.value = '';
        secureComment.value = '';
    });
}

/**
 * Initialize DOM-based XSS Demo
 */
function initDOMXSSDemo() {
    const vulnerableUrlBtn = document.getElementById('vulnerable-url-btn');
    const vulnerableUrlInput = document.getElementById('vulnerable-url');
    const vulnerableProfileName = document.getElementById('vulnerable-profile-name');
    
    const secureUrlBtn = document.getElementById('secure-url-btn');
    const secureUrlInput = document.getElementById('secure-url');
    const secureProfileName = document.getElementById('secure-profile-name');
    
    // Vulnerable implementation
    vulnerableUrlBtn.addEventListener('click', () => {
        const username = vulnerableUrlInput.value;
        
        // Add attack animation
        vulnerableProfileName.parentElement.classList.add('xss-attack');
        setTimeout(() => {
            vulnerableProfileName.parentElement.classList.remove('xss-attack');
        }, 1000);
        
        // Play sound effect
        playHackerSound('attack');
        
        // Vulnerable: Using a method that will execute scripts
        // This is intentionally vulnerable for demonstration purposes
        setTimeout(() => {
            // Set the HTML content
            vulnerableProfileName.innerHTML = username || 'Guest';
            
            // Execute any scripts in the username using eval
            // WARNING: This is extremely dangerous in real applications!
            // Only doing this for demonstration purposes
            try {
                if (username && username.includes('<script>')) {
                    const scriptContent = username.match(/<script>([\s\S]*?)<\/script>/i);
                    if (scriptContent && scriptContent[1]) {
                        // Execute the script content
                        setTimeout(() => {
                            // Using eval is dangerous and should never be used in real applications
                            // This is only for demonstration purposes
                            eval(scriptContent[1]);
                        }, 100);
                    }
                }
            } catch (e) {
                console.error('Error executing script:', e);
            }
        }, 500);
    });
    
    // Secure implementation
    secureUrlBtn.addEventListener('click', () => {
        const username = secureUrlInput.value;
        
        // Play sound effect
        playHackerSound('secure');
        
        // Secure: Using textContent instead of innerHTML
        secureProfileName.textContent = username || 'Guest';
    });
}

/**
 * Escape HTML special characters
 * @param {string} str - The string to escape
 * @returns {string} - The escaped string
 */
function escapeHTML(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Add a random hacker meme to the page
 */
function addHackerMeme() {
    const memes = [
       
        {
            url: "https://res.cloudinary.com/teepublic/image/private/s--eq3Lx--6--/t_Resized%20Artwork/c_fit,g_north_west,h_954,w_954/co_fffffe,e_outline:48/co_fffffe,e_outline:inner_fill:48/co_ffffff,e_outline:48/co_ffffff,e_outline:inner_fill:48/co_bbbbbb,e_outline:3:1000/c_mpad,g_center,h_1260,w_1260/b_rgb:eeeeee/c_limit,f_auto,h_313,q_auto:good:420,w_313/v1544702961/production/designs/3726052_4",
            alt: "Security meme - It works on my machine"
        }
    ];
    
    const randomMeme = memes[Math.floor(Math.random() * memes.length)];
    
    const memeContainer = document.createElement('div');
    memeContainer.className = 'hacker-meme';
    memeContainer.innerHTML = `<img src="${randomMeme.url}" alt="${randomMeme.alt}">`;
    
    document.body.appendChild(memeContainer);
    
    // Add click event to show enlarged meme
    memeContainer.addEventListener('click', () => {
        showEnlargedMeme(randomMeme.url, randomMeme.alt);
        playHackerSound('meme');
    });
}

/**
 * Show an enlarged meme in a modal
 * @param {string} url - The URL of the meme image
 * @param {string} alt - The alt text for the meme image
 */
function showEnlargedMeme(url, alt) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'meme-popup active';
    modal.innerHTML = `
        <div class="meme-popup-content">
            <img src="${url}" alt="${alt}">
            <div class="meme-popup-close"><i class="fas fa-times"></i></div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.meme-popup-close').addEventListener('click', (e) => {
        e.stopPropagation();
        modal.remove();
    });
    
    modal.addEventListener('click', () => {
        modal.remove();
    });
    
    modal.querySelector('.meme-popup-content').addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

/**
 * Initialize sound effects
 */
function initSoundEffects() {
    // Add event listeners for hover sound effects
    document.querySelectorAll('.btn, .tab-btn, .prevention-card, .resources-list li').forEach(element => {
        element.addEventListener('mouseenter', () => {
            playHackerSound('hover');
        });
    });
}

/**
 * Play a hacker sound effect
 * @param {string} type - The type of sound to play
 */
function playHackerSound(type) {
    // Create audio context if it doesn't exist
    if (!window.audioContext) {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            window.audioContext = new AudioContext();
        } catch (e) {
            console.warn('Web Audio API not supported');
            return;
        }
    }
    
    // Create oscillator
    const oscillator = window.audioContext.createOscillator();
    const gainNode = window.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(window.audioContext.destination);
    
    // Set sound type based on action
    switch (type) {
        case 'hover':
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, window.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(880, window.audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.05, window.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, window.audioContext.currentTime + 0.1);
            oscillator.start();
            oscillator.stop(window.audioContext.currentTime + 0.1);
            break;
            
        case 'click':
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(220, window.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(0, window.audioContext.currentTime + 0.2);
            gainNode.gain.setValueAtTime(0.05, window.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, window.audioContext.currentTime + 0.2);
            oscillator.start();
            oscillator.stop(window.audioContext.currentTime + 0.2);
            break;
            
        case 'attack':
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(110, window.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(880, window.audioContext.currentTime + 0.3);
            gainNode.gain.setValueAtTime(0.1, window.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, window.audioContext.currentTime + 0.3);
            oscillator.start();
            oscillator.stop(window.audioContext.currentTime + 0.3);
            break;
            
        case 'secure':
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, window.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1760, window.audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.05, window.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, window.audioContext.currentTime + 0.2);
            oscillator.start();
            oscillator.stop(window.audioContext.currentTime + 0.2);
            break;
            
        case 'meme':
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(440, window.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(880, window.audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.05, window.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, window.audioContext.currentTime + 0.3);
            oscillator.start();
            oscillator.stop(window.audioContext.currentTime + 0.3);
            break;
    }
}

/**
 * Add Matrix rain effect to the background
 * This is a simplified version that won't cause performance issues
 */
function addMatrixRainEffect() {
    const canvas = document.createElement('canvas');
    canvas.className = 'matrix-rain';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Characters to display
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$&+,:;=?@#|\'<>.^*()%!-{}[]_~';
    
    // Font size and columns
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Array to track the y position of each column
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -100);
    }
    
    // Draw the matrix rain
    function drawMatrixRain() {
        // Set semi-transparent black background to create trail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Set text color and font
        ctx.fillStyle = '#00ff8c';
        ctx.font = `${fontSize}px monospace`;
        
        // Draw characters
        for (let i = 0; i < drops.length; i++) {
            // Random character
            const char = chars[Math.floor(Math.random() * chars.length)];
            
            // Draw character
            ctx.fillText(char, i * fontSize, drops[i] * fontSize);
            
            // Move drop down
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    // Update canvas dimensions on window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Recalculate columns
        const newColumns = Math.floor(canvas.width / fontSize);
        
        // Reset drops array
        drops.length = 0;
        for (let i = 0; i < newColumns; i++) {
            drops[i] = Math.floor(Math.random() * -100);
        }
    });
    
    // Start animation with a lower frame rate to avoid performance issues
    setInterval(drawMatrixRain, 100);
}

// Add a fun console message for curious developers
console.log('%c🔒 Web Security Playground - XSS Demo', 'color: #00ff8c; font-size: 20px; font-weight: bold;');
console.log('%cThis is a demonstration of XSS vulnerabilities. Please use this knowledge responsibly!', 'color: #ff3e3e;');
console.log('%cWith great power comes great responsibility!', 'color: #ffcc00; font-style: italic;');
