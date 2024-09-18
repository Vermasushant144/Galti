<template>
  <div id="app">
    <!-- Show the loading screen while isLoading is true -->
    <LoadingScreen v-if="isLoading" />

    <!-- Show the main content once loading is complete -->
    <div v-else>
      <HelloWorld />
      <router-view />
    </div>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import LoadingScreen from "./components/LoadingScreen.vue";

export default {
  components: {
    HelloWorld,
    LoadingScreen,
  },
  data() {
    return {
      isLoading: true,
    };
  },
  mounted() {
    // Simulate a loading delay, replace with your actual data-fetching logic
    setTimeout(() => {
      this.isLoading = false;
    }, 2000); // Adjust delay as needed
  },
};
</script>

<style>
/* Add your styles here if needed */
</style>
