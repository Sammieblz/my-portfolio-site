export const profile = {
	name: 'Samuel Ndubuisi',
	role: 'Full Stack Developer',
	location: 'Greater Cleveland, Ohio',
	coordinates: {
		latitude: 41.4993,
		longitude: -81.6944
	},
	email: 'samuelndubuisi32@gmail.com',
	summary:
		'I build reliable web and mobile products from interface through deployment, with a focus on clear user experiences, maintainable systems, and practical delivery.',
	contentReviewed: '2026-07-28',

	githubUsername: 'Sammieblz',

	links: {
		portfolio: 'https://sndubuisi.vercel.app',
		github: 'https://github.com/Sammieblz',
		linkedin: 'https://www.linkedin.com/in/samuel-n-a4792a220/',
		instagram: 'https://www.instagram.com/Sammieblz/',
		discord: 'https://discord.com/channels/999904657151381514/1208547758336901170'
	},

	assets: {
		logo: '/sam-logo.png',
		profileImage: '/images/sam-svelte-bg.png',
		profileImageWebp: '/images/sam-svelte-bg.webp',
		socialCard: '/social-card.png',
		resumePdf: '/document/Samuel_Ndubuisi_Resume.pdf',
		resumeDownloadName: 'Samuel_Ndubuisi_Resume.pdf',
		resumeUpdated: '2026-05-07',
		resumeSize: '93 KB'
	},

	contact: {
		availability: 'Available for opportunities',
		availabilityDetails: 'Full-time positions, Freelance work',
		// Formspree project endpoint (public identifier; no secret)
		formspreeEndpoint: 'https://formspree.io/f/mqkvbjro'
	},

	services: [
		{ name: 'Full Stack Web Development', icon: 'fas fa-code', color: 'kali-green' },
		{ name: 'Mobile App Development', icon: 'fas fa-mobile-alt', color: 'kali-blue' },
		{ name: 'Database and API Design', icon: 'fas fa-database', color: 'kali-yellow' },
		{ name: 'Cloud Deployment and DevOps', icon: 'fas fa-cloud', color: 'kali-blue' }
	],

	strengths: [
		{
			name: 'Problem Solving and Critical Thinking',
			icon: 'fas fa-lightbulb',
			color: 'kali-yellow'
		},
		{ name: 'Team Collaboration and Leadership', icon: 'fas fa-users', color: 'kali-green' },
		{ name: 'Fast Learning and Adaptation', icon: 'fas fa-rocket', color: 'kali-red' },
		{ name: 'Product and Project Ownership', icon: 'fas fa-chart-line', color: 'kali-blue' }
	],

	education: [
		{
			credential: 'Bachelor of Science in Computer Information Systems Programming',
			institution: 'The University of Akron',
			year: '2024',
			location: 'Akron, Ohio',
			icon: 'fas fa-university',
			color: 'bg-blue-600',
			details: [
				'Data Structures',
				'Algorithms',
				'Database Systems',
				'Software Engineering',
				'Web Development',
				'Mobile Development'
			]
		},
		{
			credential: 'Associate of Business',
			institution: 'The University of Akron',
			year: '2024',
			location: 'Business Administration',
			icon: 'fas fa-certificate',
			color: 'bg-green-600',
			details: []
		}
	],

	experience: [
		{
			role: 'Co-founder and Full Stack Developer',
			organization: 'Byteflow LLC',
			period: 'Current',
			icon: 'fas fa-building',
			color: 'bg-blue-600',
			highlights: [
				'Build and deliver client-facing web products across interface, data, authentication, subscriptions, and content systems.',
				'Translate product requirements into maintainable releases and coordinate work across the application stack.',
				'Apply production practices including accessibility, automated testing, deployment controls, and operational documentation.'
			]
		},
		{
			role: 'Full Stack Developer',
			organization: 'Independent Developer and Freelancer',
			period: '2023 - Present',
			icon: 'fas fa-code',
			color: 'bg-red-600',
			highlights: [
				'Develop web applications with modern JavaScript frameworks and server APIs.',
				'Create cross-platform mobile products with React Native, Expo, and Capacitor.',
				'Design database, authentication, payment, content, and third-party integration workflows.',
				'Own projects from initial product framing through testing and deployment.'
			]
		}
	],

	skills: {
		Frontend: ['JavaScript', 'TypeScript', 'React', 'Svelte', 'Next.js', 'Tailwind CSS'],
		Backend: ['Node.js', 'Python', 'FastAPI', 'Java', 'REST APIs'],
		'Data and Platforms': ['PostgreSQL', 'Supabase', 'Contentful', 'Firebase', 'AWS'],
		'Delivery and Tools': ['Git', 'GitHub Actions', 'Vercel', 'Docker', 'Playwright', 'Vitest']
	},

	terminal: {
		homeDir: '/home/samuel',
		userAtHost: 'samuel@kali-portfolio',
		welcomeLine: "Welcome to Samuel's Portfolio Terminal"
	},

	// Pin order for GitHub ProjectViewer (repo `name` strings from the API)
	featuredRepoOrder: ['AITT', 'brack-app', 'V3l0city', 'my-portfolio-site', 'the-ignitor-app'],

	featuredProjects: [
		{
			title: 'AITT',
			href: 'https://github.com/Sammieblz/AITT',
			tagline:
				'Behavioral interview training: Next.js shell, Python interviewer API, hybrid models',
			description:
				'Behavioral interview training for CS students: Next.js app shell, Python interviewer API, and hybrid local/cloud model runtimes.',
			tech: 'Next.js, Python, React, FastAPI, AWS'
		},
		{
			title: 'Clutch DNA',
			href: 'https://clutchdna.com',
			tagline: 'Learning platform: lessons, auth, subscriptions, Contentful CMS (private repo)',
			description:
				'Next.js learning platform with interactive lessons, Supabase auth, Stripe subscriptions (monthly/annual + org plans), and Contentful-driven content.',
			tech: 'Next.js (App Router), Supabase, Stripe, Contentful, Tailwind CSS',
			private: true,
			repo: 'ByteFlowWebAgency/clutch-dna'
		},
		{
			title: 'Brack',
			href: 'https://github.com/Sammieblz/brack-app',
			tagline: 'Book tracking app: progress, streaks, Supabase, Capacitor iOS/Android',
			description:
				'Full-featured book tracking with reading progress, streaks, journaling, social features, and native iOS/Android via Capacitor.',
			tech: 'TypeScript, React, Vite, Supabase, Capacitor'
		},
		{
			title: 'V3l0city',
			href: 'https://github.com/Sammieblz/V3l0city',
			tagline: 'Expo speedometer: GPS, compass, Kalman-filtered speed',
			description:
				'Expo/React Native digital speedometer: GPS + heading, motion sensors, and Kalman-filtered speed for trustworthy real-time readouts.',
			tech: 'TypeScript, Expo, React Native'
		}
	],

	caseStudies: [
		{
			slug: 'aitt',
			title: 'AITT',
			summary:
				'Behavioral interview training across a Next.js application and Python interviewer API.',
			problem:
				'Technical candidates need realistic behavioral interview practice and specific feedback, not a static list of generic prompts.',
			role: 'Full-stack product engineering across the application shell, interviewer API, and local or cloud model workflows.',
			solution:
				'Combined a Next.js user experience with a FastAPI interviewer service and hybrid model runtimes so candidates can practice complete interview sessions.',
			outcomes: [
				'Created an end-to-end behavioral interview practice workflow.',
				'Supported both local and cloud model execution paths.',
				'Kept the interface and service boundaries independent enough to evolve separately.'
			],
			tech: ['Next.js', 'React', 'Python', 'FastAPI', 'AWS'],
			links: {
				source: 'https://github.com/Sammieblz/AITT',
				live: null
			}
		},
		{
			slug: 'clutch-dna',
			title: 'Clutch DNA',
			summary: 'A subscription learning platform with managed content and organization plans.',
			problem:
				'The product needed to deliver structured lessons while coordinating user access, subscriptions, organization plans, and editable content.',
			role: 'Co-founder and full-stack developer responsible for product implementation across the application stack.',
			solution:
				'Built the platform with Next.js, Supabase authentication, Stripe subscription workflows, and Contentful-managed lesson content.',
			outcomes: [
				'Delivered interactive lesson and account workflows in one product.',
				'Connected monthly, annual, and organization subscription paths.',
				'Separated editorial content from application releases through Contentful.'
			],
			tech: ['Next.js', 'Supabase', 'Stripe', 'Contentful', 'Tailwind CSS'],
			links: {
				source: null,
				live: 'https://clutchdna.com'
			}
		},
		{
			slug: 'brack',
			title: 'Brack',
			summary:
				'Cross-platform book tracking with progress, streaks, journaling, and social features.',
			problem:
				'Readers need one consistent place to track progress and habits across web and native mobile environments.',
			role: 'Product and mobile engineering across the React application, Supabase services, and Capacitor packaging.',
			solution:
				'Created a TypeScript and React product backed by Supabase, then used Capacitor to deliver the same product foundation to iOS and Android.',
			outcomes: [
				'Combined progress, streak, journal, and social workflows.',
				'Shared a product foundation across browser and native mobile targets.',
				'Designed the app around persistent reader history and ongoing engagement.'
			],
			tech: ['TypeScript', 'React', 'Vite', 'Supabase', 'Capacitor'],
			links: {
				source: 'https://github.com/Sammieblz/brack-app',
				live: null
			}
		},
		{
			slug: 'interviewai',
			title: 'InterviewAI',
			summary: 'A voice-first behavioral interview coach built during Kent Hack Enough 2026.',
			problem:
				'Candidates often reach behavioral interviews without a practical way to rehearse spoken answers and receive actionable coaching.',
			role: 'Built the user interface, orchestrated the stack, and extended the ElevenLabs prompt so questions adapt to the target role.',
			solution:
				'Connected a voice interview experience to role-aware prompting and scoring so users receive concrete feedback after realistic practice.',
			outcomes: [
				'Won the Kent Hack Enough 2026 Data Science Track.',
				'Won the MLH Best Use of ElevenLabs award.',
				'Delivered the working experience within a 12-hour hackathon.'
			],
			tech: ['Next.js', 'React', 'Python', 'ElevenLabs', 'AWS', 'Ollama'],
			links: {
				source: null,
				live: 'https://devpost.com/software/interviewai-r1pbow?ref_content=my-projects-tab&ref_feature=my_projects'
			}
		}
	],

	hackathons: [
		{
			event: 'Kent Hack Enough 2026',
			eventUrl: 'https://khe.io/',
			project: 'InterviewAI',
			projectUrl:
				'https://devpost.com/software/interviewai-r1pbow?ref_content=my-projects-tab&ref_feature=my_projects',
			awards: ['Winner: Data Science Track', 'Winner: [MLH] Best Use of ElevenLabs'],
			role: 'Built the UI, orchestrated the stack, and extended the ElevenLabs prompt so practice questions adapt to the role users are interviewing for.',
			about: [
				"We've all been there: you grind LeetCode, pass the technical round, then struggle in behavioral, not from lack of skill, but because no one teaches you how to tell your story under pressure.",
				'After seeing a teammate miss the same dream role twice for that reason, we built InterviewAI, a voice-first coach that runs real behavioral interviews, scores answers, and gives concrete fixes instead of generic praise.'
			],
			learned: [
				'The hardest part of a voice-first AI product was the real-time audio pipeline. Keeping ElevenLabs WebSockets stable across browsers, mic permissions, and reconnects took more iteration than the model work.',
				"Prompt structure mattered as much as the model: actionable coaching (\"say 'I' not 'we'\") came from a tight system prompt and a knowledge base the team invested in early.",
				'A 12-hour hackathon forces scope cuts that feel painful at hour two and obvious by hour ten.'
			],
			stack: 'Amazon Web Services, CSS, ElevenLabs, NanoGPT, Next.js, Python, React, Ollama'
		}
	]
};

export function validateProfileContent(content = profile) {
	const requiredText = [
		content.name,
		content.role,
		content.location,
		content.email,
		content.summary,
		content.assets?.resumePdf
	];
	if (requiredText.some((value) => typeof value !== 'string' || !value.trim())) {
		throw new Error('Profile content is missing required text');
	}

	const caseStudySlugs = content.caseStudies.map((study) => study.slug);
	if (new Set(caseStudySlugs).size !== caseStudySlugs.length) {
		throw new Error('Profile case-study slugs must be unique');
	}
	if (content.caseStudies.some((study) => !study.outcomes.length || !study.tech.length)) {
		throw new Error('Every case study requires outcomes and technology');
	}
	if (JSON.stringify(content).includes(String.fromCodePoint(0x2014))) {
		throw new Error('Profile content must not contain em dashes');
	}

	for (const link of Object.values(content.links)) {
		const url = new URL(link);
		if (url.protocol !== 'https:') throw new Error(`Profile link must use HTTPS: ${link}`);
	}
	return true;
}

validateProfileContent();

/** Lines printed by Terminal `projects` command */
export function getTerminalFeaturedProjectsLines() {
	const lines = ['Featured projects:', ''];
	profile.featuredProjects.forEach((p, i) => {
		lines.push(`${i + 1}. ${p.title}`);
		lines.push(`   - ${p.tagline}`);
		lines.push(`   - ${p.href}`);
		if (p.private) lines.push('   - repo: private');
		lines.push('');
	});
	const h = profile.hackathons[0];
	if (h) {
		lines.push(`Hackathon: ${h.project} (${h.event})`);
		lines.push(`   - ${h.projectUrl}`);
	}
	return lines;
}
