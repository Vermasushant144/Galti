<template>
    <div class="body">

        <div class="loader">
          Loading
        </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LoadingScreen',
  };
  </script>
  
  <style scoped>
  *,
  ::before,
  ::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  .body {
    background-color: #121212;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .loader {
    font-size: 2rem;
    font-family: sans-serif;
    font-variant: small-caps;
    font-weight: 900;
    background: conic-gradient(
      #dff2ae 0 25%,
      #ff904f 25% 50%,
      #feefe7 50% 75%,
      #ffde2b 75%
    );
    background-size: 200% 200%;
    animation: animateBackground 3.5s ease-in-out infinite;
    color: transparent;
    background-clip: text;
    -webkit-background-clip: text;
  }
  
  @keyframes animateBackground {
    25% {
      background-position: 0 100%;
    }
  
    50% {
      background-position: 100% 100%;
    }
  
    75% {
      background-position: 100% 0%;
    }
  
    100% {
      background-position: 0 0;
    }
  }
  </style>
  