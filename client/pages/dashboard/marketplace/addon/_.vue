<template>
    <section class="flex flex-shrink-0 flex-col p-8 items-center bg-gray-100 flex-grow overflow-x-hidden overflow-y-scroll">
        <div class="flex flex-col lg:flex-row justify-start lg:justify-between items-center mb-4 w-full">
            <h1 class="text-gray-800 font-extrabold tracking-tight text-3xl">Submission details</h1>
        </div>
        <div class="flex flex-col lg:flex-row w-full items-start mb-4">
            <div class="shadow flex-grow rounded-xl mb-2 relative overflow-hidden flex items-center justify-center" :style="'background:' + colors.fill.primary + ';height:450px;'">
                <div :style="'top:50%;height:50%;left:0;right:0;z-index:2;width:100%;position:absolute;background:' + colors.fill.secondary + ';'"></div>
                <div class="shadow-lg overflow-hidden flex flex-col items-center justify-center" :style="'width:85px;height:85px;position;relative;z-index:3;border-radius:50px;background:'+ colors.text.primary">
                    <div class="mt-auto w-full" :style="'height:42.5px;background:' + colors.text.secondary + ';'"></div>
                </div>
            </div>
            <div class="flex flex-col lg:w-2/3 px-8">
                <div class="flex flex-col mb-4 justify-start">
                    <label class="font-semibold mb-2">Display name</label>
                    <input class="p-3 rounded-lg bg-white text-sm text-gray-700" v-model="addon.displayName" placeholder="e.g. My beautiful theme" type="text"/>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full">
                    <label class="font-semibold mb-2">Item</label>
                    <select v-model="addon.resourceId" class="p-3 rounded-lg bg-white text-sm text-gray-700">
                        <option v-for="theme in themes" :value="theme.id">{{ theme.id }} - {{ theme.label }}</option>
                    </select>
                </div>
                <div class="flex flex-col mb-4 justify-start">
                    <label class="font-semibold mb-2">Description</label>
                    <textarea v-if="intent != 'view'" rows="6" class="p-3 rounded-lg bg-white text-sm text-gray-700" v-model="addon.description" placeholder="e.g. Your favorite beatufiul theme for Singlelink."/>
                    <p class="text-gray-600 text-sm" v-if="intent == 'view'">{{ addon.description }}</p>
                </div>
                <div class="flex flex-col mb-4 justify-start w-full">
                    <label class="font-semibold mb-2">Theme tags</label>
                    <input v-if="intent != 'view'" class="p-3 rounded-lg bg-white text-sm text-gray-700" v-model="pendingTag" placeholder="e.g. colorful" type="text"/>
                    <ul v-if="addon.tags.length>=1" class="mt-3 flex flew-rox flex-wrap justify-start items-start">
                        <li class="hover:bg-indigo-300 flex flex-row items-center justify-center p-1 text-sm px-3 text-indigo-500 mr-2 rounded bg-indigo-200 bg-indigo-200 font-medium" v-for="tag in addon.tags">
                            {{ tag }}
                            <div class="ml-2 cursor-pointer leading-none" @click="pluck(tag)">x</div>
                        </li>
                    </ul>
                </div>
                <div v-if="intent != 'view'" class="flex flex-col mb-4 justify-start w-full">
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
                    <div v-if="intent=='submit'" @click="attemptSubmit" class="px-6 py-3 font-semibold text-white rounded-lg hover:bg-indigo-500 bg-indigo-600 lg:mr-4 mb-4 lg:mb-0 cursor-pointer">Publish addon</div>
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
        data() {
            return {
                id: null,
                activeProfileId: null,
                intent: null,
                pendingTag: '',
                addon: {
                    id: null,
                    displayName: null,
                    description: null,
                    global: false,
                    tags: [],
                    resourceId: null
                },
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
        async mounted() {
            this.addon.id = Number(this.$route.path.replace('/dashboard/marketplace/addon/', ''));
            console.log(this.addon.id);
            await this.getUserData();
            await this.loadThemes();
            if(this.$route.path.replace('/dashboard/marketplace/addon/', '') == 'submit') {
                // set intent to submit
                this.intent = 'submit';
            } else {   
                this.addon = await this.$axios.$post('/marketplace/addon/' + this.$route.path.replace('/dashboard/marketplace/addon/', ''), {
                    token: this.$store.getters['auth/getToken'],
                    detailed: true
                });
                console.log(this.addon);
                // If user is author
                if(this.addon.userId == this.id) {
                    // Set intent to edit
                    this.intent = 'edit';
                } else {
                    // Else, set intent to view
                    this.intent = 'view';
                    this.getInstalledAddons();
                    this.getFavoritedAddons();
                }
                console.log('Loaded!');
                console.log(this.addon);
            }
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
                        token                    });
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
                if(!this.addon.resourceId) return;
                let submission = await this.$axios.$post('/marketplace/addon/create', {
                    token: this.$store.getters['auth/getToken'],
                    addon: {
                        //userId: this.id,
                        displayName: this.addon.displayName,
                        type: 'theme', //temporary
                        description: this.addon.description,
                        resourceId: this.addon.resourceId,
                        tags: this.addon.tags,
                        global: this.addon.global
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
                this.installed = await this.$axios.$post('/marketplace/addon/installed', {
                    token: this.$store.getters['auth/getToken'],
                    //profileId: this.activeProfileId
                });
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
                this.installed.push(this.$route.path.replace('/dashboard/marketplace/addon/', ''));
            },
            async uninstallAddon() {
                let uninstall = await this.$axios.$post('/marketplace/addon/uninstall/' + this.$route.path.replace('/dashboard/marketplace/addon/', ''), {
                    token: this.$store.getters['auth/getToken'],
                    //id: this.id,
                    //profileId: this.activeProfileId
                });
                console.log('Uninstall');
                console.log(uninstall);
                this.installed.splice(this.installed.indexof(this.$route.path.replace('/dashboard/marketplace/addon/', '')));
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