<script setup lang="ts">
const props = defineProps<{
  mode: 'login' | 'signup';
}>();

const isLogin = computed(() => props.mode === 'login');
const showPassword = ref(false);
const statusMessage = ref('');

function handleSubmit() {
  statusMessage.value = 'Authentication is not connected yet.';
}
</script>

<template>
  <main class="auth-page" :class="{ 'auth-page-signup': !isLogin }">
    <aside class="auth-visual">
      <a class="auth-brand" href="/" aria-label="Dropzone home">
        <span class="wordmark-mark">D</span>
        <span>DROPZONE<span class="wordmark-period">.</span></span>
      </a>

      <div class="auth-visual-copy">
        <span class="auth-kicker"><i/> YOUR NEXT ROUND STARTS HERE</span>
        <p>Make every<br >match <em>yours.</em></p>
        <div class="auth-visual-bottom">
          <span>THE RIGHT LOOK CHANGES EVERYTHING</span>
          <span>01 <i/> 04</span>
        </div>
      </div>
      <span class="auth-image-credit">DROPZONE / PLAYER CULTURE</span>
    </aside>

    <section class="auth-main">
      <a class="auth-back" href="/">
        <span aria-hidden="true">←</span> Back to shop
      </a>

      <div class="auth-form-wrap">
        <div class="auth-mobile-brand">
          <span class="wordmark-mark">D</span>
          <span>DROPZONE<span class="wordmark-period">.</span></span>
        </div>
        <span class="auth-kicker auth-form-kicker">{{ isLogin ? 'GOOD TO SEE YOU AGAIN' : 'JOIN THE DROP' }}</span>
        <h1>{{ isLogin ? 'Welcome back.' : 'Create your account.' }}</h1>
        <p class="auth-intro">
          {{ isLogin ? 'Your loadout is waiting. Sign in to pick up where you left off.' : 'Get closer to the skins you came for. It only takes a minute.' }}
        </p>

        <form class="auth-form" @submit.prevent="handleSubmit">
          <label v-if="!isLogin" class="auth-field">
            <span>Display name</span>
            <input
              id="display-name"
              type="text"
              name="name"
              autocomplete="name"
              placeholder="How players know you"
              required
            >
          </label>

          <label class="auth-field">
            <span>Email address</span>
            <input
              id="email"
              type="email"
              name="email"
              autocomplete="email"
              placeholder="you@example.com"
              required
            >
          </label>

          <label class="auth-field">
            <span>Password</span>
            <span class="auth-password-wrap">
              <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                name="password"
                :autocomplete="isLogin ? 'current-password' : 'new-password'"
                :placeholder="isLogin ? 'Enter your password' : 'At least 8 characters'"
                :minlength="isLogin ? undefined : 8"
                required
              >
              <button
                class="auth-password-toggle"
                type="button"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </span>
          </label>

          <div v-if="isLogin" class="auth-form-options">
            <label class="auth-checkbox">
              <input type="checkbox" name="remember" >
              <span>Keep me signed in</span>
            </label>
            <a href="#forgot-password" @click.prevent="statusMessage = 'Password recovery is not connected yet.'">Forgot password?</a>
          </div>
          <label v-else class="auth-checkbox auth-terms">
            <input type="checkbox" name="terms" required >
            <span>I agree to the Terms of Service and Privacy Policy.</span>
          </label>

          <button class="auth-submit" type="submit">
            {{ isLogin ? 'Sign in' : 'Create account' }} <span aria-hidden="true">↗</span>
          </button>
          <p v-if="statusMessage" class="auth-status" role="status">{{ statusMessage }}</p>
        </form>

        <p class="auth-switch">
          {{ isLogin ? 'New to Dropzone?' : 'Already have an account?' }}
          <NuxtLink :to="isLogin ? '/signup' : '/login'">
            {{ isLogin ? 'Create an account' : 'Sign in' }}
          </NuxtLink>
        </p>
        <div class="auth-safe-note"><span>✳</span> YOUR ACCOUNT. YOUR LOADOUT. YOUR CALL.</div>
      </div>

      <footer class="auth-footer"><span>© 2025 DROPZONE</span><span>PLAY ON YOUR TERMS.</span></footer>
    </section>
  </main>
</template>