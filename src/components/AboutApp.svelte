<script>
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
        { id: 'skills', label: 'Skills', icon: 'fas fa-code' }
    ];

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
                            src="/images/sam-svelte-bg.png" 
                            alt="Samuel Ndubuisi" 
                            class="w-full h-full object-cover"
                        />
                    </div>
                    <h2 class="text-2xl font-bold text-white mb-2">Samuel Ndubuisi</h2>
                    <p class="text-lg text-gray-300 mb-4">Full Stack Developer</p>
                    <div class="flex justify-center gap-4 text-sm text-gray-400">
                        <span><i class="fas fa-map-marker-alt mr-1"></i> Akron, Ohio</span>
                        <span><i class="fas fa-envelope mr-1"></i> samuelndubuisi32@gmail.com</span>
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
                    <h3 class="text-lg font-semibold text-white mb-4">Notable Projects</h3>
                    <div class="space-y-4">
                        <div class="border-l-4 border-blue-500 pl-4">
                            <h4 class="font-semibold text-white">Cleveland Tennis Lessons</h4>
                            <p class="text-sm text-gray-300">Web application for booking tennis lessons</p>
                            <p class="text-xs text-gray-400">React, Next.js, Express.js, Emailjs, Calendly</p>
                        </div>
                        <div class="border-l-4 border-green-500 pl-4">
                            <h4 class="font-semibold text-white">V3locity</h4>
                            <p class="text-sm text-gray-300">React Native digital speedometer with real-time tracking</p>
                            <p class="text-xs text-gray-400">Next.js, React Native, Vercel</p>
                        </div>
                        <div class="border-l-4 border-yellow-500 pl-4">
                            <h4 class="font-semibold text-white">Brack App</h4>
                            <p class="text-sm text-gray-300">Digital book tracking webapp for reading progress</p>
                            <p class="text-xs text-gray-400">TypeScript, React, Node.js</p>
                        </div>
                        <div class="border-l-4 border-purple-500 pl-4">
                            <h4 class="font-semibold text-white">The Ignitor App</h4>
                            <p class="text-sm text-gray-300">AI-powered motivational quotes with OpenAI and 11Labs</p>
                            <p class="text-xs text-gray-400">TypeScript, AI Integration, Speech Synthesis</p>
                        </div>
                        <div class="border-l-4 border-orange-500 pl-4">
                            <h4 class="font-semibold text-white">Vision Playground</h4>
                            <p class="text-sm text-gray-300">Computer vision experimentation and development</p>
                            <p class="text-xs text-gray-400">Python, OpenCV, Computer Vision</p>
                        </div>
                    </div>
                </div>
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
