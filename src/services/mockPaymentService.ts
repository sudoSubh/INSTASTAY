
export interface PaymentOptions {
  amount: number;
  currency: string;
  orderId: string;
  description: string;
  customerEmail: string;
  customerPhone: string;
  customerName: string;
}

export interface PaymentResponse {
  payment_id: string;
  order_id: string;
  signature: string;
  status: 'success' | 'failed';
}

export class MockPaymentService {
  static async initiatePayment(options: PaymentOptions): Promise<PaymentResponse> {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock successful payment (90% success rate)
    const isSuccess = Math.random() > 0.1;
    
    if (!isSuccess) {
      throw new Error('Payment failed. Please try again.');
    }

    return {
      payment_id: `pay_${Math.random().toString(36).substr(2, 12)}`,
      order_id: options.orderId,
      signature: `sig_${Math.random().toString(36).substr(2, 16)}`,
      status: 'success'
    };
  }

  static generateOrderId(): string {
    return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static async verifyPayment(paymentId: string, orderId: string): Promise<boolean> {
    // Mock verification - always return true for demo
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  }
}
