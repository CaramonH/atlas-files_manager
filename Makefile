# Variables
DOCKER_IMAGE_NAME = atlas-files_manager
DOCKER_CONTAINER_NAME = atlas-files_manager_container
HOST_DIRECTORY=./
CONTAINER_DIRECTORY=/atlas-files_manager
.PHONY: build run exec stop clean


# Builds a docker image for a development box
build:
	docker build -t $(DOCKER_IMAGE_NAME) .

# Runs the dev-box image in a container
# This will run the image in the background and map port 2022 to the ssh port on the dev box
# Feel free to add more ports as needed, (ex: docker run -d -p 2022:22 -p 9000:80 dev-box)
run:
	docker run -d --name $(DOCKER_CONTAINER_NAME) -p 2022:22 -p 8080:8080 -p 9000:9000 -p 9001:9001 -p 3000:3000 -p 4000:4000 -p 6379:6379 -p 5000:5000 -v ${HOST_DIRECTORY}:${CONTAINER_DIRECTORY} ${DOCKER_IMAGE_NAME}

# Execute a command inside the Docker container
exec:
	docker exec -it $(DOCKER_CONTAINER_NAME) bash

# Stop and remove the Docker container
stop:
	docker stop $(DOCKER_CONTAINER_NAME)
	docker rm $(DOCKER_CONTAINER_NAME)

# Clean up Docker images and containers
clean:
	docker stop $(DOCKER_CONTAINER_NAME) || true
	docker rm $(DOCKER_CONTAINER_NAME) || true
	docker rmi $(DOCKER_IMAGE_NAME) || true

start:
	docker start mongo-redis

# SSH into the running dev-box
ssh:
	ssh -p 2022 root@localhost

# Remove all docker images, containers, and volumes
nuke:
	docker system prune -af

# Reset known hosts on local machine for port 2022
# This may need to be run if you make a new dev-box and aren't able to ssh into it
reset-known-hosts:
	ssh-keygen -R [localhost]:2022
