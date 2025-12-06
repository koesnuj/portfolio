```
Test case 페이지에 “테스트케이스 편집” 기능을 추가하고 싶다.

요구사항은 다음과 같다.

[기본 동작]

1) Test case 목록(테이블)에서 특정 테스트케이스 행을 클릭하면,
   화면 가운데에 모달 팝업이 열리고 해당 케이스의 상세 정보가 편집 가능한 상태로 표시된다.

2) 모달 안에서 내용을 수정하고 "Save" 또는 "Update" 버튼을 누르면:
   - 해당 테스트케이스의 정보가 업데이트되고
   - 목록 테이블에도 바로 반영되며
   - 모달은 닫힌다.

3) "Cancel" 버튼이나 모달 외부(오버레이)를 클릭하면 변경 없이 모달이 닫힌다.

[모달에서 수정 가능한 필드]

- Title (텍스트 입력)
- Preconditions (리치 텍스트 에디터)
- Steps (리치 텍스트 에디터)
- Expected result (리치 텍스트 에디터)
- Priority (드롭다운: Low / Medium / High)

※ 이 페이지는 “테스트 런 실행용 케이스”가 아니라  
   “테스트케이스 정의”를 관리하는 페이지이므로 Assignee, Status는 필요 없다.

[리치 텍스트 에디터 기능]

Preconditions, Steps, Expected result 필드는 리치 텍스트 에디터를 사용해야 한다.
필요한 기능은 다음과 같다:

1) Text formatting
   - Bold (굵게)
   - Italic (기울임)
   - Underline (밑줄)

2) Lists
   - Bullet list (불릿 목록)
   - Numbered list (번호 목록)

3) 링크 자동 인식
   - URL(예: https://google.com)을 입력하면 자동으로 하이퍼링크로 변환
   - 렌더링 시 `<a href="..." target="_blank" rel="noreferrer">` 로 출력해 새 창에서 열리도록 한다.

[UI/UX 조건]

- 모달 디자인은 현재 TMS UI 스타일과 동일한 톤으로 구성한다.
- 화면 중앙 정렬, 폭 640~800px 카드 형태.
- 툴바는 에디터 상단에 아이콘 버튼(B/I/U, 리스트 등)으로 구성.
- 반투명 오버레이 포함, ESC 또는 배경 클릭 시 닫힘.
- Save/Update 및 Cancel 버튼은 모달 우측 하단에 배치.

[데이터 및 구현]

- TestCase 타입은 다음을 사용한다:
  ```ts
  type TestCase = {
    id: string;
    title: string;
    preconditions: string;   // HTML 또는 Markdown 저장
    steps: string;
    expectedResult: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
  };
```

---

```
Test case 폴더 구조에서 드래그&드롭을 통해
폴더 순서를 바꾸거나 부모/자식 관계를 변경할 수 있는 기능을 추가해줘.

[현재 상황]

- 좌측에 Test case 폴더 트리 구조가 있다.
- 각 폴더는 계층 구조(부모/자식)를 가진다.
- 현재는 폴더를 마우스로 드래그해서 순서를 바꾸거나
  다른 폴더의 자식으로 옮기는 기능이 없다.

[요구사항 – 드래그&드롭 동작]

1) 순서 변경
   - 같은 레벨(형제 폴더들) 안에서는
     마우스로 폴더를 드래그해서 위/아래 순서를 바꿀 수 있어야 한다.
   - 드롭 위치에 따라 최종 순서가 갱신된다.

2) 부모/자식 변경
   - 폴더를 다른 폴더 위로 드래그해서 드롭하면,
     해당 폴더의 “자식 폴더”로 이동시키는 것이 가능해야 한다.
   - 예:
     - A / B / C 가 있고,
     - B를 드래그해서 C 위에 드롭 → B가 C의 자식 폴더가 되도록.
   - 필요하다면:
     - 특정 깊이 이상으로는 중첩되지 않도록 옵션을 둘 수 있다
       (예: 최대 3단계 깊이).

3) UX 디테일
   - 드래그 중일 때:
     - 현재 드롭 가능한 영역(폴더/위치)에 하이라이트 표시.
   - 드래그 불가능한 위치(예: 자기 자신 밑, 순환 구조 등)는
     드롭되지 않도록 막아준다.
   - 드롭이 성공하면 폴더 트리가 즉시 갱신되고,
     서버에도 새로운 구조가 저장되도록 한다.

4) 데이터 구조

- 폴더 데이터는 대략 이런 형태라고 가정해줘:
  ```ts
  type Folder = {
    id: string;
    name: string;
    parentId: string | null; // 루트 폴더는 null
    children?: Folder[];
    order?: number; // 같은 레벨 내 정렬 순서
  };
```

---

```
현재 Admin 페이지와 User & Roles 페이지 구조를 다음과 같이 변경하고,
각 역할별 권한에 맞는 기능을 추가하고 싶다.

[페이지 구조 변경]

1) Admin 페이지
   - 이 페이지는 Admin role 사용자만 접근할 수 있어야 한다.
   - 일반 User role 사용자는 이 페이지 메뉴 자체가 보이지 않도록 한다.
   - Admin 페이지에서 Admin은:
     - 모든 유저 목록을 볼 수 있고
     - 각 유저의 비밀번호를 "초기화(Reset)" 할 수 있어야 한다.
   - Role/Status 드롭다운 기능은 기존과 동일하게 유지한다
     (Role: Admin/User, Status: Active/Deactive).

2) User & Roles → Settings 로 변경
   - 기존 "User & Roles" 메뉴 이름을 "Settings"로 변경한다.
   - Settings 페이지는 모든 로그인된 사용자(Admin, User)가 접근할 수 있다.
   - Settings 페이지에서는 **자기 자신**에 대해서만 다음을 할 수 있다:
     - 이름(name) 변경
     - 비밀번호(password) 변경
   - 다른 사용자의 정보는 Settings 페이지에서 보이거나 수정되지 않는다.

[세부 기능 요구사항]

1) Settings 페이지 (모든 사용자용)
   - 기본 정보 섹션:
     - 현재 사용자 이름, 이메일 표시
     - 이름 수정 input + "Save" 버튼
   - 비밀번호 변경 섹션:
     - Current password
     - New password
     - Confirm new password
     - "Change password" 버튼
   - 비밀번호 변경 시:
     - 유효성 검사(길이, 일치 여부 등)
     - 성공/실패 시 알림 메시지(토스트 또는 인라인 메시지) 표시

2) Admin 페이지 – Password 초기화 기능
   - 유저 목록 테이블에 "Reset Password" 액션 추가.
   - 각 유저 행마다 "Reset" 버튼 또는 아이콘 버튼을 둔다.
   - Reset 클릭 시:
     - 확인 모달(“정말 이 사용자의 비밀번호를 초기화하시겠습니까?”) 표시
     - 확인 후 서버에 비밀번호 초기화 요청 전송
     - 초기화 방식은 예를 들어:
       - 임시 비밀번호 자동 생성 후 Admin에게 표시하거나
       - 사용자의 이메일로 초기화 링크 발송 등, 더미 로직으로 구현해도 좋다.
   - 비밀번호 초기화는 Admin role만 실행 가능해야 한다.

3) 권한/보안
   - 라우팅/네비게이션 레벨에서:
     - Admin role이 아닌 사용자는 Admin 페이지로 접근 시 자동으로 리다이렉트하거나 403을 보여준다.
     - 좌측 메뉴/헤더 메뉴에서 Admin 페이지 항목은 Admin에게만 렌더링한다.
   - Settings 페이지는 모든 로그인 사용자에게 항상 보인다.
   - 서버/API 호출 예제에서는 role 체크를 포함해줘
     (예: Admin이 아닌 사용자가 reset API를 호출하면 에러 반환).

4) 구현
   - React + TypeScript + React Router + Tailwind CSS 기준 예제 코드로 작성해줘.
   - 최소한 다음 컴포넌트를 포함해줘:
     - `AdminPage` (유저 리스트 + Role/Status + Reset Password)
     - `SettingsPage` (내 정보 수정 + 비밀번호 변경)
     - `RequireAdmin` 같은 권한 체크용 라우트 가드 컴포넌트
   - User 타입 예시는 다음과 같이 사용해줘:
     ```ts
     type Role = "Admin" | "User";

     type User = {
       id: string;
       name: string;
       email: string;
       role: Role;
       status: "Active" | "Deactive";
     };
     ```

위 요구사항을 만족하도록 페이지 구조, 권한 설계, UI/UX, 그리고 React + TypeScript 예제 코드를 작성해줘.
```
