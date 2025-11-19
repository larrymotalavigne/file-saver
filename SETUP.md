# Setup Guide for npm Trusted Publishing

This guide explains how to set up npm trusted publishing with OIDC for the @larrym/file-saver package.

## What is npm Trusted Publishing?

npm trusted publishing uses OpenID Connect (OIDC) to securely publish packages from CI/CD workflows without managing long-lived tokens. This is the recommended way to publish npm packages as of 2025.

## Benefits

- 🔒 **No token management** - No need to create, store, or rotate npm tokens
- 🛡️ **Enhanced security** - Cryptographic verification of publisher identity
- 📜 **Automatic provenance** - Packages include provenance attestations by default
- ✅ **Supply chain security** - Verifiable link between source code and published package

## Prerequisites

1. **npm account** - You need an npm account at https://www.npmjs.com
2. **GitHub repository** - This repository must be on GitHub
3. **npm CLI v11.5.1 or later** - The GitHub Action uses the latest npm version

## Step-by-Step Setup

### 1. Create GitHub Environment

1. Go to your GitHub repository settings
2. Navigate to "Environments"
3. Click "New environment"
4. Name it `npm-publish` (must match the environment in `.github/workflows/publish.yml`)
5. Click "Configure environment"
6. (Optional) Add protection rules if desired

### 2. Configure npm Trusted Publisher

1. **Login to npm**: Go to https://www.npmjs.com and login

2. **Create package placeholder** (if package doesn't exist yet):
   - For scoped packages like `@larrym/file-saver`, you may need to create a placeholder
   - You can do this by manually publishing an initial version, or
   - Contact npm support to create the package namespace

3. **Add trusted publisher**:
   - Go to your package page on npmjs.com
   - Click on the "Settings" tab
   - Scroll down to "Publishing access"
   - Click "Add a Trusted Publisher"
   - Select "GitHub Actions"
   - Fill in the form:
     ```
     Organization/User: larrymotalavigne
     Repository: file-saver
     Workflow filename: publish.yml
     Environment name: npm-publish
     ```
   - Click "Add"

### 3. Verify Workflow Configuration

The `.github/workflows/publish.yml` file should have:

```yaml
permissions:
  contents: read
  id-token: write  # Required for OIDC

jobs:
  publish:
    runs-on: ubuntu-latest
    environment: npm-publish  # Must match npm configuration
```

### 4. Test the Setup

#### Option A: Create a Release (Recommended)

```bash
# Tag a version
git tag v1.0.0
git push origin v1.0.0

# Create a release on GitHub
# Go to: https://github.com/larrymotalavigne/file-saver/releases/new
# Select the tag, add release notes, and publish
```

#### Option B: Manual Workflow Trigger

1. Go to GitHub Actions tab
2. Select "Publish to npm" workflow
3. Click "Run workflow"
4. Select the branch and click "Run workflow"

### 5. Verify Publication

After the workflow runs:

1. Check the GitHub Actions logs for any errors
2. Visit https://www.npmjs.com/package/@larrym/file-saver
3. Verify the package was published with provenance

## Troubleshooting

### "Unable to authenticate" Error

**Cause**: The workflow configuration doesn't match npm's trusted publisher settings.

**Solution**:
- Verify workflow filename is exactly `publish.yml`
- Verify environment name is exactly `npm-publish`
- Verify repository and organization names match
- Check that `id-token: write` permission is set

### "Package already exists" Error

**Cause**: Trying to publish a version that already exists.

**Solution**:
- Update the version in `package.json`
- Create a new git tag with the new version
- Make sure `npm version` commands update the version properly

### Workflow Not Triggering

**Cause**: The workflow is configured to run on releases only.

**Solution**:
- Create a GitHub release (not just a git tag)
- Or trigger the workflow manually from the Actions tab

## Advanced Configuration

### Publishing on Push to Main

To publish on every push to main (not recommended for production):

```yaml
on:
  push:
    branches: [main]
```

### Publishing Pre-releases

Add a separate workflow or job for pre-releases:

```yaml
on:
  release:
    types: [published, prereleased]

jobs:
  publish:
    steps:
      - name: Publish
        run: |
          if [[ "${{ github.event.release.prerelease }}" == "true" ]]; then
            npm publish --provenance --access public --tag next
          else
            npm publish --provenance --access public
          fi
```

## Security Best Practices

1. **Use environments** - GitHub environments provide an extra layer of protection
2. **Enable branch protection** - Protect your main branch
3. **Review releases** - Always review what will be published before creating a release
4. **Monitor publications** - Set up npm notifications for package publications
5. **Use provenance** - Always include `--provenance` flag for supply chain security

## Resources

- [npm Trusted Publishing Documentation](https://docs.npmjs.com/trusted-publishers/)
- [GitHub OIDC Documentation](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)
- [npm Provenance Documentation](https://docs.npmjs.com/generating-provenance-statements)

## Support

If you encounter issues:
1. Check the GitHub Actions logs
2. Verify all configurations match exactly
3. Review npm's trusted publishing status page
4. Contact npm support if needed
