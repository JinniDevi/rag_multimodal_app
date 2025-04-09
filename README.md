rag-multimodal-app/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── endpoints/
│   │   │   │   ├── upload.py       # 텍스트/이미지 업로드 API
│   │   │   │   ├── query.py        # 질문/응답 API
│   │   ├── core/
│   │   │   ├── config.py           # 환경변수 관리
│   │   │   ├── vectorstore.py      # Elasticsearch 연결 및 벡터 저장
│   │   │   ├── llm_chain.py        # LangChain LLM+Retriever 구성
│   │   ├── main.py                 # FastAPI 진입점
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatBox.jsx
│   │   │   ├── Message.jsx
│   │   ├── App.jsx
│   │   ├── api.js                  # API 호출 함수
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md


1. create react directory
npx create-react-app frontend

2. To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.

Success! Created frontend at C:\DevProject\PyCharm\rag-multimodal-app\frontend
Inside that directory, you can run several commands:

  npm start
    Starts the development server.

  npm run build
    Bundles the app into static files for production.

  npm test
    Starts the test runner.
  npm run eject
    Removes this tool and copies build dependencies, configuration files
    and scripts into the app directory. If you do this, you can’t go back!
We suggest that you begin by typing:
  cd frontend
  npm start
