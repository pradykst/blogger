<template>

    <div style="font-size: 35px;">Create Profile</div>
    <br>
    <UInput v-model="n" color="primary" variant="outline" placeholder="Name..." />
    <UInput v-model="b" color="primary" variant="outline" placeholder="Bio..." />
    
    <UButton @click="create">Submit</UButton>
</template>

<script setup lang="ts">
import { createThirdwebClient, getContract, prepareContractCall, resolveMethod, sendTransaction, toWei } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { createWallet, injectedProvider } from "thirdweb/wallets";
import { setProfile } from "~/thirdweb/11155111/0xcd8edcb464d82c50acca644cb572098a6171ccfb";

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

const n = ref('')
const b = ref('')





async function create() {
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
            method:resolveMethod("setProfile"),
            // and the params for that method
            // Their types are automatically inferred based on the method signature
            params: [n.value, b.value],
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