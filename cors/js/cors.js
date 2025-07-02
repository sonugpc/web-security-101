/**
 * CORS Demo JavaScript
 * This file contains the functionality for the CORS vulnerability demonstration
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize syntax highlighting
    hljs.highlightAll();
    
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Initialize the real-time monitor
    const requestMonitor = document.getElementById('cors-request-monitor');
    const headersMonitor = document.getElementById('cors-headers-monitor');
    
    // Function to add log entry to monitor
    function addLogEntry(monitor, message, type = '') {
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        monitor.appendChild(logEntry);
        monitor.scrollTop = monitor.scrollHeight; // Auto-scroll to bottom
    }
    
    // Clear initial log entries
    requestMonitor.innerHTML = '';
    headersMonitor.innerHTML = '';
    
    addLogEntry(requestMonitor, 'CORS request monitor initialized.', 'info');
    addLogEntry(headersMonitor, 'CORS headers monitor initialized.', 'info');
    
    // Vulnerable CORS simulation
    document.getElementById('simulate-vulnerable-cors').addEventListener('click', function() {
        // Show the simulation result
        document.getElementById('vulnerable-simulation-result').style.display = 'block';
        
        // Scroll to the simulation result
        document.getElementById('vulnerable-simulation-result').scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Add log entries for the simulation
        addLogEntry(requestMonitor, 'Cross-origin request initiated from evil-site.com to api.example.com', 'warning');
        addLogEntry(headersMonitor, 'Request headers: Origin: https://evil-site.com', 'info');
        
        // Simulate the request/response flow with delays to make it more realistic
        setTimeout(() => {
            addLogEntry(requestMonitor, 'Request sent to api.example.com/api/users/me with credentials', 'info');
            
            setTimeout(() => {
                addLogEntry(headersMonitor, 'Response headers received: Access-Control-Allow-Origin: *', 'warning');
                addLogEntry(headersMonitor, 'Response headers received: Access-Control-Allow-Credentials: true', 'error');
                
                setTimeout(() => {
                    addLogEntry(requestMonitor, 'Server responded with status 200 OK', 'info');
                    addLogEntry(requestMonitor, 'Sensitive data accessed by malicious site!', 'error');
                    
                    // Highlight the attack result
                    const attackResult = document.querySelector('#vulnerable-simulation-result .attack-result');
                    attackResult.classList.add('blink');
                    setTimeout(() => {
                        attackResult.classList.remove('blink');
                    }, 3000);
                }, 800);
            }, 1000);
        }, 500);
    });
    
    // Fixed CORS simulation
    document.getElementById('simulate-fixed-cors').addEventListener('click', function() {
        // Show the simulation result
        document.getElementById('fixed-simulation-result').style.display = 'block';
        
        // Scroll to the simulation result
        document.getElementById('fixed-simulation-result').scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Add log entries for the simulation
        addLogEntry(requestMonitor, 'Cross-origin request initiated from evil-site.com to api.example.com', 'warning');
        addLogEntry(headersMonitor, 'Request headers: Origin: https://evil-site.com', 'info');
        
        // Simulate the request/response flow with delays to make it more realistic
        setTimeout(() => {
            addLogEntry(requestMonitor, 'Request sent to api.example.com/api/users/me with credentials', 'info');
            
            setTimeout(() => {
                addLogEntry(headersMonitor, 'Response headers received: Access-Control-Allow-Origin: https://app.example.com', 'success');
                addLogEntry(headersMonitor, 'Origin mismatch: evil-site.com ≠ app.example.com', 'warning');
                
                setTimeout(() => {
                    addLogEntry(requestMonitor, 'Browser blocked access to the response due to CORS policy', 'success');
                    addLogEntry(requestMonitor, 'Attack prevented by proper CORS configuration!', 'success');
                    
                    // Highlight the attack result
                    const attackResult = document.querySelector('#fixed-simulation-result .attack-result');
                    attackResult.classList.add('blink');
                    setTimeout(() => {
                        attackResult.classList.remove('blink');
                    }, 3000);
                }, 800);
            }, 1000);
        }, 500);
    });
    
    // Add some fun interactive elements to the monitor
    const monitorBtns = document.querySelectorAll('.monitor-btn');
    monitorBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.classList.contains('minimize') ? 'minimize' :
                          this.classList.contains('maximize') ? 'maximize' : 'close';
            
            const monitorContent = document.querySelector('.monitor-content');
            
            if (action === 'minimize') {
                if (monitorContent.style.display !== 'none') {
                    monitorContent.style.display = 'none';
                    addLogEntry(headersMonitor, 'Monitor minimized', 'info');
                } else {
                    monitorContent.style.display = '';
                    addLogEntry(headersMonitor, 'Monitor restored', 'info');
                }
            } else if (action === 'maximize') {
                if (monitorContent.style.maxHeight !== '500px') {
                    monitorContent.style.maxHeight = '500px';
                    addLogEntry(headersMonitor, 'Monitor maximized', 'info');
                } else {
                    monitorContent.style.maxHeight = '300px';
                    addLogEntry(headersMonitor, 'Monitor restored', 'info');
                }
            } else {
                const monitorContainer = document.querySelector('.monitor-container');
                if (monitorContainer.style.display !== 'none') {
                    monitorContainer.style.display = 'none';
                    
                    // Add a restore button
                    const restoreBtn = document.createElement('button');
                    restoreBtn.textContent = 'Restore Monitor';
                    restoreBtn.className = 'restore-btn';
                    restoreBtn.style.marginTop = '1rem';
                    restoreBtn.style.padding = '0.5rem 1rem';
                    restoreBtn.style.backgroundColor = '#323232';
                    restoreBtn.style.color = 'white';
                    restoreBtn.style.border = 'none';
                    restoreBtn.style.borderRadius = '4px';
                    restoreBtn.style.cursor = 'pointer';
                    
                    restoreBtn.addEventListener('click', () => {
                        monitorContainer.style.display = '';
                        restoreBtn.remove();
                        addLogEntry(headersMonitor, 'Monitor restored', 'info');
                    });
                    
                    document.querySelector('.realtime-monitor').appendChild(restoreBtn);
                }
            }
        });
    });
    
    // Add copy buttons to code snippets
    function createCopyButton(text) {
        const button = document.createElement('button');
        button.textContent = 'Copy';
        button.className = 'copy-btn';
        
        button.addEventListener('click', () => {
            navigator.clipboard.writeText(text).then(() => {
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            });
        });
        
        return button;
    }
    
    document.querySelectorAll('.code-snippet').forEach(snippet => {
        const code = snippet.querySelector('code');
        if (code) {
            const text = code.textContent;
            const copyBtn = createCopyButton(text);
            snippet.appendChild(copyBtn);
        }
    });
    
    // Add interactive explanation for CORS concepts
    const corsExplanations = [
        {
            term: 'Same-Origin Policy',
            definition: 'A security mechanism that restricts how a document or script loaded from one origin can interact with resources from another origin.'
        },
        {
            term: 'Origin',
            definition: 'The combination of protocol (http/https), domain (example.com), and port (80, 443, etc.) that defines a security boundary.'
        },
        {
            term: 'Preflight Request',
            definition: 'An OPTIONS request that the browser sends before the actual request to check if the CORS protocol is understood and if the actual request is safe to send.'
        },
        {
            term: 'Access-Control-Allow-Origin',
            definition: 'A response header that indicates whether the response can be shared with requesting code from the given origin.'
        },
        {
            term: 'Access-Control-Allow-Credentials',
            definition: 'A response header that indicates whether the browser should include credentials (cookies, authorization headers) in the request.'
        }
    ];
    
    // Add these explanations to the learn tab if there's a suitable container
    const learnSection = document.querySelector('.learn-content');
    if (learnSection) {
        const glossarySection = document.createElement('div');
        glossarySection.className = 'learn-section';
        glossarySection.innerHTML = '<h4>CORS Glossary</h4>';
        
        const glossaryList = document.createElement('dl');
        glossaryList.className = 'cors-glossary';
        
        corsExplanations.forEach(item => {
            const dt = document.createElement('dt');
            dt.textContent = item.term;
            
            const dd = document.createElement('dd');
            dd.textContent = item.definition;
            
            glossaryList.appendChild(dt);
            glossaryList.appendChild(dd);
        });
        
        glossarySection.appendChild(glossaryList);
        
        // Add the glossary section before the Additional Resources section
        const additionalResourcesSection = document.querySelector('.learn-section:last-child');
        if (additionalResourcesSection) {
            learnSection.insertBefore(glossarySection, additionalResourcesSection);
        } else {
            learnSection.appendChild(glossarySection);
        }
    }
});
