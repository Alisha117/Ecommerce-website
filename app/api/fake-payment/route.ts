import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/writeClient";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      customer,
      items,
      paymentMethod,
      total,
    } = body;

    // -------------------------
    // Validation
    // -------------------------

    if (!customer?.name) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer name is required",
        },
        { status: 400 }
      );
    }

    if (!customer?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer email is required",
        },
        { status: 400 }
      );
    }

    if (!customer?.phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer phone is required",
        },
        { status: 400 }
      );
    }

    if (!customer?.address) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer address is required",
        },
        { status: 400 }
      );
    }

    if (!customer?.city) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer city is required",
        },
        { status: 400 }
      );
    }

    if (!customer?.pincode) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer pincode is required",
        },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart is empty",
        },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment method is required",
        },
        { status: 400 }
      );
    }

    if (!total || total <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid total amount",
        },
        { status: 400 }
      );
    }

    // -------------------------
    // Fake payment processing
    // -------------------------

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const orderId = `ORD-${Date.now()}`;

    const paymentId =
      paymentMethod === "cod"
        ? `COD-${Date.now()}`
        : `PAY-${Math.random()
            .toString(36)
            .substring(2, 10)
            .toUpperCase()}`;

    const paymentStatus =
      paymentMethod === "cod" ? "pending" : "paid";

    // -------------------------
    // Prepare Sanity order items
    // -------------------------
const orderItems = items.map((item: any, index: number) => ({
  _key: `${item.id}-${index}`,

  product: {
    _type: "reference",
    _ref: item.id,
  },

  quantity: item.quantity,

  priceAtPurchase: item.price ?? 0,
}));

    // -------------------------
    // Create Order in Sanity
    // -------------------------

    const order = await writeClient.create({
      _type: "order",

      orderId,

      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        pincode: customer.pincode,
      },

      items: orderItems,

      subtotal: total,
      discount: 0,
      total,

      paymentMethod,
      paymentId,
      paymentStatus,

      orderStatus:
        paymentMethod === "cod"
          ? "pending"
          : "confirmed",

      createdAt: new Date().toISOString(),
    });

    // -------------------------
    // Response
    // -------------------------

    return NextResponse.json({
      success: true,

      message: "Order created successfully",

      order: {
        orderId,
        sanityId: order._id,
        paymentId,
        status: paymentStatus,
        paymentMethod,
        total,
        customer,
        items,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("ORDER CREATION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create order",
      },
      { status: 500 }
    );
  }
}