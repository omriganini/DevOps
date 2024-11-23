pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                git 'git@github.com:omriganini/DevOps.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    sh 'docker-compose build'
                }
            }
        }

        stage('Push Docker Images to Docker Hub') {
            steps {
                script {
                    sh '''
                    docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}
                    docker-compose push
                    '''
                }
            }
        }

        stage('Deploy to Target Machine') {
            steps {
                script {
                    sh '''
                    scp docker-compose.yml ${TARGET_MACHINE}:${APP_DIRECTORY}/docker-compose.yml
                    ssh ${TARGET_MACHINE} << EOF
                    cd ${APP_DIRECTORY}
                    docker-compose down || true
                    docker-compose pull
                    docker-compose up -d
                    EOF
                    '''
                }
            }
        }
    }
}
