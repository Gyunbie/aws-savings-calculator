<script lang="ts">
	import { clickoutside } from '$lib/directives/click-outside';
	import { slide } from 'svelte/transition';
	import Icon from '@iconify/svelte';

	let isOpen = false;
	let selectedOption = '';
	let searchQuery = '';
	let lazyCount = 50;

	export let label: string;
	export let options: string[] = [];
	export let select: (option: string) => void;

	let filtered = [...options];

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function closeDropdown() {
		if (isOpen) {
			isOpen = false;

			setTimeout(() => {
				searchQuery = '';
			}, 300);
		}
	}

	function selectOption(option: string) {
		selectedOption = option;
		isOpen = false;
		select(option);
	}

	function handleScroll(event: any) {
		const { scrollTop, scrollHeight, clientHeight } = event.target;

		if (scrollTop + clientHeight >= scrollHeight - 100) {
			lazyCount += 50;
		}
	}

	$: filtered = options
		.filter((option) => option.toLowerCase().includes(searchQuery.toLowerCase()))
		.slice(0, lazyCount);
</script>

<div class="space-y-1">
	<label for={label}>
		{label}
	</label>

	<div class="relative" use:clickoutside={closeDropdown}>
		<!-- Button for the dropdown -->
		<button
			on:click={toggleDropdown}
			class="text-left bg-zinc-700 h-10 rounded-xl px-4 py-1 w-full flex justify-between items-center focus:ring-2 focus:ring-primary focus:ring-opacity-30 transition duration-200"
			type="button"
		>
			{#if selectedOption}
				<span>{selectedOption}</span>
			{:else}
				<span class="text-zinc-500">Select an option</span>
			{/if}

			<Icon icon="solar:alt-arrow-down-bold-duotone" class="transition {isOpen && '-rotate-180'}" />
		</button>

		<!-- Dropdown panel -->
		{#if isOpen}
			<div
				transition:slide
				class="absolute bg-zinc-700 w-full mt-2 border border-zinc-800 rounded-xl shadow-lg overflow-hidden z-30"
			>
				<div class="w-full p-2">
					<input
						type="text"
						bind:value={searchQuery}
						class="w-full h-10 rounded-xl bg-zinc-600 px-4 py-1 focus:ring-2 focus:ring-primary focus:ring-opacity-30 border border-zinc-700 transition duration-200"
						placeholder="Search..."
					/>
				</div>

				<ul class="max-h-[16rem] overflow-y-scroll" on:scroll={handleScroll}>
					{#each filtered as option (option)}
						<li class="w-full cursor-pointer hover:bg-primary transition duration-200">
							<button
								on:click={() => selectOption(option)}
								class="w-full px-4 py-2 text-left"
								type="button"
								>{option}
							</button>
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		<!-- Select element for accessibility, not visible -->
		<select name={label} aria-label={label} class="sr-only" bind:value={selectedOption} required>
			{#each filtered as option (option)}
				<option value={option}>{option}</option>
			{/each}
		</select>
	</div>
</div>
