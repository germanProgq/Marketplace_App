import React, { useState, useCallback } from 'react';
import axios from 'axios';
import {useUser} from '../../Layout/assets/usercontext'
import { useDropzone } from 'react-dropzone';
import Loader from '../../../assets/Loaders/loaders';

import './addToCatalog.css';

const AddCatalogItem = () => {
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [itemImages, setItemImages] = useState([]); // Multiple image files
  const [itemLinks, setItemLinks] = useState(''); // Multiple image URLs
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const token = user?.token;
  const userRole = user?.role;
  const API = process.env.API || 'http://localhost:4000';

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length + itemImages.length + itemLinks.split(/[\n,;]+/).length > 10) {
      setError('Maximum of 10 items (images and links) are allowed');
      return;
    }
    setItemImages(prev => [...prev, ...acceptedFiles]);
  }, [itemImages, itemLinks]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const calculatePriority = (role) => {
    if (role === 'owner') {
      return 'sponsor(2)';
    } else if (role === 'sponsor(2)') {
      return 'sponsor(1)';
    } else if (role === 'sponsor(1)') {
      return 'ad';
    } else if (role === 'seller') {
      return 'default';
    }
    return 'default';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const imageUrls = itemLinks.split(/[\n,;]+/).map(url => url.trim()).filter(url => url);

    if (imageUrls.length + itemImages.length > 10) {
      setError('Maximum of 10 items (images and links) are allowed');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('ItemName', itemName);
    formData.append('ItemDescription', itemDescription);
    formData.append('ItemPrice', itemPrice);
    formData.append('CategoryName', categoryName);
    formData.append('Priority', calculatePriority(userRole));
    itemImages.forEach(image => formData.append('ItemImages', image));
    formData.append('ItemLinks', JSON.stringify(imageUrls));

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    };

    try {
      const response = await axios.post(`${API}/catalog/add`, formData, config);
      if (response.status === 201) {
        setSuccess(response.data.message);
        setItemName('');
        setItemDescription('');
        setItemPrice('');
        setCategoryName('');
        setItemImages([]);
        setItemLinks('');
      } else {
        setError('Unexpected response status');
      }
    } catch (err) {
      console.error("Error adding catalog item:", err);
      setError('An error occurred while adding the item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-catalog-item">
      <h2 style={{ fontSize: '40px', textAlign: 'center' }}>Add New Catalog Item</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10vh' }} className='addToCatalogForm'>
        <input
          type="text"
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          required
        />
        <textarea
          placeholder="Item Description"
          value={itemDescription}
          onChange={(e) => setItemDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Item Price"
          value={itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          required
        />
        <textarea
          placeholder="Item Image URLs (separated by newlines, commas, or semicolons)"
          value={itemLinks}
          onChange={(e) => setItemLinks(e.target.value)}
        />
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
        <button type="submit">Add Item</button>
      </form>
      {loading && <Loader />}
    </div>
  );
};

export default AddCatalogItem;
