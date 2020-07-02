<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav" />
    <scroll class="content" ref="scroll" @scroll="contentScroll" :probe-type="3">
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info :param-info="paramInfo" ref="param" />
      <detail-comment-info :comment-info="commentInfo" ref="comment" />
      <goods-list :goods="recommends" ref="recommend" />
    </scroll>
    <detail-bottom-bar @addToCart="addToCart" />
    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>
<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";

import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/content/goods/GoodsList";

import { getDetail, getCommend, Goods, Shop, GoodsParam } from "network/detail";
import { debounce } from "common/utils";
import { itemListenerMixin, backTopMixin } from "common/mixin";

import { mapActions } from "vuex";

export default {
  name: "Detail",
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0
    };
  },
  created() {
    //1、保存传入的iid
    this.iid = this.$route.params.iid;

    //2、根据iid请求详情数据
    getDetail(this.iid).then(res => {
      // console.log(res);
      const data = res.result;
      //1、获取顶部的图片轮播数据
      this.topImages = res.result.itemInfo.topImages;

      //2、获取商品信息
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );
      //3、获取店铺信息
      this.shop = new Shop(data.shopInfo);

      //4、获取商品详细信息
      this.detailInfo = data.detailInfo;

      //5、获取参数信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );

      //6、获取评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }

      // this.$nextTick(() => {
      //   this.themeTopYs = [];
      //   this.themeTopYs.push(0);
      //   this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      //   console.log(this.themeTopYs);
      // });
    });

    //3、请求推荐数据
    getCommend().then(res => {
      // console.log(res);
      this.recommends = res.data.list;
    });

    //4、给getThemeTopY赋值
    this.getThemeTopY = debounce(() => {
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.param.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      this.themeTopYs.push(Number.MAX_VALUE);
    }, 100);
  },
  mounted() {},
  destroyed() {
    this.$bus.$off("itemImageLoad", this.itemImgListener);
  },
  methods: {
    ...mapActions(["addCart"]),
    imageLoad() {
      this.$refs.scroll.refresh();
      // this.refresh();
      this.getThemeTopY();
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index] + 44, 100);
    },
    contentScroll(position) {
      //1、获取Y值
      const positionY = -position.y + 44;
      //2、positionY和主题中值进行对比
      let length = this.themeTopYs.length;
      for (let i = 0; i < length - 1; i++) {
        // if (
        //   (positionY > this,
        //   themeTopYs[i] && positionY < this.themeTopYs[i + 1])
        // )

        if (
          this.currentIndex !== i &&
          positionY >= this.themeTopYs[i] &&
          positionY < this.themeTopYs[i + 1]
        ) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex;
        }

        // if (
        //   (this.currentIndex !== i &&
        //     i < length - 1 &&
        //     positionY >= this.themeTopYs[i] &&
        //     positionY < this.themeTopYs[i + 1]) ||
        //   (i === length - 1 && positionY >= this.themeTopYs[i])
        // ) {
        //   this.currentIndex = i;
        //   this.$refs.nav.currentIndex = this.currentIndex;
        // }
      }
      //3、是否显示回到顶部
      this.listenShowBackTop(position);
    },
    addToCart() {
      //1、获取购物车展示的商品信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;
      //2、将商品添加到购物车
      // this.$store.cartList.push(product);
      // this.$store.commit("addCart", product);
      // this.$store.dispatch("addCart", product).then(res => {
      //   console.log(res);
      // });
      this.addCart(product).then(res => {
        this.$toast.show(res, 2000);
      });
    }
  },
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList
  }
};
</script>
<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}
.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}
.content {
  height: calc(100% - 102px);
}
</style>