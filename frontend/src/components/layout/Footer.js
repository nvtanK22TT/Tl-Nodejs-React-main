import React from 'react'

const Footer = () => {
  return (
    <footer className="footer trace-footer">
      <div className="footer-container trace-footer-container">
        <div className="footer-item trace-footer-brand">
          <h3>QR Nông Sản</h3>
          <p>Hệ thống QRCode truy xuất nguồn gốc nông nghiệp địa phương phục vụ chuyển đổi số.</p>
          <p><strong>Website:</strong> qrnongsan.local</p>
          <p><strong>Email:</strong> truyxuat@nongsodia.local</p>
          <p><strong>Hotline:</strong> 1900.xxxx</p>
          <p><strong>Địa chỉ:</strong> Trung tâm hỗ trợ nông nghiệp địa phương</p>
        </div>

        <div className="footer-item trace-footer-links">
          <div className="social-links">
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">f</a>
            <a href="https://zalo.me/" target="_blank" rel="noopener noreferrer">Z</a>
            <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">Y</a>
            <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer">t</a>
          </div>
          <a href="/#qr-process">Quy trình truy xuất QR</a>
          <a href="/#featured-products">Sản phẩm địa phương</a>
          <a href="/#contact-order">Liên hệ triển khai</a>
          <a href="/#products-list">Danh mục nông sản</a>
          <p className="trace-copyright">© 2026 QR Nông Sản. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
