<p align="center">
  <a href="https://prod-devcontra.now.sh" rel="noopener" target="_blank"><img width="400" src="https://i.imgur.com/yq3L9as.png" alt="DevContra logo"></a></p>
</p>

<h1 align="center">DevContra</h1>

<div align="center">

[React](https://reactjs.org/) component that implements [d3](https://github.com/d3/d3) for data visualization and is configured via the [DevContra Client](https://prod-devcontra.now.sh).

[![npm package](https://img.shields.io/npm/v/devcontra/latest.svg)](https://www.npmjs.com/package/devcontra)
[![npm downloads](https://img.shields.io/npm/dm/devcontra.svg)](https://www.npmjs.com/package/devcontra)
![Code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)
[![Follow on Twitter](https://img.shields.io/twitter/follow/itsacolemars.svg?label=follow)](https://twitter.com/itsacolemars)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=colemars/devcontra-component)](https://dependabot.com)
[![peerDependencies Status](https://david-dm.org/colemars/devcontra-component/peer-status.svg)](https://david-dm.org/colemars/devcontra-component?type=peer)
[![dependencies Status](https://david-dm.org/colemars/devcontra-component/status.svg)](https://david-dm.org/colemars/devcontra-component)
[![devDependencies Status](https://david-dm.org/colemars/devcontra-component/dev-status.svg)](https://david-dm.org/colemars/devcontra-component?type=dev)
[![Average time to resolve an issue](https://isitmaintained.com/badge/resolution/colemars/devcontra-component.svg)](https://isitmaintained.com/project/colemars/devcontra-component "Average time to resolve an issue")
</div>

## Installation

DevContra is available as an [npm package](https://www.npmjs.com/package/devcontra).

**[Stable channel v0](https://prod-devcontra.now.sh)**
```sh
// with npm
npm i devcontra

// with yarn
yarn add devcontra
```

Please note that `@next` will only point to pre-releases; to get the latest stable release use `@latest` instead.

## Usage

Here is a quick example to get you started, **it's all you need**:

```jsx
import React from 'react';
import DevContra from 'devcontra';

function App() {
  return (
    //uses the test key
    <DevContra profileKey="e380df4d-c9b0-4ac0-be51-6cf8a49d0760" />
  );
}

ReactDOM.render(<App />, document.querySelector('#app'));
```

See it here in this live demo:

[![Edit Button](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/4j7m47vlm4)

## Questions

For *how-to* questions and other non-issues,
please free to use Github issues or contact me directly.

## Examples

[DevContra Demo](https://prod-devcontra.now.sh/demo)

## Contributing

Read the [contributing guide](/CONTRIBUTING.MD) to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes to DevContra.

## Changelog

Recently Updated?
Please read the [changelog](https://github.com/colemars/devcontra-component/releases).

## Roadmap

The future plans and high priority features and enhancements can be found [here](/ROADMAP.md).

## Utilizes


[<img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Logo.png" width="100">](https://github.com/)

GitHub's beta API allows for easy data fatching for repo activity history.

[<img src="https://seeklogo.com/images/T/twitter-logo-C591CF37A1-seeklogo.com.png" width="120">](https://circleci.com/)

Twitters's API allows for easy data fatching for tweet history.

[<img src="https://i.stack.imgur.com/BDie5.png" width="200">](https://www.netlify.com/)

StackOverflow's API allows for easy data fatching for post history.

[<img src="https://d1.awsstatic.com/logos/aws-logo-lockups/poweredbyaws/PB_AWS_logo_RGB.61d334f1a1a427ea597afa54be359ca5a5aaad5f.png" width="200">](https://crowdin.com/)

dynamoDb, Cognito, Cloudformation, API Gateway, IAM, and CloudWatch make continuous devopment and management of this tool as simple as possible.

[<img src="https://www.browserstack.com/images/mail/browserstack-logo-footer.png" width="150">](https://www.browserstack.com/)

BrowserStack allows us to test in real browsers.

[<img src="https://avatars1.githubusercontent.com/u/52219245?s=200&v=4" width="50">](https://seed.run)

Seed.run allows for simple and quick API CI/CD pipeline management.

[<img src="https://user-images.githubusercontent.com/2752551/30404910-d56d9b66-989d-11e7-9208-b720eb28b4f2.png" width="150">](https://serverless.com/)

Serverless Framework allows for building and operating a serverless application. 

[<img src="https://lh4.googleusercontent.com/XnrMs4cNpMtZLAuUxypJnF1hDllFb3Hz53_WlHIqx8yo0yPzTnjfGmb18dS_9fHzJF5RjgEct7Wv7Xd99PJCCA6n5GOEvdZNxGTF0JulDZPYaGaoT-c25Zxcon9pCZqLeHSZgvuZ" width="150">](https://zeit.co/)

ZEIT Now offers a great solution for site hosting. 

[<img src="https://seeklogo.com/images/N/next-js-logo-7929BCD36F-seeklogo.com.png" width="150">](https://nextjs.org/)

NEXT.js is a React Framework that offers a great server side rendering solution.


## License

This project is licensed under the terms of the
[MIT license](/LICENSE).