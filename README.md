# 🚀 HackMatch – DevOps Lab Project

**HackMatch** is an automated teammate-matching and hackathon compatibility engine built using Node.js, Express, Jest, Docker, Kubernetes, and Jenkins.

This repository documents the complete CI/CD lifecycle, application testing, containerization, and orchestration process.

---

## 🏗️ Project Architecture & Tech Stack

| Component | Technology |
|---|---|
| Backend | Node.js & Express |
| Testing | Jest & Supertest |
| CI/CD Automation | Jenkins Pipeline |
| Containerization | Docker |
| Orchestration | Kubernetes |
| Local Kubernetes Cluster | Minikube |
| Kubernetes Service | ClusterIP |

---

## 🛠️ Step-by-Step Implementation & Workflow

### 1. Application Setup
- Developed the core REST API endpoints:
  - `/health` – Application health check.
  - `/api/hackers` – Hacker-related API.
  - `/api/teams/form` – Team formation API.
- Implemented automated unit testing using Jest and Supertest.

### 2. CI/CD Pipeline Setup
- Configured a `Jenkinsfile` to automate the development and deployment workflow.
- Implemented pipeline stages to:
  - Check out source code from the repository.
  - Install dependencies.
  - Execute automated test suites.
  - Build Docker images.
  - Tag Docker image artifacts.

### 3. Containerization
- Created a multi-stage `Dockerfile` to containerize the Node.js application.
- Configured the application to run inside an isolated Docker container.

### 4. Kubernetes Orchestration
- Created Kubernetes configuration files:
  - `deployment.yaml` – Defines the application deployment and pods.
  - `service.yaml` – Exposes the application internally using a ClusterIP service.
- Deployed and managed application pods inside a local Minikube cluster.

---

## 💻 Detailed Guide: How to Run and Access the Application

## 📋 Prerequisites

Ensure that the following tools are installed on your machine:

- [Docker](https://www.docker.com/) (Docker daemon running)
- [Minikube](https://minikube.sigs.k8s.io/docs/start/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Node.js](https://nodejs.org/) (Optional, for local development)
- npm (Optional, for local development)

---

## ☸️ Option A: Running Inside Kubernetes / Minikube

This option demonstrates the complete container orchestration workflow.

### Step 1: Start Minikube and Docker Daemon

Open your terminal and verify whether Minikube is running:

```bash
minikube status
```

If Minikube is stopped, start it using:

```bash
minikube start
```

### Step 2: Apply Kubernetes Manifests

Apply the Deployment and ClusterIP Service configurations:

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

### Step 3: Load the Docker Image into Minikube

Minikube uses its own container runtime environment. Therefore, the locally built Docker image must be loaded into Minikube.

```bash
minikube image load hackmatch-app:latest
```

### Step 4: Restart Deployment and Verify Pods

Trigger a rollout restart so that the deployment picks up the loaded image:

```bash
kubectl rollout restart deployment hackmatch-deployment
```

Verify the status of the application pods:

```bash
kubectl get pods
```

**Expected Result:** The application pod should reach the `1/1 Running` state.

Example:

```text
NAME                                  READY   STATUS    RESTARTS
hackmatch-deployment-XXXXX            1/1     Running   0
```

### Step 5: Open the Port-Forwarding Tunnel

The Kubernetes ClusterIP Service is configured with:

- Service Port: `80`
- Target Port: `3000`

Execute the following command:

```bash
kubectl port-forward svc/hackmatch-service 3000:80
```

**Important:** Keep this terminal window open. Closing the terminal stops the port-forwarding tunnel.

### Step 6: Access Application Endpoints

Open a browser and navigate to:

**Health Check Endpoint:**

```text
http://localhost:3000/health
```

Alternatively, use curl from another terminal:

```bash
curl http://localhost:3000/health
```

The application should return a valid JSON health-check response.

---

## 🐳 Option B: Quick Standalone Docker Execution

The application can also be executed directly using Docker without Kubernetes.

### Step 1: Build the Docker Image

```bash
docker build -t hackmatch-app:latest .
```

### Step 2: Run the Docker Container

```bash
docker run -d -p 3000:3000 hackmatch-app:latest
```

### Step 3: Access the Application

Open the following URL:

```text
http://localhost:3000/health
```

The application will be accessible through port `3000`.

---

## 🟢 Option C: Local Node.js Development Mode

To run the application locally without Docker or Kubernetes, follow these steps.

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Run Automated Tests

```bash
npm test
```

This executes the automated Jest and Supertest test suites.

### Step 3: Start the Application

```bash
npm start
```

The Express server will start at:

```text
http://localhost:3000
```

Access the health-check endpoint:

```text
http://localhost:3000/health
```

---

## 🐛 Troubleshooting & Error Resolutions

During the deployment process, several infrastructure-related issues were encountered and resolved.

### 1. Jenkins Docker and Node/npm CLI Errors

**Issue:**

The Jenkins container did not have the necessary Docker CLI utilities and Node/npm binaries to execute the pipeline commands.

**Resolution:**

- Installed the required Docker CLI utilities.
- Configured the Jenkins container to mount the host Docker socket:

```text
/var/run/docker.sock
```

- This allowed Jenkins to communicate with the host Docker daemon and build container images directly.

### 2. Kubernetes ErrImageNeverPull Pod Status

**Issue:**

The application pods remained in a Pending state with an `ErrImageNeverPull` error.

This happened because Kubernetes attempted to locate the `hackmatch-app:latest` image inside the Minikube cluster rather than the host machine's Docker environment.

**Resolution:**

Explicitly loaded the Docker image into Minikube:

```bash
minikube image load hackmatch-app:latest
```

Restarted the deployment:

```bash
kubectl rollout restart deployment hackmatch-deployment
```

This allowed Kubernetes to access the required image.

### 3. Service Port Mapping Mismatch (3000:3000 vs 3000:80)

**Issue:**

Initially, the following command was executed:

```bash
kubectl port-forward svc/hackmatch-service 3000:3000
```

However, it returned the following error:

```text
Service hackmatch-service does not have a service port 3000
```

**Reason:**

The Kubernetes Service was configured with:

```yaml
port: 80
targetPort: 3000
```

Therefore, the service exposed port `80`, not port `3000`.

**Resolution:**

Inspected the service configuration:

```bash
kubectl get svc hackmatch-service -o yaml
```

Corrected the port-forwarding command:

```bash
kubectl port-forward svc/hackmatch-service 3000:80
```

This successfully forwarded local port `3000` to the Kubernetes Service port `80`.

### 4. Cannot GET / Error in Browser

**Issue:**

When navigating to:

```text
http://localhost:3000
```

The browser displayed:

```text
Cannot GET /
```

**Reason:**

The Express application did not have a route handler defined for the root endpoint `/`.

This did not indicate a Docker, Kubernetes, or port-forwarding failure.

**Resolution:**

Verified the application using an existing GET endpoint:

```text
http://localhost:3000/health
```

The health-check endpoint returned valid JSON application data, confirming that the application was running successfully.

---

## 📌 Important Kubernetes Commands

| Command | Purpose |
|---|---|
| `minikube start` | Starts the Minikube cluster |
| `minikube status` | Checks Minikube status |
| `kubectl apply -f k8s/deployment.yaml` | Creates or updates the deployment |
| `kubectl apply -f k8s/service.yaml` | Creates or updates the service |
| `minikube image load hackmatch-app:latest` | Loads the Docker image into Minikube |
| `kubectl get pods` | Lists application pods |
| `kubectl get services` | Lists Kubernetes services |
| `kubectl get deployments` | Lists deployments |
| `kubectl rollout restart deployment hackmatch-deployment` | Restarts the deployment |
| `kubectl port-forward svc/hackmatch-service 3000:80` | Forwards local traffic to the service |

---

## 🎯 Project Outcome

Successfully implemented **HackMatch**, demonstrating the integration of modern DevOps tools throughout the software development lifecycle.

The project covers:

- REST API development using Node.js and Express.
- Automated testing using Jest and Supertest.
- CI/CD pipeline automation using Jenkins.
- Application containerization using Docker.
- Container image management and deployment.
- Kubernetes deployment and service configuration.
- Application orchestration using Minikube.
- Troubleshooting and resolving real-world deployment issues.

**HackMatch demonstrates an end-to-end DevOps workflow, from application development and automated testing to containerization, continuous integration, and Kubernetes-based deployment.**

---
