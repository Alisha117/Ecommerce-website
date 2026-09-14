import { defineField, defineType } from "sanity";

export const orderType = defineType({
  name: "order",
  title: "Orders",
  type: "document",

  fields: [
    defineField({
      name: "orderId",
      title: "Order ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "customer",
      title: "Customer Details",
      type: "object",
      fields: [
        defineField({
          name: "name",
          title: "Name",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),

        defineField({
          name: "email",
          title: "Email",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),

        defineField({
          name: "phone",
          title: "Phone",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),

        defineField({
          name: "address",
          title: "Address",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),

        defineField({
          name: "city",
          title: "City",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),

        defineField({
          name: "pincode",
          title: "Pincode",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    defineField({
      name: "items",
      title: "Ordered Products",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "product",
              title: "Product",
              type: "reference",
              to: [{ type: "product" }],
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: "quantity",
              title: "Quantity",
              type: "number",
              validation: (Rule) => Rule.required().min(1),
            }),

            defineField({
              name: "priceAtPurchase",
              title: "Price At Purchase",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            }),
          ],
          preview: {
            select: {
              title: "product.name",
              quantity: "quantity",
              price: "priceAtPurchase",
            },
            prepare({ title, quantity, price }) {
              return {
                title: title || "Product",
                subtitle: `Qty: ${quantity} × ₹${price}`,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),

    defineField({
      name: "subtotal",
      title: "Subtotal",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),

    defineField({
      name: "discount",
      title: "Discount",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),

    defineField({
      name: "total",
      title: "Total",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),

    defineField({
      name: "paymentMethod",
      title: "Payment Method",
      type: "string",
      options: {
        list: [
          { title: "UPI", value: "upi" },
          { title: "Credit / Debit Card", value: "card" },
          { title: "Cash On Delivery", value: "cod" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "paymentId",
      title: "Payment ID",
      type: "string",
    }),

    defineField({
      name: "paymentStatus",
      title: "Payment Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Paid", value: "paid" },
          { title: "Failed", value: "failed" },
          { title: "Refunded", value: "refunded" },
        ],
      },
      initialValue: "pending",
    }),

    defineField({
      name: "orderStatus",
      title: "Order Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Confirmed", value: "confirmed" },
          { title: "Processing", value: "processing" },
          { title: "Shipped", value: "shipped" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
      initialValue: "pending",
    }),

    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
    }),
  ],

  preview: {
    select: {
      title: "orderId",
      customer: "customer.name",
      total: "total",
      status: "orderStatus",
    },

    prepare({ title, customer, total, status }) {
      return {
        title: title || "Order",
        subtitle: `${customer || "Customer"} • ₹${total || 0} • ${status || "pending"}`,
      };
    },
  },
});