/* 
    // 사용예시 : User에 대한 ResponseDto 사용
    const userResponse = new ResponseDto<User>(true, { user: {} });

    // 에러 구조 예시 
    {
        "success": false,
        "data": null,
        "statusCode": 400,
        "errors": {
            "email": "이미 해당 이메일 주소가 사용되었습니다.",
            "username": "이미 이 사용자 이름이 사용되었습니다."
        }
    }
*/

export class ResponseDto<T> {
  //제네릭 클래스
  constructor(
    public success: boolean,
    public data?: T,
    public statusCode?: number,
    public message?: string,
    public errors?: Record<string, string>, //각 필드에 대한 유효성 오류 메세지를 담기 위한 객체
  ) {}
}
