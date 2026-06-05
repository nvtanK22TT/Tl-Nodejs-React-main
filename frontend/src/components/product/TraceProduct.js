import React, { Fragment, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'

import Loader from '../layout/Loader'
import MetaData from '../layout/MetaData'

const TraceProduct = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        const fetchTraceProduct = async () => {
            try {
                if (!token) {
                    setError('Không tìm thấy mã truy xuất sản phẩm');
                    setLoading(false);
                    return;
                }

                const { data } = await axios.get(`/api/v1/trace-product?token=${encodeURIComponent(token)}`);

                setProduct(data.product);
            } catch (error) {
                setError(error.response?.data?.message || 'Không thể truy xuất thông tin sản phẩm');
            } finally {
                setLoading(false);
            }
        }

        fetchTraceProduct();
    }, [location.search])

    return (
        <Fragment>
            <MetaData title="Truy xuất nguồn gốc sản phẩm" />

            <div className="container my-5">
                <h1 className="mb-4">Truy xuất nguồn gốc sản phẩm</h1>

                {loading ? <Loader /> : error ? (
                    <div className="alert alert-danger">{error}</div>
                ) : product && (
                    <div className="row">
                        <div className="col-12 col-lg-5 mb-4">
                            {product.images && product.images[0] && (
                                <img className="img-fluid rounded" src={product.images[0].url} alt={product.name} />
                            )}
                        </div>

                        <div className="col-12 col-lg-7">
                            <div className="card p-4">
                                <h2 className="mb-3">{product.name}</h2>
                                <p className="mb-2"><strong>Xuất xứ:</strong> {product.seller}</p>
                                <p className="mb-2"><strong>Danh mục:</strong> {product.category}</p>
                                <p className="mb-2"><strong>Giá bán:</strong> {product.price?.toLocaleString()} VNĐ</p>
                                <p className="mb-2"><strong>Tình trạng:</strong> {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}</p>
                                <p className="mb-2"><strong>Mã truy xuất:</strong> {product.secureToken}</p>
                                <p className="mb-2"><strong>Ngày tạo thông tin:</strong> {new Date(product.createdAt).toLocaleDateString('vi-VN')}</p>

                                <hr />

                                <h4 className="mb-2">Thông tin mô tả</h4>
                                <p className="mb-0">{product.description}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Fragment>
    )
}

export default TraceProduct
