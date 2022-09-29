# Infrastructure

## Terraform

In this repo we're using Terraform to programmatically spin-up the infrastructure resources needed to host our static site. 

The resources we're using are: 

- AWS S3
- AWS CloundFront

For this project we're only going to be running Terraform manually. This means that the resources in this repo have already been created by the time you're reading this and this code works as a documentation of the current state of the resource. Any updates to the `.tf` files will have to be caught in PR and noted that a manual update to the resources (`terraform apply`) will need to occur after the branch has been merged


### Getting Started

- Install terraform: https://learn.hashicorp.com/tutorials/terraform/install-cli
- Install the AWS CLI: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html
- configure your AWS CLI: `aws configure`, this will ask you to enter your AWS Access Key and Secret
- (For VSCode only, optional but recommended) Install the official Terraform VSCode extension: https://marketplace.visualstudio.com/items?itemName=HashiCorp.terraform
  - to enable [Code Completion](https://marketplace.visualstudio.com/items?itemName=HashiCorp.terraform#code-completion) add the following to your VSCode settings:
    ```json
    "terraform-ls.experimentalFeatures": {
      "prefillRequiredFields": true
    }
    ```

### Terrform Commmands

`terraform init` - Prepares your working directoy by downloading the provider plugins specified in the terraform files

`terraform validate` - Check whether the configuration is valid, mostly just for syntax issues and base terraform config stuff, it won't find errors in providers if you're missing something required

`terraform plan` - this performs a dry run, this is good to do because it will catch errors you can't get in validate

`terraform apply` - Creates or applies changes to your resource

`terraform destroy` - Removes resource


### Terraform in CI/CD

Terraform can be included as part of your CI/CD Pipeline, but you'll have to store and update its state somewhere accessible to the process that runs the pipeline. One solution is to have state (the auto-generated `.tfstate` files) pushed to an S3 Bucket. You can read more about how to do this from this official tutorial:
https://learn.hashicorp.com/tutorials/terraform/github-actions?in=terraform/automation

Or you can check out one of our sample repos:
https://github.com/Rightpoint/cloud-platform-exploration-aws-app-runner


## Deploying Manually

Deployments happen automatically by our [Github Action](../.github/workflows/deploy-to-S3.yml) when a branch is merged into `master`.

However, if you need to deploy manually, this is what you need to do:

Prequisites:

- configure your AWS ClI with access keys/secrets that have access to S3 and Cloudfront in our Rightpoint AWS
- Get the distribution ID and replace `$distribution_ID` below with the actual id

From the root of the repo:
```bash
npm run build && \
aws s3 sync ./dist s3://rp-react-best-practices --delete && \
aws cloudfront create-invalidation --distribution-id $distribution_ID --paths "/*"
```