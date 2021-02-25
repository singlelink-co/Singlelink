<template>
    <section class="flex flex-shrink-0 flex-col p-8 items-center bg-gray-100 flex-grow overflow-x-hidden overflow-y-scroll">
        <div class="flex flex-col lg:flex-row justify-start lg:justify-between items-center mb-4 w-full">
            <h1 class="text-gray-800 font-extrabold tracking-tight text-3xl">Edit theme</h1>
        </div>
    </section>
</template>
<script>
export default {
    middleware: 'authenticated',
    layout: 'dashboard'
}
</script>