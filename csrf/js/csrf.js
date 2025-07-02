/**
 * CSRF Demo JavaScript
 * This file contains the functionality for the CSRF vulnerability demonstration
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
    const requestMonitor = document.getElementById('request-monitor');
    const securityMonitor = document.getElementById('security-monitor');
    
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
    securityMonitor.innerHTML = '';
    
    addLogEntry(requestMonitor, 'Request monitor initialized.', 'info');
    addLogEntry(securityMonitor, 'Security monitor initialized. Status: Secure', 'success');
    
    // Create overlay for malicious site
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
    
    // Vulnerable version functionality
    const vulnerableBalance = document.getElementById('vulnerable-balance');
    let vulnerableBalanceValue = 1000;
    
    document.getElementById('vulnerable-transfer-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const amount = parseInt(document.getElementById('vulnerable-amount').value);
        if (isNaN(amount) || amount <= 0 || amount > vulnerableBalanceValue) {
            addLogEntry(requestMonitor, 'Invalid transfer amount', 'error');
            return;
        }
        
        // Process the transfer
        vulnerableBalanceValue -= amount;
        vulnerableBalance.textContent = `$${vulnerableBalanceValue.toFixed(2)}`;
        
        // Add transaction to history
        const transactionDiv = document.createElement('div');
        transactionDiv.className = 'transaction';
        
        const dateSpan = document.createElement('span');
        dateSpan.className = 'transaction-date';
        dateSpan.textContent = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        
        const descSpan = document.createElement('span');
        descSpan.className = 'transaction-description';
        descSpan.textContent = 'Transfer to Jane Smith';
        
        const amountSpan = document.createElement('span');
        amountSpan.className = 'transaction-amount debit';
        amountSpan.textContent = `-$${amount.toFixed(2)}`;
        
        transactionDiv.appendChild(dateSpan);
        transactionDiv.appendChild(descSpan);
        transactionDiv.appendChild(amountSpan);
        
        document.getElementById('vulnerable-transactions').prepend(transactionDiv);
        
        addLogEntry(requestMonitor, `Transfer request processed: $${amount.toFixed(2)} to Jane Smith`, 'info');
        addLogEntry(securityMonitor, 'Transfer completed without CSRF protection!', 'warning');
        
        // Reset form
        document.getElementById('vulnerable-amount').value = '100';
    });
    
    // Fixed version functionality
    const fixedBalance = document.getElementById('fixed-balance');
    let fixedBalanceValue = 1000;
    
    document.getElementById('fixed-transfer-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const amount = parseInt(document.getElementById('fixed-amount').value);
        if (isNaN(amount) || amount <= 0 || amount > fixedBalanceValue) {
            addLogEntry(requestMonitor, 'Invalid transfer amount', 'error');
            return;
        }
        
        const csrfToken = document.getElementById('csrf-token').value;
        if (!csrfToken) {
            addLogEntry(requestMonitor, 'Missing CSRF token', 'error');
            addLogEntry(securityMonitor, 'Transfer rejected: Missing CSRF token', 'error');
            return;
        }
        
        // Process the transfer
        fixedBalanceValue -= amount;
        fixedBalance.textContent = `$${fixedBalanceValue.toFixed(2)}`;
        
        // Add transaction to history
        const transactionDiv = document.createElement('div');
        transactionDiv.className = 'transaction';
        
        const dateSpan = document.createElement('span');
        dateSpan.className = 'transaction-date';
        dateSpan.textContent = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        
        const descSpan = document.createElement('span');
        descSpan.className = 'transaction-description';
        descSpan.textContent = 'Transfer to Jane Smith';
        
        const amountSpan = document.createElement('span');
        amountSpan.className = 'transaction-amount debit';
        amountSpan.textContent = `-$${amount.toFixed(2)}`;
        
        transactionDiv.appendChild(dateSpan);
        transactionDiv.appendChild(descSpan);
        transactionDiv.appendChild(amountSpan);
        
        document.getElementById('fixed-transactions').prepend(transactionDiv);
        
        addLogEntry(requestMonitor, `Transfer request processed: $${amount.toFixed(2)} to Jane Smith with CSRF token`, 'info');
        addLogEntry(securityMonitor, 'Transfer completed with CSRF protection. Valid token verified.', 'success');
        
        // Generate a new CSRF token
        document.getElementById('csrf-token').value = generateRandomToken();
        
        // Reset form
        document.getElementById('fixed-amount').value = '100';
    });
    
    // Helper function to generate a random token
    function generateRandomToken() {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result + '-' + Date.now().toString(16);
    }
    
    // Malicious site functionality for vulnerable version
    document.getElementById('show-malicious-site').addEventListener('click', function() {
        document.getElementById('malicious-site').style.display = 'block';
        overlay.style.display = 'block';
        
        addLogEntry(requestMonitor, 'User visited malicious website', 'warning');
        addLogEntry(securityMonitor, 'Potential CSRF attack detected!', 'warning');
        
        // Simulate the attack after a short delay
        setTimeout(() => {
            addLogEntry(requestMonitor, 'Hidden form submitted from malicious site', 'error');
            
            // Process the malicious transfer
            vulnerableBalanceValue -= 500;
            vulnerableBalance.textContent = `$${vulnerableBalanceValue.toFixed(2)}`;
            
            // Add transaction to history
            const transactionDiv = document.createElement('div');
            transactionDiv.className = 'transaction';
            
            const dateSpan = document.createElement('span');
            dateSpan.className = 'transaction-date';
            dateSpan.textContent = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
            
            const descSpan = document.createElement('span');
            descSpan.className = 'transaction-description';
            descSpan.textContent = 'Transfer to Hacker';
            
            const amountSpan = document.createElement('span');
            amountSpan.className = 'transaction-amount debit';
            amountSpan.textContent = '-$500.00';
            
            transactionDiv.appendChild(dateSpan);
            transactionDiv.appendChild(descSpan);
            transactionDiv.appendChild(amountSpan);
            
            document.getElementById('vulnerable-transactions').prepend(transactionDiv);
            
            addLogEntry(securityMonitor, 'CSRF attack successful! $500 transferred to attacker without user consent.', 'error');
            
            // Add a visual indicator to the transaction
            transactionDiv.style.backgroundColor = '#ffebee';
            transactionDiv.style.borderLeft = '3px solid #e53935';
            transactionDiv.style.animation = 'blink 1s infinite';
        }, 1500);
    });
    
    document.getElementById('close-malicious-site').addEventListener('click', function() {
        document.getElementById('malicious-site').style.display = 'none';
        overlay.style.display = 'none';
        
        addLogEntry(requestMonitor, 'Malicious website closed', 'info');
    });
    
    // Malicious site functionality for fixed version
    document.getElementById('show-malicious-site-fixed').addEventListener('click', function() {
        document.getElementById('malicious-site-fixed').style.display = 'block';
        overlay.style.display = 'block';
        
        addLogEntry(requestMonitor, 'User visited malicious website', 'warning');
        addLogEntry(securityMonitor, 'Potential CSRF attack detected!', 'warning');
        
        // Show the attack result after a short delay
        setTimeout(() => {
            document.getElementById('attack-result-fixed').style.display = 'flex';
            
            addLogEntry(requestMonitor, 'Hidden form submitted from malicious site', 'warning');
            addLogEntry(securityMonitor, 'CSRF attack blocked! Missing CSRF token in the request.', 'success');
            
            // Make the attack result blink
            document.getElementById('attack-result-fixed').classList.add('blink');
            setTimeout(() => {
                document.getElementById('attack-result-fixed').classList.remove('blink');
            }, 3000);
        }, 1500);
    });
    
    document.getElementById('close-malicious-site-fixed').addEventListener('click', function() {
        document.getElementById('malicious-site-fixed').style.display = 'none';
        overlay.style.display = 'none';
        document.getElementById('attack-result-fixed').style.display = 'none';
        
        addLogEntry(requestMonitor, 'Malicious website closed', 'info');
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
                    addLogEntry(securityMonitor, 'Monitor minimized', 'info');
                } else {
                    monitorContent.style.display = '';
                    addLogEntry(securityMonitor, 'Monitor restored', 'info');
                }
            } else if (action === 'maximize') {
                if (monitorContent.style.maxHeight !== '500px') {
                    monitorContent.style.maxHeight = '500px';
                    addLogEntry(securityMonitor, 'Monitor maximized', 'info');
                } else {
                    monitorContent.style.maxHeight = '300px';
                    addLogEntry(securityMonitor, 'Monitor restored', 'info');
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
                        addLogEntry(securityMonitor, 'Monitor restored', 'info');
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
        button.style.position = 'absolute';
        button.style.top = '0.5rem';
        button.style.right = '0.5rem';
        button.style.padding = '0.25rem 0.5rem';
        button.style.fontSize = '0.8rem';
        button.style.backgroundColor = '#4a6fa5';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        
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
        snippet.style.position = 'relative';
        const code = snippet.querySelector('code');
        if (code) {
            const text = code.textContent;
            const copyBtn = createCopyButton(text);
            snippet.appendChild(copyBtn);
        }
    });
});
