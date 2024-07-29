<template>
    <div class="grid justify-center">
        <div>
            <p style="text-align: center;font-size: 25px;">Create Blog</p>
            <br>
            <div class="grid justify-center">
                <UButton @click="isOpen = true" icon="i-heroicons-pencil-square" size="sm" color="primary"
                    variant="solid" label="Create" :trailing="false" />
                <UModal v-model="isOpen" fullscreen>
                    <UCard :ui="{
                        base: 'h-full flex flex-col',
                        rounded: '',
                        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
                        body: {
                            base: 'grow'
                        }
                    }">
                        <template #header>
                            <div class="flex items-center justify-between">
                                <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                                    Create Blog
                                </h3>
                                <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                                    @click="isOpen = false" />
                            </div>
                        </template>

                        <Placeholder class="h-full" />
                        <UInput v-model="title" placeholder="Title"></UInput>
                        <br>
                        <UTextarea v-model="content" resize placeholder="Search..." />
                        <br>
                        <UButton @click="blogCreate(), isOpen = false">Create</UButton>
                    </UCard>
                </UModal>
            </div>

        </div>
        <br>


        <UDivider size="xl" />
        <br>


        <p style="font-size: 25px;text-align: center;">Show Blogs</p>
        <br>

        <p style="font-size: 20px; text-align: center;">Address of Creator</p>

        <UButtonGroup size="sm" orientation="horizontal">
            <UInput v-model="address" />
            <UButton icon="i-heroicons-check" color="gray" @click="getblogs" />
        </UButtonGroup>
        <br>

        <div v-if="blogs.length>0">
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

    </div>

</template>

<script setup lang="ts">
const isOpen = ref(false)
const address = ref('')
let showBlogs = false
const blogs = ref([]);
const title = ref('')
const content = ref('')


import { createThirdwebClient, getContract, prepareContractCall, resolveMethod, sendTransaction, toWei } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { createWallet, injectedProvider } from "thirdweb/wallets";
import { getAllBlogs, getProfile } from "@/thirdweb/11155111/0xcd8edcb464d82c50acca644cb572098a6171ccfb";



const runtimeConfig = useRuntimeConfig()


const client = createThirdwebClient({
    clientId: runtimeConfig.public.thirdwebClientId,
});




const contract = await getContract({
    client,
    chain: sepolia,
    address: runtimeConfig.public.contractAddress,
});
const wallet = createWallet("io.metamask");



async function getblogs(){
    blogs.value=await getAllBlogs(
        {
            owner: address.value,
            contract: contract,
        }
    )
    console.log('showing blogs',blogs.value)
}
async function blogCreate() {
    console.log('inside blog create')
    if (injectedProvider("io.metamask")) {
        // connect the wallet, this returns a promise that resolves to the connected account
        const account = await wallet.connect({
            // pass the client you created with `createThirdwebClient()`
            client,
        });
        console.log(account);
        const transaction = prepareContractCall({
            contract,
            // Pass the method signature that you want to call
            method:resolveMethod("createBlog"),
            // and the params for that method
            // Their types are automatically inferred based on the method signature
            params: [title.value, content.value],
            // value: toWei('0.000000000000000001')
        });
        console.log(transaction);
        // sign & send a transaction with the account -> returns the transaction hash
        const { transactionHash } = await sendTransaction({
            // assuming you have called `prepareTransaction()` or `prepareContractCall()` before which returns the prepared transaction to send
            transaction,
            // Pass the account to sign the transaction with
            account,
        });
        console.log(transactionHash);
    }
    else {
        console.log('Please install MetaMask');
    }

}







</script>