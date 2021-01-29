<template>
    <div style="width:335px;" class="p-4 rounded-lg border border-gray-400 shadow-lg bg-white flex flex-col">
        <div class="flex flex-row items-start mb-2">
            <div class="w-12 h-12 rounded-full bg-gray-100 mr-4" :style="'background-position:center;background-repeat:no-repeat;background-size:cover;background-image:url(' + avatar + ')'"></div>
            <div class="flex flex-col">
                <span class="text-black font-semibold">{{ name }}</span>
                <span class="text-sm text-gray-600 font-medium">@{{ handle }}</span>
            </div>
            <img :src="'/' + platform + '.png'" class="mb-auto ml-auto w-4"/>
        </div>
        <p class="font-semibold text-sm tracking-tight text-gray-900 mb-2">{{ content }}</p>
        <div class="text-gray-600 text-sm">{{ date }}</div>
    </div>
</template>
<script>
export default {
    name: 'Testimonial',
    props: {
        name: String,
        handle: String,
        avatar: String,
        content: String,
        platform: String,
        date: String
    }
};
</script>
