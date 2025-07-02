/**
 * Web Security Playground - Main JavaScript
 * Global functionality for the entire site - Hacker Edition
 */

document.addEventListener('DOMContentLoaded', () => {
    // Add matrix rain effect to the background
    createMatrixRain();
    
    // Add glitch effect to the main title
    const mainTitle = document.querySelector('header h1');
    if (mainTitle) {
        mainTitle.classList.add('glitch');
        mainTitle.setAttribute('data-text', mainTitle.textContent);
    }
    
    // Add animated sections with different effects
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        const animationClass = index % 3 === 0 ? 'fade-in' : 
                              index % 3 === 1 ? 'slide-in-left' : 'slide-in-right';
        section.classList.add(animationClass);
        section.style.animationDelay = `${index * 0.15}s`;
    });
    
    // Add hover effects to vulnerability cards
    const cards = document.querySelectorAll('.vulnerability-card');
    cards.forEach(card => {
        const icon = card.querySelector('.card-header i');
        
        card.addEventListener('mouseenter', () => {
            icon.style.transition = 'transform 0.3s ease';
            icon.style.transform = 'scale(1.2) rotate(10deg)';
            playHackerSound('hover');
        });
        
        card.addEventListener('mouseleave', () => {
            icon.style.transform = 'scale(1) rotate(0)';
        });
        
        // Add click sound effect
        card.addEventListener('click', () => {
            playHackerSound('click');
        });
    });
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add current year to footer if there's a year placeholder
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
    
    // Check if the browser supports the required features
    function checkBrowserSupport() {
        const features = {
            'ES6': () => {
                try {
                    new Function('() => {}');
                    return true;
                } catch (e) {
                    return false;
                }
            },
            'Fetch API': () => typeof fetch !== 'undefined',
            'CSS Variables': () => {
                try {
                    const div = document.createElement('div');
                    div.style.setProperty('--test', 'test');
                    return div.style.getPropertyValue('--test') === 'test';
                } catch (e) {
                    return false;
                }
            }
        };
        
        const unsupportedFeatures = Object.entries(features)
            .filter(([_, test]) => !test())
            .map(([name, _]) => name);
        
        if (unsupportedFeatures.length > 0) {
            const warningBox = document.createElement('div');
            warningBox.className = 'warning-box';
            warningBox.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <div>
                    <h3>Browser Compatibility Issue</h3>
                    <p>Your browser doesn't support some features required for this site to work properly: ${unsupportedFeatures.join(', ')}. Please use a modern browser like Chrome, Firefox, Safari, or Edge.</p>
                </div>
            `;
            
            const intro = document.querySelector('.intro');
            if (intro) {
                intro.appendChild(warningBox);
            } else {
                document.querySelector('main').prepend(warningBox);
            }
        }
    }
    
    // Run browser support check
    checkBrowserSupport();
    
    // Add interactive tooltips for technical terms
    const technicalTerms = {
        'XSS': 'Cross-Site Scripting: A vulnerability that allows attackers to inject malicious scripts into web pages viewed by users.',
        'CSRF': 'Cross-Site Request Forgery: An attack that forces authenticated users to execute unwanted actions on a web application.',
        'CORS': 'Cross-Origin Resource Sharing: A mechanism that allows restricted resources on a web page to be requested from another domain.',
        'DOM': 'Document Object Model: A programming interface for web documents that represents the page structure.',
        'API': 'Application Programming Interface: A set of rules that allows different software applications to communicate with each other.',
        'SQL Injection': 'A code injection technique that exploits vulnerabilities in database-driven websites.',
        'XHR': 'XMLHttpRequest: An API that allows web browsers to make HTTP requests to servers without reloading the page.',
        'JWT': 'JSON Web Token: A compact, URL-safe means of representing claims to be transferred between two parties.',
        'MITM': 'Man-in-the-Middle: An attack where the attacker secretly relays and possibly alters communications between two parties.'
    };
    
    function createTooltips() {
        const content = document.querySelector('main');
        if (!content) return;
        
        // Find all text nodes
        const walker = document.createTreeWalker(
            content,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            // Skip nodes in script and style elements
            if (['SCRIPT', 'STYLE', 'CODE', 'PRE'].includes(node.parentNode.tagName)) {
                continue;
            }
            textNodes.push(node);
        }
        
        // Process each text node
        textNodes.forEach(textNode => {
            let text = textNode.nodeValue;
            let modified = false;
            
            Object.keys(technicalTerms).forEach(term => {
                // Only replace the first occurrence to avoid multiple tooltips for the same term
                const regex = new RegExp(`\\b${term}\\b`, 'i');
                if (regex.test(text) && !textNode.parentNode.closest('.tooltip')) {
                    const parts = text.split(regex);
                    const span = document.createElement('span');
                    span.className = 'tooltip';
                    span.setAttribute('data-tooltip', technicalTerms[term]);
                    span.textContent = text.match(regex)[0];
                    
                    const fragment = document.createDocumentFragment();
                    fragment.appendChild(document.createTextNode(parts[0]));
                    fragment.appendChild(span);
                    fragment.appendChild(document.createTextNode(parts[1]));
                    
                    textNode.parentNode.replaceChild(fragment, textNode);
                    modified = true;
                    return; // Exit the forEach loop after first replacement
                }
            });
            
            if (modified) {
                // Add tooltip styles if not already added
                if (!document.getElementById('tooltip-styles')) {
                    const style = document.createElement('style');
                    style.id = 'tooltip-styles';
                    style.textContent = `
                        .tooltip {
                            position: relative;
                            border-bottom: 1px dashed var(--primary-color);
                            cursor: help;
                        }
                        .tooltip:hover::after {
                            content: attr(data-tooltip);
                            position: absolute;
                            bottom: 100%;
                            left: 50%;
                            transform: translateX(-50%);
                            background-color: var(--dark-color);
                            color: var(--primary-color);
                            padding: 0.5rem;
                            border-radius: 4px;
                            font-size: 0.85rem;
                            white-space: nowrap;
                            z-index: 10;
                            box-shadow: var(--neon-green-glow);
                            border: 1px solid var(--primary-color);
                        }
                    `;
                    document.head.appendChild(style);
                }
            }
        });
    }
    
    // Create tooltips for technical terms
    createTooltips();
    
    // Add terminal effect to certain elements
    document.querySelectorAll('.intro p:first-of-type').forEach(element => {
        const text = element.textContent;
        element.innerHTML = `<div class="terminal"><span class="terminal-text">${text}</span></div>`;
    });
    
    // Add random hacker quotes to the page
    const hackerQuotes = [
        "The quieter you become, the more you can hear.",
        "There's no place like 127.0.0.1",
        "It's not a bug, it's a feature!",
        "Programming today is a race between software engineers striving to build bigger and better idiot-proof programs, and the Universe trying to produce bigger and better idiots. So far, the Universe is winning.",
        "If debugging is the process of removing software bugs, then programming must be the process of putting them in.",
        "Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live.",
        "Hack the planet!",
        "I'm not a hacker, I'm a security enthusiast.",
        "There are 10 types of people in the world: those who understand binary and those who don't.",
        "It's hardware that makes a machine fast. It's software that makes a fast machine slow."
    ];
    
    function addRandomHackerQuote() {
        const quote = hackerQuotes[Math.floor(Math.random() * hackerQuotes.length)];
        const quoteElement = document.createElement('div');
        quoteElement.className = 'hacker-quote';
        quoteElement.innerHTML = `
            <i class="fas fa-terminal"></i>
            <blockquote>${quote}</blockquote>
        `;
        
        const about = document.querySelector('.about');
        if (about) {
            about.appendChild(quoteElement);
        }
    }
    
    addRandomHackerQuote();
    
    // Add meme functionality
    function addMemes() {
        const memes = [
            {
                url: "https://i.imgur.com/KBVT5l5.jpg",
                alt: "Security meme - It works on my machine"
            },
            {
                url: "https://i.imgur.com/JfSWBEa.jpg",
                alt: "Hacker meme - HTML expert"
            },
            {
                url: "https://i.imgur.com/ZtCtVpc.jpg",
                alt: "Security meme - Password requirements"
            },
            {
                url: "https://i.imgur.com/8xP9Pmx.jpg",
                alt: "Hacker meme - Inspect element"
            },
            {
                url: "https://i.imgur.com/JZLg5Xj.jpg",
                alt: "Security meme - SQL injection"
            }
        ];
        
        // Create meme container
        const randomMeme = memes[Math.floor(Math.random() * memes.length)];
        const memeContainer = document.createElement('div');
        memeContainer.className = 'meme-container';
        memeContainer.innerHTML = `<img src="${randomMeme.url}" alt="${randomMeme.alt}">`;
        document.body.appendChild(memeContainer);
        
        // Create meme popup
        const memePopup = document.createElement('div');
        memePopup.className = 'meme-popup';
        memePopup.innerHTML = `
            <div class="meme-popup-content">
                <img src="${randomMeme.url}" alt="${randomMeme.alt}">
                <div class="meme-popup-close"><i class="fas fa-times"></i></div>
            </div>
        `;
        document.body.appendChild(memePopup);
        
        // Add event listeners
        memeContainer.addEventListener('click', () => {
            memePopup.classList.add('active');
            playHackerSound('meme');
        });
        
        memePopup.querySelector('.meme-popup-close').addEventListener('click', (e) => {
            e.stopPropagation();
            memePopup.classList.remove('active');
        });
        
        memePopup.addEventListener('click', () => {
            memePopup.classList.remove('active');
        });
        
        memePopup.querySelector('.meme-popup-content').addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    addMemes();
    
    // Create Matrix rain effect
    function createMatrixRain() {
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
        
        // Start animation
        setInterval(drawMatrixRain, 50);
    }
    
    // Add hacker sound effects
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
                
            case 'meme':
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(110, window.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(880, window.audioContext.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.05, window.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, window.audioContext.currentTime + 0.3);
                oscillator.start();
                oscillator.stop(window.audioContext.currentTime + 0.3);
                break;
        }
    }
    
    // Add "hacker typer" effect to certain elements
    function addHackerTyperEffect() {
        const hackerCode = `
function hackTheMainframe() {
    const target = document.getElementById('mainframe');
    const firewall = new Firewall(target);
    
    console.log('Initiating mainframe hack...');
    
    // Bypass firewall
    firewall.disableProtection();
    
    // Inject payload
    const payload = generatePayload();
    target.inject(payload);
    
    // Establish backdoor
    const backdoor = new BackdoorConnection({
        target: target.ip,
        port: 22,
        encrypted: true
    });
    
    backdoor.establish().then(() => {
        console.log('Backdoor established!');
        exfiltrateData(backdoor);
    });
    
    return 'HACK SUCCESSFUL';
}

// Execute hack
hackTheMainframe();
`;
        
        const hackerTyper = document.createElement('div');
        hackerTyper.className = 'hacker-typer';
        hackerTyper.innerHTML = `
            <div class="hacker-typer-header">
                <div class="hacker-typer-title">hack.js</div>
                <div class="hacker-typer-controls">
                    <span class="hacker-typer-btn minimize">_</span>
                    <span class="hacker-typer-btn maximize">□</span>
                    <span class="hacker-typer-btn close">×</span>
                </div>
            </div>
            <div class="hacker-typer-content">
                <pre><code class="language-javascript"></code></pre>
            </div>
        `;
        
        const footer = document.querySelector('footer');
        if (footer) {
            document.body.insertBefore(hackerTyper, footer);
            
            const codeElement = hackerTyper.querySelector('code');
            let currentIndex = 0;
            
            // Add CSS for hacker typer
            const style = document.createElement('style');
            style.textContent = `
                .hacker-typer {
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    width: 300px;
                    background-color: var(--dark-color);
                    border: 1px solid var(--primary-color);
                    border-radius: 8px;
                    box-shadow: var(--neon-green-glow);
                    z-index: 100;
                    overflow: hidden;
                    transform: translateX(-320px);
                    transition: transform 0.3s ease;
                }
                
                .hacker-typer.active {
                    transform: translateX(0);
                }
                
                .hacker-typer-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.5rem;
                    background-color: var(--light-color);
                    border-bottom: 1px solid var(--primary-color);
                }
                
                .hacker-typer-title {
                    color: var(--primary-color);
                    font-size: 0.9rem;
                }
                
                .hacker-typer-controls {
                    display: flex;
                    gap: 0.5rem;
                }
                
                .hacker-typer-btn {
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    text-align: center;
                    line-height: 12px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 10px;
                }
                
                .minimize {
                    background-color: #ffbd2e;
                    color: #333;
                }
                
                .maximize {
                    background-color: #28c940;
                    color: #333;
                }
                
                .close {
                    background-color: #ff5f56;
                    color: #333;
                }
                
                .hacker-typer-content {
                    padding: 0.5rem;
                    max-height: 200px;
                    overflow-y: auto;
                }
                
                .hacker-typer-content pre {
                    margin: 0;
                }
                
                .hacker-typer-content code {
                    color: var(--primary-color);
                    font-family: 'Hack', 'Courier New', monospace;
                    font-size: 0.8rem;
                }
                
                .hacker-typer-toggle {
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    width: 40px;
                    height: 40px;
                    background-color: var(--primary-color);
                    color: var(--dark-color);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 101;
                    box-shadow: var(--neon-green-glow);
                    transition: var(--transition);
                }
                
                .hacker-typer-toggle:hover {
                    transform: scale(1.1);
                }
            `;
            document.head.appendChild(style);
            
            // Add toggle button
            const toggleButton = document.createElement('div');
            toggleButton.className = 'hacker-typer-toggle';
            toggleButton.innerHTML = '<i class="fas fa-terminal"></i>';
            document.body.appendChild(toggleButton);
            
            // Toggle hacker typer
            toggleButton.addEventListener('click', () => {
                hackerTyper.classList.toggle('active');
                playHackerSound('click');
                
                if (hackerTyper.classList.contains('active')) {
                    // Start typing effect
                    const typingInterval = setInterval(() => {
                        if (currentIndex < hackerCode.length) {
                            codeElement.textContent = hackerCode.substring(0, currentIndex + 3);
                            currentIndex += 3;
                            hackerTyper.querySelector('.hacker-typer-content').scrollTop = 
                                hackerTyper.querySelector('.hacker-typer-content').scrollHeight;
                        } else {
                            clearInterval(typingInterval);
                        }
                    }, 50);
                } else {
                    // Reset typing
                    currentIndex = 0;
                    codeElement.textContent = '';
                }
            });
            
            // Close button functionality
            hackerTyper.querySelector('.close').addEventListener('click', () => {
                hackerTyper.classList.remove('active');
                currentIndex = 0;
                codeElement.textContent = '';
                playHackerSound('click');
            });
        }
    }
    
    addHackerTyperEffect();
});
