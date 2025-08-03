// Terminal-Style Portfolio JavaScript - Interactive Navigation & Effects

document.addEventListener('DOMContentLoaded', () => {
    // Terminal Navigation System
    const navTabs = document.querySelectorAll('.nav-tab');
    const terminalSections = document.querySelectorAll('.terminal-section');
    
    // Tab switching functionality
    navTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            const targetTab = e.target.getAttribute('data-tab');
            
            // Remove active class from all tabs and sections
            navTabs.forEach(t => t.classList.remove('active'));
            terminalSections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding section
            e.target.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
    
    // Keyboard shortcuts for tab navigation
    document.addEventListener('keydown', (e) => {
        // Ctrl + number keys for tab switching
        if (e.ctrlKey && e.key >= '1' && e.key <= '5') {
            e.preventDefault();
            const tabIndex = parseInt(e.key) - 1;
            const targetTab = navTabs[tabIndex];
            if (targetTab) {
                targetTab.click();
            }
        }
        
        // Alt + Left/Right for tab navigation
        if (e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
            e.preventDefault();
            const currentActiveTab = document.querySelector('.nav-tab.active');
            const currentIndex = Array.from(navTabs).indexOf(currentActiveTab);
            
            let nextIndex;
            if (e.key === 'ArrowRight') {
                nextIndex = (currentIndex + 1) % navTabs.length;
            } else {
                nextIndex = (currentIndex - 1 + navTabs.length) % navTabs.length;
            }
            
            navTabs[nextIndex].click();
        }
    });
    
    // Terminal Status Bar - Current Time
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            timeElement.textContent = timeString;
        }
    }
    
    // Update time immediately and then every minute
    updateTime();
    setInterval(updateTime, 60000);
    
    // Terminal Window Controls (Easter Eggs)
    const closeBtn = document.querySelector('.terminal-button.close');
    const minimizeBtn = document.querySelector('.terminal-button.minimize');
    const maximizeBtn = document.querySelector('.terminal-button.maximize');
    
    closeBtn?.addEventListener('click', () => {
        if (confirm('Are you sure you want to close this terminal session?')) {
            document.body.style.opacity = '0';
            setTimeout(() => {
                document.body.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: monospace; color: #39d353; background: #0d1117;">Connection closed by remote host.</div>';
            }, 500);
        }
    });
    
    minimizeBtn?.addEventListener('click', () => {
        const terminalWindow = document.querySelector('.terminal-window');
        terminalWindow.style.transform = 'scale(0.1)';
        terminalWindow.style.opacity = '0.3';
        setTimeout(() => {
            terminalWindow.style.transform = 'scale(1)';
            terminalWindow.style.opacity = '1';
        }, 1000);
    });
    
    maximizeBtn?.addEventListener('click', () => {
        const terminalWindow = document.querySelector('.terminal-window');
        if (terminalWindow.style.transform === 'scale(1.05)') {
            terminalWindow.style.transform = 'scale(1)';
        } else {
            terminalWindow.style.transform = 'scale(1.05)';
        }
    });
    
    // Typewriter Effect for Dynamic Content
    function typeWriter(element, text, speed = 50) {
        element.innerHTML = '';
        let i = 0;
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // Cursor Blinking Animation Enhancement
    function enhanceCursors() {
        const cursors = document.querySelectorAll('.cursor');
        cursors.forEach(cursor => {
            // Add random delay to make cursors feel more organic
            const delay = Math.random() * 2000;
            cursor.style.animationDelay = `${delay}ms`;
        });
    }
    
    enhanceCursors();
    
    // Terminal Command Simulation (Easter Egg)
    let commandHistory = [];
    let historyIndex = -1;
    
    // Listen for specific keyboard patterns
    document.addEventListener('keydown', (e) => {
        // Easter egg: Konami code equivalent for terminal
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            showCommandPrompt();
        }
    });
    
    function showCommandPrompt() {
        const command = prompt('manoj@portfolio:~$ ');
        if (command) {
            commandHistory.push(command);
            executeCommand(command.toLowerCase().trim());
        }
    }
    
    function executeCommand(command) {
        const output = document.createElement('div');
        output.style.position = 'fixed';
        output.style.top = '20px';
        output.style.right = '20px';
        output.style.background = 'var(--bg-secondary)';
        output.style.color = 'var(--accent-green)';
        output.style.padding = '10px';
        output.style.fontFamily = 'var(--font-mono)';
        output.style.fontSize = '12px';
        output.style.borderRadius = '4px';
        output.style.zIndex = '9999';
        output.style.border = '1px solid var(--bg-tertiary)';
        
        switch (command) {
            case 'help':
                output.innerHTML = `
                    Available commands:<br>
                    • whoami - Display user info<br>
                    • ls - List sections<br>
                    • pwd - Show current directory<br>
                    • clear - Clear output<br>
                    • contact - Show contact info<br>
                    • skills - List technical skills<br>
                    • projects - Show recent projects
                `;
                break;
            case 'whoami':
                output.innerHTML = 'manoj-palasamudram<br>Software Engineer & Developer Tools Expert';
                break;
            case 'ls':
                output.innerHTML = 'about.md  experience.js  projects.json  package.json  contact.env';
                break;
            case 'pwd':
                output.innerHTML = '/home/manoj/portfolio';
                break;
            case 'contact':
                output.innerHTML = 'Email: manojpls@icloud.com<br>GitHub: github.com/manoj30075<br>LinkedIn: linkedin.com/in/manojpls';
                break;
            case 'skills':
                output.innerHTML = 'React • TypeScript • Python • VSCode Extensions • JupyterLab • AI Development';
                break;
            case 'projects':
                output.innerHTML = 'DevFlow CLI (Claude Code automation)<br>Divergent Paths (AI scenario explorer)';
                break;
            case 'clear':
                // Don't show output for clear command
                return;
            default:
                output.innerHTML = `bash: ${command}: command not found<br>Type 'help' for available commands`;
        }
        
        document.body.appendChild(output);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (output.parentNode) {
                output.parentNode.removeChild(output);
            }
        }, 5000);
    }
    
    // Smooth scrolling for any internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Terminal window resize effect
    window.addEventListener('resize', () => {
        // Add subtle effect when window is resized
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    });
    
    // Performance optimization: Preload tab content
    function preloadContent() {
        // This ensures smooth tab switching
        terminalSections.forEach(section => {
            section.style.display = 'block';
            section.offsetHeight; // Force layout calculation
            if (!section.classList.contains('active')) {
                section.style.display = 'none';
            }
        });
    }
    
    // Initialize preloading after a short delay
    setTimeout(preloadContent, 100);
    
    // Add visual feedback for interactive elements
    document.querySelectorAll('button, a').forEach(element => {
        element.addEventListener('mousedown', () => {
            element.style.transform = 'scale(0.98)';
        });
        
        element.addEventListener('mouseup', () => {
            element.style.transform = 'scale(1)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'scale(1)';
        });
    });
    
    // Console welcome message
    console.log(`
    ╭─────────────────────────────────────────────────────────────────╮
    │  Welcome to Manoj's Terminal Portfolio!                        │
    │                                                                 │
    │  Easter eggs:                                                   │
    │  • Ctrl+Shift+C: Open command prompt                          │
    │  • Ctrl+1-5: Quick tab navigation                             │
    │  • Alt+←/→: Navigate tabs                                      │
    │                                                                 │
    │  Built with: Code as Art, Terminal as Canvas                   │
    ╰─────────────────────────────────────────────────────────────────╯
    `);
    
    // Add subtle terminal startup effect
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});