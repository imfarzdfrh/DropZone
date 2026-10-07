<template>
  <footer class="dz-footer">
    <div>
      <NuxtLink class="dz-logo" to="/">DROPZONE<span class="dz-logo-dot">.</span></NuxtLink>
      <p>Your game. Your setup. Your next level.</p>
    </div>
    <nav aria-label="Footer navigation">
      <NuxtLink to="/shop">Shop all</NuxtLink><NuxtLink to="/how-it-works">How it works</NuxtLink
      ><NuxtLink to="/support">Support</NuxtLink>
    </nav>
    <span>Demo storefront<br >© {{ new Date().getFullYear() }} Dropzone</span>
  </footer>
</template>
