## Testing a Github Action locally

Prerequisites:

- install [`nektos/act`](https://github.com/nektos/act#installation)
  - NOTE: `act` requires Docker Desktop to be installed
- You'll need the AWS secret + key for AWS user `rp-react-best-practices-user`

### Step 1

Create a new dotenv file that ends in `.local` which will already be gitignored.

```bash
touch .env.gh-action-test.local
```

### Step 2

Add the following secrets to your new local environment file. You can get their values from AWS

- `AWS_CF_DIST_ID` - the cloudfront distribution used by the S3 bucket website
- `AWS_ACCESS_KEY_ID` - of user `rp-react-best-practices-user` (or a rightpoint aws user than can write to any S3 bucket)
- `AWS_SECRET_ACCESS_KEY` - of user `rp-react-best-practices-user` (or a rightpoint aws user than can write to Cloudfont)

### Step 3

```bash
act --bind --job deploy --secret-file ./.env.gh-action-test.local
```

NOTE: https://github.com/nektos/act#first-act-run

> When running act for the first time, it will ask you to choose image to be used as default. It will save that information to ~/.actrc

You'll be presented with 3 options:

  - Large size image: +20GB Docker image, includes almost all tools used on GitHub Actions (IMPORTANT: currently only ubuntu-18.04 platform is available)
  - Medium size image: ~500MB, includes only necessary tools to bootstrap actions and aims to be compatible with all actions
  - Micro size image: <200MB, contains only NodeJS required to bootstrap actions, doesn't work with all actions


Chose the "Medium" one because the "micro" one is missing a dependency