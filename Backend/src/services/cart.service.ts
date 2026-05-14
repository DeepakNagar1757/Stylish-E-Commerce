import Cart from "../models/cart.model";

interface addItemInput {
  productId: string;
  quantity: number;
  selectedSize: string;
}

export const getCart = async (userId: string) => {
  const cart = await Cart.findOne({ user: userId }).populate({
    path: "items.product",
    select: "title price image originalPrice discountPercentage rating",
  });

  return cart;
};

export const addItemToCart = async (userId: string, itemdata: addItemInput) => {
  const { productId, quantity, selectedSize } = itemdata;

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [
        {
          product: productId,
          quantity,
          selectedSize,
        },
      ],
    });
    return cart;
  }
  const existingItem = cart.items.find(
    (item: any) =>
      item.product.toString() === productId &&
      item.selectedSize === selectedSize,
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      product: productId as any,
      quantity,
      selectedSize,
    });
  }

  await cart.save();

  return cart;
};

export const updateItemQuantity = async (
  userId: string,
  productId: string,
  selectedSize: string,
  quantity: number,
) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new Error("Cart not found");
  }

  const item = cart.items.find(
    (item: any) =>
      item.product.toString() === productId &&
      item.selectedSize === selectedSize,
  );

  if (!item) {
    throw new Error("Item not found in cart");
  }

  item.quantity = quantity;

  await cart.save();

  return cart;
};

export const removeItemFromCart = async (
  userId: string,
  productId: string,
  selectedSize: string,
) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new Error("Cart not found");
  }

  cart.items = cart.items.filter(
    (item: any) =>
      !(
        item.product.toString() === productId &&
        item.selectedSize === selectedSize
      ),
  );

  await cart.save();

  return cart;
};

export const clearCart = async (userId: string) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new Error("Cart not found");
  }

  cart.items = [];

  await cart.save();

  return cart;
};
