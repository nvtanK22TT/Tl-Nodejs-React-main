const Product = require('../models/product');
const User = require('../models/user');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database');

const products = require('../data/products');

// Setting dotenv file
dotenv.config({ path: 'backend/config/config.env' })

connectDatabase();

// Helper: map a generic category to one of the enum values used by the Product model
const mapCategory = (cat) => {
    if (!cat) return 'Bố thắng';
    const lower = cat.toLowerCase();
    if (lower.includes('oil') || lower.includes('nhớt') || lower.includes(' nhớt')) return 'Nhớt';
    if (lower.includes('filter') || lower.includes('lọc')) return 'Lọc Gió';
    if (lower.includes('elect') || lower.includes('electronics')) return 'Bố thắng';
    if (lower.includes('curoa') || lower.includes('dây')) return 'Dây Curoa';
    if (lower.includes('headphone') || lower.includes('headphones')) return 'Bố thắng';
    if (lower.includes('camera') || lower.includes('macbook') || lower.includes('laptop')) return 'Bố thắng';
    return 'Bố thắng';
}

const seedProducts = async () => {
    try {

        // remove existing products
        await Product.deleteMany();
        console.log('Products are deleted');

        // ensure an admin user exists to satisfy Product.user required field
        let admin = await User.findOne({ email: 'admin@example.com' });
        if (!admin) {
            admin = await User.create({
                name: 'Admin',
                email: 'admin@example.com',
                password: '123456',
                avatar: {
                    public_id: 'default/admin',
                    url: 'https://res.cloudinary.com/bookit/image/upload/v1606231282/products/default_avatar.jpg'
                },
                role: 'admin'
            });
            console.log('Admin user created');
        } else {
            console.log('Admin user exists');
        }

        // attach admin user id and map categories
        const productsWithUser = products.map(p => {
            // ensure numeric price
            const price = parseFloat(p.price) || 0;
            const category = mapCategory(p.category);
            return {
                ...p,
                price,
                category,
                user: admin._id
            }
        })

        await Product.insertMany(productsWithUser)
        console.log('All Products are added.')

        process.exit();

    } catch (error) {
        console.log(error.message);
        process.exit();
    }
}

seedProducts()