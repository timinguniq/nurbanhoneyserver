# 1. Base Image 선택 (가볍고 안전한 Alpine 리눅스 버전 사용)
FROM node:20-alpine

# 2. 작업 디렉토리 설정 (이미지 내부의 작업 경로)
WORKDIR /usr/src/app

# 3. 패키지 파일 복사 (캐싱 효율을 위해 소스코드보다 먼저 복사)
# package.json과 package-lock.json 둘 다 복사합니다.
COPY package*.json ./

# 4. 의존성 설치
# (프로덕션 환경이라면 'npm ci'를 사용하는 것이 더 안정적입니다)
RUN npm install --production

# 5. 소스 코드 복사
COPY . .

# 6. 포트 노출 (사용하는 포트에 맞춰 변경하세요. 예: 3000, 8080)
EXPOSE 8080

# 7. 실행 명령어
CMD ["node", "main.js"] 
# (또는 "npm", "start" 등 프로젝트 실행 방식에 맞춰 수정)
