"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useCartStore from "@/store";
import { useAuth, useUser } from "@clerk/nextjs";
import Loading from "@/components/Loading";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Priceformatter from "@/components/Priceformatter";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();

  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("upi");

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const {
    getGroupedItems,
    getItemCount,
    getSubTotalPrice,
    getTotalPrice,
  } = useCartStore();

  useEffect(() => {
    setIsClient(true);

    if (user) {
      setCustomer({
        name: user.fullName ?? "",
        email: user.emailAddresses?.[0]?.emailAddress ?? "",
        phone: "",
        address: "",
        city: "",
        pincode: "",
      });
    }
  }, [user]);

  if (!isClient) {
    return <Loading />;
  }

  if (!isSignedIn) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">
            Please sign in to checkout
          </h1>
        </div>
      </main>
    );
  }

  const cartProducts = getGroupedItems();

  if (!cartProducts || cartProducts.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">
            Your cart is empty
          </h1>

          <button
            onClick={() => router.push("/")}
            className="mt-5 px-6 py-3 bg-black text-white rounded-md"
          >
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  const subtotal = getSubTotalPrice();
  const total = getTotalPrice();
  const discount = subtotal - total;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePayment = async () => {
    if (
      !customer.name ||
      !customer.email ||
      !customer.phone ||
      !customer.address ||
      !customer.city ||
      !customer.pincode
    ) {
      toast.error("Please fill in all delivery details");
      return;
    }

    try {
      setLoading(true);

    const items = cartProducts.map(({ product }) => ({
  id: product._id,
  quantity: getItemCount(product._id),
  price: product.price ?? 0,
}));

      const response = await fetch("/api/fake-payment", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          customer,
          items,
          paymentMethod,
          total,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Payment failed"
        );
      }

      sessionStorage.setItem(
        "lastOrder",
        JSON.stringify(data.order)
      );

      router.push(
        `/order/success?orderId=${data.order.orderId}`
      );

    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Payment failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4">

        <h1 className="text-3xl font-semibold mb-8">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT SIDE */}

          <div className="lg:col-span-2 space-y-6">

            {/* DELIVERY */}

            <div className="bg-white rounded-lg border p-6">

              <h2 className="text-xl font-semibold mb-6">
                Delivery Details
              </h2>

              <div className="grid md:grid-cols-2 gap-4">

                <input
                  name="name"
                  value={customer.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="border rounded-md px-4 py-3 outline-none"
                />

                <input
                  name="email"
                  value={customer.email}
                  onChange={handleChange}
                  placeholder="Email"
                  type="email"
                  className="border rounded-md px-4 py-3 outline-none"
                />

                <input
                  name="phone"
                  value={customer.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="border rounded-md px-4 py-3 outline-none"
                />

                <input
                  name="pincode"
                  value={customer.pincode}
                  onChange={handleChange}
                  placeholder="PIN Code"
                  className="border rounded-md px-4 py-3 outline-none"
                />

                <input
                  name="city"
                  value={customer.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="border rounded-md px-4 py-3 outline-none"
                />

                <input
                  name="address"
                  value={customer.address}
                  onChange={handleChange}
                  placeholder="Address"
                  className="border rounded-md px-4 py-3 outline-none md:col-span-2"
                />

              </div>
            </div>

            {/* PAYMENT */}

            <div className="bg-white rounded-lg border p-6">

              <h2 className="text-xl font-semibold mb-6">
                Payment Method
              </h2>

              <div className="space-y-4">

                <label className="flex items-center gap-3 border rounded-md p-4 cursor-pointer">
                  <input
                    type="radio"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  <div>
                    <p className="font-semibold">
                      UPI
                    </p>

                    <p className="text-sm text-gray-500">
                      Google Pay / PhonePe / Paytm
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 border rounded-md p-4 cursor-pointer">
                  <input
                    type="radio"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  <div>
                    <p className="font-semibold">
                      Credit / Debit Card
                    </p>

                    <p className="text-sm text-gray-500">
                      Visa / Mastercard / RuPay
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 border rounded-md p-4 cursor-pointer">
                  <input
                    type="radio"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  <div>
                    <p className="font-semibold">
                      Cash on Delivery
                    </p>

                    <p className="text-sm text-gray-500">
                      Pay when your order arrives
                    </p>
                  </div>
                </label>

              </div>
            </div>

          </div>

          {/* RIGHT SIDE */}

          <div className="bg-white rounded-lg border p-6 h-fit">

            <h2 className="text-xl font-semibold mb-6">
              Order Summary
            </h2>

            <div className="space-y-5">

              {cartProducts.map(({ product }) => {

                const quantity = getItemCount(
                  product._id
                );

                return (
                  <div
                    key={product._id}
                    className="flex gap-4"
                  >

                    {product.images?.[0] && (
                      <Image
                        src={urlFor(
                          product.images[0]
                        ).url()}
                        alt={product.name || "Product"}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    )}

                    <div className="flex-1">

                      <h3 className="font-semibold">
                        {product.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Qty: {quantity}
                      </p>

                    </div>

                    <Priceformatter
                    amount={
                     (product.price || 0) * quantity
                      }
                      className="font-semibold"
                    />

                  </div>
                );
              })}

            </div>

            <div className="border-t mt-6 pt-5 space-y-4">

              <div className="flex justify-between">
                <span>Subtotal</span>

                <Priceformatter
                  amount={subtotal}
                />
              </div>

              <div className="flex justify-between">
                <span>Discount</span>

                <Priceformatter
                  amount={discount}
                />
              </div>

              <div className="border-t pt-4 flex justify-between text-lg font-semibold">

                <span>Total</span>

                <Priceformatter
                  amount={total}
                />

              </div>

            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full mt-6 bg-black text-white py-4 rounded-full font-semibold disabled:opacity-50"
            >
              {loading
                ? "Processing..."
                : `Pay ₹${total}`}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              This is a demo payment system.
              No real money will be charged.
            </p>

          </div>

        </div>
      </div>
    </main>
  );
}