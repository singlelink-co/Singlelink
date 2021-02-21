<template>
    <section class="flex flex-shrink-0 flex-col p-8 items-center bg-gray-100 flex-grow overflow-x-hidden overflow-y-scroll">
        <div class="flex flex-col lg:flex-row justify-start lg:justify-between items-center mb-4 w-full">
            <h1 class="text-gray-800 font-extrabold tracking-tight text-3xl">Theme details</h1>
            <div class="cursor-pointer bg-gray-400 text-white font-semibold text-sm py-3 px-6 rounded-lg hover:bg-gray-300" v-if="id && id == theme.authorId">Edit theme</div>
        </div>
        <div class="flex flex-col lg:flex-row w-full mb-8">
            <div class="shadow flex-grow h-44 rounded-xl mb-2 relative overflow-hidden flex items-center justify-center" :style="'background:' + theme.colors.fill.primary + ';'">
                <div :style="'top:50%;height:50%;left:0;right:0;z-index:2;width:100%;position:absolute;background:' + theme.colors.fill.secondary + ';'"></div>
                <div class="shadow-lg overflow-hidden flex flex-col items-center justify-center" :style="'width:85px;height:85px;position;relative;z-index:3;border-radius:50px;background:'+ theme.colors.text.primary">
                    <div class="mt-auto w-full" :style="'height:42.5px;background:' + theme.colors.text.secondary + ';'"></div>
                </div>
            </div>
            <div class="flex flex-col lg:w-2/3 px-8">
                <div class="flex flex-col mb-4 justify-start">
                    <label class="font-semibold mb-2">Theme name</label>
                    <input class="p-3 rounded-lg bg-white text-sm text-gray-700" v-model="theme.name" placeholder="e.g. My beautiful theme" type="text"/>
                </div>
                <div class="flex flex-col mb-4 justify-start">
                    <label class="font-semibold mb-2">Theme description</label>
                    <input class="p-3 rounded-lg bg-white text-sm text-gray-700" v-model="theme.description" placeholder="e.g. Your favorite beatufiul theme for Singlelink." type="text"/>
                </div>
                <div class="flex flex-col mb-4 justify-start">
                    <label class="font-semibold mb-2">Thumbnail image</label>
                    <input class="p-3 rounded-lg bg-white text-sm text-gray-700" v-model="theme.thumbnail" placeholder="e.g. Your favorite beatufiul theme for Singlelink." type="text"/>
                </div>
            </div>
        </div>
        <div class="flex flex-col w-full">
        <h2 class="font-bold text-xl py-2 border border-t-0 border-r-0 border-l-0 border-gray-200 w-full mb-2">Custom HTML</h2>
        <MonacoEditor
            v-if="id"
                height="350"
                language="html"
                theme="vs-dark"
                :options="{
                  autoIndent: 'full',
                  autoClosingQuotes: true,
                  readOnly: (id != theme.authorId)
                }"
                v-model="theme.customHtml"
              ></MonacoEditor>
              
        <h2 class="font-bold text-xl py-2 mt-8 border border-t-0 border-r-0 border-l-0 border-gray-200 w-full mb-2">Custom CSS</h2>
        <MonacoEditor
                v-if="id"
                height="350"
                language="html"
                theme="vs-dark"
                :options="{
                  autoIndent: 'full',
                  autoClosingQuotes: true,
                  readOnly: (id != theme.authorId)
                }"
                v-model="theme.customCss"
              ></MonacoEditor>
        </div>
        <div class="flex flex-col mb-4 justify-start w-full mt-6">
            <label class="font-semibold mb-2">Published?</label>
            <select class="p-3 rounded-lg bg-white text-sm text-gray-700" v-model="theme.global">
                <option value="false">No, this theme is private.</option>
                <option value="true">Yes, this theme is available for community download.</option>
            </select>
        </div>
        <div class="px-6 py-3 font-semibold text-white rounded-lg hover:bg-indigo-500 bg-indigo-600 mr-auto mt-4 cursor-pointer">Save changes</div>
        
    </section>
</template>
<script>
    export default {
        layout: 'dashboard',
        middleware: 'authenticated',
        data() {
            return {
                id: null,
                theme: {
                    name: 'Example theme',
                    description: 'Your favorite beatufiul theme for Singlelink.',
                    authorId: 1,
                    global: true,
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
                    customHtml: '',
                    customCss: '',
                }
            }
        },
        async mounted() {
            await this.getUserData();
        },
        methods: {
            async getUserData() {
                try {
                    const token = this.$store.getters['auth/getToken'];

                    const userResponse = await this.$axios.$post('/user', {
                        token
                    });

                    this.id = userResponse.id;
                    console.log(userResponse);

                } catch (err) {
                    console.log('Error getting user data');
                    console.log(err);
                }
                },
        }
    }
</script>