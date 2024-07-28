// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/image"],
  runtimeConfig: {
    mySecret: process.env.MY_SECRET,
    public:{
      thirdwebClientId: '',
      contractAddress: '',
      paymentContractAddress: '',
      buyContractAddress: '',
    }
  }
})