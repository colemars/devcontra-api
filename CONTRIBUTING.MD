# Contributing to DevContra

## Sending a Pull Request

When in doubt, keep your Pull Requests small. To give a Pull Request the best chance of getting accepted, don't bundle more than one feature or bug fix per Pull Request. It's often best to create two smaller Pull Requests than one big one.

1. Fork the repository.

2. Clone the fork to your local machine and add upstream remote

```sh
git clone REPO
git remote add upstream git@github.com:REPO.git
```

3. Synchronize your local `master` branch with the upstream one:

```sh
git checkout master
git pull upstream master
```

4. Create a new topic branch:

```sh
git checkout -b my-topic-branch
```

5. Make changes, commit and push to your fork:

```sh
git push -u
```

6. Go to [the repository](https://github.com/colemars/devcontra-component/) and make a Pull Request.

I am monitoring for Pull Requests. I will review your Pull Request and either merge it, request changes to it, or close it with an explanation.

### Coding style

Please follow the coding style of the project. DevContra uses prettier and eslint, so if possible, enable linting in your editor to get real-time feedback.

- `npm run prettier` reformats the code.
- `npm run lint-fix` runs manually the linting rules.

#### 4. You are done 🎉!

## Roadmap

To get a sense of where DevContra is heading, or for ideas on where you could contribute, take a look at the [roadmap](/ROADMAP.md).

## License

By contributing your code to the colemars/devcontra-* GitHub repositories, you agree to license your contribution under the MIT license.