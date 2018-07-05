<template>
  <div class="nav-breadcrumb-wrap">
    <div class="container">
      <nav class="nav-breadcrumb">
        <a href="/">Home</a>
        <slot name="Goods"></slot>
        <slot name="Cart"></slot>
        <slot name="Address"></slot>
        <slot name="OrderConfirm"></slot>
        <slot name="OrderSuccess"></slot>
      </nav>
    </div>
  </div>
</template>

