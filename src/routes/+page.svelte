<script lang="ts">
	import type { PageData } from './$types';
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';

	export let data: PageData;

	const savingsData = data.savingsData;

	console.log(savingsData);

	// Product types
	const productTypes: string[] = Array.from(
		new Set(savingsData.map((savings) => savings.product_type))
	);
	let productType: string = productTypes[0];

	const instanceFamilies = savingsData.map((savings) => savings.instance_family);
	const regions = new Set(savingsData.map((savings) => savings.region));
</script>

<div>
	<ListBox>
		{#each productTypes as type}
			<ListBoxItem bind:group={productType} name={type} value={type}>
				{type}
			</ListBoxItem>
		{/each}
	</ListBox>

	<select>
		{#each regions as region}
			<option value={region}>{region}</option>
		{/each}
	</select>
</div>
