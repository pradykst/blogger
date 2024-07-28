<template>
    <div class="grid justify-center">
        <p style="font-size: 35px;text-align: center;">Settings</p>
        <br>
        <p style="font-size: 25px;text-align: center; color: mediumseagreen;">Disconnect Wallet</p>
        <br>
        <div class="grid justify-center">
            <UButton @click="disconnect">Disconnect</UButton>
        </div>
        <br>
        <UDivider label="Owner Properties" size="lg" />
        <br>
        <p style="font-size: 15px;text-align: center;">Change Blog Length</p>
        <UButtonGroup size="sm" orientation="horizontal">
            <UInput v-model="blogLength" placeholder="length"></UInput>
            <UButton icon="i-heroicons-check" color="gray" @click="change(blogLength,'changeBlogLength')"/>
        </UButtonGroup>
        
        <br>
        <p style="font-size: 15px;text-align: center;">Change Max. Number of Reports</p>
        <UButtonGroup size="sm" orientation="horizontal">
            <UInput v-model="reportNo" placeholder="reports"></UInput>
            <UButton icon="i-heroicons-check" color="gray" @click="change(reportNo,'changeReport')"/>
        </UButtonGroup>
        
        

    </div>

</template>

<script setup lang="ts">
import { createThirdwebClient, getContract, prepareContractCall, resolveMethod, sendAndConfirmTransaction, sendTransaction, toWei } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { createWallet, injectedProvider } from "thirdweb/wallets";
import { changeBlogLength, changeReport } from "~/thirdweb/11155111/0xcd8edcb464d82c50acca644cb572098a6171ccfb";
const toast = useToast();
const reportNo = ref('');
const blogLength = ref('');

const error = ref('');


function disconnect() {
    wallet.disconnect();
    toast.add({ title: 'You are now disconnected' })
}
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

async function change(length, type) {
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
            method: resolveMethod(type),
            // and the params for that method
            // Their types are automatically inferred based on the method signature
            params: [length],
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
        try {
            const receipt = await sendAndConfirmTransaction({
                transaction,
                account,
            });
            console.log('reciept', receipt)
            toast.add({ title: 'Successfully Changed' })
        }
        catch (e) {
            console.log('error ', e)
            error.value = 'You are not the owner'
            toast.add({ title: error.value })


        }
    }
    else {
        console.log('Please install MetaMask');
    }

}



</script>
