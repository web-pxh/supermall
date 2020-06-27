<template>
  <div class="Profile">
    <nav-bar class="profile-nav">
      <div slot="center">个人信息</div>
    </nav-bar>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
export default {
  name: "Profile",
  components: {
    NavBar
  }
};
</script>

<style scoped>
.profile-nav {
  background-color: var(--color-tint);
  color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9;
}
</style>
