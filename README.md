# projectbluefire

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### When running locally...

Comment out the following (in main.js) to manually login

```
if (import.meta.env.MODE === 'development') {
const userStore = useUserStore()
userStore.handleLogin(true)
}
```

### TIAGA Integration - https://docs.taiga.io/changing-elements-status-via-commit-message.html

Add `TG-REF #STATUS-slug` to commit summary or description to change TIAGA ticket status

- Example:
- `TG-123 #in-progress`
- `TG-123 #in-pr`
- `TG-123 #done`
- Example: `TG-12 updated readme to relfect changes...`

### Blog - Sanity

npm run dev - to run Sanity Studio

Other helpful commands
npx sanity docs - to open the documentation in a browser
npx sanity manage - to open the project settings in a browser
npx sanity help - to explore the CLI manual

# Mobile/Android Development with Capacitor

This project uses Capacitor to build Android apps from the Vue 3 web application.

## Table of Contents

- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Production Build](#production-build)
- [Package.json Scripts](#packagejson-scripts)
- [Troubleshooting](#troubleshooting)
- [Play Store Deployment](#play-store-deployment)

## Project Structure

```
your-project/
├── android/                     # Android native project
├── src/                         # Vue source code
├── dist/                        # Built web assets
├── scripts/
│   └── switch-capacitor-config.js  # Config switcher script
├── capacitor.config.json        # Default config
├── capacitor.config.dev.json    # Development config
├── capacitor.config.prod.json   # Production config
└── package.json
```

## Development Workflow

### Option 1: Live Reload Development (Recommended)

**Prerequisites:**

- Computer and Android device on same WiFi network
- Android device in wireless debugging mode
- Know your computer's IP address

**Get your IP address:**

```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

**Configure development config (`capacitor.config.dev.json`):**

```json
{
  "appId": "com.projectbluefire.app",
  "appName": "Your App Name",
  "webDir": "dist",
  "server": {
    "url": "http://YOUR_COMPUTER_IP:5173",
    "cleartext": true
  }
}
```

**Start development:**

```bash
npm run dev:mobile
```

This command:

1. Switches to dev config
2. Starts Vite dev server
3. Copies files to Android project
4. Opens Android Studio

**In Android Studio:**

- Select your device from dropdown
- Click Run button (▶️)
- App will live reload when you make changes

### Option 2: Standard Development (No Live Reload)

**Build and deploy:**

```bash
npm run build
npx cap sync android
npx cap open android
```

**After making changes:**

```bash
npm run build
npx cap sync android
# Then hit Run in Android Studio
```

## Production Build

### 1. Build for Production

```bash
npm run build:mobile
```

This command:

1. Switches to production config (removes server URL)
2. Builds optimized production files
3. Copies files to Android project

### 2. Generate Signed App Bundle

**In Android Studio:**

1. `Build` → `Generate Signed Bundle / APK`
2. Select **"Android App Bundle"** (preferred by Google Play)
3. Choose your existing keystore file
4. Enter keystore and key passwords
5. Select **"release"** build variant
6. Click "Create"

### 3. Locate Your App Bundle

The `.aab` file will be created in:
`android/app/release/app-release.aab`

## Package.json Scripts

```json
{
  "scripts": {
    "dev:mobile": "node scripts/switch-capacitor-config.js dev && vite && npx cap copy android && npx cap open android",
    "build:mobile": "node scripts/switch-capacitor-config.js prod && vite build && npx cap copy android"
  }
}
```

### Script Breakdown

**`dev:mobile`:**

- Switches to development Capacitor config
- Starts Vite development server
- Copies web assets to Android project
- Opens Android Studio

**`build:mobile`:**

- Switches to production Capacitor config
- Builds production-optimized web assets
- Copies built assets to Android project

## Troubleshooting

### Build Errors: "Unable to delete directory"

This is a common Windows file locking issue:

**Solution 1 - Clean Everything:**

```bash
# Close Android Studio completely
# Delete android/app/build folder manually
cd android
./gradlew clean
npm run dev:mobile
```

**Solution 2 - Force Delete (Admin Command Prompt):**

```cmd
cd C:\path\to\your\project\android\app\
rmdir /s /q build
```

**Solution 3 - Nuclear Option:**

1. Close Android Studio
2. Restart computer
3. Try again

### Emulator Issues

- Use **Cold Boot** in AVD Manager
- **Wipe Data** in AVD Manager
- Create a new emulator
- Use physical device instead

### Live Reload Not Working

- Ensure computer and phone on same WiFi
- Check firewall settings
- Verify IP address in dev config
- Restart Vite dev server

### Wrong App Loading

- Verify correct project open in Android Studio
- Check `capacitor.config.json` has correct `appId`
- Clear emulator data or use fresh emulator

## Play Store Deployment

### 1. Pre-Deployment Checklist

- [ ] App icons configured (all sizes)
- [ ] App name and version updated
- [ ] Permissions properly set in `AndroidManifest.xml`
- [ ] Tested on multiple devices/screen sizes
- [ ] Production build generated with correct keystore

### 2. App Store Assets Needed

- App screenshots (multiple device sizes)
- Feature graphic (1024x500)
- App icon (512x512)
- Privacy policy URL
- App description and metadata

### 3. Version Management

Update version in `android/app/build.gradle`:

```gradle
android {
    defaultConfig {
        versionCode 2          // Increment for each release
        versionName "1.1.0"    // Semantic version
    }
}
```

### 4. Upload Process

1. Go to Google Play Console
2. Create new app or select existing
3. Upload the `.aab` file
4. Fill in store listing details
5. Submit for review (1-3 days typically)

## Capacitor Commands Reference

```bash
# Sync web assets to native projects
npx cap sync android

# Copy web assets only (faster)
npx cap copy android

# Open native IDE
npx cap open android

# Add native platform
npx cap add android

# Update Capacitor
npx cap update android

# Check Capacitor setup
npx cap doctor
```

## Development Tips

1. **Always sync after installing plugins:**

   ```bash
   npm install @capacitor/some-plugin
   npx cap sync android
   ```

2. **Use live reload for faster development**

3. **Test on real devices when possible**

4. **Keep keystore file safe - you need it for all future updates**

5. **Use different app IDs for different projects to avoid conflicts**

6. **Check Android Studio's "Build" output for detailed error messages**

---

## Quick Reference Commands

**Start Development:**

```bash
npm run dev:mobile
```

**Build for Production:**

```bash
npm run build:mobile
# Then generate signed bundle in Android Studio
```

**Manual Sync (after changes):**

```bash
npm run build
npx cap sync android
```
