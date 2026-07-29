<script>
	import { notify } from '$lib/notifications';
	import { profile } from '$lib/profile';

	const EMPTY_FORM = { name: '', email: '', subject: '', message: '', company: '' };

	let formData = { ...EMPTY_FORM };
	let isSubmitting = false;
	let submitStatus = null;
	let copyStatus = '';

	const contactInfo = [
		{
			icon: 'fas fa-envelope',
			label: 'Email',
			value: profile.email,
			href: `mailto:${profile.email}`,
			copyValue: profile.email,
			color: 'kali-blue'
		},
		{
			icon: 'fab fa-github',
			label: 'GitHub',
			value: `@${profile.githubUsername}`,
			href: profile.links.github,
			copyValue: profile.links.github,
			color: 'kali-yellow'
		},
		{
			icon: 'fab fa-linkedin',
			label: 'LinkedIn',
			value: 'Samuel Ndubuisi',
			href: profile.links.linkedin,
			copyValue: profile.links.linkedin,
			color: 'kali-blue'
		},
		{
			icon: 'fas fa-map-marker-alt',
			label: 'Location',
			value: profile.location,
			href: null,
			copyValue: null,
			color: 'kali-green'
		}
	];

	async function handleSubmit() {
		if (isSubmitting) return;

		const payload = {
			name: formData.name.trim().slice(0, 100),
			email: formData.email.trim().slice(0, 254),
			subject: formData.subject.trim().slice(0, 160) || 'Portfolio contact',
			message: formData.message.trim().slice(0, 5000),
			_gotcha: formData.company
		};

		if (!payload.name || !payload.email || !payload.message) {
			submitStatus = { type: 'error', message: 'Please complete every required field.' };
			return;
		}
		isSubmitting = true;
		submitStatus = null;

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					accept: 'application/json',
					'content-type': 'application/json'
				},
				body: JSON.stringify(payload),
				signal: AbortSignal.timeout(12_000)
			});

			if (!response.ok) throw new Error(`Contact endpoint returned ${response.status}`);
			submitStatus = {
				type: 'success',
				message: "Message sent. Thanks. I'll get back to you soon."
			};
			notify({
				title: 'Message sent',
				message: 'Your contact message was delivered successfully.',
				type: 'success',
				source: 'Contact',
				dedupeKey: 'contact-result'
			});
			formData = { ...EMPTY_FORM };
		} catch {
			submitStatus = {
				type: 'error',
				message: `The message could not be sent. Your text is still here; retry or email ${profile.email}.`
			};
			notify({
				title: 'Message not sent',
				message: 'Your text was preserved. Retry or use the email link.',
				type: 'error',
				source: 'Contact',
				dedupeKey: 'contact-result'
			});
		} finally {
			isSubmitting = false;
		}
	}

	async function copyToClipboard(label, value) {
		try {
			await navigator.clipboard.writeText(value);
			copyStatus = `${label} copied.`;
			notify({
				title: `${label} copied`,
				message: 'The contact detail is ready to paste.',
				type: 'success',
				source: 'Clipboard',
				duration: 3_000,
				dedupeKey: 'contact-copy'
			});
		} catch {
			copyStatus = `Could not copy ${label.toLowerCase()}.`;
			notify({
				title: 'Copy failed',
				message: `The ${label.toLowerCase()} could not be copied.`,
				type: 'error',
				source: 'Clipboard',
				duration: 4_000,
				dedupeKey: 'contact-copy'
			});
		}
	}
</script>

<section
	class="file-manager flex h-full w-full flex-col overflow-hidden"
	aria-label="Contact Samuel"
>
	<div class="flex-1 overflow-y-auto p-4 sm:p-6">
		<div class="mx-auto max-w-5xl">
			<header class="mb-7 text-center">
				<h2 class="mb-2 text-3xl font-bold text-white">Get in touch</h2>
				<p class="text-gray-300">New opportunities and thoughtful collaborations are welcome.</p>
			</header>

			<div class="grid gap-6 lg:grid-cols-2">
				<div class="space-y-6">
					<section class="rounded-lg bg-gray-800 p-5" aria-labelledby="contact-information">
						<h3 id="contact-information" class="mb-4 text-xl font-semibold text-white">
							Contact information
						</h3>
						<ul class="space-y-3">
							{#each contactInfo as contact}
								<li class="flex items-center gap-3 rounded p-3 hover:bg-gray-700">
									<span
										class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-700"
										aria-hidden="true"
									>
										<i class={`${contact.icon} ${contact.color}`}></i>
									</span>
									<div class="min-w-0 flex-1">
										<p class="text-sm text-gray-300">{contact.label}</p>
										{#if contact.href}
											<a
												class="break-words font-medium text-white hover:text-blue-300"
												href={contact.href}
												target={contact.href.startsWith('http') ? '_blank' : undefined}
												rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
											>
												{contact.value}
											</a>
										{:else}
											<p class="font-medium text-white">{contact.value}</p>
										{/if}
									</div>
									{#if contact.copyValue}
										<button
											type="button"
											class="rounded p-2 text-gray-300 hover:bg-gray-600 hover:text-white"
											on:click={() => copyToClipboard(contact.label, contact.copyValue)}
											aria-label={`Copy ${contact.label}`}
										>
											<i class="fas fa-copy" aria-hidden="true"></i>
										</button>
									{/if}
								</li>
							{/each}
						</ul>
						<p class="sr-only" aria-live="polite">{copyStatus}</p>
					</section>

					<section class="rounded-lg bg-gray-800 p-5" aria-labelledby="availability">
						<h3 id="availability" class="mb-3 text-lg font-semibold text-white">Availability</h3>
						<p class="flex items-center gap-2 text-gray-300">
							<i class="fas fa-circle text-xs text-green-400" aria-hidden="true"></i>
							{profile.contact.availability}
						</p>
						<p class="mt-2 text-sm text-gray-400">{profile.contact.availabilityDetails}</p>
					</section>
				</div>

				<section class="rounded-lg bg-gray-800 p-5" aria-labelledby="send-message">
					<h3 id="send-message" class="mb-4 text-xl font-semibold text-white">Send a message</h3>

					{#if submitStatus}
						<div
							class={`mb-4 rounded p-3 ${
								submitStatus.type === 'success'
									? 'bg-green-950 text-green-200'
									: 'bg-red-950 text-red-200'
							}`}
							role={submitStatus.type === 'success' ? 'status' : 'alert'}
						>
							{submitStatus.message}
						</div>
					{/if}

					<form
						action="/api/contact"
						method="post"
						on:submit|preventDefault={handleSubmit}
						class="space-y-4"
					>
						<div class="hidden" aria-hidden="true">
							<label for="company">Company website</label>
							<input
								id="company"
								name="company"
								bind:value={formData.company}
								tabindex="-1"
								autocomplete="off"
							/>
						</div>

						<label class="block">
							<span class="mb-1 block text-sm font-medium text-gray-300">Name *</span>
							<input
								type="text"
								name="name"
								bind:value={formData.name}
								maxlength="100"
								autocomplete="name"
								class="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
								required
							/>
						</label>

						<label class="block">
							<span class="mb-1 block text-sm font-medium text-gray-300">Email *</span>
							<input
								type="email"
								name="email"
								bind:value={formData.email}
								maxlength="254"
								autocomplete="email"
								class="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
								required
							/>
						</label>

						<label class="block">
							<span class="mb-1 block text-sm font-medium text-gray-300">Subject</span>
							<input
								type="text"
								name="subject"
								bind:value={formData.subject}
								maxlength="160"
								class="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</label>

						<label class="block">
							<span class="mb-1 block text-sm font-medium text-gray-300">Message *</span>
							<textarea
								name="message"
								bind:value={formData.message}
								rows="6"
								maxlength="5000"
								class="w-full resize-y rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
								required></textarea>
						</label>

						<p class="text-xs text-gray-400">
							Your entries pass through this site to Formspree and are used only to respond to your
							message.
						</p>

						<button
							type="submit"
							disabled={isSubmitting}
							class="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-wait disabled:bg-gray-600"
						>
							<i
								class={`fas ${isSubmitting ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}
								aria-hidden="true"
							></i>
							{isSubmitting ? 'Sending…' : 'Send message'}
						</button>
					</form>
				</section>
			</div>
		</div>
	</div>
</section>
