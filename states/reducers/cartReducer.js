import * as actions from "../actionTypes/actionTypes";

const reducer = (state = [], action) => {
  let done = false;
  switch (action.type) {
    case actions.CART_ADD:
      state.map((item, index) => {
        if (item._id === action.payload.id) {
          done = true;
          console.log("item.avaiableQuantity", item.avaiableQuantity);
          console.log("item.quantity", item.quantity);
          if (item.avaiableQuantity > item.quantity) {
            state[index].quantity =
              state[index].quantity + action.payload.avaiquantity;
          } else {
            console.log("out of stock");
          }

          return state;
        }
      });
      if (!done) {
        return [
          ...state,
          {
            _id: action.payload.id,
            category: action.payload.category,
            description: action.payload.description,
            image: action.payload.image_url,
            price: action.payload.price,
            name: action.payload.name,
            avaiableQuantity: action.payload.quantity,
            quantity: action.payload.avaiquantity,
          },
        ];
      }

    case actions.CART_REMOVE:
      return state.filter((item) => item._id !== action.payload);

    case actions.INCREASE_CART_ITEM_QUANTITY:
      if (action.payload.type === "increase") {
        state.map((item, index) => {
          if (item._id === action.payload.id) {
            return (state[index].quantity = state[index].quantity + 1);
          }
        });
      }

    case actions.DECREASE_CART_ITEM_QUANTITY:
      if (action.payload.type === "decrease") {
        state.map((item, index) => {
          if (item._id === action.payload.id) {
            return (state[index].quantity = state[index].quantity - 1);
          }
        });
      }
    case actions.EMPTY_CART:
      if (action.payload === "empty") {
        state.splice(0, state.length);
        return state;
      }

    default:
      return state;
  }
};

export default reducer;
