/**
 * 추후 상태 추가 예정
 * PENDING(결제 전),
 * SHIPPING(배송 중),
 * DELIVERED(배송 완료)
 */

export enum OrderStatus {
  PENDING = 'pending', // 결제 전
  CONFIRMED = 'confirmed', // 주문 확정됨
  CANCELED = 'canceled', // 주문 취소
}
