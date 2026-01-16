echo "Starting frontend..."
(cd frontend && npm run dev) &

(cd backend/apis && uvicorn main:app --reload) &
