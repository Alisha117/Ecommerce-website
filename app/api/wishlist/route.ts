import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { client } from "@/sanity/lib/client";

// GET wishlist
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const [wishlistRows] = await db.query(
      `
      SELECT product_id
      FROM wishlist_items
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [userId]
    );

    const rows = wishlistRows as { product_id: string }[];

    const productIds = rows.map((item) => item.product_id);

    if (productIds.length === 0) {
      return NextResponse.json({
        success: true,
        wishlist: [],
      });
    }

    const products = await client.fetch(
      `*[_type == "product" && _id in $productIds]`,
      { productIds }
    );

    return NextResponse.json({
      success: true,
      wishlist: products,
    });
  } catch (error) {
    console.error("GET wishlist error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to load wishlist" },
      { status: 500 }
    );
  }
}

// POST wishlist
export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    await db.query(
      `
      INSERT INTO wishlist_items (user_id, product_id)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE product_id = product_id
      `,
      [userId, productId]
    );

    return NextResponse.json({
      success: true,
      message: "Product added to wishlist",
    });
  } catch (error) {
    console.error("POST wishlist error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to add product to wishlist" },
      { status: 500 }
    );
  }
}

// DELETE wishlist
export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    await db.query(
      `
      DELETE FROM wishlist_items
      WHERE user_id = ? AND product_id = ?
      `,
      [userId, productId]
    );

    return NextResponse.json({
      success: true,
      message: "Product removed from wishlist",
    });
  } catch (error) {
    console.error("DELETE wishlist error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to remove product from wishlist" },
      { status: 500 }
    );
  }
}