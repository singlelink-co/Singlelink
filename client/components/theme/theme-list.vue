<template>
    <div class="flex flex-col w-full justify-center" :id="name.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '').split(' ').join('-').toLowerCase()">
        <h2 class="font-bold text-xl py-2 border border-t-0 border-r-0 border-l-0 border-gray-200 w-full mb-2">{{ name }}</h2>
        <div v-if="!addon" class="flex flex-row flex-wrap mb-2 justify-start w-full">
            <!-- Show active theme first -->
            <a v-for="theme in themes" v-if="!icon && active == theme.id" :href="'/dashboard/marketplace/addon/'+theme.id+query_string" class="flex flex-col p-3 flex-1 hover:bg-indigo-200 bg-indigo-200 border border-indigo-600 rounded-lg" style="width:225px;max-width:225px;min-width:225px;">
                <theme :id="theme.id" :label="theme.label" :colors="theme.colors" :theme="true"/>
            </a>
            <div v-for="theme in themes" v-if="icon && active == theme.id" @click="select_theme(theme.id)" class="flex flex-col p-3 flex-1 hover:bg-indigo-200 bg-indigo-200 border border-indigo-600 rounded-lg" style="width:225px;max-width:225px;min-width:225px;">
                <theme :id="theme.id" :icon="icon" :label="theme.label" :colors="theme.colors" :theme="true"/>
            </div>
            <!-- List active themes -->
            <a v-for="theme in themes" v-if="!icon && active != theme.id" :href="'/dashboard/marketplace/addon/'+theme.id+query_string" class="flex flex-col p-3 flex-1 hover:bg-gray-200 rounded-lg" style="width:225px;max-width:225px;min-width:225px;">
                <theme :id="theme.id" :label="theme.label" :colors="theme.colors" :theme="true"/>
            </a>
            <div v-for="theme in themes" v-if="icon && active != theme.id" @click="select_theme(theme.id)" class="cursor-pointer flex flex-col p-3 flex-1 hover:bg-gray-200 rounded-lg" style="width:225px;max-width:225px;min-width:225px;">
                <theme :id="theme.id" :icon="icon" :label="theme.label" :colors="theme.colors" :theme="true"/>
            </div>
        </div>
        <div v-if="addon" class="flex flex-row flex-wrap mb-2 justify-start w-full">
            <!-- Show active theme first -->
            <a v-for="theme in themes" v-if="!icon && active == theme.id" :href="'/dashboard/marketplace/addon/'+theme.id+query_string" class="flex flex-col p-3 flex-1 hover:bg-indigo-200 bg-indigo-200 border border-indigo-600 rounded-lg" style="width:225px;max-width:225px;min-width:225px;">
                <theme :colors="theme.resource.colors" :id="theme.id" :label="theme.displayName" :profileData="theme.resource"/>
            </a>
            <div v-for="theme in themes" v-if="icon && active == theme.id" @click="select_theme(theme.id)" class="flex flex-col p-3 flex-1 hover:bg-indigo-200 bg-indigo-200 border border-indigo-600 rounded-lg" style="width:225px;max-width:225px;min-width:225px;">
                <theme :colors="theme.resource.colors" :id="theme.id" :icon="icon" :label="theme.displayName" profileData="theme.resource"/>
            </div>
            <!-- List active themes -->
            <a v-for="theme in themes" v-if="!icon && active != theme.id" :href="'/dashboard/marketplace/addon/'+theme.id+query_string" class="flex flex-col p-3 flex-1 hover:bg-gray-200 rounded-lg" style="width:225px;max-width:225px;min-width:225px;">
                <theme :colors="theme.resource.colors" :id="theme.id" :label="theme.displayName" :profileData="theme.resource"/>
            </a>
            <div v-for="theme in themes" v-if="icon && active != theme.id" @click="select_theme(theme.id)" class="cursor-pointer flex flex-col p-3 flex-1 hover:bg-gray-200 rounded-lg" style="width:225px;max-width:225px;min-width:225px;">
                <theme :colors="theme.resource.colors" :id="theme.id" :icon="icon" :label="theme.displayName" :profileData="theme.resource"/>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'ThemeList',
    props: {
        name: String,
        themes: Array,
        extended: Boolean,
        icon: String,
        icon_click: String,
        item_click: String,
        active: String,
        addon: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            query_string: '',
        }
    },
    mounted() {
        if(window.location.href.split('?').length>1) {
            this.query_string='?'+window.location.href.split('?')[1];
        }
    },
     methods: {
        async select_theme(id) {
            try {
                const response = await this.$axios.$post('/profile/activate-theme', {
                    token: this.$store.getters['auth/getToken'],
                    id,
                });

                this.active = response.themeId;
                //window.location.reload();
                this.$root.$emit('refreshUserProfileView');
            } catch (error) {
                console.log('Failed to activate theme');
                console.log(error);
            }
        },
    }
}
</script>