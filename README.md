# myHub
**by Niall Thurrat**

## A web app university project
Assignment: [A02](https://github.com/niall-thurrat/myhub/wiki/A02)  
Course: 1DV612 Web Application Architectures and Frameworks, [Linnaeus University](https://lnu.se/en/)
<br/><br/> 

## _Welcome to myHub web app!_
In this repository you will find source code for the implementation of myHub web app. You can find the wiki with the project’s _Technical Pre-study_ and _Short System Design Spec_ [here](https://github.com/niall-thurrat/myhub/wiki).

## What is myHub?
myHub is a web app that enables users to connect to data from their GitLab accounts and get real-time dashboard updates as well as event notifications. Notifications can be configured per GitLab project to be shown on the myHub dashboard as well as Slack. At present the app displays _Commit_ and _Release_ data on the dashboard and can notify users about _Push_ and _Release_ events in their GitLab repos.

myHub is built using the MERN stack, so MongoDB is used to persist data, the Express.js framework powers the backend API, React.js is used for the frontend and Nodejs is the runtime environment. The planned application and its environment are shown below.

![myHub_overall_system_diagram](https://github.com/niall-thurrat/myhub/wiki/images/myHub_overall_system_diagram.png)
_overview of myHub web app and its environment_

## Where is myHub?
- myHub is not deployed at present. Watch this space!
- The myHub project’s documentation is found in the [wiki](https://github.com/niall-thurrat/myhub/wiki).  
- To understand the project you should check out the [Short System Design Spec](https://github.com/niall-thurrat/myhub/wiki/Short-System-Design-Specification) which was created as part of the preceding assignment [A01](https://github.com/niall-thurrat/myhub/wiki/A01) to plan and document myHub and its various components. Bare in mind that this is a plan and deviations between the plan and the implementation are listed in the [reflection document](https://github.com/niall-thurrat/myhub/wiki/Post-Implementation-Reflection).

#### Notes
- The original myHub project exists in a private GitLab repository and all code and docs have been imported to GitHub. Also, GitHub will also not show commit history of some files that have been moved.