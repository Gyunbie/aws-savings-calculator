<script lang="ts">
	import { clickoutside } from '$lib/directives/click-outside';
	import { slide } from 'svelte/transition';
	import Icon from '@iconify/svelte';

	let isOpen = false;
	let selectedOption = '';
	let searchQuery = '';

	export let options: string[] = [];
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
	}

	$: filtered = options.filter((option) =>
		option.toLowerCase().includes(searchQuery.toLowerCase())
	);
</script>

<div class="relative" use:clickoutside={closeDropdown}>
	<div class="relative">
		<button
			on:click={toggleDropdown}
			class="text-left bg-white h-10 rounded-xl border border-zinc-300 px-4 py-1 w-full flex justify-between items-center focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30 transition duration-200"
		>
			{#if selectedOption}
				<span>{selectedOption}</span>
			{:else}
				<span class="text-zinc-500">Select an option</span>
			{/if}

			<Icon icon="solar:alt-arrow-down-bold-duotone" class="transition {isOpen && '-rotate-180'}" />
		</button>

		{#if isOpen}
			<div
				transition:slide
				class="absolute bg-white w-full mt-2 border border-gray-300 rounded-xl shadow-lg overflow-hidden"
			>
				<div class="w-full p-2">
					<input
						type="text"
						bind:value={searchQuery}
						class="w-full h-10 rounded-xl bg-zinc-50 px-4 py-1 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30 border border-zinc-200 transition duration-200"
						placeholder="Search..."
					/>
				</div>

				<ul class="max-h-[16rem] overflow-y-scroll">
					{#each filtered as option (option)}
						<li class="w-full cursor-pointer hover:bg-gray-100 transition duration-200">
							<button on:click={() => selectOption(option)} class="w-full px-4 py-2 text-left"
								>{option}</button
							>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>
</div>
