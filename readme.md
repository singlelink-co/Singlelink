# Singlelink

<h4>
    <a href="https://singlelink.co">Singlelink</a> is the open-source Linktree alternative & micro-site platform.
</h4>

<p>
    <a href="https://github.com/Neutron-Creative/Singlelink/projects/1">
        <img src="https://img.shields.io/badge/Public%20Beta-2.2.8-%2303d2d4" alt="Version">
    </a>
    <a href="https://www.gnu.org/licenses/gpl-3.0.en.html">
        <img src="https://img.shields.io/badge/License-GPL-%236ab04c" alt="License"/>
    </a>
    <a href="https://app.singlelink.co/analytics"/>
        <img src="https://img.shields.io/badge/dynamic/json?color=FF4081&label=Hosted%20Users&query=users&url=https%3A%2F%2Fapi.singlelink.co%2Fanalytics" alt="Users"/>
    </a>
	<a href="https://twitter.com/singlelink">
		<img alt="Twitter Follow" height=20 src="https://img.shields.io/twitter/follow/singlelink?color=%2300acee&label=Follow%20us%20on%20Twitter&style=plastic">
	</a
	<a href="https://discord.gg/BUbmgV4">
		<img src="https://img.shields.io/discord/739822478276165675?color=%237289da&label=Join%20our%20community%20on%20Discord"/>
	</a>
</p>

<img src="client/static/gh-promo.png"/>

## About Singlelink
Singlelink is the open-source Linktree alternative & micro-site platform. Built with self-hosting, whitelabeling, and third-party developers in mind - Singlelink is the micro-site platform for sites that can't fit within the constraints Linktree provides.

## Getting started
To get a local instance of Singlelink running, follow these steps.

### Prerequisites
Here's what you need to be able to run Singlelink

- Node.Js
- PostgreSQL

Optionally, you'll can also include credentials for our third-party data providers to hook up the following.

- Event tracking (Mixpanel)
- User email notifications (Amazon SES)
- Image uploads (Simple Image Upload)

### Server setup
1. Clone the Singlelink repository
```
git clone https://github.com/Neutron-Creative/Singlelink.git
```
2. Install packages with NPM
```
cd Singlelink/client;npm i;cd ../server;npm i;cd ../
```
3. Setup your config file
```
npm run config-setup
```
4. Start your application!
For development environments, start the dev instance to enable hot-reloading.
```
npm run dev
```
For production environments, start the production instance to disable hot-reloading and improve performance.
```
npm run build;npm run start;
```
## Roadmap
## Contributing
## Plugin & extension development
## License
Distributed under the GPL License. See our license.md file for more information.
## Acknowledgements