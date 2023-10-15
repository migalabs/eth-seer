# Information

Ethseer provides information about the Beacon Chain of Ethereum. It displays the blocks being produced in real-time with a user-friendly interface and allows users to search for information in an engaging manner to understand the Blockchain.

## 1. Installation

### Pre-Requisites

- Before you begin, ensure you have Node.js installed on your machine. You can download and install it from https://nodejs.org/.

### Installation

1. Clone the repository: 

```jsx
$ git clone https://github.com/migalabs/eth-seer.git
```

Or if you have SSH key:

```jsx
$ git clone git@github.com:migalabs/eth-seer.git
```

1. Create .env file within the `packages/client` and `packages/server` directories. There are examples in both directories of these files. (`packages/client/.env.example` and `packages/server/.env.example`).

### Commands

- To install dependencies:

```jsx
$ npm ci
```

- To run the client:

```jsx
$ cd packages/client
$ npm run app
```

- To run the server:

```jsx
$ cd packages/server
$ npm run build
$ npm run start
```

- Connect to database

## 2. Contributions

We welcome contributions from the community. If you’d like to contribute to Ethseer, there are several ways you can help:

- **Report Issues:** If you encounter any bugs or have suggestions for improvements, please [open an issue] (https://github.com/migalabs/eth-seer/issues) on GitHub.
- **Feature Requests:** If you have ideas for new features, feel free to [open an issue] (https://github.com/migalabs/eth-seer/issues) to discuss and propose your ideas.
- **Pull Requests:** If you'd like to contribute directly by implementing new features or fixing bugs, please fork the repository, create a new branch, and [submit a pull request] (https://github.com/migalabs/eth-seer/pulls).

Before submitting a pull request, make sure to:

- Follow the coding style and conventions used in the project.
- Write tests for any new functionality or changes.
- Update the documentation if needed.

We appreciate your contributions and thank you for helping improve Ethseer.

## 3. Supporter Networks

Ethseer is compatible with the following blockchain networks:

- **Mainnet:** The primary Ethereum network used for transactions and contracts in the production environment.
- **Goerli:** A test network for Ethereum, used for development and testing without using real ETH.

When using Ethseer, make sure to configure the appropriate network based on your needs, whether it's for operations on the main network (Mainnet) or for testing in a development environment (Goerli).

## 4. License

Ethseer is licensed under the MIT License.