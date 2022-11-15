![Anahita social networking platform and framework](https://s3.ca-central-1.amazonaws.com/production.anahita.io/media/logos/homepage_logo.png)

### Women Life Freedom

We stand in solidarity with Iranian women!

#MahsaAmini #WomenLifeFreedom #IranRevolution

# Anahita React

This project is a front-end Client developed using [React Material-UI](https://mui.com/) for [Anahita](https://github.com/anahitasocial/anahita). We are currently using this app for our live website, but please remember that this repository is under active development.

You can join the [Anahita tribe](https://www.anahita.io/pages/join) and then follow the [Anahita Project](https://www.anahita.io/groups/42242-anahita-project) group for more information.

# Installation

Make sure you have already installed:

1. [Anahita](https://github.com/anahitasocial/anahita) on your development machine.
1. [NodeJS](https://nodejs.org/) installed!

To install, first clone this repository on your development machine and then run the following commands:

`$ yarn install`

`$ cp .env.sample .env`

Edit the `.env` file as follows:

| ENV key | value |
| ------- | ----- |
| PUBLIC_URL | URL string to the Reac App on your machine. It usually is http://localhost:3000 |
| REACT_APP_NAME | A string value for the name of your App, for example: Anahita |
| REACT_APP_DESCRIPTION | A string value for the description of your App, for example: Social Networking Platform & Framework |
| REACT_APP_API_BASE_URL | URL to your local Anahita installation, for example: https://anahita.localhost |
| REACT_APP_GOOGLE_ANALYTICS | On a live installation, your Google Analytics code goes here, for example UA-000000-0  |
| REACT_APP_GOOGLE_MAPS_API_KEY | Google Maps API Key |
| REACT_APP_NOTIFICATIONS_CHECK_INTERVAL | Integer value representing time in milliseconds to check for the number of new notifications. A reasonable number would be 15000 |
| REACT_APP_ASSETS | An (optional) string value for the name of your custom assets directory that goes under the `src/assets/` directory. If you leave this field empty, the default assets directory is used. |
| DISABLE_ESLINT_PLUGIN | `true` on Staging and Prod servers, `false` for development environment |
| REACT_APP_SIGNUP_CLOSED | `true` to hide Signup form, `false` to show the signup form |

Now run the following command to start the App.

`$ yarn start`

The app starts running under the `PUBLIC_URL` value, usually `http://localhost:3000`. You may need to set the CORS values in Anahita configurations.php file so you can make API calls to your Anahita REST API.

# Installation on Amazon Amplify

You can connect Amazon Amplify to your repository, and it will automatically pull the code and build it. You don't need to use a .env file and instead create Environment Variables using the Amazon Amilify interface. You may need to copy the content of `amplify.yml` to Amazon Amplify's configuration for the build to be successful. You can set up Anahita on AWS EC2 instances, Load Balancers, and Route53 to build an API endpoint, for example, `https://api.yourdomain.io`, and use this URL for the `REACT_APP_API_BASE_URL` variable in Amazon Amplify. You can configure Amazon Amplify and AWS Route53 to point `http://www.yourdomain.coom` to your Amplify apps, and you will get a Client-Server setup working.

## Credits

Anahita is developed and maintained by [rmdStudio Inc.](http://www.rmdstudio.com), a software development company in Vancouver, Canada. We develop apps for the scientific, healthcare, and industrial sectors.

---

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Below you will find some information on how to perform common tasks.<br>
You can find the most recent version of this guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).
