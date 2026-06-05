import React, { Fragment, useEffect, useState } from 'react'
import Pagination from 'react-js-pagination'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import MetaData from './layout/MetaData'
import Product from './product/Product'
import Loader from './layout/Loader'

import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { getProducts } from '../actions/productActions'
import { productCategories } from '../constants/productCategories'

const { createSliderWithTooltip } = Slider
const Range = createSliderWithTooltip(Slider.Range)

const showcaseProducts = [
    {
        title: 'Rau xanh VietGAP',
        image: '/images/trace-vegetables.png',
        tag: 'Có QR truy xuất',
        desc: 'Thông tin vùng trồng, nhật ký chăm sóc, ngày thu hoạch và đơn vị kiểm định được hiển thị minh bạch qua mã QR.',
        meta: ['Vùng trồng rõ ràng', 'Nhật ký số', 'Đã kiểm định'],
        price: '25.000đ/kg'
    },
    {
        title: 'Trái cây địa phương',
        image: '/images/trace-fruit.png',
        tag: 'OCOP',
        desc: 'Hồ sơ sản phẩm số giúp người mua kiểm tra nguồn gốc, lô sản xuất và quy trình bảo quản trước khi đặt hàng.',
        meta: ['Mã lô sản xuất', 'Đóng gói chuẩn', 'Nguồn gốc số'],
        price: '45.000đ/kg'
    },
    {
        title: 'Gạo sạch truy xuất',
        image: '/images/trace-rice.png',
        tag: 'Lô mới',
        desc: 'Mỗi bao bì gắn mã QR liên kết dữ liệu nông hộ, vùng canh tác, chứng nhận chất lượng và hành trình phân phối.',
        meta: ['Nông hộ xác thực', 'Chứng nhận', 'Chuỗi cung ứng'],
        price: '35.000đ/kg'
    }
]

const reasons = [
    ['fa-qrcode', 'Truy xuất QR nhanh', 'Quét mã để xem toàn bộ hồ sơ nông sản từ vùng trồng đến điểm bán.'],
    ['fa-seedling', 'Nguồn gốc địa phương', 'Kết nối nông hộ, hợp tác xã và sản phẩm đặc trưng của từng khu vực.'],
    ['fa-clipboard-check', 'Dữ liệu minh bạch', 'Lưu nhật ký canh tác, kiểm định, thu hoạch và đóng gói theo từng lô hàng.'],
    ['fa-shield-alt', 'Tăng niềm tin', 'Người tiêu dùng kiểm tra được thông tin trước khi mua, hạn chế hàng không rõ nguồn gốc.'],
    ['fa-chart-line', 'Phục vụ chuyển đổi số', 'Hỗ trợ số hóa quy trình quản lý sản phẩm và nâng cao năng lực tiêu thụ.'],
    ['fa-headset', 'Hỗ trợ vận hành', 'Quản trị viên, nông hộ và khách hàng có kênh cập nhật thông tin thuận tiện.']
]

const processSteps = [
    ['01', 'Tạo hồ sơ sản phẩm', 'Nhập thông tin nông hộ, vùng trồng, giống cây, tiêu chuẩn sản xuất và mã lô.'],
    ['02', 'Cập nhật nhật ký số', 'Ghi nhận chăm sóc, sử dụng vật tư, thu hoạch, đóng gói và kiểm định chất lượng.'],
    ['03', 'Sinh mã QR truy xuất', 'Mỗi lô hàng có mã QR riêng, liên kết trực tiếp tới hồ sơ nguồn gốc đã công bố.'],
    ['04', 'Quét và xác thực', 'Người tiêu dùng kiểm tra thông tin bằng điện thoại trước khi mua hoặc khi nhận hàng.']
]

const newsItems = [
    {
        title: 'QRCode giúp nông sản địa phương tăng niềm tin khi tiêu thụ',
        desc: 'Mã QR trên bao bì giúp người mua kiểm tra nhanh vùng trồng, lô sản xuất và chứng nhận chất lượng.',
        image: '/images/trace-hero.png'
    },
    {
        title: 'Số hóa nhật ký canh tác cho hợp tác xã',
        desc: 'Nhật ký điện tử giúp giảm giấy tờ, chuẩn hóa dữ liệu sản xuất và hỗ trợ quản lý theo từng mùa vụ.',
        image: '/images/trace-digital.png'
    },
    {
        title: 'Kết nối người tiêu dùng với nông hộ minh bạch hơn',
        desc: 'Dữ liệu truy xuất được công bố rõ ràng giúp sản phẩm địa phương cạnh tranh tốt hơn trên kênh số.',
        image: '/images/trace-farm.png'
    }
]

const stats = [
    ['1.000+', 'Mã QR sản phẩm'],
    ['120+', 'Nông hộ tham gia'],
    ['98%', 'Lô hàng có hồ sơ số'],
    ['4.9/5', 'Đánh giá minh bạch']
]

const testimonials = [
    ['Chị Lan', 'Chủ cửa hàng nông sản', 'Khách hàng của tôi yên tâm hơn khi chỉ cần quét QR là thấy vùng trồng, ngày thu hoạch và chứng nhận sản phẩm.'],
    ['Anh Minh', 'Đại diện hợp tác xã', 'Hệ thống giúp hợp tác xã quản lý lô sản xuất rõ ràng hơn và giới thiệu sản phẩm địa phương chuyên nghiệp hơn.'],
    ['Cô Hương', 'Người tiêu dùng', 'Tôi thường kiểm tra mã QR trước khi mua. Thông tin rõ ràng giúp tôi chọn đúng sản phẩm sạch cho gia đình.']
]

const balancingProducts = [
    {
        _id: 'static-watermelon',
        name: 'Dưa hấu đỏ địa phương',
        image: '/images/trace-watermelon.png',
        price: 28000,
        ratings: 5,
        numOfReviews: 26
    },
    {
        _id: 'static-passionfruit',
        name: 'Chanh dây tím truy xuất QR',
        image: '/images/trace-passionfruit.png',
        price: 42000,
        ratings: 5,
        numOfReviews: 19
    }
]

const StaticProductCard = ({ product, col }) => (
    <div className={`col-sm-12 col-md-6 col-lg-${col} my-3`}>
        <div className="card p-3 rounded trace-store-card">
            <a href="#contact-order">
                <img className="card-img-top mx-auto" src={product.image} alt={product.name} />
            </a>
            <div className="card-body d-flex flex-column">
                <h5 className="card-title">
                    <a href="#contact-order">{product.name}</a>
                </h5>
                <div className="ratings mt-auto">
                    <div className="rating-outer">
                        <div className="rating-inner" style={{ width: `${(product.ratings / 5) * 100}%` }}></div>
                    </div>
                    <span id="no_of_reviews">({product.numOfReviews} đánh giá)</span>
                </div>
                <p className="card-text">{product.price.toLocaleString()}đ</p>
                <div className="container">
                    <div className="row">
                        <a href="#contact-order" id="view_btn" className="btn btn-block">
                            <i className="fa fa-qrcode" aria-hidden="true"><span>&nbsp;</span></i>
                            Xem truy xuất
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
)

const Home = ({ match }) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [price, setPrice] = useState([1, 1000000])
    const [category, setCategory] = useState('')
    const [rating, setRating] = useState(0)

    const alert = useAlert()
    const dispatch = useDispatch()

    const { loading, products = [], error, productsCount, resPerPage, filteredProductsCount } = useSelector(state => state.products)
    const keyword = match.params.keyword

    useEffect(() => {
        if (error) {
            return alert.error(error)
        }

        dispatch(getProducts(keyword, currentPage, price, category, rating))
    }, [dispatch, alert, error, keyword, currentPage, price, category, rating])

    const count = keyword ? filteredProductsCount : productsCount

    return (
        <Fragment>
            <MetaData title={'Hệ thống QRCode truy xuất nguồn gốc nông nghiệp địa phương'} />

            <section className="trace-hero">
                <div className="trace-container trace-hero-grid">
                    <div className="trace-hero-copy">
                        <span className="trace-eyebrow">Nông nghiệp địa phương số</span>
                        <h1>Quét QR - hiểu rõ nguồn gốc nông sản</h1>
                        <p>
                            Hệ thống QRCode hỗ trợ truy xuất nguồn gốc nông nghiệp địa phương,
                            minh bạch dữ liệu sản xuất và phục vụ chuyển đổi số cho nông hộ,
                            hợp tác xã và người tiêu dùng.
                        </p>
                        <div className="trace-badges">
                            <span><i className="fa fa-qrcode"></i> QR truy xuất</span>
                            <span><i className="fa fa-leaf"></i> Nông sản địa phương</span>
                            <span><i className="fa fa-check-circle"></i> Dữ liệu minh bạch</span>
                        </div>
                        <div className="trace-actions">
                            <a href="#featured-products" className="trace-btn trace-btn-primary">Xem sản phẩm</a>
                            <a href="#qr-process" className="trace-btn trace-btn-outline">Tìm hiểu quy trình</a>
                        </div>
                    </div>
                    <div className="trace-hero-media">
                        <img
                            src="/images/trace-hero.png"
                            alt="Nông sản địa phương có mã QR truy xuất nguồn gốc"
                        />
                        <div className="trace-qr-card">
                            <i className="fa fa-qrcode"></i>
                            <div>
                                <strong>Mã QR lô SP-2026</strong>
                                <span>Vùng trồng, nhật ký, kiểm định</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="trace-section" id="featured-products">
                <div className="trace-container">
                    <div className="trace-section-title">
                        <span className="trace-icon"><i className="fa fa-leaf"></i></span>
                        <h2>Sản phẩm nổi bật</h2>
                        <p>Nông sản địa phương được số hóa hồ sơ và gắn mã QR truy xuất.</p>
                    </div>
                    <div className="trace-showcase">
                        {showcaseProducts.map(item => (
                            <article className="trace-product-card" key={item.title}>
                                <div className="trace-product-image">
                                    <img src={item.image} alt={item.title} />
                                    <span>{item.tag}</span>
                                </div>
                                <div className="trace-product-body">
                                    <h3>{item.title}</h3>
                                    <p>{item.desc}</p>
                                    <div className="trace-product-meta">
                                        {item.meta.map(meta => <small key={meta}>{meta}</small>)}
                                    </div>
                                    <strong>{item.price}</strong>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="trace-section trace-muted" id="qr-process">
                <div className="trace-container">
                    <div className="trace-section-title">
                        <h2>Tại sao chọn hệ thống QRCode?</h2>
                        <p>6 giá trị chính giúp truy xuất nguồn gốc minh bạch và vận hành nông nghiệp số hiệu quả.</p>
                    </div>
                    <div className="trace-reasons">
                        {reasons.map(([icon, title, desc]) => (
                            <article className="trace-reason" key={title}>
                                <i className={`fa ${icon}`}></i>
                                <h3>{title}</h3>
                                <p>{desc}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="trace-section trace-process">
                <div className="trace-container">
                    <div className="trace-section-title">
                        <h2>Quy trình truy xuất nguồn gốc</h2>
                        <p>Từ hồ sơ sản xuất đến mã QR trên bao bì, mọi dữ liệu được tổ chức theo từng lô hàng.</p>
                    </div>
                    <div className="trace-process-grid">
                        {processSteps.map(([number, title, desc]) => (
                            <article className="trace-process-step" key={title}>
                                <strong>{number}</strong>
                                <h3>{title}</h3>
                                <p>{desc}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="trace-section" id="about-system">
                <div className="trace-container trace-about-grid">
                    <div className="trace-about-image">
                        <img
                            src="/images/trace-digital.png"
                            alt="Đội ngũ triển khai hệ thống QRCode truy xuất nguồn gốc"
                        />
                    </div>
                    <div className="trace-about-copy">
                        <span className="trace-eyebrow">Về hệ thống</span>
                        <h2>Nền tảng hỗ trợ quản lý và công bố nguồn gốc nông sản</h2>
                        <p>
                            Hệ thống được thiết kế cho bài toán chuyển đổi số nông nghiệp địa phương:
                            quản lý hồ sơ sản phẩm, chuẩn hóa dữ liệu lô hàng, tạo mã QR và hỗ trợ
                            người tiêu dùng kiểm tra thông tin minh bạch.
                        </p>
                        <div className="trace-about-points">
                            <span><i className="fa fa-database"></i> Lưu trữ hồ sơ số</span>
                            <span><i className="fa fa-users"></i> Kết nối nông hộ và hợp tác xã</span>
                            <span><i className="fa fa-mobile-alt"></i> Tra cứu dễ dàng trên điện thoại</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="trace-section">
                <div className="trace-container">
                    <div className="trace-section-title">
                        <h2>Người dùng nói gì về chúng tôi</h2>
                        <p>Chia sẻ từ nông hộ, hợp tác xã và người tiêu dùng đã sử dụng hệ thống.</p>
                    </div>
                    <div className="trace-testimonials">
                        {testimonials.map(([name, role, quote]) => (
                            <article className="trace-testimonial" key={name}>
                                <div className="trace-avatar">{name.charAt(0)}</div>
                                <h3>{name}</h3>
                                <span>{role}</span>
                                <p>"{quote}"</p>
                                <div className="trace-stars">★★★★★</div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="trace-section trace-news" id="digital-news">
                <div className="trace-container">
                    <div className="trace-section-title">
                        <h2>Tin tức chuyển đổi số</h2>
                        <p>Cập nhật các nội dung liên quan đến QRCode, truy xuất nguồn gốc và nông nghiệp số.</p>
                    </div>
                    <div className="trace-news-grid">
                        {newsItems.map(item => (
                            <article className="trace-news-card" key={item.title}>
                                <img src={item.image} alt={item.title} />
                                <div>
                                    <h3>{item.title}</h3>
                                    <p>{item.desc}</p>
                                    <a href="/#digital-news">Đọc thêm</a>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="trace-stats">
                <div className="trace-container">
                    <div className="trace-section-title trace-light-title">
                        <h2>Hệ thống QRCode trong con số</h2>
                        <p>Những chỉ số thể hiện hiệu quả chuyển đổi số nông nghiệp địa phương.</p>
                    </div>
                    <div className="trace-stat-grid">
                        {stats.map(([number, label]) => (
                            <div className="trace-stat" key={label}>
                                <strong>{number}</strong>
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>
                    <div className="trace-cta">
                        <h2>Sẵn sàng số hóa hồ sơ nông sản?</h2>
                        <p>Đăng ký để được hỗ trợ tạo mã QR, quản lý lô sản xuất và công bố thông tin truy xuất.</p>
                        <a href="#contact-order" className="trace-btn trace-btn-primary">Liên hệ triển khai</a>
                    </div>
                </div>
            </section>

            <section className="trace-section" id="products-list">
                <div className="trace-container">
                    <div className="trace-section-title">
                        <h2>Danh mục nông sản địa phương</h2>
                        <p>Chọn nhóm sản phẩm để xem danh sách đang có trong hệ thống.</p>
                    </div>
                    <ul className="trace-categories">
                        {productCategories.map(item => (
                            <li key={item}>
                                <button type="button" onClick={() => setCategory(item)}>
                                    {item}
                                    <span>Truy xuất</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {loading ? <Loader /> : (
                <Fragment>
                    <section id="products" className="container mt-5">
                        <h3 className="trace-list-heading">Sản phẩm trong hệ thống</h3>
                        <div className="row">
                            {keyword ? (
                                <Fragment>
                                    <div className="col-12 col-md-3 mt-5 mb-5">
                                        <div className="px-3 trace-filter">
                                            <h4 className="mb-5">Khoảng giá</h4>
                                            <Range
                                                marks={{
                                                    10000: '10.000',
                                                    1000000: '1.000.000'
                                                }}
                                                min={10}
                                                max={1000000}
                                                defaultValue={[1, 1000000]}
                                                tipFormatter={value => `${value}`}
                                                tipProps={{
                                                    placement: 'top',
                                                    visible: true
                                                }}
                                                value={price}
                                                onChange={value => setPrice(value)}
                                            />
                                            <hr className="my-5" />

                                            <h4 className="mb-3">Đánh giá</h4>
                                            <ul className="pl-0">
                                                {[5, 4, 3, 2, 1].map(star => (
                                                    <li
                                                        style={{ cursor: 'pointer', listStyleType: 'none' }}
                                                        key={star}
                                                        onClick={() => setRating(star)}
                                                    >
                                                        <div className="rating-outer">
                                                            <div className="rating-inner" style={{ width: `${star * 20}%` }}></div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="col-12 col-md-9">
                                        <div className="row">
                                            {products.map(product => (
                                                <Product key={product._id} product={product} col={4} />
                                            ))}
                                        </div>
                                    </div>
                                </Fragment>
                            ) : (
                                <Fragment>
                                    {products.map(product => (
                                        <Product key={product._id} product={product} col={3} />
                                    ))}
                                    {balancingProducts.map(product => (
                                        <StaticProductCard key={product._id} product={product} col={3} />
                                    ))}
                                </Fragment>
                            )}
                        </div>
                    </section>

                    {resPerPage <= count && (
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={resPerPage}
                                totalItemsCount={productsCount}
                                onChange={pageNumber => setCurrentPage(pageNumber)}
                                nextPageText={'Tiếp'}
                                prevPageText={'Trở về'}
                                firstPageText={'Đầu tiên'}
                                lastPageText={'Cuối cùng'}
                                itemClass="page-item"
                                linkClass="page-link"
                            />
                        </div>
                    )}
                </Fragment>
            )}

            <section className="trace-section trace-contact" id="contact-order">
                <div className="trace-container">
                    <div className="trace-section-title">
                        <h2>Liên hệ triển khai</h2>
                        <p>Gửi thông tin để được tư vấn giải pháp QRCode truy xuất nguồn gốc.</p>
                    </div>
                    <div className="trace-contact-grid">
                        <form className="trace-form">
                            <div className="trace-form-row">
                                <input type="text" placeholder="Họ và tên *" />
                                <input type="tel" placeholder="Số điện thoại *" />
                            </div>
                            <input type="email" placeholder="Email" />
                            <input type="text" placeholder="Đơn vị / hợp tác xã / nông hộ *" />
                            <select defaultValue="">
                                <option value="" disabled>Chọn nhu cầu triển khai</option>
                                <option>Tạo mã QR cho sản phẩm</option>
                                <option>Quản lý lô sản xuất</option>
                                <option>Số hóa hồ sơ hợp tác xã</option>
                                <option>Tư vấn chuyển đổi số</option>
                            </select>
                            <textarea rows="5" placeholder="Ghi chú thêm"></textarea>
                            <button type="button" className="trace-btn trace-btn-primary">Gửi yêu cầu</button>
                        </form>
                        <aside className="trace-contact-info">
                            <div>
                                <h3><i className="fa fa-map-marker-alt"></i> Khu vực triển khai</h3>
                                <p>Hỗ trợ nông hộ, hợp tác xã và cơ sở kinh doanh nông sản tại địa phương.</p>
                            </div>
                            <div>
                                <h3><i className="fa fa-phone"></i> Hotline hỗ trợ</h3>
                                <p>Hotline: 1900.xxxx<br />Email: truyxuat@nongsodia.local<br />Thời gian: 7:00 - 21:00 hằng ngày</p>
                            </div>
                            <div>
                                <h3><i className="fa fa-credit-card"></i> Dịch vụ</h3>
                                <p>Tạo mã QR, cập nhật hồ sơ sản phẩm, quản lý dữ liệu truy xuất và báo cáo lô hàng.</p>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            <div className="trace-floating">
                <a href="#products-list">SP</a>
                <a href="#contact-order">QR</a>
                <a href="#top" aria-label="Lên đầu trang">↑</a>
            </div>
        </Fragment>
    )
}

export default Home
