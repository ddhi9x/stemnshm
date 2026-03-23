import React from 'react';
import { Link } from 'react-router-dom';
const NotFound = () => (
  <div className="container py-20 text-center">
    <h1>404</h1>
    <p>Trang bạn tìm kiếm không tồn tại.</p>
    <Link to="/" className="btn btn-primary" style={{marginTop: '1rem'}}>Về Trang Chủ</Link>
  </div>
);
export default NotFound;
