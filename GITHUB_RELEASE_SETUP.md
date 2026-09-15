# Facebook Group Poster — GitHub Releases Auto Update

## 1. Create the repository

Create a GitHub repository named:

`facebook-group-poster`

Then replace every occurrence of `YOUR_GITHUB_USERNAME` in `package.json` with your GitHub username.

## 2. Upload the project

```bash
git init
git add .
git commit -m "Initial release"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/facebook-group-poster.git
git push -u origin main
```

## 3. Publish the first release

Update `package.json` version to `3.2.1` (already set), then create and push the tag:

```bash
git tag v3.2.1
git push origin v3.2.1
```

GitHub Actions will build the Windows NSIS installer and publish it to GitHub Releases. The workflow grants the built-in `GITHUB_TOKEN` permission to write release assets.

## 4. How future updates work

For V3.2.2 / V3.3.0 etc.:

1. Change `version` in `package.json`.
2. Commit and push.
3. Create a matching tag, e.g. `v3.2.2`.
4. Push the tag.
5. GitHub Actions builds and publishes the release.
6. Installed Facebook Group Poster checks GitHub for updates.
7. User clicks Check for updates → Download → Install & Restart.

## 5. Files created by electron-builder

For Windows auto-update, electron-builder generates update metadata such as `latest.yml` and the installer artifact and uploads them to the GitHub Release.

## 6. Important

- Do not put a personal GitHub access token inside the application source code.
- The normal public GitHub Releases flow can use the Actions `GITHUB_TOKEN` for publishing.
- The app's update client should point to a public GitHub repository unless you deliberately configure private-update authentication.
- The app must be installed using the NSIS installer for normal `electron-updater` installation/update behavior; a development `npm start` session is not the same as an installed production app.
- Keep the repository owner/repo fixed and under your control. The packaged app stores the update repository configuration.
