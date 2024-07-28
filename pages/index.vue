<template>
    <div style="font-size: 45px; text-align: center; color: mediumspringgreen;">Blog</div>
    <!-- <div v-for="blog in blogs" :key="blog.id">
      {{ blog.title }}
      {{ blog.content }}
    </div>
    <div>
        PROFILE
        {{ profile.displayName }}
        {{ profile.bio}}
    </div> -->
    <br>
    <div class="grid justify-center">
        <UHorizontalNavigation :links="links" class="border-b border-black-200 dark:border-gray-600" />
    </div>
    <br>
    <div class="grid justify-center">
        <UTabs :items="items" class="w-full">
            <template #icon="{ item, selected }">
                <UIcon :name="item.icon" class="w-4 h-4 flex-shrink-0 mr-2"
                    :class="[selected && 'text-primary-500 dark:text-primary-400']" />
            </template>
        </UTabs>
    </div>
    <br>
    <br>

    <div class="grid justify-center">
        <p style="text-align: center; font-size: 20px; font-style: oblique; color: mediumseagreen;">Top Bloggers of this
            Week!</p>

        <UTable :rows="people" />

    </div>



</template>

<script setup lang="ts">

const route = useRoute()

const links = [{
    label: 'Profile',
    icon: 'i-heroicons-user',
    to: '/createprofile'
}, {
    label: 'Blogs',
    icon: 'i-heroicons-book-open',
    to: '/blogs'
}, {
    label: 'Create Blog',
    icon: 'i-heroicons-pencil-square',
    to: '/createblog'
}, {
    label: 'Settings',
    icon: 'i-heroicons-cog-6-tooth',
    to: '/settings'
}]

const items = [{
    label: 'About the App',
    icon: 'i-heroicons-information-circle',
    content: 'You can create your profile with name and your bio. Then you can create your own blogs and post them '
}, {
    label: 'Likes',
    icon: 'i-heroicons-hand-thumb-up',
    content: 'You can like and dislike posts too!'
}, {
    label: 'Reporting',
    icon: 'i-heroicons-flag',
    content: 'You can also report posts , and if they are reported by more than 5 people it gets deleted'
}]

const people = [{
    rank: 1,
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    blogs: 77,
    Likes: 133423
}, {
    rank: 2,
    name: 'Courtney Henry',
    title: 'Designer',
    blogs: 72,
    Likes: 123456
}, {
    rank: 3,
    name: 'Tom Cook',
    title: 'Director of Product',
    blogs: 68,
    Likes: 112345
}, {
    rank: 4,
    name: 'Whitney Francis',
    title: 'Copywriter',
    blogs: 56,
    Likes: 110456
}, {
    rank: 5,
    name: 'Leonard Krasner',
    title: 'Senior Designer',
    blogs: 54,
    Likes: 103489
}, {
    rank: 6,
    name: 'Floyd Miles',
    title: 'Principal Designer',
    blogs: 51,
    Likes: 102346
}]

import { createThirdwebClient, getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { getAllBlogs, getProfile } from "/thirdweb/11155111/0xCd8eDcB464D82c50ACCA644cB572098A6171ccfB";


const runtimeConfig = useRuntimeConfig()
const blogs = ref([]);
const profile = ref({});

const client = createThirdwebClient({
    clientId: runtimeConfig.public.thirdwebClientId,
});




const contract = await getContract({
    client,
    chain: sepolia,
    address: runtimeConfig.public.contractAddress,
});

const result = await getAllBlogs(
    {
        owner: '0xdE0Cefe3eb6854a81f1D967b41a5d28319FCD594',
        contract: contract,
    }
)
console.log(result)
blogs.value = result;

profile.value = await getProfile(
    {
        user: '0xdE0Cefe3eb6854a81f1D967b41a5d28319FCD594',
        contract: contract,
    }
)





</script>