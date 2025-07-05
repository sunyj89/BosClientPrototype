import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Table, 
  DatePicker, 
  Button, 
  TreeSelect,
  Form,
  Space,
  message
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import orgData from '../../mock/station/orgData.json';
import salesData from '../../mock/report/stationSalesMonthlyData.json';
import './StationSalesMonthlyReport.css';

const { RangePicker } = DatePicker;

const StationSalesMonthlyReport = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectedStations, setSelectedStations] = useState([]);
  const [dateRange, setDateRange] = useState([dayjs().subtract(1, 'month'), dayjs()]);

  // 处理组织架构数据，转换为TreeSelect需要的格式（支持多选）
  const processOrgDataForTreeSelect = (data) => {
    const processNode = (node) => {
      const treeNode = {
        title: node.name,
        value: node.id,
        key: node.id,
        type: node.type
      };

      // 如果是油站节点，设置为可选择的叶子节点
      if (node.type === 'station') {
        treeNode.isLeaf = true;
        treeNode.selectable = true;
        treeNode.checkable = true;
      } else {
        // 非油站节点设置为不可选择，但可展开
        treeNode.selectable = false;
        treeNode.checkable = false;
        treeNode.disableCheckbox = true;
      }

      // 递归处理子节点
      if (node.children && node.children.length > 0) {
        treeNode.children = node.children.map(child => processNode(child));
      }

      return treeNode;
    };

    return data.map(node => processNode(node));
  };

  // 获取所有油站节点（用于数据过滤）
  const getAllStations = (data) => {
    const stations = [];
    
    const extractStations = (nodes) => {
      nodes.forEach(node => {
        if (node.type === 'station') {
          stations.push({
            id: node.id,
            name: node.name,
            address: node.address,
            parentId: node.parentId
          });
        } else if (node.children) {
          extractStations(node.children);
        }
      });
    };
    
    extractStations(data);
    return stations;
  };

  // 获取分公司信息
  const getCompanyInfo = (data) => {
    const companies = [];
    
    const extractCompanies = (nodes) => {
      nodes.forEach(node => {
        if (node.type === 'company') {
          companies.push({
            id: node.id,
            name: node.name
          });
        } else if (node.children) {
          extractCompanies(node.children);
        }
      });
    };
    
    extractCompanies(data);
    return companies;
  };

  const treeData = processOrgDataForTreeSelect(orgData);
  const allStations = getAllStations(orgData);
  const allCompanies = getCompanyInfo(orgData);

  // 获取选中油站的名称
  const getSelectedStationNames = (selectedIds) => {
    if (!selectedIds || selectedIds.length === 0) return [];
    
    return allStations
      .filter(station => selectedIds.includes(station.id))
      .map(station => station.name);
  };

  // 表格列定义
  const columns = [
    {
      title: '站名',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 150,
      fixed: 'left'
    },
    {
      title: '92#汽油(Ⅴ）',
      dataIndex: 'oil92',
      key: 'oil92',
      width: 120,
      render: (value) => value?.toFixed(5) || '0.00000'
    },
    {
      title: '95#汽油（Ⅴ）',
      dataIndex: 'oil95',
      key: 'oil95',
      width: 120,
      render: (value) => value?.toFixed(5) || '0.00000'
    },
    {
      title: '98#汽油（Ⅴ）',
      dataIndex: 'oil98',
      key: 'oil98',
      width: 120,
      render: (value) => value?.toFixed(5) || '0.00000'
    },
    {
      title: '爱跑98#汽油',
      dataIndex: 'oilLove98',
      key: 'oilLove98',
      width: 120,
      render: (value) => value?.toFixed(5) || '0.00000'
    },
    {
      title: '0#车柴（Ⅴ）',
      dataIndex: 'diesel0',
      key: 'diesel0',
      width: 120,
      render: (value) => value?.toFixed(5) || '0.00000'
    },
    {
      title: '0#自助（Ⅴ）',
      dataIndex: 'diesel0Self',
      key: 'diesel0Self',
      width: 120,
      render: (value) => value?.toFixed(5) || '0.00000'
    },
    {
      title: '汽油小计',
      dataIndex: 'gasolineSubtotal',
      key: 'gasolineSubtotal',
      width: 120,
      render: (value) => value?.toFixed(5) || '0.00000'
    },
    {
      title: '合计(吨)',
      dataIndex: 'totalTons',
      key: 'totalTons',
      width: 120,
      render: (value) => value?.toFixed(5) || '0.00000'
    },
    {
      title: '销售额（元）',
      children: [
        {
          title: '现金',
          dataIndex: 'salesAmountCash',
          key: 'salesAmountCash',
          width: 120,
          render: (value) => value?.toFixed(2) || '0.00'
        },
        {
          title: 'IC(元)',
          dataIndex: 'salesAmountIC',
          key: 'salesAmountIC',
          width: 120,
          render: (value) => value?.toFixed(2) || '0.00'
        },
        {
          title: '合计',
          dataIndex: 'salesAmountTotal',
          key: 'salesAmountTotal',
          width: 120,
          render: (value) => value?.toFixed(2) || '0.00'
        }
      ]
    }
  ];

  // 查询处理
  const handleSearch = (values) => {
    setLoading(true);
    console.log('查询参数:', values);
    console.log('选择的油站:', values.stations);
    
    // 模拟API调用，根据查询条件过滤数据
    setTimeout(() => {
      let filteredData = [...salesData.stationSalesData];
      
      // 根据日期范围过滤
      if (values.dateRange && values.dateRange.length === 2) {
        const startDate = values.dateRange[0].format('YYYY-MM-DD');
        const endDate = values.dateRange[1].format('YYYY-MM-DD');
        filteredData = filteredData.filter(item => 
          item.date >= startDate && item.date <= endDate
        );
      }
      
      // 根据选择的油站过滤（多选）
      if (values.stations && values.stations.length > 0) {
        const stationIds = Array.isArray(values.stations) 
          ? values.stations.map(station => 
              typeof station === 'string' ? station : station.value || station.id
            )
          : [values.stations];
        
        console.log('处理后的油站ID:', stationIds);
        
        filteredData = filteredData.filter(item => 
          stationIds.includes(item.stationId)
        );
      }
      
      // 按分公司分组并计算合计
      const groupedData = [];
      const companyGroups = new Map();
      
      // 先按分公司分组
      filteredData.forEach(item => {
        const station = allStations.find(s => s.id === item.stationId);
        if (station) {
          const company = allCompanies.find(c => c.id === station.parentId);
          if (company) {
            if (!companyGroups.has(company.id)) {
              companyGroups.set(company.id, {
                companyName: company.name,
                stations: []
              });
            }
            companyGroups.get(company.id).stations.push(item);
          }
        }
      });
      
      // 生成表格数据，包含分公司合计行
      companyGroups.forEach((group, companyId) => {
        // 添加分公司下的所有油站数据
        group.stations.forEach(station => {
          groupedData.push({
            ...station,
            key: station.id || station.stationId
          });
        });
        
        // 计算分公司合计
        const companyTotal = {
          id: `${companyId}_total`,
          key: `${companyId}_total`,
          stationName: `${group.companyName}合计`,
          oil92: group.stations.reduce((sum, item) => sum + (item.oil92 || 0), 0),
          oil95: group.stations.reduce((sum, item) => sum + (item.oil95 || 0), 0),
          oil98: group.stations.reduce((sum, item) => sum + (item.oil98 || 0), 0),
          oilLove98: group.stations.reduce((sum, item) => sum + (item.oilLove98 || 0), 0),
          diesel0: group.stations.reduce((sum, item) => sum + (item.diesel0 || 0), 0),
          diesel0Self: group.stations.reduce((sum, item) => sum + (item.diesel0Self || 0), 0),
          gasolineSubtotal: group.stations.reduce((sum, item) => sum + (item.gasolineSubtotal || 0), 0),
          totalTons: group.stations.reduce((sum, item) => sum + (item.totalTons || 0), 0),
          salesAmountCash: group.stations.reduce((sum, item) => sum + (item.salesAmountCash || 0), 0),
          salesAmountIC: group.stations.reduce((sum, item) => sum + (item.salesAmountIC || 0), 0),
          salesAmountTotal: group.stations.reduce((sum, item) => sum + (item.salesAmountTotal || 0), 0),
          isCompanyTotal: true
        };
        
        groupedData.push(companyTotal);
      });
      
      // 添加总合计行
      if (groupedData.length > 0) {
        const grandTotal = {
          id: 'grand_total',
          key: 'grand_total',
          stationName: '合计',
          oil92: groupedData.filter(item => !item.isCompanyTotal && !item.isGrandTotal).reduce((sum, item) => sum + (item.oil92 || 0), 0),
          oil95: groupedData.filter(item => !item.isCompanyTotal && !item.isGrandTotal).reduce((sum, item) => sum + (item.oil95 || 0), 0),
          oil98: groupedData.filter(item => !item.isCompanyTotal && !item.isGrandTotal).reduce((sum, item) => sum + (item.oil98 || 0), 0),
          oilLove98: groupedData.filter(item => !item.isCompanyTotal && !item.isGrandTotal).reduce((sum, item) => sum + (item.oilLove98 || 0), 0),
          diesel0: groupedData.filter(item => !item.isCompanyTotal && !item.isGrandTotal).reduce((sum, item) => sum + (item.diesel0 || 0), 0),
          diesel0Self: groupedData.filter(item => !item.isCompanyTotal && !item.isGrandTotal).reduce((sum, item) => sum + (item.diesel0Self || 0), 0),
          gasolineSubtotal: groupedData.filter(item => !item.isCompanyTotal && !item.isGrandTotal).reduce((sum, item) => sum + (item.gasolineSubtotal || 0), 0),
          totalTons: groupedData.filter(item => !item.isCompanyTotal && !item.isGrandTotal).reduce((sum, item) => sum + (item.totalTons || 0), 0),
          salesAmountCash: groupedData.filter(item => !item.isCompanyTotal && !item.isGrandTotal).reduce((sum, item) => sum + (item.salesAmountCash || 0), 0),
          salesAmountIC: groupedData.filter(item => !item.isCompanyTotal && !item.isGrandTotal).reduce((sum, item) => sum + (item.salesAmountIC || 0), 0),
          salesAmountTotal: groupedData.filter(item => !item.isCompanyTotal && !item.isGrandTotal).reduce((sum, item) => sum + (item.salesAmountTotal || 0), 0),
          isGrandTotal: true
        };
        
        groupedData.push(grandTotal);
      }
      
      setTableData(groupedData);
      setLoading(false);
      
      // 显示查询结果信息
      const selectedStationNames = getSelectedStationNames(values.stations || []);
      const stationInfo = selectedStationNames.length > 0 
        ? `，选中油站：${selectedStationNames.join('、')}` 
        : '';
      
      message.success(`查询成功，共找到 ${groupedData.length} 条记录${stationInfo}`);
    }, 1000);
  };

  // 重置处理
  const handleReset = () => {
    form.resetFields();
    setTableData([]);
    setSelectedStations([]);
    setDateRange([dayjs().subtract(1, 'month'), dayjs()]);
  };

  // 导出处理
  const handleExport = () => {
    message.success('导出功能开发中...');
  };

  // 初始化加载数据
  useEffect(() => {
    // 初始化显示前20条数据
    const initialData = salesData.stationSalesData.slice(0, 20).map((item, index) => ({
      ...item,
      key: item.id || index.toString()
    }));
    setTableData(initialData);
  }, []);

  return (
    <div className="station-sales-monthly-report">
      <div className="page-header">
        <h2>9020油站销售月报表</h2>
      </div>
      
      {/* 筛选区域 */}
      <div className="filter-section">
        <Form
          form={form}
          layout="inline"
          onFinish={handleSearch}
          initialValues={{
            dateRange: dateRange,
            stations: []
          }}
        >
          <Form.Item
            label="日结日期"
            name="dateRange"
            rules={[{ required: true, message: '请选择日结日期范围' }]}
          >
            <RangePicker
              style={{ width: 280 }}
              format="YYYY-MM-DD"
              placeholder={['开始日期', '结束日期']}
              value={dateRange}
              onChange={setDateRange}
            />
          </Form.Item>
          <Form.Item
            label="油站查询"
            name="stations"
            rules={[{ required: true, message: '请选择油站' }]}
          >
            <TreeSelect
              treeData={treeData}
              value={selectedStations}
              onChange={setSelectedStations}
              placeholder="请选择油站"
              style={{ width: 340 }}
              multiple={true}
              treeCheckable={true}
              showCheckedStrategy={TreeSelect.SHOW_CHILD}
              treeDefaultExpandAll={false}
              treeDefaultExpandedKeys={['JXJTFS']}
              showSearch={true}
              treeNodeFilterProp="title"
              maxTagCount={2}
              maxTagPlaceholder={(omittedValues) => `+${omittedValues.length}个油站`}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              allowClear={true}
            />
          </Form.Item>
        </Form>
        
        <div className="filter-actions">
          <Space>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<SearchOutlined />}
              loading={loading}
              onClick={() => form.submit()}
            >
              查询
            </Button>
            <Button 
              icon={<ReloadOutlined />}
              onClick={handleReset}
            >
              重置
            </Button>
            <Button 
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleExport}
            >
              导出
            </Button>
          </Space>
        </div>
      </div>

      {/* 数据表格区 */}
      <Card title="销售数据">
        <Table
          columns={columns}
          dataSource={tableData}
          loading={loading}
          scroll={{ x: 'max-content', y: 600 }}
          pagination={{
            total: tableData.length,
            pageSize: 50,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
          }}
          size="small"
          bordered
          rowClassName={(record) => {
            if (record.isGrandTotal) return 'grand-total-row';
            if (record.isCompanyTotal) return 'company-total-row';
            return '';
          }}
        />
      </Card>
    </div>
  );
};

export default StationSalesMonthlyReport; 