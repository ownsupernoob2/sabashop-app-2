export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const ADD_ON_CART = 'ADD_ON_CART';
export const CLEAR_CART = 'CLEAR_CART';

export const AddToCart = product => {
    return { type: ADD_TO_CART, product: product }
}


export const removeFromCart = productId => {
    return { type: REMOVE_FROM_CART, pid: productId };
  };

export const addOnCart = productId => {
    return { type: ADD_ON_CART, pid: productId };
  };
export const clearCart = () => {
    return { type: CLEAR_CART };
  };






  
  