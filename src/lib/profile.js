export const profile = {
	name: 'Samuel Ndubuisi',
	role: 'Full Stack Developer',
	location: 'Akron, Ohio',
	email: 'samuelndubuisi32@gmail.com',

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
		resumePdf: '/document/Samuel_Ndubuisi_Resume2.4.pdf',
		resumeDownloadName: 'Samuel_Ndubuisi_Resume2.4.pdf'
	},

	contact: {
		availability: 'Available for opportunities',
		availabilityDetails: 'Full-time positions, Freelance work',
		// Formspree project endpoint (public identifier; no secret)
		formspreeEndpoint: 'https://formspree.io/f/mqkvbjro'
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
			tagline: 'Behavioral interview training — Next.js shell, Python interviewer API, hybrid models',
			description:
				'Behavioral interview training for CS students: Next.js app shell, Python interviewer API, and hybrid local/cloud model runtimes.',
			tech: 'Next.js, Python, React, FastAPI, AWS'
		},
		{
			title: 'Clutch DNA',
			href: 'https://clutchdna.com',
			tagline: 'Learning platform — lessons, auth, subscriptions, Contentful CMS (private repo)',
			description:
				'Next.js learning platform with interactive lessons, Supabase auth, Stripe subscriptions (monthly/annual + org plans), and Contentful-driven content.',
			tech: 'Next.js (App Router), Supabase, Stripe, Contentful, Tailwind CSS',
			private: true,
			repo: 'ByteFlowWebAgency/clutch-dna'
		},
		{
			title: 'Brack',
			href: 'https://github.com/Sammieblz/brack-app',
			tagline: 'Book tracking app — progress, streaks, Supabase, Capacitor iOS/Android',
			description:
				'Full-featured book tracking—reading progress, streaks, journaling, social features, and native iOS/Android via Capacitor.',
			tech: 'TypeScript, React, Vite, Supabase, Capacitor'
		},
		{
			title: 'V3l0city',
			href: 'https://github.com/Sammieblz/V3l0city',
			tagline: 'Expo speedometer — GPS, compass, Kalman-filtered speed',
			description:
				'Expo/React Native digital speedometer: GPS + heading, motion sensors, and Kalman-filtered speed for trustworthy real-time readouts.',
			tech: 'TypeScript, Expo, React Native'
		}
	],

	hackathons: [
		{
			event: 'Kent Hack Enough 2026',
			eventUrl: 'https://khe.io/',
			project: 'InterviewAI',
			projectUrl:
				'https://devpost.com/software/interviewai-r1pbow?ref_content=my-projects-tab&ref_feature=my_projects',
			awards: [
				'Winner — Data Science Track',
				'Winner — [MLH] Best Use of ElevenLabs'
			],
			role:
				'Built the UI, orchestrated the stack, and extended the ElevenLabs prompt so practice questions adapt to the role users are interviewing for.',
			about: [
				"We've all been there: you grind LeetCode, pass the technical round, then struggle in behavioral—not from lack of skill, but because no one teaches you how to tell your story under pressure.",
				'After seeing a teammate miss the same dream role twice for that reason, we built InterviewAI—a voice-first coach that runs real behavioral interviews, scores answers, and gives concrete fixes instead of generic praise.'
			],
			learned: [
				'The hardest part of a voice-first AI product was the realtime audio pipeline—keeping ElevenLabs WebSockets stable across browsers, mic permissions, and reconnects took more iteration than the model work.',
				'Prompt structure mattered as much as the model: actionable coaching ("say \'I\' not \'we\'") came from a tight system prompt and a knowledge base the team invested in early.',
				'A 12-hour hackathon forces scope cuts that feel painful at hour two—and obvious by hour ten.'
			],
			stack: 'Amazon Web Services, CSS, ElevenLabs, NanoGPT, Next.js, Python, React, Ollama'
		}
	]
};

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

