<template>
    <section class="flex flex-shrink-0 flex-col p-8 items-center bg-gray-100 flex-grow overflow-x-hidden overflow-y-scroll">
        <div class="flex flex-col lg:flex-row justify-start lg:justify-between items-center mb-4 w-full">
            <h1 v-if="intent!='view'" class="text-gray-800 font-extrabold tracking-tight text-3xl">Submission details</h1>
            <h1 v-if="intent=='view' && addon && addon.displayName" class="text-gray-800 font-extrabold tracking-tight text-3xl">{{ addon.displayName }}</h1>
        </div>
        <div class="flex flex-col lg:flex-row w-full items-start mb-4">
            <div class="p-3 bg-white" style="border-radius: 50px; overflow:hidden;box-shadow:0 10px 15px -3px rgb(0 0 0 / 10%), 0 4px 6px -2px rgb(0 0 0 / 5%), inset 0 0 5px 0 rgba(0,0,0,.1);">
                <div class="relative text-center rounded flex items-center justify-ceneter p-6 bg-indigo-200" style="border-radius: 40px;width: 262px;height:568px;overflow:hidden;">
                    <span class="text-sm text-indigo-500 font-medium mx-auto">Save addon for preview</span>
                    <iframe v-if="addon.id" style="z-index:2;pointer-events: none;width: 376px;height: 813px;transform: scale(0.7) translate(-82px, -175px);top:0;left:0;position:absolute;" :src="'/dashboard/marketplace/preview/' + addon.id"/>
                </div>
            </div>
            <div class="flex flex-col lg:w-2/3 px-8">
                <div class="flex flex-col mb-4 justify-start" v-if="intent!='view'">
                    <label class="font-semibold mb-2">Display name</label>
                    <input class="p-3 rounded-lg bg-white text-sm text-gray-700" v-model="addon.displayName" placeholder="e.g. My beautiful theme" type="text"/>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full" v-if="intent!='view'">
                    <label class="font-semibold mb-2">Item</label>
                    <select v-model="addon.resourceId" class="p-3 rounded-lg bg-white text-sm text-gray-700">
                        <option v-for="theme in themes" :value="theme.id">{{ theme.id }} - {{ theme.label }}</option>
                    </select>
                </div>
                <div class="flex flex-col mb-4 justify-start">
                    <label class="font-semibold mb-2">Description</label>
                    <textarea v-if="intent != 'view'" rows="6" class="p-3 rounded-lg bg-white text-sm text-gray-700" v-model="addon.description" placeholder="e.g. Your favorite beatufiul theme for Singlelink."/>
                    <p class="text-gray-600 text-lg leading-relaxed" v-if="intent == 'view'">{{ addon.description }}</p>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full">
                    <label class="font-semibold mb-2">Tags/keywords</label>
                    <input v-if="intent != 'view'" class="p-3 rounded-lg bg-white text-sm text-gray-700" v-model="pendingTag" placeholder="e.g. colorful" type="text"/>
                    <ul v-if="addon && addon.tags && addon.tags.length>=1" class="mt-3 flex flew-rox flex-wrap justify-start items-start">
                        <li class="hover:bg-indigo-300 flex flex-row items-center justify-center p-1 text-sm px-3 text-indigo-500 mr-2 rounded bg-indigo-200 bg-indigo-200 font-medium" v-for="tag in addon.tags">
                            {{ tag }}
                            <div class="ml-2 cursor-pointer leading-none" @click="pluck(tag)">x</div>
                        </li>
                    </ul>
                </div>
                <div v-if="intent == 'edit'" class="flex flex-col mb-4 justify-start w-full">
                    <label class="font-semibold mb-2">Published?</label>
                    <select class="p-3 rounded-lg bg-white text-sm text-gray-700" v-model="addon.global">
                        <option value="false">No, this theme is private.</option>
                        <option value="true">Yes, this theme is available for community download.</option>
                    </select>
                </div>
                <div class="flex flex-col lg:flex-row items-center justify-start mt-4">
                    <div v-if="intent=='view' && installed.indexOf(Number(addon.id)) < 0" @click="installAddon" class="px-6 py-3 font-semibold text-white rounded-lg hover:bg-indigo-500 bg-indigo-600 lg:mr-4 mb-4 lg:mb-0 cursor-pointer">Install addon</div>
                    <div v-if="intent=='view' && installed.indexOf(Number(addon.id)) >= 0" @click="uninstallAddon" class="px-6 py-3 font-semibold text-white rounded-lg hover:bg-indigo-500 bg-indigo-600 lg:mr-4 mb-4 lg:mb-0 cursor-pointer">Uninstall addon</div>
                    <div v-if="intent=='view' && favorites.indexOf(Number(addon.id)) < 0" @click="toggleFavoriteAddon" class="px-6 py-3 font-semibold text-gray-700 border border-gray-700 rounded-lg hover:bg-gray-50 lg:mr-4 mb-4 lg:mb-0 cursor-pointer">Add to favorites</div>
                    <div v-if="intent=='view' && favorites.indexOf(Number(addon.id)) >= 0" @click="toggleFavoriteAddon" class="px-6 py-3 font-semibold text-gray-700 border border-gray-700 rounded-lg hover:bg-gray-50 lg:mr-4 mb-4 lg:mb-0 cursor-pointer">Remove from favorites</div>
                    <div v-if="intent=='submit'" @click="attemptSubmit" class="px-6 py-3 font-semibold text-white rounded-lg hover:bg-indigo-500 bg-indigo-600 lg:mr-4 mb-4 lg:mb-0 cursor-pointer">Create addon</div>
                    <div v-if="intent=='edit'" @click="updateAddon" class="px-6 py-3 font-semibold text-white rounded-lg hover:bg-indigo-500 bg-indigo-600 lg:mr-4 mb-4 lg:mb-0 cursor-pointer">Save changes</div>
                    <div v-if="intent=='edit'" @click="deleteAddon" class="px-6 py-3 font-semibold text-white rounded-lg hover:bg-red-500 bg-red-600 cursor-pointer">Delete addon</div>
                </div>
            </div>
        </div>
        <!--<div class="flex flex-col mb-4 justify-start w-full">
            <label class="font-semibold mb-2">Theme ID</label>
            <select class="p-3 rounded-lg bg-white text-sm text-gray-700" v-model="addon.global">
                <option v-for="theme in themes" :value="theme.id">{{ theme.id }} - {{ theme.label }}</option>
            </select>
        </div>-->
        <!--<div class="flex flex-col mb-4 justify-start w-full">
            <label class="font-semibold mb-2">Theme tags</label>
            <input class="p-3 rounded-lg bg-white text-sm text-gray-700" v-model="pendingTag" placeholder="e.g. colorful" type="text"/>
            <ul v-if="addon.tags.length>=1" class="mt-2 flex flew-rox flex-wrap justify-start items-start">
                <li class="hover:bg-indigo-300 flex flex-row items-center justify-center p-1 text-sm px-3 text-indigo-500 mr-2 rounded bg-indigo-200 bg-indigo-200 font-medium" v-for="tag in addon.tags">
                    {{ tag }}
                    <div class="ml-2 cursor-pointer leading-none" @click="pluck(tag)">x</div>
                </li>
            </ul>
        </div>-->
        <!--<div class="flex flex-col mb-4 justify-start w-full">
            <label class="font-semibold mb-2">Published?</label>
            <select class="p-3 rounded-lg bg-white text-sm text-gray-700" v-model="addon.global">
                <option value="false">No, this theme is private.</option>
                <option value="true">Yes, this theme is available for community download.</option>
            </select>
        </div>-->
        <!--<div class="px-6 py-3 font-semibold text-white rounded-lg hover:bg-indigo-500 bg-indigo-600 mr-auto mt-4 cursor-pointer">Publish addon</div>-->
        <!--<div class="px-6 py-3 font-semibold text-white rounded-lg hover:bg-indigo-500 bg-indigo-600 mr-auto mt-4 cursor-pointer">Save changes</div>-->
        
    </section>
</template>
<script>
    export default {
        layout: 'dashboard',
        middleware: 'authenticated',
        head() {
            let description = '';
            let displayName = 'Un-named';
            if(this.addon.description) description = this.addon.description;
            if(this.addon.displayName) displayName = this.addon.displayName;
            return {
                title: displayName + ' theme - ' + process.env.APP_NAME,
                meta: [
                    {
                        hid: 'description',
                        name: 'description',
                        content: description + '... Download this theme in seconds for free by creating a free ' + process.env.APP_NAME + 'account!'
                    },
                    {
                        hid: 'twitter:description',
                        name: 'twitter:description',
                        content: description + '... Download this theme in seconds for free by creating a free ' + process.env.APP_NAME + 'account!'
                    },
                    {
                        hid: 'og:title',
                        name: 'og:title',
                        content: displayName + ' theme - ' + process.env.APP_NAME
                    },
                    {
                        hid: 'twitter:title',
                        name: 'twitter:title',
                        content: displayName + ' theme - ' + process.env.APP_NAME
                    },
                    {
                        hid: 'og:description',
                        name: 'og:description',
                        content: description + '... Download this theme in seconds for free by creating a free ' + process.env.APP_NAME + 'account!'
                    },
                ],
            }
        },
        data() {
            return {
                id: null,
                activeProfileId: null,
                /*intent: null,
                addon: {
                    id: null,
                    displayName: null,
                    description: null,
                    global: false,
                    tags: [],
                    resourceId: null
                },*/
                pendingTag: '',
                themes: [],
                colors: {
                        fill: {
                            primary: '#5353EC',
                            secondary: '#FFFFFF'
                        },
                        text: {
                            primary: '#FFFFFF',
                            secondary: '#000000'
                        }
                    },
                installed: [],
                favorites: []
            }
        },
        async asyncData(ctx) {
            let response = {
                addon: {
                    id: null,
                    displayName: null,
                    description: null,
                    global: false,
                    tags: [],
                    resourceId: null
                },
                intent: null
            };
            console.log(response.addon.id);
            if(ctx.route.path.replace('/dashboard/marketplace/addon/', '') == 'submit') {
                // set intent to submit
                response.intent = 'submit';
                console.log('Submit!');
                return response;
            } else {
                response.addon.id = Number(ctx.route.path.replace('/dashboard/marketplace/addon/', ''));
                response.addon = await ctx.$axios.$post('/marketplace/addon/' + ctx.route.path.replace('/dashboard/marketplace/addon/', ''), {
                    token: ctx.store.getters['auth/getToken'],
                    detailed: true
                });
                 return response;
            }
        },
        async mounted() {
            await this.getUserData();
            await this.loadThemes();
            console.log(this.addon);
                // If user is author
                if(this.intent != 'submit' && this.addon.userId == this.id) {
                    // Set intent to edit
                    this.intent = 'edit';
                } else {
                    // Else, set intent to view
                    if(this.intent != 'submit') this.intent = 'view';
                }
                console.log('Intent');
                console.log(this.intent);
                console.log('Loaded!');
                console.log(this.addon);
            this.getInstalledAddons();
            this.getFavoritedAddons();
        },
        watch: {
            pendingTag(value) {
                this.pendingTag = value;
                this.buildTags();
            }
        },
        methods: {
            async getUserData() {
                try {
                    const token = this.$store.getters['auth/getToken'];

                    const userResponse = await this.$axios.$post('/user', {
                        token
                    });
                    this.activeProfile = userResponse.activeProfileId;
                    this.id = userResponse.id;
                    console.log(userResponse);

                } catch (err) {
                    console.log('Error getting user data');
                    console.log(err);
                }
            },
            async loadThemes() {
                try {
                    // Grab themes from response
                    this.themes = (await this.$axios.$post('/themes', {
                        token: this.$store.getters['auth/getToken'],
                        includeGlobal: false,
                    }));
                    console.log(this.getUserData)

                    /*this.globalThemes = (await this.$axios.$post<Theme[]>('/themes', {
                        token: this.$store.getters['auth/getToken'],
                        onlyGlobal: true
                    }));*/
                } catch (error) {
                    console.log('Failed to get themes');
                    console.log(error);
                }
            },
            async attemptSubmit() {
                // validation
                if(!this.addon.resourceId || !this.addon.displayName) return;
                let submission = await this.$axios.$post('/marketplace/addon/create', {
                    token: this.$store.getters['auth/getToken'],
                    addon: {
                        //userId: this.id,
                        displayName: this.addon.displayName,
                        type: 'theme', //temporary
                        description: this.addon.description,
                        resourceId: this.addon.resourceId,
                        tags: this.addon.tags,
                        //global: this.addon.global
                    }
                });
                console.log('Done!');
                console.log(submission);
                window.location.href='/dashboard/marketplace/addon/' + submission.id;
            },
            async updateAddon() {
                let changed = await this.$axios.$post('/marketplace/addon/update', {
                    token: this.$store.getters['auth/getToken'],
                    addon: {
                        id: this.$route.path.replace('/dashboard/marketplace/addon/', ''),
                        displayName: this.addon.displayName,
                        type: 'theme', //temporary
                        description: this.addon.description,
                        resourceId: this.addon.resourceId,
                        tags: this.addon.tags,
                        global: this.addon.global
                    }
                });
                console.log('Done!');
                console.log(changed);
            },
            async deleteAddon() {
                let deleted = await this.$axios.$post('/marketplace/addon/delete', {
                    token: this.$store.getters['auth/getToken'],
                    id: this.$route.path.replace('/dashboard/marketplace/addon/', '')
                });
                console.log('Done!');
                console.log(deleted);
                window.location.href='/dashboard/marketplace';
            },
            async getInstalledAddons() {
                let installed = await this.$axios.$post('/marketplace/addons/installed', {
                    token: this.$store.getters['auth/getToken'],
                    //profileId: this.activeProfileId
                });
                console.log(installed);
                for(let i=0;i<installed.length;i++) {
                    this.installed.push(Number(installed[i].addonId));
                }
                console.log('Installed');
                console.log(this.installed);
            },
            async getFavoritedAddons() {
                this.favorites = await this.$axios.$post('/marketplace/user/favorites', {
                    token: this.$store.getters['auth/getToken'],
                });
                console.log('favorites');
                console.log(this.favorites);
                console.log('Addon id');
                console.log(this.addon.id);
                console.log(this.favorites.indexOf(Number(this.addon.id)));
            },
            async toggleFavoriteAddon() {
                let favorite = await this.$axios.$post('/marketplace/user/favorite/' + this.$route.path.replace('/dashboard/marketplace/addon/', ''), {
                    token: this.$store.getters['auth/getToken'],
                    //id: this.id,
                    //profileId: this.activeProfileId
                });
                if(this.favorites.indexOf(Number(this.addon.id)) >= 0) {
                    this.favorites.splice(this.favorites.indexOf(Number(this.addon.id)));
                } else {
                    this.favorites.push(Number(this.addon.id));
                }
                console.log('Toggled favorite!');
                console.log(favorite);
            },
            async installAddon() {
                let install = await this.$axios.$post('/marketplace/addon/install/' + this.$route.path.replace('/dashboard/marketplace/addon/', ''), {
                    token: this.$store.getters['auth/getToken'],
                    //id: this.id,
                    //profileId: this.activeProfileId
                });
                console.log('Install');
                console.log(install);
                this.installed = [Number(this.$route.path.replace('/dashboard/marketplace/addon/', ''))];
                window.location.reload();
            },
            async uninstallAddon() {
                let uninstall = await this.$axios.$post('/marketplace/addon/uninstall/' + this.$route.path.replace('/dashboard/marketplace/addon/', ''), {
                    token: this.$store.getters['auth/getToken'],
                    //id: this.id,
                    //profileId: this.activeProfileId
                });
                console.log('Uninstall');
                console.log(uninstall);
                this.installed = [];
                window.location.reload();
            },
            async buildTags() {
                if(this.pendingTag.indexOf(' ') > 0) {
                    this.addon.tags.push(this.pendingTag.trim());
                    this.pendingTag = '';
                }
            },
            async pluck(item) {
                let index = this.addon.tags.indexOf(item);
                if (index !== -1) {
                   this.addon.tags.splice(index, 1);
                }
            }
        }
    }
</script>