<script setup lang="ts">
useSeoMeta({
  title: 'Support | Dropzone',
  description: 'Get help with your Dropzone order or account.',
});

const statusMessage = ref('');
const supportTopics = [
  { label: 'Order question', value: 'order' },
  { label: 'Account help', value: 'account' },
  { label: 'Something else', value: 'other' },
];

function submitSupportRequest() {
  statusMessage.value = 'This demo form is not connected yet. Email support@dropzone.gg for help.';
}
</script>

<template>
  <main class="storefront">
    <SiteHeader />
    <section class="standard-hero support-hero">
      <span class="eyebrow"><span /> REAL PEOPLE. PLAYER FIRST.</span>
      <h1>Need a hand?<br /><em>We’ve got you.</em></h1>
      <p>Order question, account hiccup, or just need a little direction? Start here.</p>
    </section>

    <section class="support-layout">
      <div class="support-contact">
        <div class="support-panel-head"><span>01 / CONTACT</span><span class="live-dot" /></div>
        <h2>Talk to the team.</h2>
        <p>Send a note and include your order number if you have one. We’ll take it from there.</p>
        <form class="support-form" @submit.prevent="submitSupportRequest">
          <FormField label="Your name" input-id="support-name" required class="support-field">
            <Input
              id="support-name"
              name="name"
              autocomplete="name"
              placeholder="Player name"
              required
            />
          </FormField>
          <FormField label="Email address" input-id="support-email" required class="support-field">
            <Input
              id="support-email"
              name="email"
              type="email"
              autocomplete="email"
              placeholder="you@example.com"
              required
            />
          </FormField>
          <FormField
            label="What can we help with?"
            input-id="support-topic"
            required
            class="support-field"
          >
            <Select
              id="support-topic"
              name="topic"
              :options="supportTopics"
              placeholder="Select a topic"
              required
            />
          </FormField>
          <FormField label="Your message" input-id="support-message" required class="support-field">
            <Textarea
              id="support-message"
              name="message"
              :rows="4"
              placeholder="Give us the details..."
              required
            />
          </FormField>
          <Button class="button-primary support-submit" type="submit" variant="primary" block>
            Send a message <span>↗</span>
          </Button>
          <p v-if="statusMessage" class="support-status" role="status">{{ statusMessage }}</p>
        </form>
      </div>

      <div class="support-faq">
        <div class="support-panel-head">
          <span>02 / COMMON QUESTIONS</span><span>HELP DESK</span>
        </div>
        <h2>Quick answers.</h2>
        <div class="faq-list">
          <details open>
            <summary>Where is my order?<span>+</span></summary>
            <p>
              Check your confirmation details first. If something looks off, message us with the
              email used at checkout and your order number.
            </p>
          </details>
          <details>
            <summary>How do digital items arrive?<span>+</span></summary>
            <p>
              Each product includes its own delivery instructions. Read the listing details before
              checkout and follow the steps sent with your order.
            </p>
          </details>
          <details>
            <summary>Can I change or cancel an order?<span>+</span></summary>
            <p>
              Digital orders can be time-sensitive. Contact support as soon as possible and include
              your order number so we can review it.
            </p>
          </details>
          <details>
            <summary>How do I keep my account secure?<span>+</span></summary>
            <p>
              Use a unique password and never share your game login or verification codes with
              anyone.
            </p>
          </details>
        </div>
        <a class="support-email" href="mailto:support@dropzone.gg"
          ><span>Still stuck? Email us</span><b>support@dropzone.gg ↗</b></a
        >
      </div>
    </section>
    <SiteFooter />
  </main>
</template>
