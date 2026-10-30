# HackMatch - DevOps Lab Project

`HackMatch` is an automated teammate-matching and hackathon compatibility engine built with **Node.js, Express, Jest, Docker, Kubernetes, and Jenkins**. This repository documents the complete CI/CD lifecycle, containerization, and orchestration process.

---

## 🚀 Project Architecture & Tech Stack
* **Backend:** Node.js & Express REST API
* **Testing:** Jest & Supertest
* **CI/CD Automation:** Jenkins Pipeline
* **Containerization:** Docker
* **Orchestration:** Kubernetes (Minikube ClusterIP Service)

---

## 🛠️ Step-by-Step Implementation & Workflow

1. **Application Setup:** Developed core REST API endpoints (`/health`, `/api/hackers`, `/api/teams/form`) with automated unit tests using Jest.
2. **CI/CD Pipeline Setup:** Configured a `Jenkinsfile` to automatically check out code, run test suites, build Docker images, and tag artifacts.
3. **Containerization:** Authored a multi-stage `Dockerfile` to containerize the Node.js runtime environment.
4. **Orchestration:** Created Kubernetes Deployment and ClusterIP Service manifests (`deployment.yaml` and `service.yaml`) to run the application pods inside Minikube.

---

## 💻 Detailed Guide: How to Run and Access the Application

### 📋 Prerequisites
Ensure you have the following installed on your machine:
* **Docker** (daemon running)
* **Minikube** & **kubectl**
* **Node.js & npm** (optional, for local non-containerized testing)

---

### Option : Running inside Kubernetes / Minikube (Full Pipeline Setup)

1. Start Minikube & Docker Daemon
Open your terminal and verify Minikube is up and running:
```bash
minikube status

if Minikube is stopped, start it with:

Bash
minikube start

2. Apply Kubernetes Manifests

Apply the Deployment and ClusterIP Service configurations to your cluster:
Bash

kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

3. Load the Docker Image into Minikube

Because Minikube uses its own isolated container runtime environment, you must sync your locally built Docker image into Minikube:
Bash

minikube image load hackmatch-app:latest

4. Restart Deployment & Verify Pods

Trigger a rollout restart so the cluster picks up the loaded image, then verify that all pods reach the 1/1 Running state:
Bash

kubectl rollout restart deployment hackmatch-deployment
kubectl get pods

(You should see hackmatch-deployment-XXXXX in Running status).
5. Open the Port-Forwarding Tunnel

Since hackmatch-service is a ClusterIP service mapping service port 80 to targetPort 3000, run this port-forward command:
Bash

kubectl port-forward svc/hackmatch-service 3000:80

    ⚠️ Note: Keep this terminal tab open! Closing this terminal window stops the local port-forwarding tunnel.

6. Access Application Endpoints

Open a browser or use curl in a separate terminal:

    Health Check Endpoint: http://localhost:3000/health

    API Route Test:
    Bash

    curl http://localhost:3000/health
