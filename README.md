# Event Reward MSA 프로젝트

## 프로젝트 개요

이 프로젝트는 마이크로서비스 아키텍처(MSA)를 기반으로 한 이벤트 보상 시스템입니다. 주요 서비스로는 Gateway, Auth, Event 서비스가 있으며, 각각의 역할은 다음과 같습니다:

- **Gateway**: API 게이트웨이 역할을 수행하며, 클라이언트의 요청을 적절한 마이크로서비스로 라우팅합니다.
- **Auth**: 사용자 인증 및 권한 관리를 담당합니다.
- **Event**: 이벤트 관련 비즈니스 로직을 처리합니다.

## 기술 스택

- **프레임워크**: NestJS
- **데이터베이스**:
  - MySQL 8.0
  - MongoDB 6.0
  - Redis 7.2
- **통신**: gRPC
- **컨테이너화**: Docker

## 프로젝트 구조

```
event-reward-msa/
├── auth/                    # 인증 grpc 서비스
│   ├── src/                # 소스 코드
│   ├── migrations/         # 데이터베이스 마이그레이션
│   └── Dockerfile         # Docker 설정
├── event/                  # 이벤트 grpc 서비스
│   ├── src/               # 소스 코드
│   └── Dockerfile        # Docker 설정
├── gateway/               # API 게이트웨이
│   ├── src/              # 소스 코드
│   └── Dockerfile       # Docker 설정
└── docker-compose.yml    # Docker Compose 설정

각 서비스는 다음과 같은 공통적인 구조를 가지고 있습니다:

1. **모듈별 분리**: 각 도메인별로 모듈을 분리하여 관리
2. **DTO 계층**: 입력/출력 데이터 구조를 명확히 분리
3. **엔티티**: 데이터베이스 모델 정의
4. **서비스**: 비즈니스 로직 처리
5. **레포지토리**: 데이터베이스 접근 로직
6. **공통 모듈**: 데코레이터, 필터, 가드 등 재사용 가능한 컴포넌트

이러한 구조는 다음과 같은 이점을 제공합니다:

- **관심사 분리**: 각 모듈이 독립적으로 동작하며 유지보수가 용이
- **코드 재사용**: 공통 모듈을 통한 코드 중복 방지
- **확장성**: 새로운 기능 추가가 용이한 구조
- **테스트 용이성**: 각 계층이 명확히 분리되어 있어 단위 테스트 작성이 쉬움

```

## 서비스 구성

### Gateway 서비스

- **포트**: 3001
- **주요 기능**:
  - 클라이언트 요청 라우팅
  - gRPC 통신을 통한 마이크로서비스 연동
- **의존성**:
  - Auth 서비스
  - Event 서비스

### Auth 서비스

- **포트**: 3002
- **주요 기능**:
  - 사용자 인증
  - JWT 토큰 관리
- **데이터베이스**:
  - MySQL (사용자 정보)
  - MongoDB (이벤트/보상 관리)
  - Redis (비동기 큐)

### Event 서비스

- **포트**: 3003
- **주요 기능**:
  - 이벤트 처리
  - 보상 지급
- **데이터베이스**:
  - MongoDB (이벤트 데이터)
  - Redis (보상요청/재시도)

## 실행 방법

### 1. Docker 컨테이너 실행

```bash
# 모든 서비스 빌드 및 실행
docker-compose up --build

# 백그라운드에서 실행
docker-compose up -d
```

### 2. 데이터베이스 마이그레이션

```bash
# Auth 서비스 마이그레이션
cd auth
npm run migration:run
```

## API 문서

# Gateway API 문서

## 인증 API

### 로그인

- **URL**: `localhost:3001/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "accessToken": "string"
  }
  ```

### 토큰 갱신

- **URL**: `localhost:3001/auth/refresh`
- **Method**: `POST`
- **Cookie**: `refreshToken`
- **Response**:
  ```json
  {
    "accessToken": "string"
  }
  ```

## 사용자 API

### 사용자 생성

- **URL**: `localhost:3001/user`
- **Method**: `POST`
- **권한**: ADMIN
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string",
    "name": "string",
    "role": "USER"
  }
  ```

### 사용자 수정

- **URL**: `localhost:3001/user`
- **Method**: `PUT`
- **권한**: ADMIN
- **Body**:
  ```json
  {
    "id": "string",
    "name": "string",
    "role": "USER"
  }
  ```

### 사용자 삭제

- **URL**: `localhost:3001/user`
- **Method**: `DELETE`
- **권한**: ADMIN
- **Body**:
  ```json
  {
    "id": "string"
  }
  ```

## 이벤트 API

### 이벤트 생성

- **URL**: `localhost:3001/event`
- **Method**: `POST`
- **권한**: OPERATOR, ADMIN
- **Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "condition": "string",
    "startDate": "string",
    "endDate": "string"
  }
  ```

### 이벤트 조회

- **URL**: `localhost:3001/event/:eventId`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "condition": "string",
    "startDate": "string",
    "endDate": "string",
    "status": "ACTIVE"
  }
  ```

### 이벤트 목록 조회

- **URL**: `localhost:3001/event`
- **Method**: `GET`
- **Response**:
  ```json
  [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "condition": "string",
      "startDate": "string",
      "endDate": "string",
      "status": "ACTIVE"
    }
  ]
  ```

## 보상 API

### 보상 생성

- **URL**: `localhost:3001/reward`
- **Method**: `POST`
- **권한**: OPERATOR, ADMIN
- **Body**:
  ```json
  {
    "eventId": "string",
    "type": "POINT",
    "quantity": 1000,
    "description": "string"
  }
  ```

### 보상 조회

- **URL**: `localhost:3001/reward/:eventId`
- **Method**: `GET`
- **Response**:
  ```json
  [
    {
      "id": "string",
      "eventId": "string",
      "type": "POINT",
      "quantity": 1000,
      "description": "string"
    }
  ]
  ```

### 보상 요청

- **URL**: `localhost:3001/reward/request`
- **Method**: `POST`
- **권한**: USER, ADMIN
- **Body**:
  ```json
  {
    "eventId": "string",
    "rewardId": "string"
  }
  ```

### 보상 내역 조회

- **URL**: `localhost:3001/reward/history`
- **Method**: `GET`
- **권한**: AUDITOR, ADMIN
- **Query Parameters**:
  - `eventId` (optional): 이벤트 ID
  - `userId` (optional): 사용자 ID
  - `page` (optional): 페이지 번호 (기본값: 1)
  - `limit` (optional): 한 페이지에 표시할 내역 수 (기본값: 10)
- **예제 요청**:
  ```bash
  curl --location 'localhost:3001/reward/history?page=2&limit=5'
  ```
- **Response**:
  ```json
  [
    {
      "eventId": "string",
      "rewardId": "string",
      "status": "COMPLETED",
      "requestedAt": "string"
    }
  ]
  ```

```

```
