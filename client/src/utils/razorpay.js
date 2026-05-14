/**
 * Dynamically loads the Razorpay checkout script.
 * @returns {Promise<boolean>} True if loaded successfully, false otherwise.
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    // If already loaded, resolve immediately
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      console.error('Failed to load Razorpay checkout script');
      resolve(false);
    };

    document.body.appendChild(script);
  });
};
