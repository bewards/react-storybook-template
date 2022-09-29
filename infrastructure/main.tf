# Terraform module to provision an S3 Bucket and CloudFront for public hosting of the build of our
# React best practices repo
#
# This configuration file is written in Terraform language which was created by Hashicorp. It's
# based on a lower-level open-source language spec called "HCL", also created by Hashicorp.
# https://www.terraform.io/language/syntax/configuration
#
# The following sources were helpful in creating this file:
#
# This is from hashicorp and uses the latest version of the AWS provider syntax:
# https://github.com/hashicorp/learn-terraform-cloudflare-static-website/tree/acm-cloudfront
# it still contains some CloudFlare code in there but that can be ignored
#
# This one is uses an older AWS provider syntax but had some helpful bits:
# https://github.com/jakeasarus/terraform/blob/master/s3_website_cloudfront/main.tf
#
# AWS provider documentation:
# https://registry.terraform.io/providers/hashicorp/aws/4.9.0/docs

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      # https://www.terraform.io/language/expressions/version-constraints
      # at the time of creating this 4.9.0 was the latest version so I'm pinning this to the 
      # latest patch version of that
      version = "~> 4.9.0"
    }
  }
}

provider "aws" {
  region  = "us-east-1"
}

# Provides an S3 bucket resource with the local name "site". The name is used to refer to this
# resource from elsewhere in the same Terraform module, but has no significance outside that
# module's scope.
# https://registry.terraform.io/providers/hashicorp/aws/4.9.0/docs/resources/s3_bucket
resource "aws_s3_bucket" "site" {
  bucket = "rp-react-best-practices"
}

# https://registry.terraform.io/providers/hashicorp/aws/4.9.0/docs/resources/s3_bucket_website_configuration
resource "aws_s3_bucket_website_configuration" "site" {
  bucket = aws_s3_bucket.site.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

# ACL = "Access Control List" - manages access to the bucket
# NOTE: terraform destroy does not delete the S3 Bucket ACL but does remove the resource from Terraform state.
# https://registry.terraform.io/providers/hashicorp/aws/4.9.0/docs/resources/s3_bucket_acl
resource "aws_s3_bucket_acl" "site" {
  bucket = aws_s3_bucket.site.id

  acl = "public-read"
}

# https://registry.terraform.io/providers/hashicorp/aws/4.9.0/docs/resources/s3_bucket_policy
resource "aws_s3_bucket_policy" "site" {
  bucket = aws_s3_bucket.site.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource = [
          aws_s3_bucket.site.arn,
          "${aws_s3_bucket.site.arn}/*",
        ]
      },
    ]
  })
}

# Cloudfront is required for static site hosting with S3 if bucket name is already taken.
# https://registry.terraform.io/providers/hashicorp/aws/4.9.0/docs/resources/cloudfront_distribution
resource "aws_cloudfront_distribution" "dist" {

  origin {
    domain_name = aws_s3_bucket.site.bucket_domain_name
    origin_id   = aws_s3_bucket.site.id

    custom_origin_config {
      http_port              = "80"
      https_port             = "443"
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }
  }

  # this is needed for SPA's to redirect all paths back the index.html
  # https://stackoverflow.com/a/35673266
  custom_error_response {
    error_caching_min_ttl = 0
    error_code = "404"
    response_page_path = "/index.html"
    response_code = "200"
  }

  # Whether the distribution is enabled to accept end user requests for content.
  enabled = true

  # The object that you want CloudFront to return (for example, index.html) when an end user requests the root URL.
  default_root_object = "index.html"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  default_cache_behavior {
    # Controls which HTTP methods CloudFront processes and forwards to your Amazon S3 bucket or your custom origin.
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    # Controls whether CloudFront caches the response to requests using the specified HTTP methods.
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = aws_s3_bucket.site.id

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    # specify the protocol that users can use to access the files in the origin 
    # options are: allow-all, https-only, or redirect-to-https.
    viewer_protocol_policy = "allow-all"

    default_ttl            = 3600
    max_ttl                = 86400
  }

  # configure SSL
  viewer_certificate {
    # "True" if you want viewers to use HTTPS to request your objects and you're using the
    # CloudFront domain name for your distribution
    cloudfront_default_certificate = true
  }
}