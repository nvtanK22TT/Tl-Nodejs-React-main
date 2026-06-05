export const productCategories = [
    'Rau củ địa phương',
    'Trái cây OCOP',
    'Gạo và ngũ cốc',
    'Nông sản chế biến',
    'Thủy sản',
    'Chăn nuôi',
    'Vật tư nông nghiệp',
    'Sản phẩm VietGAP'
]

export const legacyCategoryMap = {
    'Rau củ': 'Rau củ địa phương',
    'Trái cây': 'Trái cây OCOP',
    'Hạt giống': 'Vật tư nông nghiệp',
    'Phân bón': 'Vật tư nông nghiệp',
    'Dụng cụ nông nghiệp': 'Vật tư nông nghiệp'
}

export const normalizeProductCategory = (category) => legacyCategoryMap[category] || category
