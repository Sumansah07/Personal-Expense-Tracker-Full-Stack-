
# Expense Tracker

## Description

This is Expense Tracker Web App to manage all your Daily Expenses.

You can add and delete Expenses easily with different categories.

## Run Locally (Traditional Method)

Clone the project

```bash
  git clone https://github.com/Bug-Slicers/expensetracker.git
```

Go to the project directory

```bash
  cd expensetracker
```

Install dependencies in project directory

```bash
  npm install
```
Go to the client folder

```bash
  cd client
```
Install dependencies in client

```bash
  npm install
```

Start the client react project

```bash
  npm run start
```

Come back to project directory

```bash
  cd ..
```
Start Server using node or nodemon

```bash
  node app.js
  or nodemon app.js
```

## Run with Docker (Recommended)

This application can be run using Docker, which makes it easy to set up and run without installing dependencies locally.

### Prerequisites
- Docker and Docker Compose installed on your machine

### Steps to run with Docker

1. Clone the project
```bash
git clone https://github.com/Bug-Slicers/expensetracker.git
cd expensetracker
```

2. Create a config.env file from the example
```bash
cp config.env.example config.env
```

3. Generate a secure SECRET_KEY (optional but recommended)
```bash
node generate-secret.js
```

4. Edit the config.env file to set your SECRET_KEY and other environment variables

5. Build and start the containers
```bash
docker-compose up -d
```

6. Access the application at http://localhost:5000

### Stopping the application
```bash
docker-compose down
```

### To remove all data (including the database volume)
```bash
docker-compose down -v
```

### Troubleshooting Docker Setup

If you encounter any issues:

1. Check the logs:
```bash
docker-compose logs
```

2. For specific service logs:
```bash
docker-compose logs app
docker-compose logs mongo
```

3. If the MongoDB connection fails, ensure the database service is healthy:
```bash
docker-compose ps
```

4. Rebuild the containers if needed:
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Environment Variables

To run this project, you will need to add the following environment variables to your config.env file

`SECRET_KEY` : For verifying jwt tokens.

`DATABASE` : contains the dbURI of MongoDB connections

`PORT` : Port on which the server will run (default: 5000)

`NODE_ENV` : Set to 'production' for production environment