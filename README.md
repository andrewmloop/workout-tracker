# Workout Tracker Web App

## Introduction
This is a web app designed to help users track their workouts. It's built with TypeScript, React for the front end, Node.js with Express.js for the backend, and MongoDB Atlas for database storage. Authentication is implemented using JSON Web Tokens (JWT).

## Features
- User authentication and authorization with JWT
- Ability to log workouts and track progress
- View workout history
- Responsive design for seamless use on desktop and mobile devices

## Try It Out
A version of this app is hosted at: https://iron-temple-app.herokuapp.com. Please be patient if there is a delay when first connecting to the site. The app is hosted on an Eco Dyno which is put to sleep when no usage is detected for a period of time.
> [!NOTE]
> This app works best when viewed on a mobile device, preferrably downloaded as a PWA. See the following links for instructions on how to do this.
> - iOS - https://web.dev/learn/pwa/installation#ios_and_ipados_installation
> - Android - https://web.dev/learn/pwa/installation#android_installation

## Running Locally
1. Build the image
   
`docker build -t workout-tracker .`

2. Create a `.env` file with:

```xml
MONGO_URI="MongoDB Atlas Cluster Connection String"
JWT_SECRET="JWT Token"
```

3. Start the application

```
docker run \
  -p port:port \
  --env-file ./.env \
  workout-tracker
```


## Technologies Used
- TypeScript
- React
- Node.js
- Express.js
- MongoDB Atlas
- JSON Web Tokens (JWT)
