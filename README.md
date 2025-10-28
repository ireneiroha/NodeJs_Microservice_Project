# Node.js Microservices Task Management App

A microservices-based **Task Management Application** built with **Node.js**, **Express**, **Mongoose**, **MongoDB**, **RabbitMQ**, and **Docker Compose**, now including a **Notification Service** for event-driven updates.

---

## 🧱 Architecture Overview

This project demonstrates a distributed system design using three independent services:

* **User Service** → Manages user registration and retrieval (MongoDB)
* **Task Service** → Handles task creation and assignment, publishes messages to RabbitMQ
* **Notification Service** → Listens for task events and simulates sending notifications (via logs or console)
* **RabbitMQ** → Message broker enabling asynchronous communication
* **MongoDB** → Database for users and tasks

Each service runs in its own Docker container and communicates through RabbitMQ.

---

## 🗂️ Project Structure

```
nodejs-microservices-task-app/
├── user-service/
│   ├── Dockerfile
│   ├── index.js
│   ├── models/User.js
│   └── package.json
├── task-service/
│   ├── Dockerfile
│   ├── index.js
│   ├── models/Task.js
│   └── package.json
├── notification-service/
│   ├── Dockerfile
│   ├── index.js
│   └── package.json
├── docker-compose.yml
├── postman_collection.json
└── README.md
```

---

## ⚙️ Technologies Used

* **Node.js** — runtime for building scalable microservices
* **Express.js** — lightweight web framework
* **Mongoose** — MongoDB object modeling
* **MongoDB** — document-oriented database
* **RabbitMQ** — message broker for service communication
* **Docker & Docker Compose** — container orchestration
* **Postman** — API testing and automation

---

## 🚀 Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/ireneiroha/nodejs_microservices_project.git
cd nodejs_microservices_project
```

### 2️⃣ Build and run containers

```bash
docker compose up --build
```

### 3️⃣ Access Services

* **User Service** → [http://localhost:3001](http://localhost:3001)
* **Task Service** → [http://localhost:3002](http://localhost:3002)
* **Notification Service** → Logs notifications in container console
* **RabbitMQ Management UI** → [http://localhost:15672](http://localhost:15672)

Default RabbitMQ credentials: `guest / guest`

---

## 🔧 Example API Usage (via Postman)

### Create a User

```bash
POST http://localhost:3001/users
Content-Type: application/json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Create a Task

```bash
POST http://localhost:3002/tasks
Content-Type: application/json
{
  "title": "Complete Documentation",
  "assignedTo": "<user_id>"
}
```

When a task is created, the `task-service` publishes a message to RabbitMQ. The `notification-service` receives the event and logs:

```
📢 Notification sent to user <user_id> about new task: Complete Documentation
```

---

## 🐳 Docker Compose Overview

`docker-compose.yml` defines all services:

```yaml
services:
  mongo:
    image: mongo:5
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: example
    ports:
      - "27017:27017"

  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"

  user-service:
    build: ./user-service
    depends_on:
      - mongo
      - rabbitmq
    ports:
      - "3001:3001"

  task-service:
    build: ./task-service
    depends_on:
      - mongo
      - rabbitmq
    ports:
      - "3002:3002"

  notification-service:
    build: ./notification-service
    depends_on:
      - rabbitmq
    ports:
      - "3003:3003"
```

---

## 🧪 Testing with Postman

A `postman_collection.json` file is included for quick API testing.

1. Open Postman → Import → select `postman_collection.json`
2. Test the following endpoints:

   * `POST /users` → create a user
   * `GET /users` → list all users
   * `POST /tasks` → create a task and trigger notification

You’ll see task and notification logs directly in Docker container outputs.

---

## 🧩 Future Improvements

* Add JWT-based authentication to user-service
* Add email/SMS notifications (e.g., using Twilio or SendGrid)
* Implement an API gateway (Traefik or Nginx)
* Add unit tests and CI/CD pipelines

---

## 📄 License

MIT License © 2025


MIT License © 2025
