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

Currently, there is no consistent way to keep track of office hours, peer tutoring, etc. Students often take 4-6 classes, each with their own set of differing schedules. Some professors use Google Calendar, some use Google Sheets, some just display it on the Home page of Canvas, while others just put it in their syllabus. Many students input these office hours into their own calendar, an arduous process of creating 10-20 different events and the worst part is that OH are updated/canceled as the semester progresses. That means students have to continually look out for announcements, emails, etc. and physically update their own calendars to match.

O(H), or Office(H)ours, is an office hours calendar and visualizer to better organize and coordinate schedules designed with the user in mind. Rather than just being a website that displays set classes OHs, O(H) offers a more individualized way to keep track of OHs. In addition, it offers seamless communication with professors and TA/ULAs as they can update times and events on the app which will automatically update on the student's view.

## Table of Contents

Table of Contents Here

## Tech Stack

- React + Chakra UI
- Flask
- PostgreSQL + AWS

## Folder Structure

- `backend`
  - `app.py`: flask app
  - `database.py`: database queries
  - `requirements.txt`: python packages
  - `run.py`: program to run app
- `frontend`
  - `public`
  - `src`
    - `classes`
    - `components`
    - `pages`
      - `About`
      - `Auth`
      - `Calendar`
      - `Class`
      - `Create`
      - `FAQ`
      - `Home`
    - `redux`
    - `styles`
    - `App.jsx`
    - `index.js`
  - `.env`

## How to Run

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

We host our PostgreSQL on AWS, which is already linked to our app. In case you want to reproduce it from scratch -- here are the steps:

- steps here

**Note: it is recommended to use a virtual environment for python**

```bash
# activate
$ python3 -m venv .venv
$ source .venv/bin/activate

# deactivate
$ deactivate
```

## Contributions

### Nikhil Ismail ('24.5, ni58)

Set up frontend skeleton, set up react router for navigation, built UI for auth page

### Vinh Tran ('25, vt237)

Set up backend skeleton + designed frontend UI and worked on student view, FAQ, and About pages

### Haroon Mohamedali ('26, hhm22)

Set up PostgreSQL DB + python connection to DB and worked on professor view
