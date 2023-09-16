<script lang="ts">
	export let productTypes: string[] = [];
	export let selectedType: string = productTypes[0];
	export let setType: (type: string) => void;
</script>

<div class="space-y-2">
	<p>Select your product type</p>

	<div class="flex items-center gap-2">
		{#each productTypes as productType}
			<button
				class="shadow-xl flex-grow flex flex-col justify-center items-center gap-2 p-6 rounded-2xl h-20 transition duration-300 font-semibold text-2xl font-space-grotesk"
				class:bg-primary={selectedType === productType}
				class:bg-zinc-700={selectedType !== productType}
				on:click={() => setType(productType)}
				type="button"
			>
				{productType}
			</button>
		{/each}
	</div>
</div>
