# KeepDistance

The world is rapidly falling into a pandemic crisis. Experts say we should all practice social distancing, however, some parts of the population struggle with the execution of these practices. We tried to find solutions that encourage social distancing in a fun and easy way and at the same time enable anonymized contact tracing.

## General Information

### Introduction

KeepDistance scans its surroundings for low energy Bluetooth signals within proximity of two meters. If it detects a device it registers it as a contact to the backend-server. The server identifies if the contact is made by a mobile device and stores this contact together with a timestamp.

This information then generates a score, which gets lower the more contacts a user has. You can compare yourself with a global ranking, see how many contacts you had today and see your rank (e.g. "Distance Master"). This way we try to encourage social distancing in a fun way.

The information collected basically registers contacts with other users. This information can potentially be used for contact tracing. Although we do not know who the person is, we can notify them via in-app notifications if the came into contact with an infected person. For that, the infect person has to report his infection via the app.

We strongly believe in the social responsibility of each individual and therefore collect no information that makes it possible to link the contacts to a real person. So means, if you get a notification that you have been infected, you can decide what to do with it. However, we strongly recommend that you seek medical advice and put yourself in self-quarantine.

### Devpost
The devpost project of this repository is [here](https://devpost.com/software/keepdistance).

## Develop & Run locally

### Client

1. Make sure that you have Android Studio for development setup and yoru device connected (development mode on, usb debug on).
2. Navigate to: `client/CoreApp`
3. Run: `run npx react-native run-android`

### Server

1. Setup your local AWS credentials
2. Navigate to: `server/code-vs-covid-19-be`
3. Run: `npm start`

## Deploy

### Client

Build and deploy the APK to your phone or emulator using Android Studio.

### Server

1. Setup your remote (e.g. serverless.com) AWS credentials
2. Navigate to: `server/code-vs-covid-19-be`
3. Run: `npm run deploy`


## Test

### Client

1. Navigate to: `client/CoreApp`
2. Run: `npm run test`

### Server

1. Navigate to: `server/code-vs-covid-19-be`
2. Run: `npm run test`
