output "website_bucket_name" {
  description = "Name (id) of the bucket"
  value       = aws_s3_bucket.site.id
}

# output "bucket_domain_name" {
#   description = "Bucket endpoint"
#   value       = aws_s3_bucket.site.bucket_domain_name
# }

output "public_http_url" {
  description = "The publicly accessible site"
  value = "http://${aws_s3_bucket.site.website_endpoint}"
}

output "cloudfront_https_url" {
  description = "Cloudfront endpoint, this endpoint has SSL"
  value = "https://${aws_cloudfront_distribution.dist.domain_name}"
}

output "cloudfront_distribution_id" {
  description = "Cloudfront dist id"
  value = aws_cloudfront_distribution.dist.id
}