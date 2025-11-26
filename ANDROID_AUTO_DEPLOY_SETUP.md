# Android Auto-Deploy Setup Guide

This guide will help you set up automated deployments to Google Play Store's Internal Testing track.

## Overview

Once configured, every push to `main` branch will automatically:
1. Build your web app for production
2. Build a signed Android AAB file
3. Upload it to Play Store Internal Testing track
4. Auto-increment the version code

## Prerequisites

- [ ] You have an existing keystore file for signing your app
- [ ] You have a Google Play Console account with your app set up
- [ ] Your app is already published (at least to Internal Testing)

## Step 1: Create Play Store Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one)
3. Navigate to **IAM & Admin** > **Service Accounts**
4. Click **Create Service Account**
   - Name: `github-actions-play-store`
   - Description: `Service account for automated Play Store uploads`
   - Click **Create and Continue**
5. Skip granting roles for now, click **Done**
6. Click on the newly created service account
7. Go to **Keys** tab
8. Click **Add Key** > **Create New Key**
9. Choose **JSON** format
10. Save the downloaded JSON file securely

## Step 2: Grant Play Console Access

1. Go to [Google Play Console](https://play.google.com/console/)
2. Select your app
3. Go to **Setup** > **API access**
4. Under **Service accounts**, find your service account and click **Grant access**
5. Choose the following permissions:
   - **View app information and download bulk reports (read-only)**
   - **Create, edit, and delete draft apps**
   - **Release apps to testing tracks**
   - **Release to production, exclude devices, and use Play App Signing**
6. On the **App permissions** tab, select your app
7. Click **Apply** and **Invite user**

## Step 3: Encode Your Keystore File

You need to base64 encode your keystore file to store it in GitHub Secrets.

### On Windows (PowerShell):
```powershell
$bytes = [System.IO.File]::ReadAllBytes("C:\path\to\your\release.keystore")
$base64 = [System.Convert]::ToBase64String($bytes)
$base64 | Set-Clipboard
```

### On Mac/Linux:
```bash
base64 -i /path/to/your/release.keystore | pbcopy
```

The encoded keystore is now in your clipboard.

## Step 4: Add GitHub Secrets

Go to your GitHub repository:
1. Click **Settings** > **Secrets and variables** > **Actions**
2. Click **New repository secret** for each of the following:

### Required Secrets:

| Secret Name | Description | Example/How to Get |
|------------|-------------|-------------------|
| `ANDROID_KEYSTORE_BASE64` | Base64-encoded keystore file | From Step 3 above |
| `ANDROID_KEYSTORE_PASSWORD` | Keystore password | The password you created when generating the keystore |
| `ANDROID_KEY_ALIAS` | Key alias in keystore | Usually something like `upload` or `release` |
| `ANDROID_KEY_PASSWORD` | Key password (may be same as keystore password) | Password for the specific key alias |
| `PLAY_STORE_SERVICE_ACCOUNT_JSON` | Full contents of service account JSON | Open the JSON file from Step 1, copy entire contents |

### How to add `PLAY_STORE_SERVICE_ACCOUNT_JSON`:
1. Open the JSON file you downloaded in Step 1
2. Copy the **entire contents** (it should start with `{` and end with `}`)
3. Paste it as the secret value

## Step 5: Update .gitignore

Make sure these files are in your `.gitignore`:

```
# Android signing
android/keystore.properties
android/app/release.keystore
android/*.keystore
android/play-store-credentials.json

# Local signing configs
*.jks
*.keystore
```

## Step 6: Test the Workflow

### Option 1: Manual Test (Recommended First Time)
1. Go to your repo on GitHub
2. Click **Actions** tab
3. Click **Deploy Android to Play Store (Internal Testing)**
4. Click **Run workflow** dropdown
5. Click green **Run workflow** button

### Option 2: Automatic Test
1. Make any small change to your code
2. Commit and push to `main` branch:
   ```bash
   git add .
   git commit -m "test: trigger android deploy"
   git push origin main
   ```

## Step 7: Verify Deployment

1. Go to [Google Play Console](https://play.google.com/console/)
2. Select your app
3. Navigate to **Release** > **Testing** > **Internal testing**
4. You should see a new release with an auto-incremented version code

## Troubleshooting

### Error: "The version code must be higher than the previous version"
- The auto-increment should handle this, but if you see this error:
  - Check that your local builds aren't using a higher version code
  - The workflow uses timestamp-based versioning: `yyMMddHH`

### Error: "Invalid keystore format"
- Make sure you copied the entire base64 string
- Try encoding again and ensure no extra spaces or newlines

### Error: "Service account does not have permission"
- Double-check Step 2 - ensure all permissions are granted
- Wait a few minutes for permissions to propagate

### Error: "Track 'internal' not found"
- You need to have at least one manual release to Internal Testing first
- Go to Play Console and create a draft internal release manually

### Build fails during `npm run build:mobile`
- Check that your Firebase/environment secrets are set in the workflow
- You may need to add additional env vars to the workflow file

## Version Management

### Auto-Increment
The version code is automatically generated based on the current date/time:
- Format: `yyMMddHH` (year, month, day, hour)
- Example: Version code `25112620` = Nov 26, 2025, 8:00 PM

### Manual Version Name
The version name (user-visible) is in `android/app/build.gradle`:
```gradle
versionName "0.0.4"
```

Update this manually when you want to change the user-facing version.

## Security Notes

- Never commit keystore files or passwords to git
- GitHub Secrets are encrypted and only exposed during workflow runs
- The workflow cleans up sensitive files after use
- Service account has minimal permissions (only Play Store access)

## Next Steps

Once internal testing works:
1. Test the app thoroughly with your internal testers
2. When ready for wider release, manually promote from Internal → Alpha/Beta/Production in Play Console
3. Consider creating separate workflows for different release tracks if needed

## Support

If you run into issues:
1. Check the GitHub Actions logs for detailed error messages
2. Verify all secrets are set correctly
3. Ensure your Play Console setup is complete
4. Check that your service account has the right permissions