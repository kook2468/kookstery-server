export enum CartStatus {
  ACTIVE = 'active', //기본값
  INACTIVE = 'inactive', //주문이 완료된 후 카트를 비활성화
  PENDING = 'pending', //결제중 작업 대기중인 상태
  DELETED = 'deleted', //카트를 삭제했거나, 일정 기간동안 사용하지 않아 삭제된 상태
}
