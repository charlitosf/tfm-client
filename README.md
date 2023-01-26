# tfm-client

Javascript client of the Password Manager project, an implementation of [The Integrally Secure Storage Protocol](http://rua.ua.es/dspace/handle/10045/124732). The back-end server is located at [charlitosf/tfm-server](https://github.com/charlitosf/tfm-server).

## Prerequisites

- git
- Node v16^

## Project setup

In order for the client to work, the server associated with this project must be properly set up according to the [instructions](https://github.com/charlitosf/tfm-server/blob/master/README.md).

Then:

```bash
# Clone the repository
git clone https://github.com/charlitosf/tfm-client
cd tfm-client

# Create the .env file (and modify it accordingly)
cp .env.copy .env
```

Finally, simply install the dependencies with npm.

```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```