# Bài thuyết trình chức năng QR Code truy xuất nguồn gốc nông sản

## Slide 1: Giới thiệu đề tài

**Tên chức năng:** Sinh mã QR Code và truy xuất nguồn gốc sản phẩm nông sản

**Mục tiêu:**
- Mỗi sản phẩm nông sản có một mã truy xuất riêng.
- Admin có thể tự sinh mã QR cho sản phẩm.
- Người dùng quét QR để xem thông tin nguồn gốc sản phẩm trên website.

**Lời trình bày:**
> Trong hệ thống website nông sản, em xây dựng thêm chức năng QR Code để hỗ trợ truy xuất nguồn gốc. Khi admin tạo hoặc quản lý sản phẩm, hệ thống sẽ tạo mã truy xuất riêng cho sản phẩm đó. Người dùng chỉ cần quét mã QR là có thể xem thông tin nguồn gốc sản phẩm.

---

## Slide 2: Vấn đề cần giải quyết

**Thực trạng:**
- Người mua khó kiểm tra nguồn gốc sản phẩm.
- Thông tin sản phẩm thường chỉ hiển thị trên website, chưa có cách truy cập nhanh ngoài đời thực.
- Khi sản phẩm được in tem/nhãn, cần một mã để người dùng quét và kiểm tra.

**Giải pháp:**
- Tạo mã `secureToken` duy nhất cho từng sản phẩm.
- Sinh QR Code chứa đường link truy xuất.
- Xây dựng trang `/trace-product` để hiển thị thông tin sản phẩm theo token.

**Lời trình bày:**
> Chức năng này giúp tăng tính minh bạch cho sản phẩm nông sản. Thay vì người dùng phải tìm kiếm thủ công trên website, hệ thống cung cấp một mã QR gắn trực tiếp với sản phẩm.

---

## Slide 3: Luồng hoạt động tổng quát

**Quy trình:**
1. Admin tạo sản phẩm trên website.
2. Backend tự sinh `secureToken` cho sản phẩm.
3. Admin bấm nút QR trong trang quản lý sản phẩm.
4. Backend tạo QR Code từ link truy xuất.
5. Frontend hiển thị ảnh QR Code.
6. Người dùng quét QR.
7. Website mở trang thông tin nguồn gốc sản phẩm.

**Sơ đồ luồng:**

```text
Admin tạo sản phẩm
        |
        v
Backend sinh secureToken
        |
        v
Admin bấm nút QR
        |
        v
Backend sinh QR Code
        |
        v
Frontend hiển thị QR
        |
        v
Người dùng quét QR
        |
        v
Trang truy xuất nguồn gốc
```

**Lời trình bày:**
> Đây là luồng chính của chức năng. Điểm quan trọng là mỗi sản phẩm có một token riêng, QR Code không chứa toàn bộ dữ liệu sản phẩm mà chứa đường link truy xuất an toàn.

---

## Slide 4: Chức năng phía Admin

**Trang sử dụng:** Trang quản lý sản phẩm của admin

**Thao tác thực hiện:**
1. Admin đăng nhập tài khoản quản trị.
2. Vào trang danh sách sản phẩm.
3. Ở mỗi sản phẩm có nút QR Code.
4. Admin bấm nút QR.
5. Hệ thống hiển thị:
   - Ảnh QR Code
   - Tên sản phẩm
   - Xuất xứ
   - Link truy xuất

**File liên quan:**
- `frontend/src/components/admin/ProductsList.js`
- `backend/controllers/productController.js`
- `backend/routes/product.js`

**Lời trình bày:**
> Ở trang quản lý sản phẩm, em bổ sung thêm một thao tác cho admin là tạo mã QR. Khi bấm vào nút này, frontend gửi `productId` lên backend. Backend dựa vào sản phẩm đó để tạo mã QR và trả về cho giao diện hiển thị.

---

## Slide 5: Cơ chế sinh mã QR Code

**API sinh QR:**

```http
POST /api/v1/product/qr-code
```

**Dữ liệu gửi lên:**

```json
{
  "productId": "id_cua_san_pham"
}
```

**Backend xử lý:**
- Tìm sản phẩm theo `productId`.
- Kiểm tra sản phẩm có `secureToken` chưa.
- Nếu chưa có thì tự tạo token.
- Tạo link truy xuất:

```text
http://localhost:3000/trace-product?token=SECURE_TOKEN
```

- Dùng thư viện `qrcode` để chuyển link thành ảnh QR dạng Base64.

**Kết quả trả về:**

```json
{
  "success": true,
  "traceUrl": "...",
  "qrCodeDataUrl": "data:image/png;base64,...",
  "product": {}
}
```

**Lời trình bày:**
> Backend không tạo QR từ nội dung mô tả sản phẩm, mà tạo QR từ một đường link chứa token. Cách này giúp dữ liệu gọn hơn, đồng thời khi thông tin sản phẩm thay đổi thì người dùng quét QR vẫn xem được dữ liệu mới nhất từ database.

---

## Slide 6: Trang truy xuất nguồn gốc cho người dùng

**URL truy xuất:**

```text
/trace-product?token=SECURE_TOKEN
```

**Thông tin hiển thị:**
- Tên sản phẩm
- Hình ảnh sản phẩm
- Xuất xứ
- Danh mục
- Giá bán
- Tình trạng còn hàng/hết hàng
- Mã truy xuất
- Ngày tạo thông tin
- Mô tả sản phẩm

**File liên quan:**
- `frontend/src/components/product/TraceProduct.js`
- `frontend/src/App.js`

**Lời trình bày:**
> Khi người dùng quét QR, trình duyệt sẽ mở trang truy xuất. Trang này lấy token từ URL, gọi API backend để lấy thông tin sản phẩm tương ứng và hiển thị ra giao diện.

---

## Slide 7: API truy xuất thông tin sản phẩm

**API truy xuất:**

```http
GET /api/v1/trace-product?token=SECURE_TOKEN
```

**Backend xử lý:**
1. Nhận token từ query string.
2. Kiểm tra token có tồn tại không.
3. Tìm sản phẩm trong database theo `secureToken`.
4. Nếu tìm thấy, trả về thông tin sản phẩm.
5. Nếu không tìm thấy, trả về lỗi.

**Ưu điểm:**
- Không cần đăng nhập vẫn xem được thông tin truy xuất.
- Không để lộ ID sản phẩm trực tiếp trên QR.
- Token khó đoán hơn ID thông thường.

**Lời trình bày:**
> API truy xuất được thiết kế public để người mua có thể xem thông tin sản phẩm mà không cần đăng nhập. Tuy nhiên, hệ thống sử dụng token riêng thay vì ID sản phẩm để tăng tính bảo mật.

---

## Slide 8: Các file đã xây dựng trong hệ thống

**Backend:**
- `backend/models/product.js`
  - Thêm trường `secureToken`.
  - Tự sinh token cho sản phẩm.

- `backend/controllers/productController.js`
  - Hàm `generateProductQRCode`.
  - Hàm `getTraceProduct`.

- `backend/routes/product.js`
  - Route sinh QR Code.
  - Route truy xuất sản phẩm theo token.

**Frontend:**
- `frontend/src/components/admin/ProductsList.js`
  - Thêm nút tạo QR.
  - Hiển thị ảnh QR và link truy xuất.

- `frontend/src/components/product/TraceProduct.js`
  - Trang hiển thị thông tin nguồn gốc sản phẩm.

- `frontend/src/App.js`
  - Thêm route `/trace-product`.

**Dependency:**
- `qrcode`

**Lời trình bày:**
> Chức năng này có cả phần backend và frontend. Backend chịu trách nhiệm sinh token, sinh QR và truy xuất dữ liệu. Frontend chịu trách nhiệm cho thao tác admin và trang hiển thị cho người dùng.

---

## Slide 9: Kịch bản demo cho thầy cô

**Bước 1:** Đăng nhập bằng tài khoản admin.

**Bước 2:** Vào trang quản lý sản phẩm.

**Bước 3:** Chọn một sản phẩm và bấm nút QR Code.

**Bước 4:** Hệ thống hiển thị mã QR của sản phẩm.

**Bước 5:** Bấm vào link truy xuất hoặc dùng điện thoại quét mã QR.

**Bước 6:** Trang truy xuất nguồn gốc mở ra.

**Bước 7:** Giới thiệu các thông tin được hiển thị:
- Tên sản phẩm
- Xuất xứ
- Danh mục
- Mã truy xuất
- Mô tả sản phẩm

**Lời trình bày:**
> Khi demo, em sẽ thao tác trực tiếp trên trang admin. Sau khi bấm tạo QR, em có thể mở link truy xuất để chứng minh QR dẫn đến đúng thông tin sản phẩm.

---

## Slide 10: Kết luận và hướng phát triển

**Kết quả đạt được:**
- Hệ thống tự sinh mã truy xuất cho sản phẩm.
- Admin có thể tạo QR Code ngay trên website.
- Người dùng có thể quét QR để xem thông tin nguồn gốc.
- Chức năng giúp tăng độ tin cậy và minh bạch cho nông sản.

**Hướng phát triển:**
- Bổ sung thông tin lô hàng, ngày thu hoạch, nơi sản xuất.
- Thêm lịch sử vận chuyển và kiểm định chất lượng.
- Cho phép tải QR Code về để in tem sản phẩm.
- Dùng domain thật sau khi deploy để quét QR bằng điện thoại.

**Lời trình bày:**
> Chức năng hiện tại đã đáp ứng được luồng truy xuất cơ bản. Trong tương lai, hệ thống có thể mở rộng thêm thông tin về lô hàng, quy trình sản xuất và kiểm định để phù hợp hơn với bài toán truy xuất nguồn gốc nông sản thực tế.

