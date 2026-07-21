#!/bin/bash
# Deploy Water Margin for Kids to GitHub Pages

set -e

echo "🐉 Water Margin for Kids - GitHub Pages Deployment"
echo "=================================================="

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "Please install it: https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub."
    echo "Please run: gh auth login"
    exit 1
fi

# Get repository name
REPO_NAME="water-margin-kids"
echo "📦 Creating GitHub repository: $REPO_NAME"

# Create the repository if it doesn't exist
if ! gh repo view "$REPO_NAME" &> /dev/null; then
    gh repo create "$REPO_NAME" --public --description "Interactive webapp teaching the classic Chinese folktale Water Margin to primary school children"
    echo "✅ Repository created!"
else
    echo "ℹ️  Repository already exists."
fi

# Add remote if not exists
if ! git remote get-url origin &> /dev/null; then
    gh repo set-default "ai/$REPO_NAME"
    git remote add origin "https://github.com/ai/$REPO_NAME.git"
    echo "✅ Remote added."
fi

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push -u origin main

# Enable GitHub Pages
echo "🌐 Enabling GitHub Pages..."
gh api repos/ai/$REPO_NAME/pages -X PUT -f build_type=legacy -f source.branch=main -f source.path=/ 2>/dev/null || \
gh api repos/ai/$REPO_NAME/pages -X POST -f build_type=legacy -f source.branch=main -f source.path=/ 2>/dev/null || \
echo "⚠️  Pages may need to be enabled manually in repository settings."

echo ""
echo "✅ Deployment complete!"
echo "🔗 Your site will be available at: https://ai.github.io/$REPO_NAME/"
echo ""
echo "Note: It may take a few minutes for GitHub Pages to build and deploy."