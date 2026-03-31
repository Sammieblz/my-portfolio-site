<script>
    import { onMount } from 'svelte';
    import { profile, getTerminalFeaturedProjectsLines } from '$lib/profile';

    const HOME = profile.terminal.homeDir;
    const USER = profile.terminal.userAtHost;

    export let window;
    export let closeWindow;
    export let minimizeWindow;
    export let maximizeWindow;

    let terminalRef;
    let commandInput = '';
    let commandHistory = [];
    let historyIndex = -1;
    let output = [];
    let isProcessing = false;
    let currentDir = HOME;

    function promptLine() {
        return `${USER}:${currentDir}$`;
    }

    const commands = {
        'help': {
            description: 'Show available commands',
            execute: () => [
                'Available commands:',
                '  help          - Show this help message',
                '  clear         - Clear the terminal',
                '  whoami        - Display current user',
                '  pwd           - Print working directory',
                '  ls            - List files and directories',
                '  cd <dir>      - Change directory',
                '  cat <file>    - Display file contents',
                '  projects      - Show GitHub projects',
                '  about         - About Samuel',
                '  contact       - Contact information',
                '  resume        - Open resume',
                '  date          - Show current date and time',
                '  uptime        - Show system uptime',
                '  neofetch      - System information',
                '  history       - Show command history',
                '  exit          - Close terminal'
            ]
        },
        'clear': {
            description: 'Clear the terminal',
            execute: () => {
                output = [];
                return [];
            }
        },
        'whoami': {
            description: 'Display current user',
            execute: () => [profile.name]
        },
        'pwd': {
            description: 'Print working directory',
            execute: () => [currentDir]
        },
        'cd': {
            description: 'Change directory',
            execute: (args) => {
                if (!args[0]) {
                    currentDir = HOME;
                    return [currentDir];
                }
                
                const targetDir = args[0];
                if (targetDir === '..') {
                    const parts = currentDir.split('/').filter(p => p);
                    if (parts.length > 1) {
                        parts.pop();
                        currentDir = '/' + parts.join('/');
                    } else {
                        currentDir = HOME;
                    }
                } else if (targetDir === '~' || targetDir === HOME) {
                    currentDir = HOME;
                } else if (targetDir.startsWith('/')) {
                    currentDir = targetDir;
                } else {
                    currentDir = currentDir === '/' ? `/${targetDir}` : `${currentDir}/${targetDir}`;
                }
                
                return [currentDir];
            }
        },
        'ls': {
            description: 'List files and directories',
            execute: () => [
                'Desktop/',
                'Documents/',
                'Downloads/',
                'Projects/',
                'resume.pdf',
                'about.txt',
                'contact.txt',
                'hackathon.txt'
            ]
        },
        'cat': {
            description: 'Display file contents',
            execute: (args) => {
                if (!args[0]) return ['Usage: cat <filename>'];
                
                const h = profile.hackathons[0];
                const files = {
                    'about.txt': [
                        profile.name,
                        profile.role,
                        '',
                        'Education:',
                        '  - Associate of Business, University of Akron',
                        '  - Bachelor of Science in Computer Information Systems Programming',
                        '',
                        'Skills:',
                        '  - JavaScript, Python, Java, C++',
                        '  - React, Svelte, Angular, Next.js',
                        '  - Node.js, Express.js, MongoDB',
                        '  - Firebase, Vercel',
                        '',
                        'Experience:',
                        '  - Byteflow LLC Co-founder',
                        '  - Full Stack Development',
                        '  - Project Management',
                        ...(h
                            ? [
                                    '',
                                    'Hackathons:',
                                    `  - ${h.project} @ ${h.event}`
                              ]
                            : [])
                    ],
                    'contact.txt': [
                        'Contact Information:',
                        '',
                        `Email: ${profile.email}`,
                        `GitHub: ${profile.links.github}`,
                        `LinkedIn: ${profile.links.linkedin}`,
                        '',
                        `Location: ${profile.location}`,
                        `Available for: ${profile.contact.availabilityDetails}`
                    ],
                    ...(h
                        ? {
                              'hackathon.txt': [
                                  `${h.project} — ${h.event}`,
                                  '',
                                  ...h.awards.map((a) => `  * ${a}`),
                                  '',
                                  'Devpost:',
                                  `  ${h.projectUrl}`,
                                  '',
                                  `Event: ${h.eventUrl}`
                              ]
                          }
                        : {})
                };
                
                return files[args[0]] || [`cat: ${args[0]}: No such file or directory`];
            }
        },
        'projects': {
            description: 'Show GitHub projects',
            execute: () => getTerminalFeaturedProjectsLines()
        },
        'about': {
            description: 'About Samuel',
            execute: () => {
                const lines = [
                    `${profile.name} - ${profile.role}`,
                    '',
                    'A passionate developer with expertise in modern web technologies.',
                    'Graduated from The University of Akron with degrees in Business',
                    'and Computer Information Systems Programming.',
                    '',
                    'Co-founder of Byteflow LLC, where I apply academic knowledge',
                    'through practical experience in full-stack development.',
                    '',
                    'Specialized in JavaScript ecosystem including React, Svelte,',
                    'Angular, and Node.js, with experience in Python and Java.'
                ];
                const h = profile.hackathons[0];
                if (h) {
                    lines.push('');
                    lines.push(`Recent: ${h.project} @ ${h.event} — ${h.awards[0] || 'award winner'}`);
                }
                return lines;
            }
        },
        'contact': {
            description: 'Contact information',
            execute: () => [
                `Contact ${profile.name}:`,
                '',
                `Email: ${profile.email}`,
                `GitHub: ${profile.links.github}`,
                `LinkedIn: ${profile.links.linkedin}`,
                '',
                `Location: ${profile.location}`,
                `Status: ${profile.contact.availability}`
            ]
        },
        'resume': {
            description: 'Open resume',
            execute: () => {
                // This would trigger opening the resume viewer
                setTimeout(() => {
                    const event = new CustomEvent('openApp', { 
                        detail: { type: 'resume', title: 'Resume.pdf', width: 800, height: 600 } 
                    });
                    window.dispatchEvent(event);
                }, 100);
                return ['Opening resume...'];
            }
        },
        'date': {
            description: 'Show current date and time',
            execute: () => [new Date().toString()]
        },
        'uptime': {
            description: 'Show system uptime',
            execute: () => [`System uptime: ${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`]
        },
        'neofetch': {
            description: 'System information',
            execute: () => [
                USER,
                '-------------------',
                'OS: Kali Linux Portfolio v1.0',
                `Host: ${profile.name}'s Portfolio`,
                'Kernel: SvelteKit 2.0.0',
                'Shell: Terminal.js',
                'Terminal: Web Terminal',
                'CPU: Intel i7-12700K',
                'Memory: 32GB DDR4',
                'GPU: RTX 3080',
                'Theme: Kali Linux Dark'
            ]
        },
        'history': {
            description: 'Show command history',
            execute: () => {
                if (commandHistory.length === 0) {
                    return ['No commands in history'];
                }
                return commandHistory.map((cmd, index) => `${index + 1}  ${cmd}`);
            }
        }
    };

    function executeCommand(input) {
        const parts = input.trim().split(' ');
        const command = parts[0];
        const args = parts.slice(1);

        if (command === 'exit') {
            closeWindow(window.id);
            return;
        }

        if (command === 'clear') {
            output = [];
            return;
        }

        if (commands[command]) {
            isProcessing = true;
            setTimeout(() => {
                const result = commands[command].execute(args);
                output = [...output, ...result];
                isProcessing = false;
            }, 200);
        } else {
            output.push(`Command not found: ${command}. Type 'help' for available commands.`);
        }
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            if (commandInput.trim()) {
                output.push(`${promptLine()} ${commandInput}`);
                commandHistory.unshift(commandInput);
                historyIndex = -1;
                executeCommand(commandInput);
                commandInput = '';
            }
        } else if (event.key === 'ArrowUp') {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                commandInput = commandHistory[historyIndex];
            }
        } else if (event.key === 'ArrowDown') {
            if (historyIndex > 0) {
                historyIndex--;
                commandInput = commandHistory[historyIndex];
            } else if (historyIndex === 0) {
                historyIndex = -1;
                commandInput = '';
            }
        }
    }

    onMount(() => {
        output = [
            profile.terminal.welcomeLine,
            'Type "help" for available commands',
            '',
            promptLine()
        ];
        
        if (terminalRef) {
            terminalRef.focus();
        }
    });
</script>

<div class="w-full h-full terminal overflow-hidden flex flex-col">

    <!-- Terminal Content -->
    <div class="flex-1 p-4 overflow-y-auto">
        {#each output as line (line)}
            <div class="text-sm mono mb-1">
                {#if line.startsWith(USER)}
                    <span class="kali-green">{line.split('$')[0]}$</span>
                    <span class="kali-blue">{line.split('$')[1] || ''}</span>
                {:else if line.startsWith('Command not found')}
                    <span class="kali-red">{line}</span>
                {:else if line.startsWith('Available commands') || line.startsWith('Featured GitHub repos:') || line.startsWith('Hackathon:') || line.startsWith('Contact') || line.startsWith('About')}
                    <span class="kali-yellow font-semibold">{line}</span>
                {:else if line.startsWith('  ') || line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.')}
                    <span class="text-gray-300">{line}</span>
                {:else}
                    <span class="text-gray-100">{line}</span>
                {/if}
            </div>
        {/each}
        
        {#if isProcessing}
            <div class="text-sm mono">
                <span class="kali-green">{USER}:{currentDir}$</span>
                <span class="loading-dots kali-blue"></span>
            </div>
        {/if}
    </div>

    <!-- Command Input -->
    <div class="p-4 border-t border-gray-600">
        <div class="flex items-center">
            <span class="kali-green mono text-sm">{USER}:{currentDir}$</span>
            <input
                bind:this={terminalRef}
                bind:value={commandInput}
                on:keydown={handleKeyDown}
                class="flex-1 bg-transparent text-white mono text-sm ml-2 outline-none"
                placeholder="Enter command..."
                autocomplete="off"
            />
            <span class="terminal-cursor kali-green">|</span>
        </div>
    </div>
</div>
