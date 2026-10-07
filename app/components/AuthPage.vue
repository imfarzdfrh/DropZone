<script setup lang="ts">
const props = defineProps<{
  mode: 'login' | 'signup';
}>();

const isLogin = computed(() => props.mode === 'login');
const showPassword = ref(false);
const statusMessage = ref('');
const account = useAccount();

async function handleSubmit(event: SubmitEvent) {
  const form = event.currentTarget as HTMLFormElement;
  const values = new FormData(form);
  const email = String(values.get('email') ?? '');
  const username = String(values.get('name') ?? '');
  account.startDemoSession(email, username || undefined);
  statusMessage.value = 'Demo account ready. Authentication is not connected.';
  await navigateTo('/account');
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
        <span class="auth-kicker"><i /> YOUR NEXT ROUND STARTS HERE</span>
        <p>Make every<br >match <em>yours.</em></p>
        <div class="auth-visual-bottom">
          <span>THE RIGHT LOOK CHANGES EVERYTHING</span>
          <span>01 <i /> 04</span>
        </div>
      </div>
      <span class="auth-image-credit">DROPZONE / PLAYER CULTURE</span>
    </aside>

    <section class="auth-main">
      <a class="auth-back" href="/"> <span aria-hidden="true">←</span> Back to shop </a>

      <div class="auth-form-wrap">
        <div class="auth-mobile-brand">
          <span class="wordmark-mark">D</span>
          <span>DROPZONE<span class="wordmark-period">.</span></span>
        </div>
        <span class="auth-kicker auth-form-kicker">{{
          isLogin ? 'GOOD TO SEE YOU AGAIN' : 'JOIN THE DROP'
        }}</span>
        <h1>{{ isLogin ? 'Welcome back.' : 'Create your account.' }}</h1>
        <p class="auth-status" role="note">
          Demo mode: any valid email opens a local sample account. Passwords are not verified or
          stored.
        </p>
        <p class="auth-intro">
          {{
            isLogin
              ? 'Your loadout is waiting. Sign in to pick up where you left off.'
              : 'Keep your games, gear and saved picks in one place. It only takes a minute.'
          }}
        </p>

        <form class="auth-form" @submit.prevent="handleSubmit">
          <FormField
            v-if="!isLogin"
            label="Display name"
            input-id="display-name"
            required
            class="auth-field"
          >
            <Input
              id="display-name"
              type="text"
              name="name"
              autocomplete="name"
              placeholder="How players know you"
              required
            />
          </FormField>

          <FormField label="Email address" input-id="email" required class="auth-field">
            <Input
              id="email"
              type="email"
              name="email"
              autocomplete="email"
              placeholder="you@example.com"
              required
            />
          </FormField>

          <FormField label="Password" input-id="password" required class="auth-field">
            <span class="auth-password-wrap">
              <Input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                name="password"
                :autocomplete="isLogin ? 'current-password' : 'new-password'"
                :placeholder="isLogin ? 'Enter your password' : 'At least 8 characters'"
                :minlength="isLogin ? undefined : 8"
                required
              />
              <Button
                variant="ghost"
                size="sm"
                class="auth-password-toggle"
                type="button"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? 'Hide' : 'Show' }}
              </Button>
            </span>
          </FormField>

          <div v-if="isLogin" class="auth-form-options">
            <Label class="auth-checkbox">
              <Checkbox name="remember" />
              <span>Keep me signed in</span>
            </Label>
            <Button
              variant="ghost"
              size="sm"
              class="auth-forgot-password"
              @click.prevent="statusMessage = 'Password recovery is not connected yet.'"
              >Forgot password?</Button
            >
          </div>
          <Label v-else class="auth-checkbox auth-terms">
            <Checkbox name="terms" required />
            <span>I agree to the Terms of Service and Privacy Policy.</span>
          </Label>

          <Button class="auth-submit" type="submit" variant="primary" block>
            {{ isLogin ? 'Sign in' : 'Create account' }} <span aria-hidden="true">↗</span>
          </Button>
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

      <footer class="auth-footer">
        <span>© {{ new Date().getFullYear() }} DROPZONE</span><span>PLAY ON YOUR TERMS.</span>
      </footer>
    </section>
  </main>
</template>
