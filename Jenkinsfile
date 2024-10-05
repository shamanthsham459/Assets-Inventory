pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                // Clone your repository
                git 'https://github.com/shamanthsham459/Assets-Inventory.git'  // Replace with your repository URL
            }
        }

        stage('Build and Deploy with Docker Compose') {
            steps {
                script {
                    // Build and start the services using Docker Compose
                    sh 'docker-compose down'  // Stop and remove existing containers
                    sh 'docker-compose up -d --build'  // Build and start services in detached mode
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
            // Clean up unused Docker resources
            sh 'docker system prune -f'
        }
    }
}
