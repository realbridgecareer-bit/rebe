// 결제 주문 공용 타입 + 주문번호 생성.

export type OrderStatus = "pending" | "paid" | "failed";

export type Order = {
  id?: string;
  created_at?: string;
  order_id: string;
  package_id: string | null;
  package_name: string;
  amount: number;
  buyer_name: string;
  buyer_phone: string;
  buyer_email: string | null;
  status: OrderStatus;
  payment_key: string | null;
  approved_at: string | null;
};

/** 토스페이먼츠 orderId 규칙: 영문 대소문자/숫자/-/_/= , 6~64자, 유일값. */
export function generateOrderId(): string {
  const rand = (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`).replace(/-/g, "");
  return `rebe_${Date.now().toString(36)}_${rand.slice(0, 12)}`;
}
