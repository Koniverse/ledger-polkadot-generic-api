# Ledger Polkadot Generic API

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

---

![zondax_light](docs/assets/zondax_light.png#gh-light-mode-only)
![zondax_dark](docs/assets/zondax_dark.png#gh-dark-mode-only)

_Please visit our website at [zondax.ch](https://zondax.ch)_

---

## Overview
This API service generates essential, shortened metadata from transaction blobs to facilitate signing transactions on a Ledger device. 
Designed as an external software component, it simplifies interactions with the Ledger Polkadot Generic app by abstracting mandatory steps of the signing process to a service. 
The service is delivered through a standardized REST API, ensuring easy integration and a streamlined user experience.

## Prerequisites
- **Node.js**: Version 20.0.0 or higher. You can download it from [Node.js official website](https://nodejs.org/).
- **Yarn**: Version 4.0.0 or higher. Install Yarn globally using npm with `npm install --global corepack` and `corepack enable`.
- **Rust**: Necessary for compiling Rust dependencies. Install Rust through [rustup](https://rustup.rs/).

## Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/zondax/ledger-polkadot-generic-api.git
cd ledger-polkadot-generic-api
yarn install
```

## Building the Project
To build the project, run:
```bash
yarn build
```
This command will compile Rust modules and TypeScript files.

### Detailed Build Commands
- **Build Rust Modules**: `yarn build:rust`
- **Build Node.js Modules (TypeScript)**: `yarn build:node`

## Continuous Integration (CI)
### Build Workflow
Our CI process kicks off on every push, automatically building the code within a Rust container environment. The build includes steps for dependency installation, formatting, linting, and testing. We use GitHub Actions with customized runners to ensure the process is both efficient and secure.

### Publish Workflow
The publish process is triggered on pushes to main, master, or dev branches, on pull requests, and on release creation. It utilizes Earthly for building and optionally pushing Docker images, depending on the type of event triggering the workflow. Branch-specific builds use Earthly to handle complex multi-stage builds in a repeatable manner.

### Dependabot Integration
Dependabot is configured to check daily for updates to npm packages, ensuring that our project dependencies remain secure and up-to-date.

## Cleaning the Build
To clean your project (remove compiled modules and distribution files), run:
```bash
yarn clean
```

## Formatting Code
To format the project code, use:
```bash
yarn format
```

## Linting
To lint your code, run:
```bash
yarn lint
```
To automatically fix linting errors, run:
```bash
yarn lint:fix
```

## Running the Project
After building the project, you can start it with:
```bash
yarn start
```

## Testing
Run tests using:
```bash
yarn test
```

## Using Docker
To build and run the project using Docker:
```bash
yarn docker
```
Detailed Docker commands:
- **Build Docker Image**: `yarn docker:build`
- **Run Docker Container**: `yarn docker:run`

## Deploying 
Sure, here is a revised version of your instructions:

### Obtain the Image
you can build the image or pull it from the [Zondax Docker Hub](https://hub.docker.com/repository/docker/zondax/ledger-polkadot-generic-api/general).

### Create the File with Supported Chains
Refer to the `chains.yaml` file in this repository as an example. The file should include:
- **name**: The name of the chain.
- **id**: A fixed value used by API clients to select a specific chain from the available options.
- **url**: The node URL of the chain.

### Run the Docker Image
You need to take several steps into consideration:
- Mount the `chains.yaml` file at the `/app` directory. The file path should be `/app/chains.yaml`. 
- Expose port 3001 to enable the service to function.

As an example, this would be the command to run a new container:
```bash
  docker run -p 3001:3001 -v /path/to/your/chains.yaml:/app/chains.yaml zondax/ledger-polkadot-generic-api
```

## Consuming the API
You can please review the OpenAPI spec where each available endpoint is described. You can check jest tests as well. 

## Contributing
Guidelines for how to contribute to the project. You can detail how to fork the repository, create a new branch, make changes, and pull requests.

## License
Apache 2.0
