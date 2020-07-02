<template>
  <div class="cart">
    <nav-bar class="cart-nav">
      <div slot="center">购物车({{cartLength}})</div>
    </nav-bar>
    <!-- 商品类表 -->
    <cart-list />
    <!-- 底部汇总 -->
    <cart-bottom-bar />
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";

import CartList from "./childComps/CartList";
import CartBottomBar from "./childComps/CartBottomBar";

import { mapGetters } from "vuex";
export default {
  name: "Cart",
  computed: {
    ...mapGetters(["cartLength"])
  },
  components: {
    NavBar,
    CartList,
    CartBottomBar
  }
};
</script>

<style scoped>
.cart {
  height: 100vh;
}
.cart-nav {
  background-color: var(--color-tint);
  color: #fff;
}
</style>
