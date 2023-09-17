<script lang="ts">
	import Autocomplete from '$lib/components/Autocomplete.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import ProductTypes from '$lib/components/ProductTypes.svelte';
	import { parseSavingData } from '$lib/helpers/array';
	import type { Calculation, ParsedSavingData, SavingData, UserInput } from '$lib/types/aws';
	import type { PageData } from './$types';

	export let data: PageData;

	const savingsData: SavingData[] = data.savingsData;

	let parsedData: ParsedSavingData = {
		productTypes: parseSavingData(savingsData, 'product_type'),
		instanceFamilies: parseSavingData(savingsData, 'instance_family'),
		regions: parseSavingData(savingsData, 'region'),
		savingsPlans: parseSavingData(savingsData, 'plan_description'),
		services: parseSavingData(savingsData, 'service_code'),
		usages: parseSavingData(savingsData, 'usage_type')
	};

	let userInput: UserInput = {
		productType: parsedData.productTypes[0],
		instanceFamily: '',
		region: '',
		savingsPlan: '',
		service: '',
		usage: '',
		hours: null,
		quantity: null
	};

	function handleSelect(
		option: string,
		type: 'productType' | 'instanceFamily' | 'region' | 'savingsPlan' | 'service' | 'usage'
	) {
		userInput[type] = option;

		let parent:
			| 'productTypes'
			| 'instanceFamilies'
			| 'regions'
			| 'savingsPlans'
			| 'services'
			| 'usages' = 'productTypes';

		if (type === 'productType') {
			parent = 'productTypes';
		} else if (type === 'instanceFamily') {
			parent = 'instanceFamilies';
		} else if (type === 'region') {
			parent = 'regions';
		} else if (type === 'savingsPlan') {
			parent = 'savingsPlans';
		} else if (type === 'service') {
			parent = 'services';
		} else if (type === 'usage') {
			parent = 'usages';
		}

		const filteredArray = savingsData.filter(
			(savings) =>
				(!userInput.productType || savings.product_type === userInput.productType) &&
				(!userInput.instanceFamily || savings.instance_family === userInput.instanceFamily) &&
				(!userInput.region || savings.region === userInput.region) &&
				(!userInput.savingsPlan || savings.plan_description === userInput.savingsPlan) &&
				(!userInput.service || savings.service_code === userInput.service) &&
				(!userInput.usage || savings.usage_type === userInput.usage)
		);

		// Omit parent to not filter out the current selection
		parsedData = {
			...parsedData,
			instanceFamilies: parseSavingData(filteredArray, 'instance_family'),
			savingsPlans: parseSavingData(filteredArray, 'plan_description'),
			services: parseSavingData(filteredArray, 'service_code'),
			usages: parseSavingData(filteredArray, 'usage_type'),
			[parent]: parsedData[parent]
		};
	}

	let calculation: Calculation | null;

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		// Find the plan
		const plan = savingsData.find(
			(savings) =>
				savings.product_type === userInput.productType &&
				savings.region === userInput.region &&
				savings.plan_description === userInput.savingsPlan &&
				savings.service_code === userInput.service &&
				savings.usage_type === userInput.usage
		);

		if (plan) {
			calculation = {
				rate: plan.rate,
				unit: plan.unit,
				currency: plan.currency,
				total: plan.rate * userInput.hours! * userInput.quantity!,
				hours: userInput.hours,
				quantity: userInput.quantity
			};

			// Scroll to the calculation
			setTimeout(() => {
				const calculationElement = document.getElementById('calculation');
				calculationElement?.scrollIntoView({ behavior: 'smooth' });
			}, 10);
		}
	}
</script>

<div>
	<div class="min-h-screen p-8 md:p-20 xl:px-0 flex flex-col justify-center items-center">
		<div class="space-y-10 w-full">
			<Hero />

			<form class="grid md:grid-cols-2 gap-6" on:submit={handleSubmit}>
				<!-- Product Type -->
				<div class="col-span-full">
					<ProductTypes
						selectedType={userInput.productType}
						setType={(type) => handleSelect(type, 'productType')}
						productTypes={parsedData.productTypes}
					/>
				</div>

				<!-- Region -->
				<Autocomplete
					label="Region"
					options={parsedData.regions}
					select={(option) => handleSelect(option, 'region')}
				/>

				<!-- Savings Plans -->
				<Autocomplete
					label="Savings Plan"
					options={parsedData.savingsPlans}
					select={(option) => handleSelect(option, 'savingsPlan')}
				/>

				<!-- Instance Family -->
				<!-- Only exists in 'EC2' instances -->
				{#if userInput.productType === 'EC2'}
					<div class="col-span-full grid md:grid-cols-2 gap-6">
						<Autocomplete
							label="Instance Family"
							options={parsedData.instanceFamilies}
							select={(option) => handleSelect(option, 'instanceFamily')}
						/>
					</div>
				{/if}

				<!-- Service -->
				<Autocomplete
					label="Service"
					options={parsedData.services}
					select={(option) => handleSelect(option, 'service')}
				/>

				<!-- Usage -->
				<Autocomplete
					label="Usage"
					options={parsedData.usages}
					select={(option) => handleSelect(option, 'usage')}
				/>

				<!-- Hours -->
				<div class="space-y-1">
					<label for="hours">Service Usage Hours</label>
					<input
						bind:value={userInput.hours}
						type="number"
						name="hours"
						id="hours"
						class="w-full h-10 rounded-xl bg-zinc-700 px-4 py-1 text-zinc-50 focus:ring-2 focus:ring-primary focus:ring-opacity-30 transition duration-200 placeholder:text-zinc-500"
						min={1}
						placeholder="730"
						required
					/>
				</div>

				<div class="space-y-1">
					<label for="quantity">Quantity</label>
					<input
						bind:value={userInput.quantity}
						type="number"
						name="quantity"
						id="quantity"
						class="w-full h-10 rounded-xl bg-zinc-700 px-4 py-1 text-zinc-50 focus:ring-2 focus:ring-primary focus:ring-opacity-30 transition duration-200 placeholder:text-zinc-500"
						placeholder="5"
						min={1}
						required
					/>
				</div>

				<div class="col-span-full lg:pr-6">
					<button
						class="w-full lg:w-1/2 px-4 py-1 h-10 rounded-xl bg-primary text-zinc-50 hover:bg-primary-dark transition duration-200"
						type="submit"
					>
						Calculate
					</button>
				</div>
			</form>
		</div>
	</div>

	{#if calculation}
		<div class="p-8 md:p-20 pb-20 md:pb-40 xl:px-0 space-y-10 w-full" id="calculation">
			<h2 class="font-space-grotesk text-5xl font-bold">
				Your Savings for
				<span class="text-primary"> {userInput.productType}</span>
				<span class="text-primary break-words"> {userInput.usage}</span>:
			</h2>

			<p class="font-space-grotesk text-4xl">
				Region:
				<span class="text-primary">
					{userInput.region}
				</span>
			</p>

			<p class="font-space-grotesk text-4xl">
				Hours:
				<span class="text-primary">
					{calculation.hours}
				</span>
			</p>

			<p class="font-space-grotesk text-4xl">
				Quantity:
				<span class="text-primary">
					{calculation.quantity}
				</span>
			</p>

			<p class="font-space-grotesk text-4xl">
				Total cost:
				<span class="underline font-extrabold">
					{calculation.total.toLocaleString('en-US', {
						style: 'currency',
						currency: calculation.currency
					})}
				</span>
			</p>

			<p class="font-space-grotesk text-5xl font-bold">
				Save with a rate of <span class="text-primary">
					{calculation.rate}
					{calculation.currency} / {calculation.unit}
				</span>
			</p>
		</div>
	{/if}
</div>
