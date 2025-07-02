# GitHub Actions Deployment

This repository uses GitHub Actions to automatically deploy changes to the production server.

## Workflow

The deployment workflow is triggered when changes are pushed to the `main` branch. It performs the following steps:

1. Connects to the server via SSH
2. Navigates to the `snampcomponet` directory
3. Pulls the latest changes from git
4. Runs `snap build` to build the Docker images
5. Runs `snap restart` to restart the services

## Required Secrets

To use this workflow, you need to set up the following secrets in your GitHub repository:

1. Go to your GitHub repository
2. Click on "Settings" > "Secrets and variables" > "Actions"
3. Add the following secrets:

| Secret Name | Description |
|-------------|-------------|
| `SSH_USERNAME` | The username to use when connecting to the server |
| `SSH_PRIVATE_KEY` | The private SSH key to use for authentication (the entire key content including BEGIN and END lines) |
| `SSH_PORT` | (Optional) The SSH port to use (defaults to 22 if not specified) |

## Generating an SSH Key for Deployment

If you need to generate a new SSH key for deployment:

1. Generate a new SSH key pair:
   ```
   ssh-keygen -t ed25519 -C "github-actions-deploy"
   ```
   (Don't use a passphrase as GitHub Actions can't use it)

2. Add the public key to the server's `~/.ssh/authorized_keys` file

3. Add the private key to GitHub Secrets as `SSH_PRIVATE_KEY`
