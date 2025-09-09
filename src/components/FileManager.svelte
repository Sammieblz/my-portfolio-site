<script>
    import { onMount } from 'svelte';
    
    export let window;

    let currentPath = '/home/samuel';
    let selectedItems = [];
    let viewMode = 'grid'; // 'grid' or 'list'
    let showHidden = false;

    const fileSystem = {
        '/home/samuel': {
            type: 'directory',
            children: {
                'Desktop': {
                    type: 'directory',
                    children: {
                        'Terminal': { type: 'app', icon: 'fas fa-terminal', color: 'kali-green' },
                        'File Manager': { type: 'app', icon: 'fas fa-folder', color: 'kali-blue' },
                        'GitHub Projects': { type: 'app', icon: 'fab fa-github', color: 'kali-yellow' },
                        'Resume.pdf': { type: 'file', icon: 'fas fa-file-pdf', color: 'kali-red' },
                        'About Samuel': { type: 'app', icon: 'fas fa-user', color: 'kali-red' },
                        'Contact': { type: 'app', icon: 'fas fa-envelope', color: 'kali-blue' }
                    }
                },
                'Documents': {
                    type: 'directory',
                    children: {
                        'resume.pdf': { type: 'file', icon: 'fas fa-file-pdf', color: 'kali-red', size: '2.3 MB' },
                        'projects.md': { type: 'file', icon: 'fas fa-file-alt', color: 'kali-blue', size: '1.2 KB' },
                        'skills.txt': { type: 'file', icon: 'fas fa-file-text', color: 'kali-green', size: '856 B' }
                    }
                },
                'Projects': {
                    type: 'directory',
                    children: {
                        'cleveland-tennis': { type: 'directory', icon: 'fas fa-folder', color: 'kali-blue' },
                        'v3locity': { type: 'directory', icon: 'fas fa-folder', color: 'kali-green' },
                        'client-portal': { type: 'directory', icon: 'fas fa-folder', color: 'kali-yellow' }
                    }
                },
                'Downloads': {
                    type: 'directory',
                    children: {}
                },
                'Pictures': {
                    type: 'directory',
                    children: {
                        'profile.jpg': { type: 'file', icon: 'fas fa-image', color: 'kali-blue', size: '1.8 MB' },
                        'screenshots': { type: 'directory', icon: 'fas fa-folder', color: 'kali-blue' }
                    }
                }
            }
        }
    };

    let currentDirectory = fileSystem[currentPath];

    function navigateTo(path) {
        if (path === '..') {
            const parts = currentPath.split('/').filter(p => p);
            if (parts.length > 2) { // More than ['home', 'samuel']
                parts.pop();
                currentPath = '/' + parts.join('/');
            } else {
                currentPath = '/home/samuel';
            }
        } else {
            if (currentPath === '/home/samuel') {
                currentPath = `/home/samuel/${path}`;
            } else {
                currentPath = `${currentPath}/${path}`;
            }
        }
        
        currentDirectory = getDirectoryAtPath(currentPath);
        if (!currentDirectory) {
            // If directory not found, go back to home
            currentPath = '/home/samuel';
            currentDirectory = fileSystem[currentPath];
        }
    }

    function getDirectoryAtPath(path) {
        if (path === '/home/samuel') {
            return fileSystem['/home/samuel'];
        }
        
        const parts = path.split('/').filter(p => p);
        let current = fileSystem['/home/samuel'];
        
        // Skip 'home' and 'samuel' parts since we start from /home/samuel
        for (let i = 2; i < parts.length; i++) {
            const part = parts[i];
            if (current && current.children && current.children[part]) {
                current = current.children[part];
            } else {
                return null;
            }
        }
        
        return current;
    }

    function handleItemClick(item, event) {
        if (event.ctrlKey || event.metaKey) {
            // Multi-select
            if (selectedItems.includes(item)) {
                selectedItems = selectedItems.filter(i => i !== item);
            } else {
                selectedItems = [...selectedItems, item];
            }
        } else {
            // Single select
            selectedItems = [item];
            
            if (item.type === 'directory') {
                navigateTo(item.name);
            } else if (item.type === 'app') {
                // Open app
                const event = new CustomEvent('openApp', { 
                    detail: { 
                        type: item.name.toLowerCase().replace(' ', '-').replace('github projects', 'projects'),
                        title: item.name,
                        width: 800,
                        height: 600
                    } 
                });
                window.dispatchEvent(event);
            } else if (item.name === 'resume.pdf') {
                const event = new CustomEvent('openApp', { 
                    detail: { 
                        type: 'resume',
                        title: 'Resume.pdf',
                        width: 800,
                        height: 600
                    } 
                });
                window.dispatchEvent(event);
            }
        }
    }

    function handleItemDoubleClick(item) {
        if (item.type === 'directory') {
            navigateTo(item.name);
        } else if (item.type === 'app' || item.name === 'resume.pdf') {
            handleItemClick(item, {});
        }
    }

    function getFileIcon(item) {
        if (item.icon) return item.icon;
        
        if (item.type === 'directory') return 'fas fa-folder';
        if (item.name.endsWith('.pdf')) return 'fas fa-file-pdf';
        if (item.name.endsWith('.txt')) return 'fas fa-file-text';
        if (item.name.endsWith('.md')) return 'fas fa-file-alt';
        if (item.name.endsWith('.jpg') || item.name.endsWith('.png')) return 'fas fa-image';
        
        return 'fas fa-file';
    }

    function getFileColor(item) {
        if (item.color) return item.color;
        
        if (item.type === 'directory') return 'kali-blue';
        if (item.name.endsWith('.pdf')) return 'kali-red';
        if (item.name.endsWith('.txt')) return 'kali-green';
        if (item.name.endsWith('.md')) return 'kali-blue';
        if (item.name.endsWith('.jpg') || item.name.endsWith('.png')) return 'kali-yellow';
        
        return 'text-gray-400';
    }

    function formatFileSize(size) {
        if (!size) return '';
        return size;
    }

    onMount(() => {
        // Initialize current directory
        currentDirectory = fileSystem[currentPath];
    });
</script>

<div class="w-full h-full file-manager overflow-hidden flex flex-col">

    <!-- Toolbar -->
    <div class="px-4 py-2 border-b border-gray-600 flex items-center justify-between">
        <div class="flex items-center gap-2">
            <button
                class="px-2 py-1 text-xs rounded hover:bg-gray-600"
                on:click={() => currentPath !== '/home/samuel' && navigateTo('..')}
                disabled={currentPath === '/home/samuel'}
            >
                <i class="fas fa-arrow-left"></i>
            </button>
            <button class="px-2 py-1 text-xs rounded hover:bg-gray-600">
                <i class="fas fa-arrow-right"></i>
            </button>
            <button class="px-2 py-1 text-xs rounded hover:bg-gray-600">
                <i class="fas fa-arrow-up"></i>
            </button>
            <div class="w-px h-4 bg-gray-600 mx-2"></div>
            <button class="px-2 py-1 text-xs rounded hover:bg-gray-600">
                <i class="fas fa-home"></i>
            </button>
        </div>
        
        <div class="flex items-center gap-2">
            <button
                class="px-2 py-1 text-xs rounded hover:bg-gray-600"
                class:bg-gray-600={viewMode === 'grid'}
                on:click={() => viewMode = 'grid'}
            >
                <i class="fas fa-th"></i>
            </button>
            <button
                class="px-2 py-1 text-xs rounded hover:bg-gray-600"
                class:bg-gray-600={viewMode === 'list'}
                on:click={() => viewMode = 'list'}
            >
                <i class="fas fa-list"></i>
            </button>
        </div>
    </div>

    <!-- Address Bar -->
    <div class="px-4 py-2 border-b border-gray-600">
        <div class="flex items-center gap-2">
            <span class="text-xs mono text-gray-400">Path:</span>
            <span class="text-xs mono text-white">{currentPath}</span>
        </div>
    </div>

    <!-- File List -->
    <div class="flex-1 overflow-y-auto p-4">
        {#if currentDirectory && currentDirectory.children}
            {#if viewMode === 'grid'}
                <div class="grid grid-cols-6 gap-4">
                    {#each Object.entries(currentDirectory.children) as [name, item]}
                        <div
                            class="file-item p-3 text-center cursor-pointer rounded"
                            class:bg-blue-500={selectedItems.some(s => s.name === name)}
                            class:bg-opacity-20={selectedItems.some(s => s.name === name)}
                            role="button"
                            tabindex="0"
                            on:click={(e) => handleItemClick({...item, name}, e)}
                            on:dblclick={() => handleItemDoubleClick({...item, name})}
                            on:keydown={(e) => e.key === 'Enter' && handleItemClick({...item, name}, e)}
                        >
                            <div class="text-3xl mb-2 {getFileColor({...item, name})}">
                                <i class={getFileIcon({...item, name})}></i>
                            </div>
                            <div class="text-xs text-white font-medium leading-tight break-words">
                                {name}
                            </div>
                            {#if item.size}
                                <div class="text-xs text-gray-400 mt-1">
                                    {formatFileSize(item.size)}
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="space-y-1">
                    {#each Object.entries(currentDirectory.children) as [name, item]}
                        <div
                            class="file-item p-2 flex items-center gap-3 cursor-pointer rounded"
                            class:bg-blue-500={selectedItems.some(s => s.name === name)}
                            class:bg-opacity-20={selectedItems.some(s => s.name === name)}
                            role="button"
                            tabindex="0"
                            on:click={(e) => handleItemClick({...item, name}, e)}
                            on:dblclick={() => handleItemDoubleClick({...item, name})}
                            on:keydown={(e) => e.key === 'Enter' && handleItemClick({...item, name}, e)}
                        >
                            <div class="text-lg {getFileColor({...item, name})}">
                                <i class={getFileIcon({...item, name})}></i>
                            </div>
                            <div class="flex-1 text-sm text-white">
                                {name}
                            </div>
                            <div class="text-xs text-gray-400">
                                {item.type === 'directory' ? 'Directory' : 'File'}
                            </div>
                            {#if item.size}
                                <div class="text-xs text-gray-400">
                                    {formatFileSize(item.size)}
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
            {/if}
        {:else}
            <div class="text-center text-gray-400 py-8">
                <i class="fas fa-folder-open text-4xl mb-2"></i>
                <div>Directory not found</div>
            </div>
        {/if}
    </div>
</div>
