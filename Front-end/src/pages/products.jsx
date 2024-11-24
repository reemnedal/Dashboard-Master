import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function AddProduct() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 2;

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products');
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:3000/api/products/${productId}`);
      Swal.fire('Deleted!', 'Product deleted successfully!', 'success');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      Swal.fire('Error!', 'Failed to delete product.', 'error');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleAddProductClick = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filterProducts = () => {
    let updatedProducts = products;

    if (searchTerm) {
      updatedProducts = updatedProducts.filter(product =>
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      updatedProducts = updatedProducts.filter(product =>
        product.category === selectedCategory
      );
    }

    setFilteredProducts(updatedProducts);
    setCurrentPage(1); // Reset to the first page when filtering
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, products]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#704e81]">Products</h2>
        <button
          onClick={handleAddProductClick}
          className="bg-[#704e81] hover:bg-[#5d4069] text-white px-4 py-2 rounded-lg"
        >
          Add Product
        </button>
      </div>

      {showModal && (
        <ProductForm 
          product={editingProduct} 
          onClose={() => setShowModal(false)} 
          onSuccess={fetchProducts} 
        />
      )}

      <input 
        type="text" 
        placeholder="Search by name" 
        value={searchTerm} 
        onChange={handleSearchChange} 
        className="mt-4 p-2 border border-gray-300 rounded"
      />
      
      <select 
        value={selectedCategory} 
        onChange={handleCategoryChange} 
        className="mt-4 p-2 border border-gray-300 rounded"
      >
        <option value="">All Categories</option>
        <option value="camera">Cameras</option>
        <option value="lens">Lenses</option>
        <option value="lighting">Lighting</option>
        <option value="camera bag">Camera Bags</option>
        <option value="memory card">Memory Cards</option>
        <option value="others">Others</option>
      </select>

      <h2 className="text-2xl font-bold text-[#704e81] mt-6">Product List</h2>
      <ul className="mt-4">
        {paginatedProducts.map((product) => (
          <li key={product.product_id} className="border p-4 mb-2 flex justify-between items-center">
            <div>
              <h3 className="font-bold">{product.product_name}</h3>
              <p>Price: ${product.price}</p>
              <p>Stock: {product.stock}</p>
              <p>Category: {product.category}</p>
              <p>Description: {product.description}</p>
              <img src={product.image_url} alt={product.product_name} className="w-20 h-20 object-cover" />
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(product)}
                className="bg-[#704e81] hover:bg-[#5d4069] text-white px-4 py-2 rounded-lg"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.product_id)}
                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-between mt-4">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-[#704e81] hover:bg-[#5d4069] text-white px-4 py-2 rounded-lg"
        >
          Previous
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="bg-[#704e81] hover:bg-[#5d4069] text-white px-4 py-2 rounded-lg"
        >
          Next
        </button>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

    </div>
  );
}

function ProductForm({ product, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    product_name: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    image_url: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        product_name: product.product_name,
        price: product.price,
        stock: product.stock,
        category: product.category,
        description: product.description,
        image_url: product.image_url
      });
    } else {
      setFormData({
        product_name: '',
        price: '',
        stock: '',
        category: '',
        description: '',
        image_url: ''
      });
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (product) {
        await axios.put(`http://localhost:3000/api/products/${product.product_id}`, formData);
        Swal.fire('Updated!', 'Product updated successfully!', 'success');
      } else {
        await axios.post('http://localhost:3000/api/Addproducts', formData);
        Swal.fire('Added!', 'Product added successfully!', 'success');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      Swal.fire('Error!', 'Failed to save product.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-[#704e81] mb-4">
          {product ? 'Edit Product' : 'Add Product'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="product_name"
            placeholder="Product Name"
            value={formData.product_name}
            onChange={handleChange}
            className="input-field"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="input-field"
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            className="input-field"
          />
          <input
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="input-field"
          />
          <input
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="input-field"
          />
          <input
            name="image_url"
            placeholder="Image URL"
            value={formData.image_url}
            onChange={handleChange}
            className="input-field"
          />
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg">
              Cancel
            </button>
            <button type="submit" className="bg-[#704e81] hover:bg-[#5d4069] text-white px-4 py-2 rounded-lg">
              {product ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
      
    </div>
  );
}

export default AddProduct;
