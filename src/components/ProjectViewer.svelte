<script>
    import { onMount } from 'svelte';
    
    export let window;
    export let closeWindow;
    export let minimizeWindow;
    export let maximizeWindow;

    let projects = [];
    let loading = true;
    let error = null;
    let selectedProject = null;

    // GitHub API configuration
    const GITHUB_USERNAME = 'Sammieblz';
    const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=10`;

    async function fetchProjects() {
        try {
            loading = true;
            const response = await fetch(GITHUB_API_URL);
            
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Filter and format projects - exclude unwanted projects
            const excludedProjects = ['weather-app', 'IT-2320-interactive-internet-programming-projects', 'MyWebsite'];
            projects = data
                .filter(repo => !repo.fork && repo.name !== 'Sammieblz' && !excludedProjects.includes(repo.name))
                .map(repo => ({
                    id: repo.id,
                    name: repo.name,
                    description: repo.description || 'No description available',
                    url: repo.html_url,
                    homepage: repo.homepage,
                    language: repo.language || 'Unknown',
                    stars: repo.stargazers_count,
                    forks: repo.forks_count,
                    updated: new Date(repo.updated_at).toLocaleDateString(),
                    topics: repo.topics || [],
                    size: repo.size,
                    cloneUrl: repo.clone_url,
                    sshUrl: repo.ssh_url
                }))
                .slice(0, 6); // Limit to 6 projects
                
        } catch (err) {
            console.error('Error fetching projects:', err);
            error = err.message;
            
            // Fallback to hardcoded projects if API fails
            projects = [
                {
                    id: 1,
                    name: 'brack-app',
                    description: 'Brack (Book Tracking) is a digital book tracking webapp that allows users to keep track of the books they are reading and progress of reading.',
                    url: 'https://github.com/Sammieblz/brack-app',
                    homepage: null,
                    language: 'TypeScript',
                    stars: 0,
                    forks: 0,
                    updated: '2024-01-15',
                    topics: ['typescript', 'react', 'book-tracking', 'webapp'],
                    size: 1024,
                    cloneUrl: 'https://github.com/Sammieblz/brack-app.git',
                    sshUrl: 'git@github.com:Sammieblz/brack-app.git'
                },
                {
                    id: 2,
                    name: 'my-portfolio-site',
                    description: 'My portfolio site with a Kali Linux GUI feel.',
                    url: 'https://github.com/Sammieblz/my-portfolio-site',
                    homepage: null,
                    language: 'Svelte',
                    stars: 1,
                    forks: 0,
                    updated: '2024-01-10',
                    topics: ['svelte', 'portfolio', 'kali-linux', 'gui'],
                    size: 2048,
                    cloneUrl: 'https://github.com/Sammieblz/my-portfolio-site.git',
                    sshUrl: 'git@github.com/Sammieblz/my-portfolio-site.git'
                },
                {
                    id: 3,
                    name: 'the-ignitor-app',
                    description: 'AI powered app that provides personalized motivational quotes leveraging OpenAI language models and 11Labs speech models.',
                    url: 'https://github.com/Sammieblz/the-ignitor-app',
                    homepage: null,
                    language: 'TypeScript',
                    stars: 0,
                    forks: 0,
                    updated: '2024-01-05',
                    topics: ['typescript', 'ai', 'openai', '11labs', 'motivation'],
                    size: 3072,
                    cloneUrl: 'https://github.com/Sammieblz/the-ignitor-app.git',
                    sshUrl: 'git@github.com/Sammieblz/the-ignitor-app.git'
                },
                {
                    id: 4,
                    name: 'V310city',
                    description: 'React-native (mobile replica) of "my-speedometer" project: Digital speedometer that tracks a user\'s speed using speed logic and position in real time using a compass.',
                    url: 'https://github.com/Sammieblz/V310city',
                    homepage: null,
                    language: 'TypeScript',
                    stars: 0,
                    forks: 0,
                    updated: '2024-06-21',
                    topics: ['react-native', 'typescript', 'speedometer', 'mobile'],
                    size: 2048,
                    cloneUrl: 'https://github.com/Sammieblz/V310city.git',
                    sshUrl: 'git@github.com/Sammieblz/V310city.git'
                },
                {
                    id: 5,
                    name: 'VisionPlayground',
                    description: 'Experimentation with computer vision',
                    url: 'https://github.com/Sammieblz/VisionPlayground',
                    homepage: null,
                    language: 'Python',
                    stars: 0,
                    forks: 0,
                    updated: '2023-08-19',
                    topics: ['python', 'computer-vision', 'opencv'],
                    size: 1024,
                    cloneUrl: 'https://github.com/Sammieblz/VisionPlayground.git',
                    sshUrl: 'git@github.com/Sammieblz/VisionPlayground.git'
                }
            ];
        } finally {
            loading = false;
        }
    }

    function getLanguageColor(language) {
        const colors = {
            'JavaScript': 'kali-yellow',
            'TypeScript': 'kali-blue',
            'Python': 'kali-green',
            'Java': 'kali-red',
            'C++': 'kali-blue',
            'HTML': 'kali-red',
            'CSS': 'kali-blue',
            'Vue': 'kali-green',
            'Svelte': 'kali-red',
            'Unknown': 'text-gray-400'
        };
        return colors[language] || 'text-gray-400';
    }

    function formatSize(size) {
        if (size < 1024) return `${size} KB`;
        return `${(size / 1024).toFixed(1)} MB`;
    }

    function openProject(project) {
        selectedProject = project;
    }

    function closeProjectDetails() {
        selectedProject = null;
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text);
        // You could add a toast notification here
    }

    onMount(() => {
        fetchProjects();
    });
</script>

<div class="w-full h-full file-manager overflow-hidden flex flex-col">

    <!-- Toolbar -->
    <div class="px-4 py-2 border-b border-gray-600 flex items-center justify-between">
        <div class="flex items-center gap-2">
            <button
                class="px-3 py-1 text-xs rounded hover:bg-gray-600 flex items-center gap-2"
                on:click={fetchProjects}
                disabled={loading}
            >
                <i class="fas fa-sync-alt" class:animate-spin={loading}></i>
                Refresh
            </button>
            <div class="text-xs text-gray-400">
                {projects.length} projects
            </div>
        </div>
        
        <div class="flex items-center gap-2">
            <div class="text-xs text-gray-400">
                Last updated: {new Date().toLocaleTimeString()}
            </div>
        </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto p-4">
        {#if loading}
            <div class="flex items-center justify-center h-64">
                <div class="text-center">
                    <i class="fas fa-spinner fa-spin text-3xl kali-blue mb-4"></i>
                    <div class="text-gray-400">Loading projects from GitHub...</div>
                </div>
            </div>
        {:else if error}
            <div class="text-center py-8">
                <i class="fas fa-exclamation-triangle text-3xl kali-red mb-4"></i>
                <div class="text-red-400 mb-2">Error loading projects</div>
                <div class="text-gray-400 text-sm mb-4">{error}</div>
                <button
                    class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                    on:click={fetchProjects}
                >
                    Retry
                </button>
            </div>
        {:else}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {#each projects as project (project.id)}
                    <div
                        class="file-item p-4 rounded border border-gray-600 hover:border-gray-500 cursor-pointer"
                        role="button"
                        tabindex="0"
                        on:click={() => openProject(project)}
                        on:keydown={(e) => e.key === 'Enter' && openProject(project)}
                    >
                        <div class="flex items-start justify-between mb-2">
                            <h3 class="text-lg font-semibold text-white truncate">
                                {project.name}
                            </h3>
                            <div class="flex items-center gap-2 text-xs text-gray-400">
                                <i class="fas fa-star"></i>
                                {project.stars}
                                <i class="fas fa-code-branch"></i>
                                {project.forks}
                            </div>
                        </div>
                        
                        <p class="text-sm text-gray-300 mb-3 line-clamp-2">
                            {project.description}
                        </p>
                        
                        <div class="flex items-center justify-between text-xs">
                            <div class="flex items-center gap-2">
                                <span class="px-2 py-1 rounded {getLanguageColor(project.language)} bg-opacity-20">
                                    {project.language}
                                </span>
                                <span class="text-gray-400">
                                    {formatSize(project.size)}
                                </span>
                            </div>
                            <span class="text-gray-400">
                                {project.updated}
                            </span>
                        </div>
                        
                        {#if project.topics.length > 0}
                            <div class="flex flex-wrap gap-1 mt-2">
                                {#each project.topics.slice(0, 3) as topic}
                                    <span class="px-2 py-1 text-xs bg-gray-700 rounded">
                                        {topic}
                                    </span>
                                {/each}
                                {#if project.topics.length > 3}
                                    <span class="text-xs text-gray-400">
                                        +{project.topics.length - 3} more
                                    </span>
                                {/if}
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>

<!-- Project Details Modal -->
{#if selectedProject}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-gray-800 rounded-lg w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
            <div class="flex items-center justify-between p-4 border-b border-gray-600">
                <h2 class="text-xl font-semibold text-white">{selectedProject.name}</h2>
                <button
                    class="text-gray-400 hover:text-white"
                    on:click={closeProjectDetails}
                >
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="p-4 overflow-y-auto max-h-[60vh]">
                <p class="text-gray-300 mb-4">{selectedProject.description}</p>
                
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <div class="text-sm text-gray-400">Language</div>
                        <div class="text-white">{selectedProject.language}</div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-400">Size</div>
                        <div class="text-white">{formatSize(selectedProject.size)}</div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-400">Stars</div>
                        <div class="text-white">{selectedProject.stars}</div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-400">Forks</div>
                        <div class="text-white">{selectedProject.forks}</div>
                    </div>
                </div>
                
                <div class="mb-4">
                    <div class="text-sm text-gray-400">Clone URL</div>
                    <div class="flex items-center gap-2 mt-1">
                        <input
                            type="text"
                            value={selectedProject.cloneUrl}
                            readonly
                            class="flex-1 bg-gray-700 text-white p-2 rounded text-sm mono"
                        />
                        <button
                            class="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                            on:click={() => copyToClipboard(selectedProject.cloneUrl)}
                        >
                            Copy
                        </button>
                    </div>
                </div>
                
                <div class="flex gap-2">
                    <a
                        href={selectedProject.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm flex items-center gap-2"
                    >
                        <i class="fab fa-github"></i>
                        View on GitHub
                    </a>
                    {#if selectedProject.homepage}
                        <a
                            href={selectedProject.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm flex items-center gap-2"
                        >
                            <i class="fas fa-external-link-alt"></i>
                            Live Demo
                        </a>
                    {/if}
                </div>
            </div>
        </div>
    </div>
{/if}
