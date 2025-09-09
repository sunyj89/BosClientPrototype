import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Checkbox,
  message,
  Row,
  Col,
  Space
} from 'antd';
import {
  SearchOutlined,
  SaveOutlined,
  DollarOutlined
} from '@ant-design/icons';
import PriceManagementModal from './PriceManagementModal';

const { Option } = Select;

const ProcurementCatalog = () => {
  const [loading, setLoading] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [productFilter, setProductFilter] = useState('');
  const [dataSource, setDataSource] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [associatedProducts, setAssociatedProducts] = useState(new Set());
  const [supplierCodes, setSupplierCodes] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [priceModalVisible, setPriceModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // 模拟供应商数据
  const suppliers = [
    { id: 'UNI001', name: '统一企业中国投资有限公司' },
    { id: 'KMF001', name: '康师傅控股有限公司' },
    { id: 'WHG001', name: '旺旺集团' },
    { id: 'NES001', name: '雀巢（中国）有限公司' },
    { id: 'PGC001', name: '宝洁（中国）有限公司' }
  ];

  // 模拟商品主数据
  const allProducts = [
    {
      id: 'SKU001',
      ourSku: 'SKU001001',
      productName: '统一冰红茶500ml',
      category: '饮料',
      brand: '统一'
    },
    {
      id: 'SKU002',
      ourSku: 'SKU001002', 
      productName: '康师傅红烧牛肉面',
      category: '方便面',
      brand: '康师傅'
    },
    {
      id: 'SKU003',
      ourSku: 'SKU001003',
      productName: '旺旺雪饼84g',
      category: '休闲食品',
      brand: '旺旺'
    },
    {
      id: 'SKU004',
      ourSku: 'SKU001004',
      productName: '雀巢咖啡原味',
      category: '咖啡',
      brand: '雀巢'
    },
    {
      id: 'SKU005',
      ourSku: 'SKU001005',
      productName: '飘柔洗发水400ml',
      category: '洗护用品',
      brand: '飘柔'
    },
    {
      id: 'SKU006',
      ourSku: 'SKU001006',
      productName: '统一绿茶500ml',
      category: '饮料', 
      brand: '统一'
    },
    {
      id: 'SKU007',
      ourSku: 'SKU001007',
      productName: '康师傅冰红茶500ml',
      category: '饮料',
      brand: '康师傅'
    },
    {
      id: 'SKU008',
      ourSku: 'SKU001008',
      productName: '旺旺仙贝',
      category: '休闲食品',
      brand: '旺旺'
    }
  ];

  // 模拟已有关联数据
  const existingAssociations = {
    'UNI001': {
      'SKU001': { supplierCode: 'UNI-ICE-TEA-500' },
      'SKU006': { supplierCode: 'UNI-GREEN-TEA-500' }
    },
    'KMF001': {
      'SKU002': { supplierCode: 'KMF-BEEF-NOODLE' },
      'SKU007': { supplierCode: 'KMF-ICE-TEA-500' }
    },
    'WHG001': {
      'SKU003': { supplierCode: 'WW-SNOW-CAKE-84' },
      'SKU008': { supplierCode: 'WW-RICE-CRACKER' }
    }
  };

  useEffect(() => {
    setOriginalData(allProducts);
    setDataSource(allProducts);
  }, []);

  // 供应商选择处理
  const handleSupplierChange = (supplierId) => {
    setSelectedSupplier(supplierId);
    setHasChanges(false);
    
    // 加载该供应商的已有关联数据
    const existingData = existingAssociations[supplierId] || {};
    const associatedProductIds = new Set(Object.keys(existingData));
    const codes = {};
    
    Object.keys(existingData).forEach(productId => {
      codes[productId] = existingData[productId].supplierCode;
    });
    
    setAssociatedProducts(associatedProductIds);
    setSupplierCodes(codes);
  };

  // 商品筛选处理
  const handleProductFilter = (value) => {
    setProductFilter(value);
    if (!value.trim()) {
      setDataSource(originalData);
    } else {
      const filtered = originalData.filter(product => 
        product.productName.toLowerCase().includes(value.toLowerCase()) ||
        product.ourSku.toLowerCase().includes(value.toLowerCase()) ||
        product.brand.toLowerCase().includes(value.toLowerCase())
      );
      setDataSource(filtered);
    }
  };

  // 关联复选框变化处理
  const handleAssociationChange = (productId, checked) => {
    const newAssociated = new Set(associatedProducts);
    
    if (checked) {
      newAssociated.add(productId);
    } else {
      newAssociated.delete(productId);
      // 取消关联时保留编码，方便用户误操作后恢复
    }
    
    setAssociatedProducts(newAssociated);
    setHasChanges(true);
  };

  // 供应商商品编码变化处理
  const handleSupplierCodeChange = (productId, value) => {
    setSupplierCodes({
      ...supplierCodes,
      [productId]: value
    });
    setHasChanges(true);
  };

  // 保存更改
  const handleSave = () => {
    if (!selectedSupplier) {
      message.error('请先选择供应商');
      return;
    }

    setLoading(true);
    
    // 构建要保存的数据
    const saveData = {
      supplierId: selectedSupplier,
      associations: Array.from(associatedProducts).map(productId => ({
        productId,
        supplierCode: supplierCodes[productId] || ''
      }))
    };
    
    // 模拟API调用
    setTimeout(() => {
      console.log('保存数据:', saveData);
      message.success(`已成功保存 ${saveData.associations.length} 个商品的关联关系`);
      setHasChanges(false);
      setLoading(false);
    }, 1000);
  };

  // 管理价格按钮处理
  const handleManagePrice = (productId) => {
    const product = dataSource.find(p => p.id === productId);
    const supplier = suppliers.find(s => s.id === selectedSupplier);
    
    if (product && supplier) {
      setCurrentProduct(product);
      setPriceModalVisible(true);
    }
  };

  const columns = [
    {
      title: '关联',
      key: 'associate',
      width: 80,
      fixed: 'left',
      render: (_, record) => (
        <Checkbox
          checked={associatedProducts.has(record.id)}
          onChange={(e) => handleAssociationChange(record.id, e.target.checked)}
          disabled={!selectedSupplier}
        />
      )
    },
    {
      title: '我方SKU',
      dataIndex: 'ourSku',
      key: 'ourSku',
      width: 120,
      render: (text) => (
        <span style={{ fontFamily: 'monospace', fontWeight: 500 }}>{text}</span>
      )
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      key: 'productName',
      width: 200,
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.brand} | {record.category}
          </div>
        </div>
      )
    },
    {
      title: '供应商商品编码',
      key: 'supplierCode',
      width: 200,
      render: (_, record) => {
        const isAssociated = associatedProducts.has(record.id);
        return (
          <Input
            placeholder="请输入供应商商品编码"
            value={supplierCodes[record.id] || ''}
            onChange={(e) => handleSupplierCodeChange(record.id, e.target.value)}
            disabled={!isAssociated || !selectedSupplier}
            style={{ 
              backgroundColor: isAssociated ? '#fff' : '#f5f5f5'
            }}
          />
        );
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => {
        const isAssociated = associatedProducts.has(record.id);
        return (
          <Button
            type="primary"
            size="small"
            icon={<DollarOutlined />}
            disabled={!isAssociated || !selectedSupplier}
            onClick={() => handleManagePrice(record.id)}
            style={{ borderRadius: '2px' }}
          >
            管理价格
          </Button>
        );
      }
    }
  ];

  return (
    <div>
      {/* 控制栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={6}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>当前供应商：</span>
              <Select
                placeholder="请选择供应商"
                style={{ width: '100%' }}
                value={selectedSupplier}
                onChange={handleSupplierChange}
                allowClear
              >
                {suppliers.map(supplier => (
                  <Option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col span={8}>
            <Input
              placeholder="按商品名称或SKU搜索..."
              prefix={<SearchOutlined />}
              value={productFilter}
              onChange={(e) => handleProductFilter(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={10} style={{ textAlign: 'right' }}>
            <Space>
              {hasChanges && (
                <span style={{ color: '#faad14', fontSize: '12px' }}>
                  有未保存的更改
                </span>
              )}
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSave}
                loading={loading}
                disabled={!selectedSupplier || !hasChanges}
                style={{ borderRadius: '2px' }}
              >
                💾 保存更改
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 商品数据表格 */}
      <Card>
        {!selectedSupplier ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 0', 
            color: '#999',
            fontSize: '16px'
          }}>
            请先在上方选择一个供应商，然后在下方表格中管理该供应商的商品目录
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={dataSource}
            rowKey="id"
            loading={loading}
            scroll={{ x: 800 }}
            pagination={{
              defaultPageSize: 15,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => {
                const associatedCount = Array.from(associatedProducts).filter(id => 
                  dataSource.some(item => item.id === id)
                ).length;
                return `第 ${range[0]}-${range[1]} 条/共 ${total} 条，已关联 ${associatedCount} 个商品`;
              }
            }}
            rowClassName={(record) => 
              associatedProducts.has(record.id) ? 'associated-row' : ''
            }
          />
        )}
      </Card>
      
      {/* 自定义样式 */}
      <style jsx>{`
        :global(.associated-row) {
          background-color: #f6ffed !important;
        }
        :global(.associated-row:hover) {
          background-color: #f6ffed !important;
        }
      `}</style>
      
      {/* 价格管理弹窗 */}
      <PriceManagementModal
        visible={priceModalVisible}
        onCancel={() => setPriceModalVisible(false)}
        productInfo={currentProduct}
        supplierInfo={suppliers.find(s => s.id === selectedSupplier)}
      />
    </div>
  );
};

export default ProcurementCatalog;