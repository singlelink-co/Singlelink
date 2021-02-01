<template>
    <div>
        <section class="mb-16 w-full">
        <h1>Singlelink Blog</h1>
        <p class="mb-8">
            View our most recent posts about maintenance, updates, and more.
        </p>
        </section>
        <section class="w-full flex flex-col mb-32 space-y-12">
            <a class="p-8 rounded-lg bg-white shadow-lg flex flex-col" v-for="post in posts" :href="'/blog/'+post.slug">
                <h3>{{ post.title }}</h3>
                <p class="text-sm mb-6 leading-loose">{{ post.content }}</p>
                <div class="flex flex-row items-center justify-start space-x-8 w-full">
                    <div class="text-center w-auto text-sm font-medium text-white px-8 py-6 lg:py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500">Read more</div>
                    <p class="w-auto text-xs text-gray-600">Posted on {{ post.date }}</p>
                </div>
            </a>
        </section>
    </div>
</template>

<script scoped>
    export default {
        data: () => {
            return {
                posts: [
                    {
                        title: 'Planned migration to v2.1',
                        date: '01/15/2021',
                        content: 'Learn more about our planned outage on Thursday, January 15th, 2021.',
                        slug: 'planned-outage-01-15-21'
                    },
                    {
                        title: 'MongoDB Atlas outage report',
                        date: '10/29/2020',
                        content: 'Learn more about our latest outage on Wednesday, October 28th, 2020, and what we\'re doing to mitigate events like these in the future.',
                        slug: 'outage-report-10-29-20'
                    }
                ]
            };
        }
    };
</script>