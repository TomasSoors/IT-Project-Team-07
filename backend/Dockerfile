
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV SECRET_KEY=6640eac2136b46b05bd536bf4a9e4ba9d7d324dccc2a2e5d73692ba6eb20aab9
ENV DATABASE_URL=mysql+mysqlconnector://user:userpass@mysql:3306/userdatabase

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]