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

### 인증 API

- **로그인**: `POST /auth/login`
- **토큰 갱신**: `POST /auth/refresh`
- **사용자 등록**: `POST /user`
- **사용자 수정**: `PUT /user`
- **사용자 삭제**: `DELETE /user`

### 이벤트 API

- **이벤트 등록**: `POST /event`
- **이벤트 목록**: `GET /event`
- **이벤트 조회**: `GET /event/:eventId`

- **보상 등록**: `POST /reward`
- **보상 조회**: `GET /reward/:eventId`

- **보상 요청**: `POST /reward/request`
- **보상 내역 조회**: `GET /reward/history`

```

```
