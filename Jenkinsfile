stage('Clone Repository') {
    steps {
        checkout([
            $class: 'GitSCM',
            branches: [[name: '*/main']],
            userRemoteConfigs: [[url: 'https://github.com/omriganini/DevOps.git']]
        ])
        script {
            sh '''
            echo "Current directory:"
            pwd
            echo "Workspace contents after cloning:"
            ls -la
            '''
        }
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
                withCredentials([
                    usernamePassword(credentialsId: 'docker-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')
                ]) {
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
