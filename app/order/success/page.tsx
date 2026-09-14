"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Order = {
  orderId: string;
  paymentId: string;
  status: string;
  paymentMethod: string;
  total: number;
};

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const savedOrder = sessionStorage.getItem("lastOrder");

    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    }
  }, []);

  if (!order) {
    return (
      <main className="mx-auto mt-20 max-w-[700px] px-5 text-center">
        <h1>Order Not Found</h1>

        <Link href="/">Go back to home</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto mt-20 max-w-[700px] px-5 text-center">
      <div className="rounded-[15px] border border-[#ddd] p-10">
        <h1>🎉 Order Successful!</h1>

        <p className="mt-[15px]">
          Thank you for your purchase.
        </p>

        <div className="mt-[30px] text-left">
          <p>
            <strong>Order ID:</strong>{" "}
            {order.orderId}
          </p>

          <p>
            <strong>Payment ID:</strong>{" "}
            {order.paymentId}
          </p>

          <p>
            <strong>Payment Method:</strong>{" "}
            {order.paymentMethod}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {order.status}
          </p>

          <p>
            <strong>Total:</strong> ₹{order.total}
          </p>
        </div>

        <Link href="/">
          <button className="mt-[30px] cursor-pointer rounded-lg border-0 px-[25px] py-3">
            Continue Shopping
          </button>
        </Link>
      </div>
    </main>
  );
}