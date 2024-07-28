<template>
    <div style="font-size: 45px; text-align: center;">Blog</div>
    <!-- <div v-for="blog in blogs" :key="blog.id">
      {{ blog.title }}
      {{ blog.content }}
    </div>
    <div>
        PROFILE
        {{ profile.displayName }}
        {{ profile.bio}}
    </div> -->

</template>

<script setup lang="ts">

import { createThirdwebClient, getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { getAllBlogs,getProfile } from "/thirdweb/11155111/0xCd8eDcB464D82c50ACCA644cB572098A6171ccfB";


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