<template>
  <div>
    <SiteHeader />

    <UMain>
      <slot />
    </UMain>

    <SiteFooter />

    <SiteContatoModal />
    <SiteAcessoExternoModal />
    <SiteAvisoCookies />
  </div>
</template>
