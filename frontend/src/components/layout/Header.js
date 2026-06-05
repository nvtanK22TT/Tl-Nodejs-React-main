import React, { Fragment } from 'react'
import { Route, Link } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { logout } from '../../actions/userActions'

import Search from './Search'

import '../../App.css'

const Header = () => {
    const alert = useAlert()
    const dispatch = useDispatch()

    const { user, loading } = useSelector(state => state.auth)
    const { cartItems } = useSelector(state => state.cart)

    const logoutHandler = () => {
        dispatch(logout())
        alert.success('Đăng xuất thành công')
    }

    return (
        <Fragment>
            <nav className="navbar row trace-navbar" id="top">
                <div className="col-12 col-lg-3">
                    <div className="navbar-brand trace-brand d-flex align-items-center">
                        <Link to="/" className="d-flex align-items-center" style={{ textDecoration: 'none' }}>
                            <div className="trace-logo-mark">
                                <i className="fa fa-qrcode"></i>
                            </div>
                            <div className="trace-brand-text">
                                <strong>QR Nông Sản</strong>
                                <span>Truy xuất nguồn gốc địa phương</span>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="col-12 col-lg-4 mt-2 mt-lg-0">
                    <Route render={({ history }) => <Search history={history} />} />
                </div>

                <div className="col-12 col-lg-5 mt-3 mt-lg-0 trace-nav-actions">
                    <div className="trace-nav-links">
                        <Link to="/">Trang chủ</Link>
                        <a href="/#featured-products">Sản phẩm</a>
                        <a href="/#about-system">Về chúng tôi</a>
                        <a href="/#digital-news">Tin tức</a>
                        <a href="/#contact-order">Liên hệ</a>
                    </div>

                    {user && user.role === 'admin' ? (
                        <p></p>
                    ) : (
                        <Link to="/cart" style={{ textDecoration: 'none' }} >
                            <span id="cart" className="ml-3">Giỏ hàng</span>
                            <span className="ml-1" id="cart_count"><i className="bi bi-cart4"></i>{cartItems.length}</span>
                        </Link>
                    )}

                    {user ? (
                        <div className="ml-4 dropdown d-inline">
                            <Link to="#!" className="btn dropdown-toggle mr-4 trace-user-menu" type="button" id="dropDownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <figure className="avatar avatar-nav">
                                    <img
                                        src={user.avatar && user.avatar.url}
                                        alt={user && user.name}
                                        className="rounded-circle"
                                    />
                                </figure>
                                <span>{user && user.name}</span>
                            </Link>

                            <div className="dropdown-menu" aria-labelledby="dropDownMenuButton">
                                {user && user.role === 'admin' && (
                                    <Link className="dropdown-item" to="/dashboard">Trang quản trị</Link>
                                )}
                                {user && user.role !== 'admin' && (
                                    <Link className="dropdown-item" to="/orders/me">Đơn đặt hàng</Link>
                                )}

                                <Link className="dropdown-item" to="/me">Thông tin cá nhân</Link>
                                <Link className="dropdown-item text-danger" to="/" onClick={logoutHandler}>
                                    Đăng xuất
                                </Link>
                            </div>
                        </div>
                    ) : !loading && <Link to="/login" className="btn ml-4" id="login_btn">Đăng nhập</Link>}
                </div>
            </nav>
        </Fragment>
    )
}

export default Header
