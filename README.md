<h1 align="center">
  <img src="frontend/public/text_logo.png" width="400" />
  <br/>
  office hours management app
</h1>

<div align="center">
  <p>
    <strong>Final Project Assignment, CPSC419</strong>
  </p>
</div>

<h3 align="center">by Nikhil, Vinh, Haroon</h3>

## Project Description

Description Here

## Table of Contents

Table of Contents Here

## Tech Stack

- React + Chakra UI
- Flask
- PostgreSQL

## Folder Structure

File Tree Here

## Deployment

### Local

#### Frontend

To run the React app on your local machine:

```bash
# navigate to frontend
$ cd frontend
# install dependencies
$ npm install
# run react app
$ npm start
```

#### Backend

**Server**

To run the Flask server directly on your local machine (port is env variable set to 80):

```bash
# navigate to backend
$ cd backend
# install dependencies
$ pip install -r requirements.txt
# run flask app
$ python run.py
```
**Database**

We host our PostgreSQL on AWS, which is already linked to our app. In case you want to reproduce it from scratch: here are the steps:

First, following the instructions located [here](https://aws.amazon.com/getting-started/hands-on/create-connect-postgresql-db/) deploy a postgres db instance. After deploying, connect to your db using pg admin4.
Then use our create_script located [here](../db/create_script).

**Note: it is recommended to use a virtual environment for python**

```bash
# activate
$ python3 -m venv .venv
$ source .venv/bin/activate

# deactivate
$ deactivate
```

## Testing

Testing Results Here

## Contributions

### Nikhil Ismail ('24.5, ni58)

Set up frontend skeleton, set up react router for navigation, built UI for auth page

### Vinh Tran ('25, vt237)

Set up backend skeleton + designed frontend UI and worked on student view, FAQ, and About pages

### Haroon Mohamedali ('26, hhm22)

Set up PostgreSQL DB + python connection to DB and worked on professor view
