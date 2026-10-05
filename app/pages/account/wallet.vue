<script setup lang="ts">
import { validDeposit } from '~/utils/storeValidation';
const account = useAccount();
const amount = ref(10);
const customAmount = ref('');
const step = ref<'amount' | 'payment'>('amount');
const message = ref('');
const selectedAmount = computed(() =>
  customAmount.value ? Number(customAmount.value) : amount.value,
);
const formattedDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

function continueToPayment() {
  message.value = '';
  if (!validDeposit(selectedAmount.value)) {
    message.value = 'Choose an amount between $5 and $500 with at most two decimal places.';
    return;
  }
  step.value = 'payment';
}

function recordPendingRequest() {
  if (account.requestDeposit(selectedAmount.value)) {
    message.value =
      'Payment provider unavailable. A pending demo request was recorded; your balance has not changed.';
    step.value = 'amount';
    customAmount.value = '';
    amount.value = 10;
  } else {
    message.value = 'Unable to record this amount. Check your session and deposit amount.';
    step.value = 'amount';
  }
}

useSeoMeta({
  title: 'Wallet | Dropzone',
  description: 'View your Dropzone wallet and transaction history.',
});
</script>

<template>
  <AccountShell>
    <div class="wallet-page-content">
      <section class="wallet-card">
        <div class="wallet-card-top">
          <span class="wallet-symbol" aria-hidden="true">◈</span
          ><span>DROPZONE WALLET <i>DEMO</i></span>
        </div>
        <span class="wallet-label">AVAILABLE BALANCE</span>
        <strong class="wallet-amount">${{ account.user.value?.walletBalance.toFixed(2) }}</strong>
        <div class="wallet-card-bottom">
          <span>PLAYER FUNDS</span><span>•••• &nbsp; •••• &nbsp; •••• &nbsp; 2048</span>
        </div>
        <span class="wallet-card-grid" aria-hidden="true" />
      </section>

      <section class="account-panel add-funds-panel">
        <div class="account-section-heading">
          <div>
            <span class="account-overline">LOAD YOUR WALLET</span>
            <h2>Add funds</h2>
            <p>Choose an amount to begin a demo payment request.</p>
          </div>
        </div>
        <div v-if="step === 'amount'" class="funds-step">
          <div class="fund-amount-options" role="group" aria-label="Choose deposit amount">
            <button
              v-for="value in [5, 10, 25, 50]"
              :key="value"
              type="button"
              :class="{ 'fund-amount-active': !customAmount && amount === value }"
              @click="
                amount = value;
                customAmount = '';
              "
            >
              ${{ value }}
            </button>
          </div>
          <label class="account-field"
            ><span>Custom amount <small>$5 minimum · $500 maximum</small></span
            ><span class="currency-input"
              ><i>$</i
              ><input
                v-model="customAmount"
                type="number"
                min="5"
                max="500"
                step="0.01"
                placeholder="Enter amount"
                @input="amount = 0" ></span
          ></label>
          <Button type="button" @click="continueToPayment"
            >Continue to payment <span aria-hidden="true">↗</span></Button
          >
        </div>
        <div v-else class="payment-placeholder">
          <div>
            <span class="account-overline">PAYMENT STEP</span
            ><strong>${{ selectedAmount.toFixed(2) }}</strong>
            <p>
              No payment provider is connected. Continuing will only record a pending demo request;
              funds will not be added.
            </p>
          </div>
          <div class="payment-step-actions">
            <button class="account-text-button" type="button" @click="step = 'amount'">
              ← Change amount</button
            ><Button type="button" variant="secondary" @click="recordPendingRequest"
              >Record pending request</Button
            >
          </div>
        </div>
        <p v-if="message" class="account-form-message" role="status">{{ message }}</p>
        <p class="wallet-safety-note">
          No real payments are processed. Your balance changes only after future server-side payment
          confirmation.
        </p>
      </section>

      <section class="account-panel transaction-panel">
        <div class="account-section-heading">
          <div>
            <span class="account-overline">WALLET ACTIVITY</span>
            <h2>Transactions</h2>
          </div>
          <span class="transaction-count">{{ account.transactions.value.length }} RECORDS</span>
        </div>
        <div v-if="account.transactions.value.length" class="transaction-list">
          <article
            v-for="transaction in account.transactions.value"
            :key="transaction.id"
            class="transaction-row"
          >
            <span
              class="transaction-icon"
              :class="`transaction-icon-${transaction.type.toLowerCase()}`"
              >{{
                transaction.type === 'Purchase' ? '↗' : transaction.type === 'Refund' ? '↙' : '+'
              }}</span
            >
            <div class="transaction-description">
              <strong>{{ transaction.description }}</strong
              ><span>{{ transaction.type }} · {{ formattedDate(transaction.date) }}</span>
            </div>
            <span
              class="transaction-status"
              :class="`status-${transaction.status.toLowerCase()}`"
              >{{ transaction.status }}</span
            >
            <strong class="transaction-amount"
              >{{ transaction.amount < 0 ? '−' : '+' }}${{
                Math.abs(transaction.amount).toFixed(2)
              }}</strong
            >
          </article>
        </div>
        <div v-else class="transaction-empty">
          <span>◈</span>
          <p>No wallet activity yet.</p>
        </div>
      </section>
    </div>
  </AccountShell>
</template>
