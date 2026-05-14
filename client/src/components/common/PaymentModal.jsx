import { useState, useEffect } from 'react';
import { X, CheckCircle2, Sparkles, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import paymentService from '../../services/paymentService';
import { loadRazorpayScript } from '../../utils/razorpay';

// --- Success Modal Component ---
const SuccessModal = ({ onClose }) => (
  <div className="p-8 text-center animate-in fade-in zoom-in duration-300">
    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-6 shadow-inner">
      <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-500" />
    </div>
    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Payment Successful!</h2>
    <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
      Welcome to PlaceMate Premium. You now have access to all advanced features.
    </p>
    <button
      onClick={onClose}
      className="w-full rounded-2xl bg-gray-900 dark:bg-white px-5 py-4 text-sm font-bold text-white dark:text-gray-900 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
    >
      Continue to Dashboard
    </button>
  </div>
);

// --- Main Payment Modal Component ---
const PaymentModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  
  const plans = [
    { id: '1m', name: '1 Month Plan', price: 299 },
    { id: '6m', name: '6 Months Plan', price: 1499 },
    { id: 'life', name: 'Lifetime Access', price: 3999 },
  ];
  const [selectedPlan, setSelectedPlan] = useState(plans[0]);

  // Pre-load the Razorpay script when the modal opens
  useEffect(() => {
    if (isOpen) {
      loadRazorpayScript().then((res) => {
        setScriptLoaded(res);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePayment = async () => {
    if (!scriptLoaded) {
      toast.error('Razorpay SDK failed to load. Are you online?');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create Order on Backend
      const order = await paymentService.createOrder(selectedPlan.price);
      
      if (!order || !order.id) {
        throw new Error('Server failed to create order');
      }

      // 2. Configure Razorpay Options
      const options = {
        key: order.key_id, // Enter the Key ID generated from the Dashboard
        amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: order.currency,
        name: "PlaceMate Premium",
        description: `Upgrade to ${selectedPlan.name}`,
        image: "https://razorpay.com/favicon.png", // Custom logo can be added here
        order_id: order.id, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        
        // --- Success Handler ---
        handler: async function (response) {
          try {
            toast.loading("Verifying payment...", { id: "payment-verify" });
            
            // 3. Verify Payment Signature on Backend
            const verificationResult = await paymentService.verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verificationResult.isPremium) {
              toast.success("Payment verified successfully!", { id: "payment-verify" });
              await updateProfile({ isPremium: true }); // Sync auth context state
              setIsProcessing(false); // Reset processing state
              setIsSuccess(true); // Show success view
            } else {
              throw new Error("Verification failed on server");
            }
          } catch (error) {
            console.error("Verification Error:", error);
            setIsProcessing(false); // Reset processing state on error
            toast.error("Payment verification failed. Please contact support.", { id: "payment-verify" });
          }
        },
        
        // Prefill details to improve conversion
        prefill: {
          name: user?.name || "Test User",
          email: user?.email || "test@example.com",
          contact: "9999999999" // Can be filled if you have phone numbers
        },
        
        // Notes can be passed for tracking
        notes: {
          address: "PlaceMate Corporate Office"
        },
        
        theme: {
          color: "#4f46e5", // Match our brand Indigo
        },

        // --- Modal Options ---
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            toast("Payment cancelled", { icon: "ℹ️" });
          }
        }
      };

      // 4. Initialize and Open Razorpay
      const rzp = new window.Razorpay(options);
      
      // --- Failure Handler ---
      rzp.on('payment.failed', function (response) {
        setIsProcessing(false);
        console.error("Payment Failed:", response.error);
        toast.error(`Payment failed: ${response.error.description}`);
        /* Useful for testing UPI payments:
           success@razorpay
           failure@razorpay
        */
      });
      
      rzp.open();
    } catch (error) {
      console.error("Payment initialization error:", error);
      toast.error(error.message || "Could not initiate payment. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (isProcessing) return;
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md overflow-hidden rounded-[2rem] bg-white dark:bg-gray-900 shadow-2xl animate-in fade-in zoom-in duration-200 border border-gray-100 dark:border-gray-800">
        
        {isSuccess ? (
          <SuccessModal onClose={handleClose} />
        ) : (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="relative p-6 border-b border-gray-100 dark:border-gray-800">
              <button 
                onClick={handleClose}
                className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full"
                disabled={isProcessing}
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                  <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upgrade to Premium</h2>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 pl-1">
                Unlock AI Mock Interviews, Advanced Analytics, and unlimited Resume Parsing.
              </p>
            </div>
            
            {/* Plan Selection */}
            <div className="p-6 bg-gray-50 dark:bg-gray-800/30 flex-1">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Choose your subscription</h3>
              <div className="space-y-3 mb-6">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      selectedPlan.id === plan.id
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20 shadow-md shadow-indigo-100 dark:shadow-none'
                        : 'border-transparent bg-white dark:bg-gray-900 hover:border-indigo-200 dark:hover:border-indigo-800/50 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        selectedPlan.id === plan.id ? 'border-indigo-600' : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {selectedPlan.id === plan.id && <div className="h-2.5 w-2.5 rounded-full bg-indigo-600 animate-in zoom-in" />}
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{plan.name}</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">₹{plan.price}</span>
                  </button>
                ))}
              </div>

              {/* Trust Badge */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 flex items-center justify-center gap-3 shadow-sm">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  Secured by 
                  <span className="font-bold tracking-tight text-blue-900 dark:text-blue-400">Razorpay</span>
                </span>
              </div>
              <p className="text-xs text-center text-gray-400 mt-3 px-4">
                Payments are securely processed. We don't store your card details.
              </p>
            </div>

            {/* Footer / CTA */}
            <div className="p-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={handlePayment}
                disabled={isProcessing || !scriptLoaded}
                className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-700 hover:shadow-indigo-600/40 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100 overflow-hidden"
              >
                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />
                
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Connecting to Razorpay...
                  </>
                ) : (
                  `Proceed to Pay ₹${selectedPlan.price}`
                )}
              </button>
              
              {/* Note for developers during testing */}
              <div className="mt-4 text-center">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Test Mode Active</p>
                <p className="text-[10px] text-gray-500 mt-1">Use <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-gray-600 dark:text-gray-300">success@razorpay</code> for test UPI</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
