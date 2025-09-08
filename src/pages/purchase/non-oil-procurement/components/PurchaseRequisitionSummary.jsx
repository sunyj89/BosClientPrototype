import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  DatePicker,
  Space,
  message,
  Row,
  Col,
  Form,
  Modal,
  Descriptions,
  Input,
  TreeSelect,
  Select,
  Tag,
  Spin
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  PlusOutlined
} from '@ant-design/icons';

// 导入数据
import purchaseRequisitionSummaryData from '../../../../mock/purchase/purchaseRequisitionSummary.json';
import purchaseRequisitionJsonData from '../../../../mock/purchase/purchaseRequisition.json';
import stationData from '../../../../mock/station/stationData.json';

const { RangePicker } = DatePicker;

const PurchaseRequisitionSummary = () => {
  const [searchForm] = Form.useForm();
  const [createForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [purchaseRequisitionData, setPurchaseRequisitionData] = useState([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [stationTreeData, setStationTreeData] = useState([]);
  const [availableRequisitions, setAvailableRequisitions] = useState([]);
  const [selectedRequisitions, setSelectedRequisitions] = useState([]);

  // 从 Mock 数据加载采购申请汇总数据
  const mockPurchaseRequisitionData = purchaseRequisitionSummaryData.purchaseRequisitionSummary;
  
  // 从 Mock 数据加载已审批的采购申请数据
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mockApprovedRequisitions = React.useMemo(() => {
    console.log('原始采购申请数据:', purchaseRequisitionJsonData);
    const approvedData = purchaseRequisitionJsonData?.purchaseRequisitions?.filter(
      req => req.status === 'approved'
    ) || [];
    console.log('已审批的申请数据:', approvedData);
    return approvedData;
  }, []
  );

  // 构建组织架构树数据
  const buildStationTreeData = () => {
    const { branches, serviceAreas, stations } = stationData;
    
    const tree = [{
      title: '江西交投化石能源公司',
      value: 'ROOT',
      key: 'ROOT',
      children: []
    }];
    
    branches.forEach(branch => {
      const branchNode = {
        title: branch.name,
        value: branch.id,
        key: branch.id,
        children: []
      };
      
      // 添加该分公司下的服务区
      const branchServiceAreas = serviceAreas.filter(sa => sa.branchId === branch.id);
      branchServiceAreas.forEach(serviceArea => {
        const serviceAreaNode = {
          title: serviceArea.name,
          value: serviceArea.id,
          key: serviceArea.id,
          children: []
        };
        
        // 添加该服务区下的加油站
        const serviceAreaStations = stations.filter(station => station.serviceAreaId === serviceArea.id);
        serviceAreaStations.forEach(station => {
          serviceAreaNode.children.push({
            title: station.name,
            value: station.id,
            key: station.id,
            isLeaf: true
          });
        });
        
        branchNode.children.push(serviceAreaNode);
      });
      
      tree[0].children.push(branchNode);
    });
    
    return tree;
  };

  // 初始化组织架构树数据
  useEffect(() => {
    const treeData = buildStationTreeData();
    setStationTreeData(treeData);
    setAvailableRequisitions(mockApprovedRequisitions);
  }, [mockApprovedRequisitions]);

  // 加载数据
  const loadData = React.useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setPurchaseRequisitionData(mockPurchaseRequisitionData);
      setLoading(false);
    }, 500);
  }, [mockPurchaseRequisitionData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 处理组织架构选择
  const handleStationChange = (value) => {
    setSelectedStation(value);
  };

  // 搜索处理
  const handleSearch = (values) => {
    console.log('搜索条件:', values);
    setLoading(true);
    
    // 模拟搜索逻辑
    setTimeout(() => {
      let filteredData = [...mockPurchaseRequisitionData];
      
      // 按供应商名称筛选
      if (values.supplierName) {
        filteredData = filteredData.filter(record => 
          record.supplierName.toLowerCase().includes(values.supplierName.toLowerCase())
        );
      }
      
      // 按状态筛选
      if (values.status) {
        filteredData = filteredData.filter(record => record.status === values.status);
      }
      
      // 按分公司/加油站筛选
      if (values.stationId && values.stationId !== 'ROOT') {
        const { branches, serviceAreas, stations } = stationData;
        
        // 判断选择的是分公司、服务区还是加油站
        const isBranch = branches.find(b => b.id === values.stationId);
        const isServiceArea = serviceAreas.find(sa => sa.id === values.stationId);
        const isStation = stations.find(s => s.id === values.stationId);
        
        filteredData = filteredData.map(record => {
          const filteredProducts = record.products.filter(product => {
            return product.branchRequirements.some(req => {
              if (isBranch) {
                return req.branchName === isBranch.name;
              } else if (isServiceArea) {
                const serviceAreaStations = stations.filter(s => s.serviceAreaId === values.stationId);
                return serviceAreaStations.some(s => s.name === req.stationName);
              } else if (isStation) {
                return req.stationName === isStation.name;
              }
              return false;
            });
          });
          
          if (filteredProducts.length > 0) {
            // 重新计算汇总数据
            const totalPurchaseAmount = filteredProducts.reduce((sum, product) => sum + product.totalAmount, 0);
            const totalProductCount = filteredProducts.reduce((sum, product) => sum + product.totalQuantity, 0);
            return {
              ...record,
              products: filteredProducts,
              totalProductCount,
              totalPurchaseAmount
            };
          }
          return null;
        }).filter(Boolean);
      }
      
      setPurchaseRequisitionData(filteredData);
      setLoading(false);
    }, 800);
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    setSelectedStation(null);
    loadData();
  };

  // 查看详情
  const handleViewDetail = (record) => {
    setCurrentRecord(record);
    setSelectedProducts(record.products);
    setDetailModalVisible(true);
  };

  // 创建汇总表
  const handleCreateSummary = () => {
    console.log('可用的已审批申请单:', availableRequisitions);
    console.log('总申请单数量:', availableRequisitions.length);
    setCreateModalVisible(true);
    createForm.resetFields();
    setSelectedRequisitions([]);
  };

  // 刷新可用申请单列表
  const handleRefreshRequisitions = () => {
    // 直接使用导入的数据
    const refreshedData = purchaseRequisitionJsonData?.purchaseRequisitions?.filter(
      req => req.status === 'approved'
    ) || [];
    console.log('刷新后的数据:', refreshedData);
    console.log('原始数据源:', purchaseRequisitionJsonData);
    setAvailableRequisitions(refreshedData);
    message.success(`刷新成功，找到 ${refreshedData.length} 条已审批申请单`);
  };
  const generateSummaryId = () => {
    const timestamp = Date.now();
    return `REQ${timestamp.toString().slice(-8)}`;
  };

  // 保存汇总表
  const handleSaveSummary = async (values) => {
    try {
      if (selectedRequisitions.length === 0) {
        message.error('请选择至少一条采购申请记录');
        return;
      }

      const summaryId = generateSummaryId();
      
      // 按供应商分组处理选中的采购申请
      const supplierGroups = {};
      selectedRequisitions.forEach(req => {
        req.products.forEach(product => {
          if (!supplierGroups[product.supplier]) {
            supplierGroups[product.supplier] = {
              supplierName: product.supplier,
              products: [],
              totalProductCount: 0,
              totalPurchaseAmount: 0
            };
          }
          
          // 添加商品到供应商组
          const existingProduct = supplierGroups[product.supplier].products.find(
            p => p.productId === product.productId
          );
          
          if (existingProduct) {
            // 如果商品已存在，合并数量
            existingProduct.totalQuantity += product.requestedQuantity;
            existingProduct.totalAmount += product.estimatedAmount;
            existingProduct.branchRequirements.push({
              branchName: req.branchName,
              stationName: req.stationName,
              quantity: product.requestedQuantity
            });
          } else {
            // 新商品
            supplierGroups[product.supplier].products.push({
              id: supplierGroups[product.supplier].products.length + 1,
              productCode: product.productId,
              productName: product.productName,
              specification: product.specification,
              packagingUnit: product.unit,
              salePrice: product.estimatedUnitPrice * 1.3, // 模拟销售价
              purchasePrice: product.estimatedUnitPrice,
              branchRequirements: [{
                branchName: req.branchName,
                stationName: req.stationName,
                quantity: product.requestedQuantity
              }],
              totalQuantity: product.requestedQuantity,
              totalAmount: product.estimatedAmount
            });
          }
          
          supplierGroups[product.supplier].totalProductCount += product.requestedQuantity;
          supplierGroups[product.supplier].totalPurchaseAmount += product.estimatedAmount;
        });
      });

      // 创建新的汇总表记录
      const newSummaryRecords = Object.values(supplierGroups).map((group, index) => ({
        id: `${summaryId}-${String(index + 1).padStart(3, '0')}`,
        supplierName: group.supplierName,
        totalProductCount: group.totalProductCount,
        totalPurchaseAmount: group.totalPurchaseAmount,
        status: '待提交',
        createTime: new Date().toLocaleString(),
        creator: values.creator || '管理员',
        products: group.products
      }));

      // 更新数据
      setPurchaseRequisitionData(prev => [...newSummaryRecords, ...prev]);
      
      message.success(`成功创建 ${newSummaryRecords.length} 条采购申请汇总表`);
      setCreateModalVisible(false);
      
    } catch (error) {
      console.error('创建汇总表失败:', error);
      message.error('创建汇总表失败，请重试');
    }
  };

  // 采购申请汇总表格列定义
  const purchaseRequisitionColumns = [
    {
      title: '汇总表编号',
      dataIndex: 'id',
      key: 'id',
      width: 150,
      align: 'center',
      render: (text) => (
        <span style={{ fontWeight: 500, color: '#1890ff' }}>{text}</span>
      )
    },
    {
      title: '供应商名称',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 250,
      ellipsis: true
    },
    {
      title: '关联商品总数量',
      dataIndex: 'totalProductCount',
      key: 'totalProductCount',
      width: 130,
      align: 'center',
      render: (count) => (
        <span style={{ fontWeight: 500 }}>{count}</span>
      )
    },
    {
      title: '采购金额',
      dataIndex: 'totalPurchaseAmount',
      key: 'totalPurchaseAmount',
      width: 120,
      align: 'right',
      render: (amount) => (
        <span style={{ fontWeight: 500, color: '#52c41a', fontSize: '14px' }}>
          ¥{amount?.toLocaleString()}
        </span>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center',
      render: (status) => {
        const statusConfig = {
          '待提交': { color: 'orange', text: '待提交' },
          '已提交': { color: 'green', text: '已提交' }
        };
        const config = statusConfig[status] || { color: 'default', text: status };
        return (
          <span style={{ color: config.color, fontWeight: 500 }}>
            {config.text}
          </span>
        );
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
      align: 'center'
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      width: 100,
      align: 'center'
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
            style={{ borderRadius: '2px' }}
          >
            查看
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div className="module-container">
      <Card>
        <Spin spinning={loading}>
          {/* 筛选区域 */}
          <Form form={searchForm} onFinish={handleSearch}>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={3}>  
                <Form.Item name="supplierName" label="供应商名称">
                  <Input 
                    placeholder="请输入供应商名称" 
                    allowClear 
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="stationId" label="分公司/加油站">
                  <TreeSelect
                    style={{ width: '100%' }}
                    value={selectedStation}
                    treeData={stationTreeData}
                    placeholder="请选择分公司/加油站"
                    allowClear
                    showSearch
                    treeNodeFilterProp="title"
                    onChange={handleStationChange}
                  />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name="status" label="状态">
                  <Select
                    placeholder="请选择状态"
                    allowClear
                    style={{ width: '100%' }}
                  >
                    <Select.Option value="待提交">待提交</Select.Option>
                    <Select.Option value="已提交">已提交</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="dateRange" label="日期范围">
                  <RangePicker 
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                    placeholder={['开始日期', '结束日期']}
                  />
                </Form.Item>
              </Col>
              <Col span={6} style={{ textAlign: 'right' }}>
                <Space>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<SearchOutlined />}
                    style={{ borderRadius: '2px' }}
                  >
                    查询
                  </Button>
                  <Button 
                    icon={<ReloadOutlined />} 
                    onClick={handleReset}
                    style={{ borderRadius: '2px' }}
                  >
                    重置
                  </Button>
                  <Button 
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreateSummary}
                    style={{ borderRadius: '2px', backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                  >
                    创建汇总表
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>

          {/* 汇总表格 */}
          <Table
            columns={purchaseRequisitionColumns}
            dataSource={purchaseRequisitionData}
            rowKey="id"
            loading={loading}
            scroll={{ x: 'max-content' }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
            }}
          />
        </Spin>
      </Card>
      
      {/* 查看详情弹窗 */}
      <Modal
        title={
          <span>
            <EyeOutlined style={{ marginRight: 8 }} />
            采购申请详情
          </span>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={1200}
      >
        {currentRecord && (
          <div>
            <Descriptions column={3} bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="汇总表编号">
                {currentRecord.id}
              </Descriptions.Item>
              <Descriptions.Item label="供应商名称">
                {currentRecord.supplierName}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={currentRecord.status === '已提交' ? 'green' : 'orange'}>
                  {currentRecord.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="关联商品总数量">
                {currentRecord.totalProductCount}
              </Descriptions.Item>
              <Descriptions.Item label="采购金额">
                <span style={{ fontWeight: 500, color: '#52c41a', fontSize: '16px' }}>
                  ¥{currentRecord.totalPurchaseAmount?.toLocaleString()}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="创建人">
                {currentRecord.creator}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间" span={2}>
                {currentRecord.createTime}
              </Descriptions.Item>
            </Descriptions>
            
            <h4 style={{ marginBottom: 12 }}>商品明细及分公司分布：</h4>
            <Table
              columns={[
                {
                  title: '序号',
                  key: 'index',
                  width: 60,
                  align: 'center',
                  render: (_, record, index) => index + 1
                },
                {
                  title: '商品编号',
                  dataIndex: 'productCode',
                  key: 'productCode',
                  width: 100,
                  align: 'center'
                },
                {
                  title: '商品名称',
                  dataIndex: 'productName',
                  key: 'productName',
                  width: 250,
                  ellipsis: true
                },
                {
                  title: '单位',
                  dataIndex: 'packagingUnit',
                  key: 'packagingUnit',
                  width: 60,
                  align: 'center'
                },
                {
                  title: '零售价格',
                  dataIndex: 'salePrice',
                  key: 'salePrice',
                  width: 80,
                  align: 'right',
                  render: (price) => `￥${price?.toFixed(2)}`
                },
                {
                  title: '进价',
                  dataIndex: 'purchasePrice',
                  key: 'purchasePrice',
                  width: 80,
                  align: 'right',
                  render: (price) => `￥${price?.toFixed(2)}`
                },
                // 动态生成各分公司的列
                ...((() => {
                  // 获取所有分公司和加油站的组合
                  const allBranchStations = [];
                  if (selectedProducts.length > 0) {
                    selectedProducts.forEach(product => {
                      product.branchRequirements?.forEach(req => {
                        const key = `${req.branchName}-${req.stationName}`;
                        if (!allBranchStations.find(item => item.key === key)) {
                          allBranchStations.push({
                            key,
                            branchName: req.branchName,
                            stationName: req.stationName
                          });
                        }
                      });
                    });
                  }
                  
                  // 按分公司分组
                  const branchGroups = {};
                  allBranchStations.forEach(item => {
                    if (!branchGroups[item.branchName]) {
                      branchGroups[item.branchName] = [];
                    }
                    branchGroups[item.branchName].push(item);
                  });
                  
                  // 生成列定义
                  const branchColumns = [];
                  Object.keys(branchGroups).forEach(branchName => {
                    const stations = branchGroups[branchName];
                    
                    if (stations.length === 1) {
                      // 单个加油站，直接使用加油站名称
                      branchColumns.push({
                        title: stations[0].stationName.replace('高速服务区加油站', '站'),
                        key: stations[0].key,
                        width: 100,
                        align: 'center',
                        render: (_, record) => {
                          const req = record.branchRequirements?.find(r => 
                            r.branchName === stations[0].branchName && r.stationName === stations[0].stationName
                          );
                          return req?.quantity || '';
                        }
                      });
                    } else {
                      // 多个加油站，使用分组列
                      const subColumns = stations.map(station => ({
                        title: station.stationName.replace('高速服务区加油站', '站'),
                        key: station.key,
                        width: 80,
                        align: 'center',
                        render: (_, record) => {
                          const req = record.branchRequirements?.find(r => 
                            r.branchName === station.branchName && r.stationName === station.stationName
                          );
                          return req?.quantity || '';
                        }
                      }));
                      
                      branchColumns.push({
                        title: branchName,
                        children: subColumns
                      });
                    }
                  });
                  
                  return branchColumns;
                })()),
                {
                  title: '小计',
                  dataIndex: 'totalQuantity',
                  key: 'totalQuantity',
                  width: 80,
                  align: 'center',
                  fixed: 'right',
                  render: (quantity) => (
                    <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
                      {quantity}
                    </span>
                  )
                },
                {
                  title: '采购金额',
                  dataIndex: 'totalAmount',
                  key: 'totalAmount',
                  width: 100,
                  align: 'right',
                  fixed: 'right',
                  render: (amount) => (
                    <span style={{ fontWeight: 'bold', color: '#52c41a' }}>
                      ￥{amount?.toFixed(2)}
                    </span>
                  )
                }
              ]}
              dataSource={selectedProducts}
              rowKey="id"
              pagination={false}
              size="small"
              bordered
              scroll={{ x: 'max-content' }}
            />
          </div>
        )}
      </Modal>
      
      {/* 创建汇总表弹窗 */}
      <Modal
        title="创建采购申请汇总表"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        width={1400}
        footer={[
          <Button key="cancel" onClick={() => setCreateModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => createForm.submit()}>
            保存
          </Button>
        ]}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleSaveSummary}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="summaryName"
                label="汇总表名称"
                rules={[{ required: true, message: '请输入汇总表名称' }]}
              >
                <Input placeholder="请输入汇总表名称" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="creator"
                label="创建人"
                rules={[{ required: true, message: '请输入创建人' }]}
                initialValue="管理员"
              >
                <Input placeholder="请输入创建人" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="expectedDeliveryDate"
                label="预计交付日期"
              >
                <DatePicker style={{ width: '100%' }} placeholder="请选择交付日期" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="remarks"
            label="备注"
          >
            <Input.TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
          
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h4 style={{ margin: 0 }}>选择已审批的采购申请：</h4>
              <div>
                <span style={{ fontSize: '12px', color: '#666', marginRight: 8 }}>
                  共找到 {availableRequisitions.length} 条已审批申请单
                </span>
                <Button 
                  size="small" 
                  icon={<ReloadOutlined />}
                  onClick={handleRefreshRequisitions}
                  style={{ fontSize: '12px' }}
                >
                  刷新
                </Button>
              </div>
            </div>
            <Table
              rowSelection={{
                type: 'checkbox',
                selectedRowKeys: selectedRequisitions.map(req => req.id),
                onChange: (selectedRowKeys, selectedRows) => {
                  setSelectedRequisitions(selectedRows);
                },
                getCheckboxProps: (record) => ({
                  disabled: record.status !== 'approved'
                })
              }}
              columns={[
                {
                  title: '申请单号',
                  dataIndex: 'requisitionNo',
                  key: 'requisitionNo',
                  width: 120
                },
                {
                  title: '采购渠道',
                  dataIndex: 'channelName',
                  key: 'channelName',
                  width: 120
                },
                {
                  title: '申请油站',
                  dataIndex: 'stationName',
                  key: 'stationName',
                  width: 150,
                  ellipsis: true
                },
                {
                  title: '所属分公司',
                  dataIndex: 'branchName',
                  key: 'branchName',
                  width: 120
                },
                {
                  title: '申请人',
                  dataIndex: 'applicant',
                  key: 'applicant',
                  width: 80
                },
                {
                  title: '申请日期',
                  dataIndex: 'applicationDate',
                  key: 'applicationDate',
                  width: 100
                },
                {
                  title: '预估金额',
                  dataIndex: 'estimatedAmount',
                  key: 'estimatedAmount',
                  width: 100,
                  align: 'right',
                  render: (amount) => `¥${amount?.toLocaleString()}`
                },
                {
                  title: '商品数量',
                  dataIndex: 'productCount',
                  key: 'productCount',
                  width: 80,
                  align: 'center'
                },
                {
                  title: '状态',
                  dataIndex: 'status',
                  key: 'status',
                  width: 80,
                  align: 'center',
                  render: (status) => {
                    const statusConfig = {
                      'approved': { color: 'green', text: '已批准' },
                      'pending': { color: 'orange', text: '待审批' },
                      'rejected': { color: 'red', text: '已驳回' },
                      'draft': { color: 'default', text: '草稿' }
                    };
                    const config = statusConfig[status] || { color: 'default', text: status };
                    return (
                      <Tag color={config.color}>
                        {config.text}
                      </Tag>
                    );
                  }
                }
              ]}
              dataSource={availableRequisitions}
              rowKey="id"
              pagination={{
                pageSize: 5,
                showSizeChanger: false,
                showQuickJumper: false,
                showTotal: (total, range) => `显示 ${range[0]}-${range[1]} 条，共 ${total} 条`
              }}
              size="small"
              scroll={{ y: 300 }}
              locale={{
                emptyText: availableRequisitions.length === 0 ? 
                  <div style={{ padding: '20px', textAlign: 'center' }}>
                    <p>暂无已审批的采购申请单</p>
                    <p style={{ fontSize: '12px', color: '#999' }}>
                      请确认已有采购申请单被审批通过，或点击上方刷新按钮重新加载数据
                    </p>
                  </div> : '暂无数据'
              }}
            />
          </div>
          
          {selectedRequisitions.length > 0 && (
            <div style={{ marginTop: 16, padding: 12, backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 4 }}>
              <p style={{ margin: 0, color: '#52c41a' }}>
                已选择 <strong>{selectedRequisitions.length}</strong> 条采购申请，
                预估总金额：<strong>¥{selectedRequisitions.reduce((sum, req) => sum + req.estimatedAmount, 0).toLocaleString()}</strong>
              </p>
            </div>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default PurchaseRequisitionSummary;