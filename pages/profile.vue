<template>
    <div class="grid justify-center">
        <div style="font-size: 40px;">
            <p class="grid justify-center"> <UIcon name="i-heroicons-user-circle" class="w-50 h-50" /></p>
           
            <p style="text-align: center;">PROFILE</p>
        </div>

        <div>
            <UCard>
                <template #header style="text-align: center;">
                    <Placeholder class="h-8" />
                    <p style="font-size: 20px; color: gray;text-align: center;">Name</p>

                    <p style="text-align: center;"> {{ profile.displayName }}
                    </p>
                </template>

                <Placeholder class="h-32" />
                <p style="font-size: 20px; color: gray;text-align: center;">Bio</p>

                <p style="text-align: center;"> {{ profile.bio }}
                </p>



                <template #footer>
                    <Placeholder class="h-8" />
                    <p style="text-align: center;">
                        <UButton to="/createprofile" color="white">Create Profile</UButton>
                    </p>

                </template>
            </UCard>


        </div>
        <br>
        <UDivider size="md" />
        <br>

        <div style="font-size: 35px;">
            <p class="grid justify-center"> <UIcon name="i-heroicons-book-open" class="w-50 h-50" /></p>
           

            <p style="text-align: center;">Your Blogs</p>
        </div>
        <br>
        <div v-for="blog in blogs" :key="blog.id">
            <UCard>
                <template #header>
                    <p style="font-size: 20px; color: gray;text-align: center;">Title</p>
                    <Placeholder class="h-8" />
                    <p style="text-align: center;">{{ blog.title }}
                    </p>
                    
                </template>

                <Placeholder class="h-32" />
                <p style="font-size: 20px; color: gray;text-align: center;">Content</p>


                <p style="text-align: center;"> {{ blog.content }}
                </p>
                
                


            </UCard>
            <br>
            
            
        </div>
    </div>
</template>

<script setup lang="ts">

import { createThirdwebClient, getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { getAllBlogs, getProfile } from "@/thirdweb/11155111/0xcd8edcb464d82c50acca644cb572098a6171ccfb";


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