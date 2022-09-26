import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  ADD_ON_CART,
  CLEAR_CART,
} from "../actions/cart";
import { ADD_ORDER } from "../actions/orders";
import CartItem from "../../models/cart-item";
import { DELETE_PRODUCT } from "../actions/products";

const initialState = {
  items: {},
  totalAmount: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const { id, title, discountedPrice, imageUrl, discount, pushToken } = action.product;

      const itemExisted = !!state.items[id];
      const sum = itemExisted ? state.items[id].sum + discountedPrice : discountedPrice;
      const quantity = itemExisted ? state.items[id].quantity + 1 : 1;

      return {
        ...state,
        items: {
          ...state.items,
          [id]: new CartItem(quantity, discountedPrice, title, sum, imageUrl, discount, pushToken),
        },
        totalAmount: state.totalAmount + discountedPrice,
      };

    case ADD_ON_CART:
      const selectedCartItem = state.items[action.pid];
      let updatedCartItems;
      // need to reduce it, not erase it
      const updatedCartItem = new CartItem(
        selectedCartItem.quantity + 1,
        selectedCartItem.productPrice,
        selectedCartItem.productTitle,
        selectedCartItem.sum + selectedCartItem.productPrice,
        selectedCartItem.productImage,
      );
      updatedCartItems = { ...state.items, [action.pid]: updatedCartItem };

      return {
        ...state,
        items: updatedCartItems,
        totalAmount: state.totalAmount + selectedCartItem.productPrice,
      };

    case REMOVE_FROM_CART:
      const selectedCartItem1 = state.items[action.pid];
      const currentQty = selectedCartItem1.quantity;
      let updatedCartItems1;
      if (currentQty > 1) {
        // need to reduce it, not erase it
        const updatedCartItem1 = new CartItem(
          selectedCartItem1.quantity - 1,
          selectedCartItem1.productPrice,
          selectedCartItem1.productTitle,
          selectedCartItem1.sum - selectedCartItem1.productPrice,
          selectedCartItem1.productImage,

        );
        updatedCartItems1 = { ...state.items, [action.pid]: updatedCartItem1 };
      } else {
        updatedCartItems1 = { ...state.items };
        delete updatedCartItems1[action.pid];
      }
      return {
        ...state,
        items: updatedCartItems1,
        totalAmount: state.totalAmount - selectedCartItem1.productPrice,
      };
    case ADD_ORDER:
      return initialState;
    case CLEAR_CART:
      return initialState;
    case DELETE_PRODUCT:
      if (!state.items[action.pid]) {
        return state;
      }
      const updatedItems = { ...state.items };
      const itemTotal = state.items[action.pid].sum;
      delete updatedItems[action.pid];
      return {
        ...state,
        items: updatedItems,
        totalAmount: state.totalAmount - itemTotal,
      };
  }

  return state;
};
