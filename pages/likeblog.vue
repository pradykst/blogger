<template>
    <div class="grid justify-center">
        <p style="font-size: 30px;">Feedback For Blog</p>

        <br>

        <p style="font-size: 25px; text-align: center; color: mediumseagreen;">Blog</p>

        <p style="font: 20px;text-align: center;">Creator Address</p>
        <UInput v-model="address" placeholder="Address"></UInput>
        <br>
        <p style="font: 20px;text-align: center;">Blog Id</p>

        <UInput v-model="id" placeholder="Id"></UInput>

        <br>
        <div style="text-align: center;">
            <UButton @click="showBlog">Show</UButton>
        </div>
        <br>
        <div class="grid justify-center" v-if="blogs.length > 0">
            <UButtonGroup size="xl" orientation="horizontal">
                <UTooltip text="Like Blog">
                    <UButton icon="i-heroicons-hand-thumb-up" color="gray" @click="interact('likeBlog')"></UButton>
                </UTooltip>
                <UTooltip text="Dislike Blog">
                    <UButton icon="i-heroicons-hand-thumb-down" color="gray" @click="interact('unlikeBlog')"></UButton>
                </UTooltip>
                <UTooltip text="Report Blog">
                    <UButton icon="i-heroicons-flag" color="gray" @click="interact('reportBlog')"></UButton>
                </UTooltip>




            </UButtonGroup>
            <br>
        </div>


        <UCard v-if="blogs.length > 0">
            <template #header>
                <p style="font-size: 20px; color: gray;text-align: center;">Title</p>
                <Placeholder class="h-8" />
                <p style="text-align: center;">{{ blogs[id].title }}
                </p>

            </template>

            <Placeholder class="h-32" />
            <p style="font-size: 20px; color: gray;text-align: center;">Content</p>


            <p style="text-align: center;"> {{ blogs[id].content }}
            </p>
        </UCard>





    </div>
</template>

<script setup lang="ts">
const address = ref('')
const id = ref('')
const blogs = ref([]);
const error=ref('');
const toast = useToast()


import { createThirdwebClient, getContract, prepareContractCall, resolveMethod, sendAndConfirmTransaction, sendTransaction, toWei } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { createWallet, injectedProvider } from "thirdweb/wallets";
import { getAllBlogs } from "/thirdweb/11155111/0xCd8eDcB464D82c50ACCA644cB572098A6171ccfB";

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

async function showBlog() {
    blogs.value = await getAllBlogs(
        {
            owner: address.value,
            contract: contract,
        }
    )
    console.log('showing blogs', blogs.value)
}

async function interact(methodName) {
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
            method: resolveMethod(methodName),
            // and the params for that method
            // Their types are automatically inferred based on the method signature
            params: [address.value, id.value],
            // value: toWei('0.000000000000000001')
        });
        console.log(transaction);
        // sign & send a transaction with the account -> returns the transaction hash
        // const { transactionHash } = await sendTransaction({
        //     // assuming you have called `prepareTransaction()` or `prepareContractCall()` before which returns the prepared transaction to send
        //     transaction,
        //     // Pass the account to sign the transaction with
        //     account,
        // });
        // console.log(transactionHash);
        try{
        const receipt = await sendAndConfirmTransaction({
            transaction,
            account,
        });
        console.log('reciept',receipt)
    }
    catch(e){
        console.log('error ',e)
        error.value='Creator cant like, dislike or report post'
        toast.add({ title: error.value})
        

    }
}
    else {
        console.log('Please install MetaMask');
    }

}


</script>