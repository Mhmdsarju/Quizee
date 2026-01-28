import { useState } from "react";
import Swal from "sweetalert2";
import api from "../../api/axios";

export default function AddMoneyModal({ onClose, onSuccess }) {
  const [amount, setAmount] = useState("");

  const handleAdd = async () => {
    if (!amount || amount <= 0) {
      return Swal.fire({
        icon: "warning",
        title: "Invalid Amount",
        text: "Please enter a valid amount",
      });
    }

    try {
      Swal.fire({
        title: "Creating payment...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const { data: order } = await api.post(
        "/payment/create-order",
        { amount }
      );

      Swal.close();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: "INR",
        order_id: order.id,
        name: "Quiz App Wallet",
        description: "Add money to wallet",
        handler: async function (response) {
          try {
            Swal.fire({
              title: "Verifying payment...",
              allowOutsideClick: false,
              didOpen: () => Swal.showLoading(),
            });

            await api.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount,
            });

            Swal.fire({
              icon: "success",
              title: "Money Added",
              text: `₹${amount} added to your wallet successfully`,
              timer: 1500,
              showConfirmButton: false,
            });

            /* ✅ TELL WALLET PAGE PAYMENT IS DONE */
            onSuccess();   // 🔥 THIS TRIGGERS AUTO REDIRECT
          } catch (err) {
            Swal.fire({
              icon: "error",
              title: "Payment Failed",
              text:
                err?.response?.data?.message ||
                "Payment verification failed",
            });
          }
        },

        modal: {
          ondismiss: () => {
            Swal.fire({
              icon: "info",
              title: "Payment Cancelled",
              text: "You cancelled the payment",
            });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err?.response?.data?.message ||
          "Unable to initiate payment",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[320px] p-6 space-y-4">
        <h3 className="text-lg font-semibold">Add Money</h3>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={handleAdd}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
          >
            Add Money
          </button>
        </div>
      </div>
    </div>
  );
}
