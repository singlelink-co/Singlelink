<template>
	<section class="flex flex-col p-8 items-center overflow-x-hidden overflow-y-scroll">
		<div class="flex flex-row items-center justify-start mb-4 space-x-4 mb-4">
			<img class="w-8" src="/Compass.svg"/>
			<h1 class="text-black font-extrabold tracking-tight text-3xl w-full flex flex-row items-start lg:items-center">
				Search & discover
			</h1>
		</div>
			<p class="font-bold text-black opacity-70 text-xl my-4">This page isn't ready yet. Check back soon for more updates!</p>
	</section>
</template>

<script>
	export default {
		name: 'DashboardDiscover',
		layout: 'dashboard',
		middleware: 'authenticated',
		data() {
			return {
				user: {
					name: '',
					emailHash: '',
					activeProfile: {
						imageUrl: '',
						headline: '',
						subtitle: '',
						handle: '',
						customDomain: '',
						visibility: '',
						showWatermark: false,
						metadata: {
							privacyMode: false
						},
					}
				}
			};
		},
		mounted() {
			this.getUserData();
		},
		methods: {
			async getUserData() {
				try {
					const token = this.$store.getters['auth/getToken'];

					const userResponse = await this.$axios.$post('/user', {
					token
					});

					const siteResponse = await this.$axios.$post('/profile/active-profile', {
					token
					});

					this.user.name = userResponse.name;
					this.user.emailHash = userResponse.emailHash;

					this.user.activeProfile.imageUrl = siteResponse.imageUrl;
					this.user.activeProfile.headline = siteResponse.headline;
					this.user.activeProfile.subtitle = siteResponse.subtitle;
					this.user.activeProfile.handle = siteResponse.handle;
					this.user.activeProfile.customDomain = siteResponse.customDomain;
					this.user.activeProfile.visibility = siteResponse.visibility;
					this.user.activeProfile.showWatermark = siteResponse.showWatermark;

					this.user.activeProfile.metadata.privacyMode = siteResponse.metadata.privacyMode;

					this.$set(this.user.activeProfile, 'user.activeProfile', siteResponse);

					this.originalHandle = this.user.activeProfile.handle;
				} catch (err) {
					console.log('Error getting user data');
					console.log(err);
				}
			},
		}
	}
</script>