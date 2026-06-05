import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'
import axios from 'axios'

import MetaData from '../layout/MetaData'
import Loader from '../layout/Loader'
import Sidebar from './Sidebar'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { getAdminProducts, deleteProduct, clearErrors } from '../../actions/productActions'
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants'

const ProductsList = ({ history }) => {

    const alert = useAlert();
    const dispatch = useDispatch();
    const [qrLoading, setQrLoading] = useState(false);
    const [qrInfo, setQrInfo] = useState(null);

    const { loading, error, products } = useSelector(state => state.products);
    const { error: deleteError, isDeleted } = useSelector(state => state.product)

    useEffect(() => {
        dispatch(getAdminProducts());

        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors())
        }

        if (isDeleted) {
            alert.success('Product deleted successfully');
            history.push('/admin/products');
            dispatch({ type: DELETE_PRODUCT_RESET })
        }

    }, [dispatch, alert, error, deleteError, isDeleted, history])

    const setProducts = () => {
        const data = {
            columns: [
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Tên sản phẩm',
                    field: 'name',
                    sort: 'asc'
                },
                {
                    label: 'Giá',
                    field: 'price',
                    sort: 'asc'
                },
                {
                    label: 'Số lượng còn lại',
                    field: 'stock',
                    sort: 'asc'
                },
                {
                    label: 'Hành động',
                    field: 'actions',
                },
            ],
            rows: []
        }

        products.forEach(product => {
            data.rows.push({
                id: product._id,
                name: product.name,
                price: `${(product.price).toLocaleString()} VNĐ`,
                stock: product.stock,
                actions: <Fragment>
                    <Link to={`/admin/product/${product._id}`} className="btn btn-primary py-1 px-2">
                        <i className="fa fa-pencil"></i>
                    </Link>
                    <button className="btn btn-danger py-1 px-2 ml-2" data-toggle="modal" data-target="#exampleModal" >
                        <i className="fa fa-trash"></i>
                    </button>
                    <button className="btn btn-success py-1 px-2 ml-2" onClick={() => generateQRCodeHandler(product._id)}>
                        <i className="fa fa-qrcode"></i>
                    </button>
                    {/* model delete */}
                    <div>
                        <div className="modal fade" id="exampleModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Thông báo!</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">×</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                        Bạn có muốn xóa không
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Hủy</button>
                                        <button type="button" className="btn btn-danger" onClick={() => deleteProductHandler(product._id)} data-dismiss="modal">Xóa</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>
            })
        })

        return data;
    }

    const deleteProductHandler = (id) => {
        dispatch(deleteProduct(id))
    }

    const generateQRCodeHandler = async (productId) => {
        try {
            setQrLoading(true);

            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            const { data } = await axios.post('/api/v1/product/qr-code', { productId }, config);
            setQrInfo(data);
        } catch (error) {
            alert.error(error.response?.data?.message || 'Không thể tạo mã QR');
        } finally {
            setQrLoading(false);
        }
    }

    return (
        <Fragment>
            <MetaData title={'Tất cả sản phẩm'} />

            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        <h1 className="my-5">Tất cả sản phẩm</h1>
                        <Link to='/admin/product'><button type="button" className="btn btn-primary">Thêm sản phẩm mới</button></Link>

                        {(qrLoading || qrInfo) && (
                            <div className="card my-4 p-3">
                                <h5 className="mb-3">Mã QR truy xuất nguồn gốc</h5>
                                {qrLoading ? <Loader /> : (
                                    <div className="row align-items-center">
                                        <div className="col-12 col-md-4 text-center">
                                            <img src={qrInfo.qrCodeDataUrl} alt="QR truy xuất nguồn gốc" style={{ maxWidth: '220px', width: '100%' }} />
                                        </div>
                                        <div className="col-12 col-md-8">
                                            <p className="mb-2">Sản phẩm: <strong>{qrInfo.product?.name}</strong></p>
                                            <p className="mb-2">Xuất xứ: <strong>{qrInfo.product?.seller}</strong></p>
                                            <a href={qrInfo.traceUrl} target="_blank" rel="noopener noreferrer">{qrInfo.traceUrl}</a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {loading ? <Loader /> : (
                            <MDBDataTable
                                data={setProducts()}
                                className="px-3"
                                bordered
                                striped
                                hover
                            />
                        )}

                    </Fragment>
                </div>
            </div>

        </Fragment>
    )
}

export default ProductsList
