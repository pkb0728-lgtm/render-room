# Render Room

Render Room은 제품 사진을 업로드하면 AI가 광고용 제품 이미지처럼 다시 렌더링해주는 Next.js 기반 웹 애플리케이션입니다. 사용자는 제품 이미지와 선택적인 무드 참고 이미지를 올리고, GPT 이미지 또는 Gemini 이미지 모델을 선택해 상업용 제품 컷을 생성할 수 있습니다.

## 데모

- 배포 주소: https://render-room.vercel.app
- GitHub 저장소: https://github.com/pkb0728-lgtm/render-room

## 주요 기능

- 제품 이미지 업로드 및 PNG, JPEG, WEBP 형식 검증
- 조명과 색감 참고를 위한 무드 이미지 업로드
- GPT 이미지 / Gemini 이미지 생성 모델 선택
- 무드, 조명, 배경, 렌즈, 비율, 품질 옵션 제공
- Before / After 결과 미리보기
- 생성 프롬프트 미리보기
- 생성 이미지 다운로드

## 기술 스택

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- OpenAI Images API
- Google Gemini Image API

## 프로젝트 목적

이 프로젝트는 단순한 정적 페이지가 아니라 실제로 사용할 수 있는 AI 이미지 생성 워크플로우를 구현하는 데 초점을 맞췄습니다. 이미지 업로드, 옵션 기반 프롬프트 구성, AI 제공자 선택, 서버 API 라우트 처리, 결과 이미지 표시와 다운로드까지 하나의 작은 제품 경험으로 구성했습니다.

포트폴리오 관점에서는 다음 역량을 보여주기 위해 제작했습니다.

- Next.js App Router 기반 풀스택 구조 이해
- 서버 API 라우트에서 외부 AI API 연동
- OpenAI와 Gemini의 서로 다른 이미지 생성 API 처리
- 사용자 입력값을 바탕으로 프롬프트를 동적으로 구성
- 환경변수를 통한 API 키 보안 관리
- 실제 배포 가능한 웹 애플리케이션 구성

## 로컬 실행 방법

의존성을 설치합니다.

```bash
npm install
```

환경변수 파일을 생성합니다.

```bash
cp .env.example .env.local
```

Windows PowerShell에서는 아래 명령을 사용할 수 있습니다.

```powershell
Copy-Item .env.example .env.local
```

`.env.local` 파일에 API 키를 입력합니다.

```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_IMAGE_MODEL=gpt-image-2

GEMINI_API_KEY=your_gemini_api_key
GEMINI_IMAGE_MODEL=gemini-3.1-flash-image-preview
```

개발 서버를 실행합니다.

```bash
npm run dev
```

브라우저에서 아래 주소로 접속합니다.

```text
http://localhost:3000
```

## 사용 가능한 명령어

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## 환경변수

| 이름 | 필수 여부 | 설명 |
| --- | --- | --- |
| `OPENAI_API_KEY` | GPT 이미지 사용 시 필수 | OpenAI 이미지 생성 API 키 |
| `OPENAI_IMAGE_MODEL` | 선택 | 기본값은 `gpt-image-2` |
| `GEMINI_API_KEY` | Gemini 이미지 사용 시 필수 | Gemini 이미지 생성 API 키 |
| `GEMINI_IMAGE_MODEL` | 선택 | 기본값은 `gemini-3.1-flash-image-preview` |

## 배포

이 프로젝트는 Next.js API Route를 사용하므로 GitHub Pages가 아니라 Vercel처럼 서버 사이드 라우트를 지원하는 플랫폼에 배포하는 것이 적합합니다.

Vercel에 배포할 때는 프로젝트의 환경변수 설정 화면에 `.env.local`과 같은 값을 등록해야 이미지 생성 기능이 정상 동작합니다.

현재 배포 주소:

```text
https://render-room.vercel.app
```

## 보안 안내

`.env.local` 파일에는 실제 API 키가 들어가므로 GitHub에 올리면 안 됩니다. 이 프로젝트는 `.gitignore`를 통해 `.env.local`이 커밋되지 않도록 설정되어 있으며, 공개용 예시 파일인 `.env.example`만 저장소에 포함합니다.
