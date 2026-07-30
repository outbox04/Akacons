export interface PaintCode {
  code: string;
  name: string;
  category: string;
  categoryId: string;
  hex: string;
  imagePath?: string;
}

export interface PaintCategory {
  id: string;
  name: string;
  prefix: string;
  swatch: string;
  count: number;
}

export const PAINT_CATEGORIES: PaintCategory[] = [
  { id: 'be-tong', name: 'Sơn Hiệu Ứng Bê Tông', prefix: 'XT', swatch: '#B7B0A2', count: 89 },
  { id: 'son-voi', name: 'Sơn Vôi (Lime Wash)', prefix: 'XV', swatch: '#E8E2D5', count: 96 },
  { id: 'gi-set', name: 'Sơn Hiệu Ứng Gỉ Sét', prefix: 'Xm', swatch: '#8C4A27', count: 16 },
  { id: 'ngoc-trai', name: 'Sơn Hiệu Ứng Ngọc Trai', prefix: 'MP', swatch: '#D8CFBC', count: 17 },
];

export const PAINT_CODES: PaintCode[] = [
  // 1. Sơn Hiệu Ứng Bê Tông (XT Series)
  { code: 'XT-01', name: 'Màu ghi xám mờ', category: 'Sơn Hiệu Ứng Bê Tông', categoryId: 'be-tong', hex: '#9E9A93', imagePath: '/Mã Sơn/2. SƠN H.Ư BÊ TÔNG/Màu ghi XT-01.png' },
  { code: 'XT-02', name: 'Màu ghi xi măng', category: 'Sơn Hiệu Ứng Bê Tông', categoryId: 'be-tong', hex: '#B2ADA4', imagePath: '/Mã Sơn/2. SƠN H.Ư BÊ TÔNG/Màu ghi XT-02.png' },
  { code: 'XT-03', name: 'Màu ghi đô thị', category: 'Sơn Hiệu Ứng Bê Tông', categoryId: 'be-tong', hex: '#87837C', imagePath: '/Mã Sơn/2. SƠN H.Ư BÊ TÔNG/Màu ghi XT-03.png' },
  { code: 'XT-101', name: 'Màu be cát nhạt', category: 'Sơn Hiệu Ứng Bê Tông', categoryId: 'be-tong', hex: '#D6CBBA', imagePath: '/Mã Sơn/2. SƠN H.Ư BÊ TÔNG/Màu be XT-101.png' },
  { code: 'XT-102', name: 'Màu be cát kem', category: 'Sơn Hiệu Ứng Bê Tông', categoryId: 'be-tong', hex: '#C9BCAB', imagePath: '/Mã Sơn/2. SƠN H.Ư BÊ TÔNG/Màu be XT-102.png' },
  { code: 'XT-103', name: 'Màu be trung tính', category: 'Sơn Hiệu Ứng Bê Tông', categoryId: 'be-tong', hex: '#B8AB98', imagePath: '/Mã Sơn/2. SƠN H.Ư BÊ TÔNG/Màu be XT-103.png' },
  { code: 'XT-201', name: 'Màu cam đất ấm', category: 'Sơn Hiệu Ứng Bê Tông', categoryId: 'be-tong', hex: '#C87B52', imagePath: '/Mã Sơn/2. SƠN H.Ư BÊ TÔNG/Màu cam XT-201.png' },
  { code: 'XT-202', name: 'Màu cam đất nung', category: 'Sơn Hiệu Ứng Bê Tông', categoryId: 'be-tong', hex: '#B56A41', imagePath: '/Mã Sơn/2. SƠN H.Ư BÊ TÔNG/Màu cam XT-202.png' },
  { code: 'XT-251', name: 'Màu hồng thạch anh', category: 'Sơn Hiệu Ứng Bê Tông', categoryId: 'be-tong', hex: '#D8A798', imagePath: '/Mã Sơn/2. SƠN H.Ư BÊ TÔNG/Màu hồng XT-251.png' },
  { code: 'XT-301', name: 'Màu nâu gỗ trầm', category: 'Sơn Hiệu Ứng Bê Tông', categoryId: 'be-tong', hex: '#7A5741', imagePath: '/Mã Sơn/2. SƠN H.Ư BÊ TÔNG/Màu nâu XT-301.jpg' },
  { code: 'XT-401', name: 'Màu tím khoáng sanh', category: 'Sơn Hiệu Ứng Bê Tông', categoryId: 'be-tong', hex: '#8B7382', imagePath: '/Mã Sơn/2. SƠN H.Ư BÊ TÔNG/Màu tím XT-401.png' },
  { code: 'XT-501', name: 'Màu xanh rêu phong', category: 'Sơn Hiệu Ứng Bê Tông', categoryId: 'be-tong', hex: '#5B6B4F', imagePath: '/Mã Sơn/2. SƠN H.Ư BÊ TÔNG/Màu xanh XT-501.jpg' },
  { code: 'XT-550', name: 'Màu xanh nước đại dương', category: 'Sơn Hiệu Ứng Bê Tông', categoryId: 'be-tong', hex: '#46586B', imagePath: '/Mã Sơn/2. SƠN H.Ư BÊ TÔNG/Màu xanh nước  XT-550.jpg' },

  // 2. Sơn Vôi (XV Series)
  { code: 'XV-01', name: 'Màu vôi trắng kem', category: 'Sơn Vôi', categoryId: 'son-voi', hex: '#EBE5D8', imagePath: '/Mã Sơn/3. SƠN VÔI/Màu be XV-01.jpg' },
  { code: 'XV-02', name: 'Màu vôi be sáng', category: 'Sơn Vôi', categoryId: 'son-voi', hex: '#DFD7C7', imagePath: '/Mã Sơn/3. SƠN VÔI/Màu be XV-02.jpg' },
  { code: 'XV-03', name: 'Màu vôi be nhã', category: 'Sơn Vôi', categoryId: 'son-voi', hex: '#D2C8B5', imagePath: '/Mã Sơn/3. SƠN VÔI/Màu be XV-03.jpg' },
  { code: 'XV-100', name: 'Màu vôi cam nung', category: 'Sơn Vôi', categoryId: 'son-voi', hex: '#C67E58', imagePath: '/Mã Sơn/3. SƠN VÔI/Màu cam XV-100.jpg' },
  { code: 'XV-120', name: 'Màu vôi nâu rustic', category: 'Sơn Vôi', categoryId: 'son-voi', hex: '#84624D', imagePath: '/Mã Sơn/3. SƠN VÔI/Màu nâu XV-120.jpg' },
  { code: 'XV-150', name: 'Màu vôi xanh ô liu', category: 'Sơn Vôi', categoryId: 'son-voi', hex: '#6C7A5C', imagePath: '/Mã Sơn/3. SƠN VÔI/Màu xanh XV-150.jpg' },
  { code: 'XV-180', name: 'Màu vôi xanh gốm cổ', category: 'Sơn Vôi', categoryId: 'son-voi', hex: '#546675', imagePath: '/Mã Sơn/3. SƠN VÔI/Màu xanh nước XV-180.jpg' },

  // 3. Sơn Hiệu Ứng Gỉ Sét (Xm Series)
  { code: 'Xm-01', name: 'Màu gỉ sét đồng đỏ', category: 'Sơn Hiệu Ứng Gỉ Sét', categoryId: 'gi-set', hex: '#A64B2A', imagePath: '/Mã Sơn/5. SƠN H.Ư GỈ SÉT/Xm-01.png' },
  { code: 'Xm-02', name: 'Màu gỉ sét sắt nhám', category: 'Sơn Hiệu Ứng Gỉ Sét', categoryId: 'gi-set', hex: '#8F3D1F', imagePath: '/Mã Sơn/5. SƠN H.Ư GỈ SÉT/Xm-02.png' },
  { code: 'Xm-03', name: 'Màu gỉ sét oxy hóa nhẹ', category: 'Sơn Hiệu Ứng Gỉ Sét', categoryId: 'gi-set', hex: '#B85832', imagePath: '/Mã Sơn/5. SƠN H.Ư GỈ SÉT/Xm-03.png' },
  { code: 'Xm-04', name: 'Màu gỉ sét đồng cổ vintage', category: 'Sơn Hiệu Ứng Gỉ Sét', categoryId: 'gi-set', hex: '#7A3219', imagePath: '/Mã Sơn/5. SƠN H.Ư GỈ SÉT/Xm-04.png' },

  // 4. Sơn Hiệu Ứng Ngọc Trai (MP Series)
  { code: 'MP-01', name: 'Màu ngọc trai champagne', category: 'Sơn Hiệu Ứng Ngọc Trai', categoryId: 'ngoc-trai', hex: '#E2D7C4', imagePath: '/Mã Sơn/6. SƠN H.Ư NGỌC TRAI/MP-01.webp' },
  { code: 'MP-02', name: 'Màu ngọc trai ánh bạc', category: 'Sơn Hiệu Ứng Ngọc Trai', categoryId: 'ngoc-trai', hex: '#D1CDC4', imagePath: '/Mã Sơn/6. SƠN H.Ư NGỌC TRAI/MP-02.webp' },
  { code: 'MP-03', name: 'Màu ngọc trai vàng hồng', category: 'Sơn Hiệu Ứng Ngọc Trai', categoryId: 'ngoc-trai', hex: '#D8C3B4', imagePath: '/Mã Sơn/6. SƠN H.Ư NGỌC TRAI/MP-03.webp' },
  { code: 'MP-04', name: 'Màu ngọc trai lụa satin', category: 'Sơn Hiệu Ứng Ngọc Trai', categoryId: 'ngoc-trai', hex: '#C9BEAD', imagePath: '/Mã Sơn/6. SƠN H.Ư NGỌC TRAI/MP-04.webp' },
];
