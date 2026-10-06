<script setup lang="ts">
import { skins } from '~/data/skins';

useSeoMeta({
  title: 'Your cart | Dropzone',
  description: 'Review your Dropzone skin picks before checkout.',
});

const cart = useCart();
const account = useAccount();
const checkoutMessage = ref('');
const useWalletFunds = ref(false);

const cartLines = computed(() =>
  Object.entries(cart.items.value)
    .map(([id, quantity]) => {
      const skin = skins.find((item) => item.id === Number(id));
      return skin ? { ...skin, quantity } : null;
    })
    .filter((line) => line !== null),
);

const walletContribution = computed(() =>
  useWalletFunds.value && account.user.value
    ? Math.min(cart.subtotal.value, account.user.value.walletBalance)
    : 0,
);
const remainingAfterWallet = computed(() =>
  Math.max(0, cart.subtotal.value - walletContribution.value),
);

function beginCheckout() {
  checkoutMessage.value = walletContribution.value
    ? 'Checkout is not connected. Wallet funds have not been charged.'
    : 'Checkout is not connected yet. Your cart is saved while you browse.';
}
</script>

<template>
  <main class="storefront">
    <SiteHeader />
    <section class="standard-hero cart-page-hero">
      <span class="eyebrow"><span /> YOUR PICKS, ALL IN ONE PLACE</span>
      <h1>Your <em>cart.</em></h1>
      <p>One last look before your next loadout gets real.</p>
    </section>

    <section class="cart-section">
      <div v-if="cartLines.length" class="cart-layout">
        <div class="cart-items">
          <div class="cart-list-heading">
            <span>ITEM</span><span>QUANTITY</span><span>PRICE</span>
          </div>
          <article v-for="line in cartLines" :key="line.id" class="cart-line">
            <div class="cart-product">
              <div
                class="cart-thumb"
                :style="{
                  backgroundImage: `linear-gradient(180deg, transparent, rgba(10, 13, 13, .35)), url('${line.image}')`,
                }"
              />
              <div>
                <span class="cart-product-game">{{ line.game }} / {{ line.category }}</span>
                <h2>{{ line.name }}</h2>
                <span class="cart-stock">DIGITAL ITEM · IN STOCK</span>
              </div>
            </div>
            <div class="quantity-control">
              <Button
                variant="outline"
                size="icon"
                :aria-label="`Remove one ${line.name}`"
                @click="cart.setQuantity(line.id, line.quantity - 1)"
              >
                −
              </Button>
              <span>{{ line.quantity }}</span>
              <Button
                variant="outline"
                size="icon"
                :aria-label="`Add one ${line.name}`"
                @click="cart.setQuantity(line.id, line.quantity + 1)"
              >
                +
              </Button>
            </div>
            <div class="cart-line-price">
              <strong>${{ (line.price * line.quantity).toFixed(2) }}</strong
              ><Button variant="danger" size="sm" @click="cart.removeFromCart(line.id)"
                >Remove</Button
              >
            </div>
          </article>
          <Button variant="ghost" class="continue-shopping" to="/shop"
            ><span>←</span> Keep browsing</Button
          >
        </div>

        <aside class="order-summary">
          <span class="eyebrow"><span /> THE BREAKDOWN</span>
          <h2>Order summary</h2>
          <div class="summary-row">
            <span
              >Items <i>({{ cart.count.value }})</i></span
            ><strong>${{ cart.subtotal.value.toFixed(2) }}</strong>
          </div>
          <div class="summary-row">
            <span>Digital delivery</span><strong class="included">INCLUDED</strong>
          </div>
          <div v-if="account.user.value" class="cart-wallet-option">
            <Label
              ><Checkbox v-model="useWalletFunds" /><span>Use wallet funds</span
              ><strong>${{ account.user.value.walletBalance.toFixed(2) }} available</strong></Label
            >
            <div v-if="useWalletFunds" class="cart-wallet-breakdown">
              <span>Wallet contribution</span><strong>−${{ walletContribution.toFixed(2) }}</strong>
              <span>Remaining at checkout</span
              ><strong>${{ remainingAfterWallet.toFixed(2) }}</strong>
            </div>
            <small>Preview only. Funds are not deducted until secure checkout is connected.</small>
          </div>
          <Button v-else variant="ghost" class="cart-wallet-signin" to="/login"
            >Sign in to use wallet funds <span>↗</span></Button
          >
          <div class="summary-total">
            <span>{{ useWalletFunds ? 'Remaining due' : 'Estimated total' }}</span
            ><strong
              >${{
                useWalletFunds ? remainingAfterWallet.toFixed(2) : cart.subtotal.value.toFixed(2)
              }}</strong
            >
          </div>
          <Button variant="primary" size="lg" class="checkout-button" @click="beginCheckout">
            Continue to checkout <span>↗</span>
          </Button>
          <p v-if="checkoutMessage" class="checkout-message" role="status">{{ checkoutMessage }}</p>
          <p class="secure-note"><span>◈</span> Your order details stay private.</p>
        </aside>
      </div>
      <div v-else class="cart-empty">
        <span class="empty-cart-mark">＋</span>
        <span class="eyebrow"><span /> NOTHING IN THE DROP ZONE</span>
        <h2>Your cart is taking a breather.</h2>
        <p>There are plenty of good looks still waiting to be found.</p>
        <Button variant="primary" class="button-primary" to="/shop"
          >Explore the shop <span>↗</span></Button
        >
      </div>
    </section>
    <SiteFooter />
  </main>
</template>
