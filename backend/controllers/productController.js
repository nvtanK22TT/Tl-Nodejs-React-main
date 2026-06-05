const Product = require('../models/product')

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures')
const cloudinary = require('cloudinary')
const QRCode = require('qrcode')
const crypto = require('crypto')

const TRACE_PRODUCT_BASE_URL = 'https://qrnongsan.local/trace-product'

// Generate product QR Code   =>   /api/v1/product/qr-code
exports.generateProductQRCode = async (req, res, next) => {
    try {
        const { secureToken } = req.body;

        if (!secureToken) {
            return next(new ErrorHandler('secureToken là bắt buộc', 400));
        }

        const traceUrl = `${TRACE_PRODUCT_BASE_URL}?token=${encodeURIComponent(secureToken)}`;
        const qrCodeDataUrl = await QRCode.toDataURL(traceUrl);

        res.status(200).json({
            success: true,
            qrCodeDataUrl
        })
    } catch (error) {
        return next(new ErrorHandler('Không thể tạo mã QR cho sản phẩm', 500));
    }
}

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://tl-nodejs-react-main-a67s.vercel.app/'
const TRACE_PRODUCT_PATH = '/trace-product'

const buildTraceUrl = (secureToken) => {
    return `${FRONTEND_URL}${TRACE_PRODUCT_PATH}?token=${encodeURIComponent(secureToken)}`
}

// Generate product QR Code by product id   =>   /api/v1/product/qr-code
exports.generateProductQRCode = async (req, res, next) => {
    try {
        const { productId, secureToken } = req.body;

        let token = secureToken;
        let product = null;

        if (productId) {
            product = await Product.findById(productId);

            if (!product) {
                return next(new ErrorHandler('Khong tim thay san pham', 404));
            }

            if (!product.secureToken) {
                product.secureToken = crypto.randomBytes(16).toString('hex');
                await product.save({ validateBeforeSave: false });
            }

            token = product.secureToken;
        }

        if (!token) {
            return next(new ErrorHandler('productId hoac secureToken la bat buoc', 400));
        }

        const traceUrl = buildTraceUrl(token);
        const qrCodeDataUrl = await QRCode.toDataURL(traceUrl);

        res.status(200).json({
            success: true,
            traceUrl,
            qrCodeDataUrl,
            product
        })
    } catch (error) {
        return next(new ErrorHandler('Khong the tao ma QR cho san pham', 500));
    }
}

// Get trace product by secure token   =>   /api/v1/trace-product?token=...
exports.getTraceProduct = async (req, res, next) => {
    try {
        const { token } = req.query;

        if (!token) {
            return next(new ErrorHandler('token la bat buoc', 400));
        }

        const product = await Product.findOne({ secureToken: token });

        if (!product) {
            return next(new ErrorHandler('Khong tim thay thong tin truy xuat san pham', 404));
        }

        res.status(200).json({
            success: true,
            product
        })
    } catch (error) {
        return next(new ErrorHandler('Khong the truy xuat thong tin san pham', 500));
    }
}

// Create new product   =>   /api/v1/admin/product/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {

    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'products'
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    req.body.images = imagesLinks
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
})


// Get all products   =>   /api/v1/products?keyword=apple
exports.getProducts = catchAsyncErrors(async (req, res, next) => {

    const resPerPage = 12;
    const productsCount = await Product.countDocuments();

    const apiFeatures = new APIFeatures(Product.find(), req.query)
        .search()
        .filter()

    let products = await apiFeatures.query;
    let filteredProductsCount = products.length;

    apiFeatures.pagination(resPerPage)
    products = await apiFeatures.query;


    setTimeout(function () {
        res.status(200).json({
            success: true,
            productsCount,
            resPerPage,
            filteredProductsCount,
            products
        })
    }, 2000)


})

// Get all products (Admin)  =>   /api/v1/admin/products
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {

    const products = await Product.find();

    res.status(200).json({
        success: true,
        products
    })

})

// Get single product details   =>   /api/v1/product/:id
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler('Không tìm thấy sản phẩm', 404));
    }


    res.status(200).json({
        success: true,
        product
    })

})

// Update Product   =>   /api/v1/admin/product/:id
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {

    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler('Không tìm thấy sản phẩm', 404));
    }

    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    if (images !== undefined) {

        // Deleting images associated with the product
        for (let i = 0; i < product.images.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
        }

        let imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: 'products'
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }

        req.body.images = imagesLinks

    }



    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product
    })

})

// Delete Product   =>   /api/v1/admin/product/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler('Không tìm thấy sản phẩm', 404));
    }

    // Deleting images associated with the product
    for (let i = 0; i < product.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: 'Xóa sản phẩm thành công'
    })

})


// Create new review   =>   /api/v1/review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )

    if (isReviewed) {
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })

    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    })

})


// Get Product Reviews   =>   /api/v1/reviews
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    try {
        const product = await Product.findById(req.query.id);

        res.status(200).json({
            success: true,
            reviews: product.reviews
        })
    } catch (error) {
        res.status(200).json({
            message: 'Không tìm thấy review với id'
        })
    }
})

// Delete Product Review   =>   /api/v1/reviews
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.productId);

    console.log(product);

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());

    const numOfReviews = reviews.length;

    const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})
