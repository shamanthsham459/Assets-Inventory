pipeline {
    agent any

    environment {
        // Define environment variables for the database
        MONGO_URI = "mongodb://mongo:27017/mydatabase"  // Update with your database name
    }

    stages {
        stage('Clone Repository') {
            steps {
                // Clone your repository
                git 'https://github.com/shamanthsham459/Assets-Inventory.git'  // Replace with your repository URL
            }
        }

        stage('Build Frontend') {
            steps {
                // Build the React frontend
                dir('frontend') {
                    script {
                        // Install dependencies and build the frontend
                        sh 'npm install'
                        sh 'npm run build'
                    }
                }
            }
        }

        stage('Build Backend') {
            steps {
                // Build the Node.js backend
                dir('backend') {
                    script {
                        // Install dependencies
                        sh 'npm install'
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    // Build Docker images for frontend and backend
                    sh 'docker build -t asset-react-app ./frontend'  // Replace with your frontend image name
                    sh 'docker build -t asset-nodejs-api ./backend'    // Replace with your backend image name
                }
            }
        }

        stage('Deploy to Docker') {
            steps {
                script {
                    // Stop and remove existing containers
                    sh 'docker-compose down'
                    // Start the containers
                    sh 'docker-compose up -d --build'
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
        }
        always {
            // Clean up Docker images if needed
            sh 'docker system prune -f'
        }
    }
}
