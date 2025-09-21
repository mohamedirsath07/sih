# Student Guidance Platform

## Overview
The Student Guidance Platform is a mobile and web-based application designed to assist students in Jammu & Kashmir (and later across India) in making informed academic and career choices. The platform addresses the critical gap in awareness regarding the importance of graduation and the various career opportunities available through different degree programs.

## Features
- **Aptitude & Interest Test**: A short quiz to assess students' interests and strengths, providing personalized course suggestions.
- **Stream & Career Mapping**: Visual charts that map degree options to potential jobs, higher studies, and average salaries.
- **Nearby Government Colleges**: A location-based directory of government colleges, including details on courses offered and facilities available.
- **Scholarships & Notifications**: Information on available scholarships and important admission timelines, with offline alerts.
- **User Profile & Personalization**: Custom user profiles that enable AI-driven recommendations for courses, colleges, and career paths.
- **Community & Chatbot (Optional Add-ons)**: Peer-to-peer guidance and a chatbot for answering career-related questions.

## Tech Stack
- **Frontend**: React PWA with offline support using service workers and IndexedDB.
- **Backend**: Flask for REST APIs.
- **Database**: MongoDB for main data storage, with SQLite/IndexedDB for offline sync.
- **Authentication**: JWT for secure login.
- **Data Sync**: Custom APIs for syncing data when online.

## Implementation Strategy
1. **Stakeholder Collaboration**: Engage with government education departments, school teachers, NGOs, and counselors for content and outreach.
2. **Technology Development**: Partner with EdTech developers to create a scalable, lightweight application with offline capabilities.
3. **Pilot Launch**: Initiate a pilot in one or two districts with low college enrollment to gather feedback.
4. **Full-Scale Rollout**: Expand the platform state-wide or nationally through government schools and skill centers.
5. **Monitoring & Feedback**: Utilize real-time analytics to track usage and improve app suggestions.

## Expected Impact
- Increased enrollment in government degree colleges.
- Reduced dropout rates after Class 10 and 12.
- Empowered students with reliable, localized career guidance.
- Enhanced perception of government colleges as viable educational institutions.

## Getting Started
To set up the project locally, follow these steps:
1. Clone the repository.
2. Navigate to the `frontend` directory and run `npm install` to install dependencies.
3. Navigate to the `backend` directory and install the required Python packages listed in `requirements.txt`.
4. Start the backend server and the frontend application.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License. See the LICENSE file for details.