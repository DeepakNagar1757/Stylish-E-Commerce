export const CartDummyData = {
  success: true,
  data: {
    cart_items: [
      {
        id: "cart_item_001",
        product: {
          id: "prod_12345",
          name: "Women's Casual Wear",
          image_url:
            "https://images.unsplash.com/photo-1600219823854-f3bfee26ea9c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d29tZW5zLWNhc3VhbC13ZWFyfGVufDB8fDB8fHww",
          rating: {
            average: 4.8,
            count: 1247,
            stars: 5,
          },
          variations: [
            {
              type: "color",
              options: [
                {
                  id: "var_black",
                  name: "Black",
                  is_available: true,
                },
                {
                  id: "var_red",
                  name: "Red",
                  is_available: true,
                },
              ],
            },
          ],
        },
        selected_variation: {
          color: "Black",
        },
        pricing: {
          original_price: 64.0,
          discounted_price: 34.0,
          discount_percentage: 33,
          currency: "USD",
          price: 34,
        },
        quantity: 1,
        subtotal: 34.0,
      },
      {
        id: "cart_item_002",
        product: {
          id: "prod_67890",
          name: "Men's Jacket",
          image_url:
            "https://images.unsplash.com/photo-1578198576866-7e0ba6078128?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8TWVuJ3MlMjBKYWNrZXR8ZW58MHx8MHx8fDA%3D",
          rating: {
            average: 4.7,
            count: 892,
            stars: 5,
          },
          variations: [
            {
              type: "color",
              options: [
                {
                  id: "var_green",
                  name: "Green",
                  is_available: true,
                },
                {
                  id: "var_grey",
                  name: "Grey",
                  is_available: true,
                },
              ],
            },
          ],
        },
        selected_variation: {
          color: "Green",
        },
        pricing: {
          original_price: 67.0,
          discounted_price: 45.0,
          discount_percentage: 28,
          currency: "USD",
          price: 24,
        },
        quantity: 1,
        subtotal: 45.0,
      },
      {
        id: "cart_item_003",
        product: {
          id: "prod_11223",
          name: "Summer Dress",
          image_url:
            "https://plus.unsplash.com/premium_photo-1673384389967-e31ea744f3eb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8U3VtbWVyJTIwRHJlc3N8ZW58MHx8MHx8fDA%3D",
          rating: {
            average: 4.9,
            count: 2103,
            stars: 5,
          },
          variations: [
            {
              type: "color",
              options: [
                {
                  id: "var_blue",
                  name: "Blue",
                  is_available: true,
                },
                {
                  id: "var_white",
                  name: "White",
                  is_available: true,
                },
                {
                  id: "var_pink",
                  name: "Pink",
                  is_available: false,
                },
              ],
            },
            {
              type: "size",
              options: [
                {
                  id: "size_s",
                  name: "S",
                  is_available: true,
                },
                {
                  id: "size_m",
                  name: "M",
                  is_available: true,
                },
                {
                  id: "size_l",
                  name: "L",
                  is_available: true,
                },
              ],
            },
          ],
        },
        selected_variation: {
          color: "Blue",
          size: "M",
        },
        pricing: {
          original_price: 89.0,
          discounted_price: 52.0,
          discount_percentage: 42,
          currency: "USD",
          price: 34,
        },
        quantity: 2,
        subtotal: 104.0,
      },
      {
        id: "cart_item_004",
        product: {
          id: "prod_44556",
          name: "Classic Sneakers",
          image_url:
            "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Q2xhc3NpYyUyMFNuZWFrZXJzfGVufDB8fDB8fHww",
          rating: {
            average: 4.6,
            count: 1567,
            stars: 5,
          },
          variations: [
            {
              type: "color",
              options: [
                {
                  id: "var_white",
                  name: "White",
                  is_available: true,
                },
                {
                  id: "var_black",
                  name: "Black",
                  is_available: true,
                },
              ],
            },
            {
              type: "size",
              options: [
                {
                  id: "size_8",
                  name: "8",
                  is_available: true,
                },
                {
                  id: "size_9",
                  name: "9",
                  is_available: true,
                },
                {
                  id: "size_10",
                  name: "10",
                  is_available: true,
                },
              ],
            },
          ],
        },
        selected_variation: {
          color: "White",
          size: "9",
        },
        pricing: {
          original_price: 120.0,
          discounted_price: 95.0,
          discount_percentage: 21,
          currency: "USD",
          price: 34,
        },
        quantity: 1,
        subtotal: 95.0,
      },
    ],
    order_summary: {
      total_items: 5,
      subtotal: 278.0,
      tax: 22.24,
      shipping: 5.0,
      discount_code: null,
      discount_amount: 0.0,
      total: 305.24,
      currency: "USD",
    },
  },
  timestamp: "2024-04-23T11:56:00Z",
};
