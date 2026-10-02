<script setup lang="ts">
useSeoMeta({
  title: 'How it works | Dropzone',
  description: 'A quick guide to finding and receiving your next gaming skin.',
});

const steps = [
  {
    number: '01',
    title: 'Pick your look',
    text: 'Browse the drop and find a skin that feels like you. Every listing shows its game, type, and price up front.',
  },
  {
    number: '02',
    title: 'Check out',
    text: 'Add your picks to the cart and review your order before checkout. No surprises hiding in the total.',
  },
  {
    number: '03',
    title: 'Gear up',
    text: 'Once your order is confirmed, delivery instructions arrive with your purchase so you can get in game.',
  },
];
</script>

<template>
  <main class="storefront">
    <SiteHeader />
    <section class="standard-hero process-hero">
      <span class="eyebrow"><span /> EASY IN. BACK IN GAME.</span>
      <h1>From drop to<br ><em>drop-in.</em></h1>
      <p>Good skins should be the easy part. Here’s how getting yours works.</p>
      <NuxtLink class="button-primary" to="/shop">Browse the collection <span>↗</span></NuxtLink>
      <span class="process-orbit orbit-one">01</span><span class="process-orbit orbit-two">03</span>
    </section>

    <section class="process-section">
      <div class="process-section-heading">
        <span class="eyebrow"><span /> THREE STEPS. ZERO DRAMA.</span
        ><span class="process-caption">YOUR LOADOUT, ON YOUR TERMS</span>
      </div>
      <div class="process-steps">
        <article v-for="step in steps" :key="step.number" class="process-step">
          <span class="process-number">{{ step.number }}</span>
          <div class="process-step-icon" aria-hidden="true">
            <svg v-if="step.number === '01'" viewBox="0 0 48 48">
              <circle cx="20" cy="20" r="11" />
              <path d="m28 28 10 10M16 20h8M20 16v8" />
            </svg>
            <svg v-else-if="step.number === '02'" viewBox="0 0 48 48">
              <path d="M8 10h5l5 21h19l5-15H16M20 37h.1M35 37h.1" />
              <path d="m24 20 4 4 8-8" />
            </svg>
            <svg v-else viewBox="0 0 48 48">
              <path d="M8 25 24 9l16 16M13 21v18h22V21M20 39V27h8v12" />
              <path d="m19 18 4 4 7-8" />
            </svg>
          </div>
          <h2>{{ step.title }}</h2>
          <p>{{ step.text }}</p>
        </article>
      </div>
    </section>

    <section class="promise-band">
      <div>
        <span class="eyebrow"><span /> THE DROPZONE PROMISE</span>
        <h2>Clear prices.<br ><em>No weird stuff.</em></h2>
      </div>
      <p>
        Every item is listed with its price before you commit. Need a hand at any point? A real
        person is one message away.
      </p>
      <NuxtLink to="/support">Meet support <span>↗</span></NuxtLink>
    </section>

    <section class="process-faq">
      <div>
        <span class="eyebrow"><span /> QUICK ANSWERS</span>
        <h2>Still curious?</h2>
      </div>
      <div class="faq-list">
        <details>
          <summary>How quickly will I get my order?<span>+</span></summary>
          <p>
            Delivery timing depends on the item and game. The listing and order instructions should
            make the next step clear before you buy.
          </p>
        </details>
        <details>
          <summary>Which games are supported?<span>+</span></summary>
          <p>
            Each skin listing names its game. We’re starting with a curated selection and adding
            more as the collection grows.
          </p>
        </details>
        <details>
          <summary>Can I get help with an order?<span>+</span></summary>
          <p>
            Yes. Visit the support page and send us a note with your order details so we can point
            you in the right direction.
          </p>
        </details>
      </div>
    </section>
    <SiteFooter />
  </main>
</template>
