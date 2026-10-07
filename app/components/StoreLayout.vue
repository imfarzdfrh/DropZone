<template>
  <div class="store-layout">
    <div class="store-main"><slot /></div>
    <aside class="store-sidebar">
      <span class="section-kicker">FIND YOUR NEXT UPGRADE</span>
      <h2>Shop by category</h2>
      <CategoryNavigation />
      <div class="sidebar-help">
        <StoreIcon name="help" />
        <div>
          <strong>Need a hand?</strong
          ><NuxtLink to="/support"
            >Visit our help centre <span aria-hidden="true">↗</span></NuxtLink
          >
        </div>
      </div>
    </aside>
  </div>
</template>
