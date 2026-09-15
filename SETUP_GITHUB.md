# Cấu hình GitHub Releases cho Facebook Group Poster

## Mục tiêu

Sau khi cấu hình xong, quy trình phát hành sẽ là:

`đổi version → git tag → GitHub Actions build Windows → GitHub Release → app tự kiểm tra → tải → sao lưu → cài → khởi động lại`

## 1. Tạo repository GitHub

Tạo repository công khai tên:

`facebook-group-poster`

Trong `package.json`, thay `butanken-png` bằng username GitHub của bạn ở 3 chỗ:

- `repository.url`
- `homepage`
- `build.publish.owner`

Không cần tạo Personal Access Token cho luồng public repository này: GitHub Actions dùng `GITHUB_TOKEN` tích hợp của workflow để tạo/cập nhật Release.

## 2. Đưa code lên GitHub

Trong thư mục project:

```bash
git init
git add .
git commit -m "Facebook Group Poster V3.2.1"
git branch -M main
git remote add origin https://github.com/butanken-png/facebook-group-poster.git
git push -u origin main
```

## 3. Tạo release V3.2.1

```bash
git tag v3.2.1
git push origin v3.2.1
```

Workflow `.github/workflows/release.yml` sẽ chạy trên tag `v*.*.*`, build Windows NSIS và publish lên GitHub Releases.

## 4. Kiểm tra

Vào GitHub → repository → **Actions**. Job `Build and Publish Windows Release` phải xanh.

Sau đó vào **Releases**. Release `v3.2.1` sẽ có installer và file metadata cập nhật do electron-builder tạo.

## 5. Các bản sau

Ví dụ nâng lên V3.3.0:

```bash
# sửa version trong package.json thành 3.3.0

git add .
git commit -m "Release V3.3.0"
git push

git tag v3.3.0
git push origin v3.3.0
```

Không cần gửi ZIP cho người dùng nữa.

## 6. Cách app cập nhật

Bản cài Windows sử dụng `electron-updater` và GitHub provider. Trong app:

`↻ Kiểm tra cập nhật` → `Tải bản mới` → `Cập nhật & khởi động lại`

Trước khi tải/cài, app lưu backup dữ liệu vào thư mục `userData/backups` và giữ tối đa 10 bản backup.

## 7. Lưu ý quan trọng

- Phải test auto-update bằng bản **đã build/cài bằng NSIS**, không phải `npm start`.
- Repository owner/repo phải là repository bạn thực sự kiểm soát.
- Không đưa PAT/token cá nhân vào source code hoặc installer.
- Nếu sau này repository là private, cơ chế update public này cần cấu hình xác thực riêng; không nên nhét token vào app.
- Windows SmartScreen có thể cảnh báo ứng dụng chưa được code-sign. Auto-update vẫn có thể hoạt động, nhưng phát hành thương mại nên ký code-signing certificate.
