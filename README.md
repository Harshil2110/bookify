Steps to run the project:

Go to firebase console and create a project. After creating project you will get firebase key and other credentials, copy these and paste it in firebase.js file. 

Go to Expo or eas login and login/signup. Go to Projects tab and Create a Project. Copy project id and paste it in app.json file. Open VS code terminal or command prompt and install expo cli globally. 

Install Expo Go app in your android device.

Open the project folder in VS Code and run npx expo start to run the app in your mobile using Expo Go application. (Make sure that your laptop and mobile are connected with same wifi)

Got to mongodb atlas and make a mongodb database. Paste the URL of the database in server.js file in back-end folder to connect to mongodb database.

Other important details: 

While developing with Expo Go you should have a live server and not local server. Only live servers can work with Expo Go app. My server is running on AWS as it gives one year free with some of its virtual machine. I created account with AWS then I used EC2 and got a Ubuntu virtual machine where I install node js and other necessary tools and packages and uploaded my back-end files and started the server. And I used this AWS server to connect with my mobile android app. 

Make Build of your application: 

Open your project folder in VS Code. Now open terminal and login to your eas account using eas login. 

After successful login just use this command - eas build --platform android --profile production to make a build of your application as an apk format so that you can distribute this apk or install it in your mobile to see the app running.
