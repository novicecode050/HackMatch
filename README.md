HackMatch - DevOps Lab Project

HackMatch is an automated teammate-matching and hackathon compatibility engine built with Node.js, Express, Jest, Docker, Kubernetes, and Jenkins. This repository documents the complete CI/CD lifecycle, containerization, and orchestration process.

🚀 Project Architecture & Tech Stack

Backend: Node.js & Express REST API

Testing: Jest & Supertest

CI/CD Automation: Jenkins Pipeline

Containerization: Docker

Orchestration: Kubernetes (Minikube ClusterIP Service)

🛠️ Step-by-Step Implementation & Workflow

Application Setup: Developed core REST API endpoints (/health, /api/hackers, /api/teams/form) with automated unit tests using Jest.

CI/CD Pipeline Setup: Configured a Jenkinsfile to automatically check out code, run test suites, build Docker images, and tag artifacts.

Containerization: Authored a multi-stage Dockerfile to containerize the Node.js runtime environment.

Orchestration: Created Kubernetes Deployment and ClusterIP Service manifests (deployment.yaml and service.yaml) to run the application pods inside Minikube.

💻 Detailed Guide: How to Run and Access the Application

📋 Prerequisites

Ensure you have the following installed on your machine:

Docker (daemon running)

Minikube & kubectl

Node.js & npm (optional, for local non-containerized testing)

Option A: Running inside Kubernetes / Minikube (Full Pipeline Setup)

1. Start Minikube & Docker Daemon

Open your terminal and verify Minikube is up and running:

minikube status


If Minikube is stopped, start it with:

minikube start


2. Apply Kubernetes Manifests

Apply the Deployment and ClusterIP Service configurations to your cluster:

kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml


3. Load the Docker Image into Minikube

Because Minikube uses its own isolated container runtime environment, sync your locally built Docker image into Minikube:

minikube image load hackmatch-app:latest


4. Restart Deployment & Verify Pods

Trigger a rollout restart so the cluster picks up the loaded image, then verify that all pods reach the 1/1 Running state:

kubectl rollout restart deployment hackmatch-deployment
kubectl get pods


(You should see hackmatch-deployment-XXXXX in Running status).

5. Open the Port-Forwarding Tunnel

Since hackmatch-service is a ClusterIP service mapping service port 80 to targetPort 3000, run this port-forward command:

kubectl port-forward svc/hackmatch-service 3000:80


⚠️ Note: Keep this terminal tab open! Closing this terminal window stops the local port-forwarding tunnel.

6. Access Application Endpoints

Open a browser or use curl in a separate terminal tab:

Health Check Endpoint: http://localhost:3000/health

API Route Test:

curl http://localhost:3000/health


Option B: Quick Standalone Docker Execution

If you want to run the standalone Docker container directly without Kubernetes:

# Build the Docker image
docker build -t hackmatch-app:latest .

# Run the container locally on port 3000
docker run -d -p 3000:3000 hackmatch-app:latest


Access at: http://localhost:3000/health

Option C: Local Node.js Development Mode

If you want to test the code locally without any containers:

npm install
npm test          # Runs automated Jest & Supertest test suites
npm start         # Starts Express server on http://localhost:3000


🐛 Troubleshooting & Error Resolutions

During the deployment process, several key infrastructure hurdles were encountered and resolved:

1. Jenkins Docker & Node/npm CLI Errors

Issue: The Jenkins container lacked the necessary Docker CLI tools and Node/npm binaries to execute build commands inside pipeline stages.

Fix: Installed Docker CLI utilities and configured the container environment to mount the host Docker socket (/var/run/docker.sock), allowing Jenkins to build container images directly.

2. Kubernetes ErrImageNeverPull Pod Status

Issue: Pods remained in a Pending state with an ErrImageNeverPull error because Kubernetes looked for the hackmatch-app:latest image inside Minikube's isolated cluster node rather than the host machine's Docker daemon.

Fix: Explicitly loaded the local image into Minikube and restarted the deployment rollout:

minikube image load hackmatch-app:latest
kubectl rollout restart deployment hackmatch-deployment


3. Service Port Mapping Mismatch (3000:3000 vs 3000:80)

Issue: Attempting to run kubectl port-forward svc/hackmatch-service 3000:3000 failed with Service hackmatch-service does not have a service port 3000 because the Kubernetes Service (hackmatch-service) was configured with port: 80 targeting targetPort: 3000.

Fix: Inspected the service spec (kubectl get svc hackmatch-service -o yaml) and corrected the command to point to service port 80:

kubectl port-forward svc/hackmatch-service 3000:80


4. Cannot GET / in Browser

Issue: Navigating to http://localhost:3000 displayed Cannot GET /.

Fix: Confirmed that connection tunneling was successful and that Express returned Cannot GET / simply because no root (/) route had been defined. Accessing GET-enabled API routes like http://localhost:3000/health returned valid JSON application data.
