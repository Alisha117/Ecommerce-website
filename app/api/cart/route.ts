import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { client } from "@/sanity/lib/client";

// GET USER CART
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be logged in",
        },
        { status: 401 }
      );
    }

    // Get cart items from MySQL
    const [rows] = await db.query(
      `SELECT product_id, quantity
       FROM cart_items
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    const cartRows = rows as {
      product_id: string;
      quantity: number;
    }[];

    // If cart is empty
    if (cartRows.length === 0) {
      return NextResponse.json({
        success: true,
        cart: [],
      });
    }

    // Get product IDs
    const productIds = cartRows.map((item) => item.product_id);

    // Get products from Sanity
    const products = await client.fetch(
      `*[_type == "product" && _id in $productIds]`,
      { productIds }
    );


    // Combine Sanity product + MySQL quantity
    const cart = cartRows
      .map((item) => {
        const product = products.find(
          (product: any) => product._id === item.product_id
        );

        if (!product) return null;

        return {
          product,
          quantity: item.quantity,
        };
      })
      .filter(Boolean);

    return NextResponse.json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("GET CART ERROR:", error);

   return NextResponse.json(
  {
    success: false,
    message: "Failed to load cart",
    error: error instanceof Error ? error.message : String(error),
  },
  { status: 500 }
);
  }
}


// ADD PRODUCT TO CART
export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    // User is not logged in
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be logged in",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message: "productId is required",
        },
        { status: 400 }
      );
    }

    await db.query(
      `
      INSERT INTO cart_items
        (user_id, product_id, quantity)
      VALUES
        (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        quantity = quantity + VALUES(quantity)
      `,
      [userId, productId, quantity]
    );

    return NextResponse.json({
      success: true,
      message: "Product added to cart",
    });

  } catch (error) {
    console.error("ADD CART ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add product to cart",
      },
      { status: 500 }
    );
  }
}


// DECREASE PRODUCT QUANTITY
export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be logged in",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message: "productId is required",
        },
        { status: 400 }
      );
    }

    const [rows] = await db.query(
      `
      SELECT quantity
      FROM cart_items
      WHERE user_id = ? AND product_id = ?
      `,
      [userId, productId]
    );

    const cartRows = rows as { quantity: number }[];

    if (cartRows.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Product is not in cart",
      });
    }

    if (cartRows[0].quantity > 1) {

      await db.query(
        `
        UPDATE cart_items
        SET quantity = quantity - 1
        WHERE user_id = ? AND product_id = ?
        `,
        [userId, productId]
      );

    } else {

      await db.query(
        `
        DELETE FROM cart_items
        WHERE user_id = ? AND product_id = ?
        `,
        [userId, productId]
      );

    }

    return NextResponse.json({
      success: true,
      message: "Cart quantity updated",
    });

  } catch (error) {
    console.error("DECREASE CART ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to decrease cart quantity",
      },
      { status: 500 }
    );
  }
}


// DELETE PRODUCT FROM CART
export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be logged in",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message: "productId is required",
        },
        { status: 400 }
      );
    }

    await db.query(
      `
      DELETE FROM cart_items
      WHERE user_id = ? AND product_id = ?
      `,
      [userId, productId]
    );

    return NextResponse.json({
      success: true,
      message: "Product removed from cart",
    });

  } catch (error) {
    console.error("DELETE CART ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to remove product from cart",
      },
      { status: 500 }
    );
  }
}