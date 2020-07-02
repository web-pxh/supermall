import { ADD_COUNTER, ADD_CART } from "./mutations-type"
export default {
  //mutations唯一的目的就是修改state中的状态
  //mutations中的每个方法尽可能完成的事件比较单一
  [ADD_COUNTER](state, payload) {
    payload.count++
  },
  [ADD_CART](state, payload) {
    payload.checked = true
    state.cartList.push(payload)
  }
}