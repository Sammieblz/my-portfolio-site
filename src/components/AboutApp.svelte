<script>
    import { profile } from '$lib/profile';

    export let window;
    export let closeWindow;
    export let minimizeWindow;
    export let maximizeWindow;

    let currentTab = 'overview';
    let showSkills = false;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: 'fas fa-user' },
        { id: 'education', label: 'Education', icon: 'fas fa-graduation-cap' },
        { id: 'experience', label: 'Experience', icon: 'fas fa-briefcase' },
        { id: 'hackathons', label: 'Hackathons', icon: 'fas fa-trophy' },
        { id: 'skills', label: 'Skills', icon: 'fas fa-code' }
    ];

    const projectAccent = ['border-blue-500', 'border-green-500', 'border-yellow-500', 'border-purple-500', 'border-orange-500'];

    const skills = {
        'Frontend': [
            { name: 'JavaScript', level: 90, color: 'kali-yellow' },
            { name: 'React', level: 85, color: 'kali-blue' },
            { name: 'Svelte', level: 80, color: 'kali-red' },
            { name: 'Angular', level: 75, color: 'kali-red' },
            { name: 'Next.js', level: 85, color: 'kali-blue' },
            { name: 'TailwindCSS', level: 90, color: 'kali-blue' }
        ],
        'Backend': [
            { name: 'Node.js', level: 85, color: 'kali-green' },
            { name: 'Express.js', level: 80, color: 'kali-green' },
            { name: 'Python', level: 75, color: 'kali-yellow' },
            { name: 'Java', level: 70, color: 'kali-red' },
            { name: 'C++', level: 65, color: 'kali-blue' }
        ],
        'Database': [
            { name: 'MongoDB', level: 80, color: 'kali-green' },
            { name: 'Firebase', level: 75, color: 'kali-yellow' },
            { name: 'PostgreSQL', level: 70, color: 'kali-blue' },
            { name: 'MySQL', level: 65, color: 'kali-blue' }
        ],
        'Tools & Others': [
            { name: 'Git', level: 85, color: 'kali-red' },
            { name: 'Docker', level: 70, color: 'kali-blue' },
            { name: 'AWS', level: 65, color: 'kali-yellow' },
            { name: 'Vercel', level: 80, color: 'kali-blue' },
            { name: 'Figma', level: 75, color: 'kali-red' }
        ]
    };

    function getSkillColor(level) {
        if (level >= 80) return 'kali-green';
        if (level >= 60) return 'kali-yellow';
        return 'kali-red';
    }
</script>

<div class="w-full h-full file-manager overflow-hidden flex flex-col">

    <!-- Tabs -->
    <div class="px-4 py-2 border-b border-gray-600">
        <div class="flex gap-1">
            {#each tabs as tab}
                <button
                    class="px-3 py-1 text-xs rounded flex items-center gap-2"
                    class:bg-gray-700={currentTab === tab.id}
                    class:hover:bg-gray-600={currentTab !== tab.id}
                    on:click={() => currentTab = tab.id}
                >
                    <i class={tab.icon}></i>
                    {tab.label}
                </button>
            {/each}
        </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto p-4">
        {#if currentTab === 'overview'}
            <div class="space-y-6">
                <div class="text-center">
                    <div class="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden border-4 border-gray-600">
                        <img 
                            src={profile.assets.profileImage}
                            alt={profile.name}
                            class="w-full h-full object-cover"
                        />
                    </div>
                    <h2 class="text-2xl font-bold text-white mb-2">{profile.name}</h2>
                    <p class="text-lg text-gray-300 mb-4">{profile.role}</p>
                    <div class="flex justify-center gap-4 text-sm text-gray-400 mb-4">
                        <span><i class="fas fa-map-marker-alt mr-1"></i> {profile.location}</span>
                        <span><i class="fas fa-envelope mr-1"></i> {profile.email}</span>
                    </div>
                    
                    <!-- Social Links -->
                    <div class="flex justify-center gap-4">
                        <a 
                            href={profile.links.linkedin}
                            target="_blank" 
                            rel="noopener noreferrer"
                            class="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors"
                            title="LinkedIn"
                        >
                            <i class="fab fa-linkedin-in text-white"></i>
                        </a>
                        <a 
                            href={profile.links.github}
                            target="_blank" 
                            rel="noopener noreferrer"
                            class="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
                            title="GitHub"
                        >
                            <i class="fab fa-github text-white"></i>
                        </a>
                        <a 
                            href={profile.links.instagram}
                            target="_blank" 
                            rel="noopener noreferrer"
                            class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full flex items-center justify-center transition-colors"
                            title="Instagram"
                        >
                            <i class="fab fa-instagram text-white"></i>
                        </a>
                        <a 
                            href={profile.links.discord}
                            target="_blank" 
                            rel="noopener noreferrer"
                            class="w-10 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center transition-colors"
                            title="Discord"
                        >
                            <i class="fab fa-discord text-white"></i>
                        </a>
                    </div>
                </div>

                <div class="bg-gray-800 rounded-lg p-4">
                    <h3 class="text-lg font-semibold text-white mb-3">About Me</h3>
                    <p class="text-gray-300 leading-relaxed">
                        I am a passionate Full Stack Developer with a strong foundation in modern web technologies. 
                        I graduated from The University of Akron with an Associate of Business and a Bachelor of 
                        Science in Computer Information Systems Programming. I apply my academic knowledge through 
                        practical experience in full-stack development, creating innovative solutions and engaging applications.
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-gray-800 rounded-lg p-4">
                        <h4 class="text-lg font-semibold text-white mb-3">What I Do</h4>
                        <ul class="space-y-2 text-gray-300">
                            <li class="flex items-center gap-2">
                                <i class="fas fa-code kali-green"></i>
                                Full Stack Web Development
                            </li>
                            <li class="flex items-center gap-2">
                                <i class="fas fa-mobile-alt kali-blue"></i>
                                Mobile App Development
                            </li>
                            <li class="flex items-center gap-2">
                                <i class="fas fa-database kali-yellow"></i>
                                Database Design & Management
                            </li>
                            <li class="flex items-center gap-2">
                                <i class="fas fa-cloud kali-blue"></i>
                                Cloud Deployment & DevOps
                            </li>
                        </ul>
                    </div>

                    <div class="bg-gray-800 rounded-lg p-4">
                        <h4 class="text-lg font-semibold text-white mb-3">Key Strengths</h4>
                        <ul class="space-y-2 text-gray-300">
                            <li class="flex items-center gap-2">
                                <i class="fas fa-lightbulb kali-yellow"></i>
                                Problem Solving & Critical Thinking
                            </li>
                            <li class="flex items-center gap-2">
                                <i class="fas fa-users kali-green"></i>
                                Team Collaboration & Leadership
                            </li>
                            <li class="flex items-center gap-2">
                                <i class="fas fa-rocket kali-red"></i>
                                Fast Learning & Adaptation
                            </li>
                            <li class="flex items-center gap-2">
                                <i class="fas fa-chart-line kali-blue"></i>
                                Project Management
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        {:else if currentTab === 'education'}
            <div class="space-y-6">
                <div class="bg-gray-800 rounded-lg p-6">
                    <div class="flex items-start gap-4">
                        <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                            <i class="fas fa-university text-white"></i>
                        </div>
                        <div class="flex-1">
                            <h3 class="text-xl font-semibold text-white">The University of Akron</h3>
                            <p class="text-gray-300 mb-2">Bachelor of Science in Computer Information Systems Programming</p>
                            <p class="text-sm text-gray-400">2024 • Akron, Ohio</p>
                            <div class="mt-3">
                                <h4 class="text-sm font-semibold text-gray-300 mb-2">Relevant Coursework:</h4>
                                <div class="flex flex-wrap gap-2">
                                    <span class="px-2 py-1 bg-gray-700 rounded text-xs">Data Structures</span>
                                    <span class="px-2 py-1 bg-gray-700 rounded text-xs">Algorithms</span>
                                    <span class="px-2 py-1 bg-gray-700 rounded text-xs">Database Systems</span>
                                    <span class="px-2 py-1 bg-gray-700 rounded text-xs">Software Engineering</span>
                                    <span class="px-2 py-1 bg-gray-700 rounded text-xs">Web Development</span>
                                    <span class="px-2 py-1 bg-gray-700 rounded text-xs">Mobile Development</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-800 rounded-lg p-6">
                    <div class="flex items-start gap-4">
                        <div class="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                            <i class="fas fa-certificate text-white"></i>
                        </div>
                        <div class="flex-1">
                            <h3 class="text-xl font-semibold text-white">Associate of Business</h3>
                            <p class="text-gray-300 mb-2">Business Administration</p>
                            <p class="text-sm text-gray-400">2024 • The University of Akron</p>
                        </div>
                    </div>
                </div>
            </div>

        {:else if currentTab === 'experience'}
            <div class="space-y-6">
                <div class="bg-gray-800 rounded-lg p-6">
                    <div class="flex items-start gap-4">
                        <div class="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                            <i class="fas fa-code text-white"></i>
                        </div>
                        <div class="flex-1">
                            <h3 class="text-xl font-semibold text-white">Full Stack Developer</h3>
                            <p class="text-gray-300 mb-1">Independent Developer & Freelancer</p>
                            <p class="text-sm text-gray-400 mb-3">2023 - Present</p>
                            <ul class="space-y-2 text-gray-300 text-sm">
                                <li class="flex items-start gap-2">
                                    <i class="fas fa-arrow-right text-xs mt-1 kali-green"></i>
                                    Developed full-stack web applications using modern JavaScript frameworks
                                </li>
                                <li class="flex items-start gap-2">
                                    <i class="fas fa-arrow-right text-xs mt-1 kali-green"></i>
                                    Created mobile applications using React Native and cross-platform technologies
                                </li>
                                <li class="flex items-start gap-2">
                                    <i class="fas fa-arrow-right text-xs mt-1 kali-green"></i>
                                    Built responsive and interactive user interfaces with modern design principles
                                </li>
                                <li class="flex items-start gap-2">
                                    <i class="fas fa-arrow-right text-xs mt-1 kali-green"></i>
                                    Implemented database solutions and API integrations for various projects
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-800 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-white mb-4">Featured Projects</h3>
                    <div class="space-y-4">
                        {#each profile.featuredProjects as p, i}
                            <div class="border-l-4 {projectAccent[i % projectAccent.length]} pl-4">
                                <a
                                    href={p.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="font-semibold text-white hover:text-blue-300"
                                >{p.title}</a>
                                <p class="text-sm text-gray-300 mt-1">{p.description}</p>
                                <p class="text-xs text-gray-400 mt-1">{p.tech}</p>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>

        {:else if currentTab === 'hackathons'}
            <div class="space-y-6">
                {#each profile.hackathons as h}
                    <div class="bg-gray-800 rounded-lg p-6 space-y-4">
                        <div class="flex flex-wrap items-center gap-2">
                            <span class="px-2 py-1 rounded text-xs bg-yellow-900/50 text-yellow-200 font-medium">
                                {h.event}
                            </span>
                        </div>
                        <div>
                            <a
                                href={h.projectUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="text-xl font-semibold text-white hover:text-blue-300"
                            >{h.project}</a>
                            <p class="text-sm text-gray-400 mt-1">
                                <a href={h.eventUrl} target="_blank" rel="noopener noreferrer" class="hover:text-gray-300">{h.event}</a>
                                · <a href={h.projectUrl} target="_blank" rel="noopener noreferrer" class="hover:text-gray-300">Devpost</a>
                            </p>
                        </div>
                        <div>
                            <h4 class="text-sm font-semibold text-gray-300 mb-2">Awards</h4>
                            <ul class="space-y-1 text-sm text-gray-300">
                                {#each h.awards as award}
                                    <li class="flex items-start gap-2">
                                        <i class="fas fa-award text-yellow-500 mt-0.5"></i>
                                        {award}
                                    </li>
                                {/each}
                            </ul>
                        </div>
                        <div>
                            <h4 class="text-sm font-semibold text-gray-300 mb-1">My role</h4>
                            <p class="text-gray-300 text-sm leading-relaxed">{h.role}</p>
                        </div>
                        <div>
                            <h4 class="text-sm font-semibold text-gray-300 mb-2">About</h4>
                            {#each h.about as paragraph}
                                <p class="text-gray-300 text-sm leading-relaxed mb-2 last:mb-0">{paragraph}</p>
                            {/each}
                        </div>
                        <div>
                            <h4 class="text-sm font-semibold text-gray-300 mb-2">What we learned</h4>
                            <ul class="space-y-2 text-sm text-gray-300 list-disc list-inside">
                                {#each h.learned as item}
                                    <li>{item}</li>
                                {/each}
                            </ul>
                        </div>
                        <p class="text-xs text-gray-400 pt-2 border-t border-gray-700">
                            Built with: {h.stack}
                        </p>
                    </div>
                {/each}
            </div>

        {:else if currentTab === 'skills'}
            <div class="space-y-6">
                {#each Object.entries(skills) as [category, skillList]}
                    <div class="bg-gray-800 rounded-lg p-4">
                        <h3 class="text-lg font-semibold text-white mb-4">{category}</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {#each skillList as skill}
                                <div class="space-y-2">
                                    <div class="flex items-center justify-between">
                                        <span class="text-sm text-gray-300">{skill.name}</span>
                                        <span class="text-xs text-gray-400">{skill.level}%</span>
                                    </div>
                                    <div class="w-full bg-gray-700 rounded-full h-2">
                                        <div 
                                            class="h-2 rounded-full {getSkillColor(skill.level)}"
                                            style="width: {skill.level}%"
                                        ></div>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>
