<script>
    export let window;
    export let closeWindow;
    export let minimizeWindow;
    export let maximizeWindow;

    let formData = {
        name: '',
        email: '',
        subject: '',
        message: ''
    };
    let isSubmitting = false;
    let submitStatus = null;

    async function handleSubmit() {
        if (!formData.name || !formData.email || !formData.message) {
            submitStatus = { type: 'error', message: 'Please fill in all required fields.' };
            return;
        }

        isSubmitting = true;
        submitStatus = null;

        try {
            const response = await fetch('https://formspree.io/f/mqkvbjro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject || 'Portfolio Contact',
                    message: formData.message
                })
            });

            if (response.ok) {
                submitStatus = { type: 'success', message: 'Message sent successfully! I\'ll get back to you soon.' };
                formData = { name: '', email: '', subject: '', message: '' };
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            submitStatus = { type: 'error', message: 'Failed to send message. Please try again or contact me directly.' };
        } finally {
            isSubmitting = false;
        }
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text);
        // You could add a toast notification here
    }

    const contactInfo = [
        {
            icon: 'fas fa-envelope',
            label: 'Email',
            value: 'samuelndubuisi32@gmail.com',
            color: 'kali-blue',
            action: () => window.open('mailto:samuelndubuisi32@gmail.com')
        },
        {
            icon: 'fab fa-github',
            label: 'GitHub',
            value: 'github.com/Sammieblz',
            color: 'kali-yellow',
            action: () => window.open('https://github.com/Sammieblz', '_blank')
        },
        {
            icon: 'fab fa-linkedin',
            label: 'LinkedIn',
            value: 'linkedin.com/in/samuel-ndubuisi-a4792a220',
            color: 'kali-blue',
            action: () => window.open('https://www.linkedin.com/in/samuel-ndubuisi-a4792a220', '_blank')
        },
        {
            icon: 'fas fa-map-marker-alt',
            label: 'Location',
            value: 'Akron, Ohio',
            color: 'kali-green',
            action: null
        }
    ];
</script>

<div class="w-full h-full file-manager overflow-hidden flex flex-col">

    <!-- Content -->
    <div class="flex-1 overflow-y-auto p-4">
        <div class="max-w-4xl mx-auto">
            <!-- Header Section -->
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-white mb-2">Get In Touch</h1>
                <p class="text-gray-300">I'm always interested in new opportunities and collaborations</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Contact Information -->
                <div class="space-y-6">
                    <div class="bg-gray-800 rounded-lg p-6">
                        <h2 class="text-xl font-semibold text-white mb-4">Contact Information</h2>
                        <div class="space-y-4">
                            {#each contactInfo as contact}
                                <div class="flex items-center gap-3 p-3 rounded hover:bg-gray-700 cursor-pointer"
                                     on:click={contact.action}
                                     class:cursor-pointer={contact.action}
                                     class:cursor-default={!contact.action}
                                >
                                    <div class="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                                        <i class="{contact.icon} {contact.color}"></i>
                                    </div>
                                    <div class="flex-1">
                                        <div class="text-sm text-gray-400">{contact.label}</div>
                                        <div class="text-white font-medium">{contact.value}</div>
                                    </div>
                                    {#if contact.action}
                                        <button
                                            class="text-gray-400 hover:text-white"
                                            on:click|stopPropagation={() => copyToClipboard(contact.value)}
                                        >
                                            <i class="fas fa-copy"></i>
                                        </button>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    </div>

                    <div class="bg-gray-800 rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-white mb-4">Quick Facts</h3>
                        <div class="space-y-3">
                            <div class="flex items-center gap-2">
                                <i class="fas fa-clock kali-green"></i>
                                <span class="text-gray-300">Available for new opportunities</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <i class="fas fa-map-marker-alt kali-red"></i>
                                <span class="text-gray-300">Based in Akron, Ohio</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <i class="fas fa-code kali-blue"></i>
                                <span class="text-gray-300">Full Stack Developer</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <i class="fas fa-graduation-cap kali-yellow"></i>
                                <span class="text-gray-300">University of Akron Graduate</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Contact Form -->
                <div class="bg-gray-800 rounded-lg p-6">
                    <h2 class="text-xl font-semibold text-white mb-4">Send Message</h2>
                    
                    {#if submitStatus}
                        <div class="mb-4 p-3 rounded {submitStatus.type === 'success' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}">
                            {submitStatus.message}
                        </div>
                    {/if}

                    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
                        <div>
                            <label for="name" class="block text-sm font-medium text-gray-300 mb-1">
                                Name <span class="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                bind:value={formData.name}
                                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Your name"
                                required
                            />
                        </div>

                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-300 mb-1">
                                Email <span class="text-red-400">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                bind:value={formData.email}
                                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="your.email@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label for="subject" class="block text-sm font-medium text-gray-300 mb-1">
                                Subject
                            </label>
                            <input
                                type="text"
                                id="subject"
                                bind:value={formData.subject}
                                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="What's this about?"
                            />
                        </div>

                        <div>
                            <label for="message" class="block text-sm font-medium text-gray-300 mb-1">
                                Message <span class="text-red-400">*</span>
                            </label>
                            <textarea
                                id="message"
                                bind:value={formData.message}
                                rows="5"
                                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                placeholder="Tell me about your project or opportunity..."
                                required
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            {#if isSubmitting}
                                <i class="fas fa-spinner fa-spin"></i>
                                Sending...
                            {:else}
                                <i class="fas fa-paper-plane"></i>
                                Send Message
                            {/if}
                        </button>
                    </form>
                </div>
            </div>

            <!-- Additional Info -->
            <div class="mt-8 bg-gray-800 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-white mb-4">What to Expect</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="text-center">
                        <div class="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                            <i class="fas fa-reply text-white"></i>
                        </div>
                        <h4 class="font-semibold text-white mb-1">Quick Response</h4>
                        <p class="text-sm text-gray-300">I typically respond within 24 hours</p>
                    </div>
                    <div class="text-center">
                        <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                            <i class="fas fa-handshake text-white"></i>
                        </div>
                        <h4 class="font-semibold text-white mb-1">Professional</h4>
                        <p class="text-sm text-gray-300">Let's discuss your project requirements</p>
                    </div>
                    <div class="text-center">
                        <div class="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-2">
                            <i class="fas fa-lightbulb text-white"></i>
                        </div>
                        <h4 class="font-semibold text-white mb-1">Innovative</h4>
                        <p class="text-sm text-gray-300">Bringing fresh ideas to your projects</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
