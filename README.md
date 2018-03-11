<h1>Ionic Mobile App!!</h1>
_________________

<h2>Install Dependencies</h2>
<code>$ npm install</code>
This should get you started. If you need to do more steps to setup, please update this readme.

<h2>Get Started In The Browser</h2>
We use a build script (gulpfile.js to learn more) for development and production builds.
Production means it will use recognizeapp.com.

You should be able to use this username/password in development mode.

<h3>To Test in the Browser</h3>
<code>$ ionic serve</code>

This will generate <strong>index.html</strong> and <strong>dist/</strong> directory. That will have the generated html for development mode. Go to the browser at
<a href="localhost:8100">localhost:8100</a>.

<strong>The first time</strong> it will error saying there isn't an index.html. That's just a simple bug in our chain. So just hit refresh and it will work.

<h4>What is Browser Mode</h4>
Browser mode is using local json that is stored as a scaffold in the app. That will allow you to easily login to the app in the browser. It is a bit buggy but you can get into the stream page in the browser.

<h3>To Test in iOS</h3>
<code>$ ionic build ios && gulp development</code>

This will build it for development. If you want to try production, switch the word development with production.

<h3>Compiling SASS and Watching It</h3>
You may not see CSS changes occur on page refresh. I've had to reset ionic serve to get it to show updates. I am not sure why yet.