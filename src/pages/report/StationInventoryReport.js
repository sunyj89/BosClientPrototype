import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Table, 
  DatePicker, 
  Button, 
  Select, 
  Tabs,
  Form,
  Space,
  TreeSelect,
  message
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import orgData from '../../mock/station/orgData.json';
import inventoryData from '../../mock/report/stationInventoryData.json';
import './StationInventoryReport.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

const StationInventoryReport = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('single');
  const [tableData, setTableData] = useState([]);
  const [selectedStations, setSelectedStations] = useState(undefined);
  const [selectedOilTypes, setSelectedOilTypes] = useState([]);
  const [dateRange, setDateRange] = useState([dayjs().subtract(7, 'day'), dayjs()]);
  
  // 汇总查询状态
  const [summaryTableData, setSummaryTableData] = useState([]);
  const [selectedSummaryStations, setSelectedSummaryStations] = useState([]);
  const [summaryDateRange, setSummaryDateRange] = useState([dayjs().subtract(7, 'day'), dayjs()]);

  // 油品类型选项
  const oilTypeOptions = [
    { value: '92', label: '92号汽油(Ⅴ)' },
    { value: '95', label: '95号清洁汽油(Ⅴ)' },
    { value: '0', label: '0号车用柴油(Ⅴ)' },
    { value: 'urea', label: '车用尾气处理液' }
  ];

  // 处理组织架构数据，转换为TreeSelect需要的格式（支持单选和多选）
  const processOrgDataForTreeSelect = (data, isMultiple = false) => {
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
        if (isMultiple) {
          treeNode.checkable = true;
        }
      } else {
        // 非油站节点设置为不可选择，但可展开
        treeNode.selectable = false;
        if (isMultiple) {
          treeNode.checkable = false;
          treeNode.disableCheckbox = true;
        } else {
          treeNode.disabled = true;
        }
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
            address: node.address
          });
        } else if (node.children) {
          extractStations(node.children);
        }
      });
    };
    
    extractStations(data);
    return stations;
  };

  const treeData = processOrgDataForTreeSelect(orgData, false); // 单选模式
  const summaryTreeData = processOrgDataForTreeSelect(orgData, true); // 多选模式
  const allStations = getAllStations(orgData);

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
      title: '日结时间',
      dataIndex: 'date',
      key: 'date',
      width: 100,
      fixed: 'left'
    },
    {
      title: '油站名称',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 120,
      fixed: 'left'
    },
    {
      title: '进货升数',
      children: [
        {
          title: '92号汽油(Ⅴ)',
          dataIndex: 'purchase92L',
          key: 'purchase92L',
          width: 100,
          render: (value) => value?.toFixed(2) || '0.00'
        },
        {
          title: '95号清洁汽油(Ⅴ)',
          dataIndex: 'purchase95L',
          key: 'purchase95L',
          width: 120,
          render: (value) => value?.toFixed(2) || '0.00'
        },
        {
          title: '0号车用柴油(Ⅴ)',
          dataIndex: 'purchase0L',
          key: 'purchase0L',
          width: 120,
          render: (value) => value?.toFixed(2) || '0.00'
        },
        {
          title: '车用尾气处理液',
          dataIndex: 'purchaseUreaL',
          key: 'purchaseUreaL',
          width: 120,
          render: (value) => value?.toFixed(2) || '0.00'
        }
      ]
    },
    {
      title: '进货吨数',
      children: [
        {
          title: '92号汽油(Ⅴ)',
          dataIndex: 'purchase92T',
          key: 'purchase92T',
          width: 100,
          render: (value) => value?.toFixed(3) || '0.000'
        },
        {
          title: '95号清洁汽油(Ⅴ)',
          dataIndex: 'purchase95T',
          key: 'purchase95T',
          width: 120,
          render: (value) => value?.toFixed(3) || '0.000'
        },
        {
          title: '0号车用柴油(Ⅴ)',
          dataIndex: 'purchase0T',
          key: 'purchase0T',
          width: 120,
          render: (value) => value?.toFixed(3) || '0.000'
        },
        {
          title: '车用尾气处理液',
          dataIndex: 'purchaseUreaT',
          key: 'purchaseUreaT',
          width: 120,
          render: (value) => value?.toFixed(3) || '0.000'
        }
      ]
    },
    {
      title: '销售升数',
      children: [
        {
          title: '92号汽油(Ⅴ)',
          children: [
            {
              title: 'IC卡',
              dataIndex: 'sales92IC',
              key: 'sales92IC',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            },
            {
              title: '现金',
              dataIndex: 'sales92Cash',
              key: 'sales92Cash',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            },
            {
              title: '合计',
              dataIndex: 'sales92Total',
              key: 'sales92Total',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            }
          ]
        },
        {
          title: '95号清洁汽油(Ⅴ)',
          children: [
            {
              title: 'IC卡',
              dataIndex: 'sales95IC',
              key: 'sales95IC',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            },
            {
              title: '现金',
              dataIndex: 'sales95Cash',
              key: 'sales95Cash',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            },
            {
              title: '合计',
              dataIndex: 'sales95Total',
              key: 'sales95Total',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            }
          ]
        },
        {
          title: '0号车用柴油(Ⅴ)',
          children: [
            {
              title: 'IC卡',
              dataIndex: 'sales0IC',
              key: 'sales0IC',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            },
            {
              title: '现金',
              dataIndex: 'sales0Cash',
              key: 'sales0Cash',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            },
            {
              title: '合计',
              dataIndex: 'sales0Total',
              key: 'sales0Total',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            }
          ]
        },
        {
          title: '车用尾气处理液',
          children: [
            {
              title: 'IC卡',
              dataIndex: 'salesUreaIC',
              key: 'salesUreaIC',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            },
            {
              title: '现金',
              dataIndex: 'salesUreaCash',
              key: 'salesUreaCash',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            },
            {
              title: '合计',
              dataIndex: 'salesUreaTotal',
              key: 'salesUreaTotal',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            }
          ]
        }
      ]
    },
    {
      title: '销售金额',
      children: [
        {
          title: '92号汽油(Ⅴ)',
          children: [
            {
              title: 'IC卡',
              dataIndex: 'salesAmount92IC',
              key: 'salesAmount92IC',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            },
            {
              title: '现金',
              dataIndex: 'salesAmount92Cash',
              key: 'salesAmount92Cash',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            },
            {
              title: '合计',
              dataIndex: 'salesAmount92Total',
              key: 'salesAmount92Total',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            }
          ]
        },
        {
          title: '95号清洁汽油(Ⅴ)',
          children: [
            {
              title: 'IC卡',
              dataIndex: 'salesAmount95IC',
              key: 'salesAmount95IC',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            },
            {
              title: '现金',
              dataIndex: 'salesAmount95Cash',
              key: 'salesAmount95Cash',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            },
            {
              title: '合计',
              dataIndex: 'salesAmount95Total',
              key: 'salesAmount95Total',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            }
          ]
        },
        {
          title: '0号车用柴油(Ⅴ)',
          children: [
            {
              title: 'IC卡',
              dataIndex: 'salesAmount0IC',
              key: 'salesAmount0IC',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            },
            {
              title: '现金',
              dataIndex: 'salesAmount0Cash',
              key: 'salesAmount0Cash',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            },
            {
              title: '合计',
              dataIndex: 'salesAmount0Total',
              key: 'salesAmount0Total',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            }
          ]
        },
        {
          title: '车用尾气处理液',
          children: [
            {
              title: 'IC卡',
              dataIndex: 'salesAmountUreaIC',
              key: 'salesAmountUreaIC',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            },
            {
              title: '现金',
              dataIndex: 'salesAmountUreaCash',
              key: 'salesAmountUreaCash',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            },
            {
              title: '合计',
              dataIndex: 'salesAmountUreaTotal',
              key: 'salesAmountUreaTotal',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            }
          ]
        },
        {
          title: '合计',
          children: [
            {
              title: 'IC卡',
              dataIndex: 'salesAmountTotalIC',
              key: 'salesAmountTotalIC',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            },
            {
              title: '现金',
              dataIndex: 'salesAmountTotalCash',
              key: 'salesAmountTotalCash',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            },
            {
              title: '合计',
              dataIndex: 'salesAmountTotalAll',
              key: 'salesAmountTotalAll',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            }
          ]
        }
      ]
    },
    {
      title: '销售吨数',
      children: [
        {
          title: '92号汽油(Ⅴ)',
          dataIndex: 'salesTon92',
          key: 'salesTon92',
          width: 100,
          render: (value) => value?.toFixed(3) || '0.000'
        },
        {
          title: '95号清洁汽油(Ⅴ)',
          dataIndex: 'salesTon95',
          key: 'salesTon95',
          width: 120,
          render: (value) => value?.toFixed(3) || '0.000'
        },
        {
          title: '0号车用柴油(Ⅴ)',
          dataIndex: 'salesTon0',
          key: 'salesTon0',
          width: 120,
          render: (value) => value?.toFixed(3) || '0.000'
        },
        {
          title: '车用尾气处理液',
          dataIndex: 'salesTonUrea',
          key: 'salesTonUrea',
          width: 120,
          render: (value) => value?.toFixed(3) || '0.000'
        },
        {
          title: '合计',
          dataIndex: 'salesTonTotal',
          key: 'salesTonTotal',
          width: 80,
          render: (value) => value?.toFixed(3) || '0.000'
        }
      ]
    },
    {
      title: '库存升数',
      children: [
        {
          title: '92号汽油(Ⅴ)',
          dataIndex: 'inventory92L',
          key: 'inventory92L',
          width: 100,
          render: (value) => value?.toFixed(2) || '0.00'
        },
        {
          title: '95号清洁汽油(Ⅴ)',
          dataIndex: 'inventory95L',
          key: 'inventory95L',
          width: 120,
          render: (value) => value?.toFixed(2) || '0.00'
        },
        {
          title: '0号车用柴油(Ⅴ)',
          dataIndex: 'inventory0L',
          key: 'inventory0L',
          width: 120,
          render: (value) => value?.toFixed(2) || '0.00'
        },
        {
          title: '车用尾气处理液',
          dataIndex: 'inventoryUreaL',
          key: 'inventoryUreaL',
          width: 120,
          render: (value) => value?.toFixed(2) || '0.00'
        }
      ]
    },
    {
      title: '库存吨数',
      children: [
        {
          title: '92号汽油(Ⅴ)',
          dataIndex: 'inventory92T',
          key: 'inventory92T',
          width: 100,
          render: (value) => value?.toFixed(3) || '0.000'
        },
        {
          title: '95号清洁汽油(Ⅴ)',
          dataIndex: 'inventory95T',
          key: 'inventory95T',
          width: 120,
          render: (value) => value?.toFixed(3) || '0.000'
        },
        {
          title: '0号车用柴油(Ⅴ)',
          dataIndex: 'inventory0T',
          key: 'inventory0T',
          width: 120,
          render: (value) => value?.toFixed(3) || '0.000'
        },
        {
          title: '车用尾气处理液',
          dataIndex: 'inventoryUreaT',
          key: 'inventoryUreaT',
          width: 120,
          render: (value) => value?.toFixed(3) || '0.000'
        }
      ]
    }
  ];

  // 汇总查询表格列定义
  const summaryColumns = [
    {
      title: '日结时间',
      dataIndex: 'date',
      key: 'date',
      width: 100,
      fixed: 'left'
    },
    {
      title: '进货升数',
      children: [
        {
          title: '92号汽油(Ⅴ)',
          dataIndex: 'purchase92L',
          key: 'purchase92L',
          width: 100,
          render: (value) => value?.toFixed(2) || '0.00'
        },
        {
          title: '95号清洁汽油(Ⅴ)',
          dataIndex: 'purchase95L',
          key: 'purchase95L',
          width: 120,
          render: (value) => value?.toFixed(2) || '0.00'
        },
        {
          title: '0号车用柴油(Ⅴ)',
          dataIndex: 'purchase0L',
          key: 'purchase0L',
          width: 120,
          render: (value) => value?.toFixed(2) || '0.00'
        },
        {
          title: '车用尾气处理液',
          dataIndex: 'purchaseUreaL',
          key: 'purchaseUreaL',
          width: 120,
          render: (value) => value?.toFixed(2) || '0.00'
        }
      ]
    },
    {
      title: '进货吨数',
      children: [
        {
          title: '92号汽油(Ⅴ)',
          dataIndex: 'purchase92T',
          key: 'purchase92T',
          width: 100,
          render: (value) => value?.toFixed(3) || '0.000'
        },
        {
          title: '95号清洁汽油(Ⅴ)',
          dataIndex: 'purchase95T',
          key: 'purchase95T',
          width: 120,
          render: (value) => value?.toFixed(3) || '0.000'
        },
        {
          title: '0号车用柴油(Ⅴ)',
          dataIndex: 'purchase0T',
          key: 'purchase0T',
          width: 120,
          render: (value) => value?.toFixed(3) || '0.000'
        },
        {
          title: '车用尾气处理液',
          dataIndex: 'purchaseUreaT',
          key: 'purchaseUreaT',
          width: 120,
          render: (value) => value?.toFixed(3) || '0.000'
        }
      ]
    },
    {
      title: '销售升数',
      children: [
        {
          title: '92号汽油(Ⅴ)',
          children: [
            {
              title: 'IC卡',
              dataIndex: 'sales92IC',
              key: 'sales92IC',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            },
            {
              title: '现金',
              dataIndex: 'sales92Cash',
              key: 'sales92Cash',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            },
            {
              title: '合计',
              dataIndex: 'sales92Total',
              key: 'sales92Total',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            }
          ]
        },
        {
          title: '95号清洁汽油(Ⅴ)',
          children: [
            {
              title: 'IC卡',
              dataIndex: 'sales95IC',
              key: 'sales95IC',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            },
            {
              title: '现金',
              dataIndex: 'sales95Cash',
              key: 'sales95Cash',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            },
            {
              title: '合计',
              dataIndex: 'sales95Total',
              key: 'sales95Total',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            }
          ]
        },
        {
          title: '0号车用柴油(Ⅴ)',
          children: [
            {
              title: 'IC卡',
              dataIndex: 'sales0IC',
              key: 'sales0IC',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            },
            {
              title: '现金',
              dataIndex: 'sales0Cash',
              key: 'sales0Cash',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            },
            {
              title: '合计',
              dataIndex: 'sales0Total',
              key: 'sales0Total',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            }
          ]
        },
        {
          title: '车用尾气处理液',
          children: [
            {
              title: 'IC卡',
              dataIndex: 'salesUreaIC',
              key: 'salesUreaIC',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            },
            {
              title: '现金',
              dataIndex: 'salesUreaCash',
              key: 'salesUreaCash',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            },
            {
              title: '合计',
              dataIndex: 'salesUreaTotal',
              key: 'salesUreaTotal',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            }
          ]
        }
      ]
    },
    {
      title: '销售金额',
      children: [
        {
          title: '92号汽油(Ⅴ)',
          children: [
            {
              title: 'IC卡',
              dataIndex: 'salesAmount92IC',
              key: 'salesAmount92IC',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            },
            {
              title: '现金',
              dataIndex: 'salesAmount92Cash',
              key: 'salesAmount92Cash',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            },
            {
              title: '合计',
              dataIndex: 'salesAmount92Total',
              key: 'salesAmount92Total',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            }
          ]
        },
        {
          title: '95号清洁汽油(Ⅴ)',
          children: [
            {
              title: 'IC卡',
              dataIndex: 'salesAmount95IC',
              key: 'salesAmount95IC',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            },
            {
              title: '现金',
              dataIndex: 'salesAmount95Cash',
              key: 'salesAmount95Cash',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            },
            {
              title: '合计',
              dataIndex: 'salesAmount95Total',
              key: 'salesAmount95Total',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            }
          ]
        },
        {
          title: '0号车用柴油(Ⅴ)',
          children: [
            {
              title: 'IC卡',
              dataIndex: 'salesAmount0IC',
              key: 'salesAmount0IC',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            },
            {
              title: '现金',
              dataIndex: 'salesAmount0Cash',
              key: 'salesAmount0Cash',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            },
            {
              title: '合计',
              dataIndex: 'salesAmount0Total',
              key: 'salesAmount0Total',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            }
          ]
        },
        {
          title: '车用尾气处理液',
          children: [
            {
              title: 'IC卡',
              dataIndex: 'salesAmountUreaIC',
              key: 'salesAmountUreaIC',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            },
            {
              title: '现金',
              dataIndex: 'salesAmountUreaCash',
              key: 'salesAmountUreaCash',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            },
            {
              title: '合计',
              dataIndex: 'salesAmountUreaTotal',
              key: 'salesAmountUreaTotal',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            }
          ]
        },
        {
          title: '合计',
          children: [
            {
              title: 'IC卡',
              dataIndex: 'salesAmountTotalIC',
              key: 'salesAmountTotalIC',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            },
            {
              title: '现金',
              dataIndex: 'salesAmountTotalCash',
              key: 'salesAmountTotalCash',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            },
            {
              title: '合计',
              dataIndex: 'salesAmountTotalAll',
              key: 'salesAmountTotalAll',
              width: 80,
              render: (value) => value?.toFixed(2) || '0.00'
            }
          ]
        }
      ]
    },
    {
      title: '销售吨数',
      children: [
        {
          title: '92号汽油(Ⅴ)',
          dataIndex: 'salesTon92',
          key: 'salesTon92',
          width: 100,
          render: (value) => value?.toFixed(3) || '0.000'
        },
        {
          title: '95号清洁汽油(Ⅴ)',
          dataIndex: 'salesTon95',
          key: 'salesTon95',
          width: 120,
          render: (value) => value?.toFixed(3) || '0.000'
        },
        {
          title: '0号车用柴油(Ⅴ)',
          dataIndex: 'salesTon0',
          key: 'salesTon0',
          width: 120,
          render: (value) => value?.toFixed(3) || '0.000'
        },
        {
          title: '车用尾气处理液',
          dataIndex: 'salesTonUrea',
          key: 'salesTonUrea',
          width: 120,
          render: (value) => value?.toFixed(3) || '0.000'
        },
        {
          title: '合计',
          dataIndex: 'salesTonTotal',
          key: 'salesTonTotal',
          width: 80,
          render: (value) => value?.toFixed(3) || '0.000'
        }
      ]
    },
    {
      title: '库存升数',
      children: [
        {
          title: '92号汽油(Ⅴ)',
          dataIndex: 'inventory92L',
          key: 'inventory92L',
          width: 100,
          render: (value) => value?.toFixed(2) || '0.00'
        },
        {
          title: '95号清洁汽油(Ⅴ)',
          dataIndex: 'inventory95L',
          key: 'inventory95L',
          width: 120,
          render: (value) => value?.toFixed(2) || '0.00'
        },
        {
          title: '0号车用柴油(Ⅴ)',
          dataIndex: 'inventory0L',
          key: 'inventory0L',
          width: 120,
          render: (value) => value?.toFixed(2) || '0.00'
        },
        {
          title: '车用尾气处理液',
          dataIndex: 'inventoryUreaL',
          key: 'inventoryUreaL',
          width: 120,
          render: (value) => value?.toFixed(2) || '0.00'
        }
      ]
    },
    {
      title: '库存吨数',
      children: [
        {
          title: '92号汽油(Ⅴ)',
          dataIndex: 'inventory92T',
          key: 'inventory92T',
          width: 100,
          render: (value) => value?.toFixed(3) || '0.000'
        },
        {
          title: '95号清洁汽油(Ⅴ)',
          dataIndex: 'inventory95T',
          key: 'inventory95T',
          width: 120,
          render: (value) => value?.toFixed(3) || '0.000'
        },
        {
          title: '0号车用柴油(Ⅴ)',
          dataIndex: 'inventory0T',
          key: 'inventory0T',
          width: 120,
          render: (value) => value?.toFixed(3) || '0.000'
        },
        {
          title: '车用尾气处理液',
          dataIndex: 'inventoryUreaT',
          key: 'inventoryUreaT',
          width: 120,
          render: (value) => value?.toFixed(3) || '0.000'
        }
      ]
    }
  ];

  // 查询处理
  const handleSearch = (values) => {
    setLoading(true);
    console.log('查询参数:', values);
    console.log('选择的油站:', values.stations);
    console.log('选择的油品类型:', values.oilTypes);
    
    // 模拟API调用，根据查询条件过滤数据
    setTimeout(() => {
      let filteredData = [...inventoryData.singleStationData];
      let stationId = null; // 单选油站
      
      // 根据日期范围过滤
      if (values.dateRange && values.dateRange.length === 2) {
        const startDate = values.dateRange[0].format('YYYY-MM-DD');
        const endDate = values.dateRange[1].format('YYYY-MM-DD');
        filteredData = filteredData.filter(item => 
          item.date >= startDate && item.date <= endDate
        );
      }
      
      // 根据选择的油站过滤（单选）
      if (values.stations) {
        stationId = typeof values.stations === 'string' ? values.stations : values.stations.value || values.stations.id;
        console.log('处理后的油站ID:', stationId);
        
        filteredData = filteredData.filter(item => 
          item.stationId === stationId
        );
      }
      
      // 根据油品类型过滤（这里暂时不实际过滤数据，因为模拟数据结构复杂）
      // 实际项目中可以根据选择的油品类型过滤相应的列数据
      
      // 添加key字段用于表格渲染
      filteredData = filteredData.map((item, index) => ({
        ...item,
        key: item.id || index.toString()
      }));
      
      setTableData(filteredData);
      setLoading(false);
      
      // 显示查询结果信息
      const selectedStationName = stationId ? getSelectedStationNames([stationId])[0] : '';
      const stationInfo = selectedStationName ? `，选中油站：${selectedStationName}` : '';
      const oilTypeInfo = values.oilTypes && values.oilTypes.length > 0 
        ? `，油品类型：${values.oilTypes.map(type => oilTypeOptions.find(opt => opt.value === type)?.label).join('、')}` 
        : '';
      
      message.success(`查询成功，共找到 ${filteredData.length} 条记录${stationInfo}${oilTypeInfo}`);
    }, 1000);
  };

  // 重置处理
  const handleReset = () => {
    form.resetFields();
    setTableData([]);
    setSelectedStations(undefined);
    setSelectedOilTypes([]);
    setDateRange([dayjs().subtract(7, 'day'), dayjs()]);
  };

  // 导出处理
  const handleExport = () => {
    message.success('导出功能开发中...');
  };

  // 汇总查询处理
  const handleSummarySearch = (values) => {
    setLoading(true);
    console.log('汇总查询参数:', values);
    console.log('选择的油站:', values.summaryStations);
    
    // 模拟API调用，根据查询条件过滤和汇总数据
    setTimeout(() => {
      let filteredData = [...inventoryData.singleStationData];
      let stationIds = [];
      
      // 根据日期范围过滤
      if (values.summaryDateRange && values.summaryDateRange.length === 2) {
        const startDate = values.summaryDateRange[0].format('YYYY-MM-DD');
        const endDate = values.summaryDateRange[1].format('YYYY-MM-DD');
        filteredData = filteredData.filter(item => 
          item.date >= startDate && item.date <= endDate
        );
      }
      
      // 根据选择的油站过滤（多选）
      if (values.summaryStations && values.summaryStations.length > 0) {
        stationIds = Array.isArray(values.summaryStations) 
          ? values.summaryStations.map(station => 
              typeof station === 'string' ? station : station.value || station.id
            )
          : [values.summaryStations];
        
        console.log('处理后的油站ID:', stationIds);
        
        filteredData = filteredData.filter(item => 
          stationIds.includes(item.stationId)
        );
      }
      
      // 按日期进行汇总
      const summaryMap = new Map();
      
      filteredData.forEach(item => {
        const key = item.date;
        
        if (!summaryMap.has(key)) {
          summaryMap.set(key, {
            id: key,
            date: item.date,
            purchase92L: 0,
            purchase95L: 0,
            purchase0L: 0,
            purchaseUreaL: 0,
            purchase92T: 0,
            purchase95T: 0,
            purchase0T: 0,
            purchaseUreaT: 0,
            sales92IC: 0,
            sales92Cash: 0,
            sales92Total: 0,
            sales95IC: 0,
            sales95Cash: 0,
            sales95Total: 0,
            sales0IC: 0,
            sales0Cash: 0,
            sales0Total: 0,
            salesUreaIC: 0,
            salesUreaCash: 0,
            salesUreaTotal: 0,
            salesAmount92IC: 0,
            salesAmount92Cash: 0,
            salesAmount92Total: 0,
            salesAmount95IC: 0,
            salesAmount95Cash: 0,
            salesAmount95Total: 0,
            salesAmount0IC: 0,
            salesAmount0Cash: 0,
            salesAmount0Total: 0,
            salesAmountUreaIC: 0,
            salesAmountUreaCash: 0,
            salesAmountUreaTotal: 0,
            salesAmountTotalIC: 0,
            salesAmountTotalCash: 0,
            salesAmountTotalAll: 0,
            salesTon92: 0,
            salesTon95: 0,
            salesTon0: 0,
            salesTonUrea: 0,
            salesTonTotal: 0,
            inventory92L: 0,
            inventory95L: 0,
            inventory0L: 0,
            inventoryUreaL: 0,
            inventory92T: 0,
            inventory95T: 0,
            inventory0T: 0,
            inventoryUreaT: 0
          });
        }
        
        const summary = summaryMap.get(key);
        
        // 汇总各项数据
        summary.purchase92L += item.purchase92L || 0;
        summary.purchase95L += item.purchase95L || 0;
        summary.purchase0L += item.purchase0L || 0;
        summary.purchaseUreaL += item.purchaseUreaL || 0;
        summary.purchase92T += item.purchase92T || 0;
        summary.purchase95T += item.purchase95T || 0;
        summary.purchase0T += item.purchase0T || 0;
        summary.purchaseUreaT += item.purchaseUreaT || 0;
        
        summary.sales92IC += item.sales92IC || 0;
        summary.sales92Cash += item.sales92Cash || 0;
        summary.sales92Total += item.sales92Total || 0;
        summary.sales95IC += item.sales95IC || 0;
        summary.sales95Cash += item.sales95Cash || 0;
        summary.sales95Total += item.sales95Total || 0;
        summary.sales0IC += item.sales0IC || 0;
        summary.sales0Cash += item.sales0Cash || 0;
        summary.sales0Total += item.sales0Total || 0;
        summary.salesUreaIC += item.salesUreaIC || 0;
        summary.salesUreaCash += item.salesUreaCash || 0;
        summary.salesUreaTotal += item.salesUreaTotal || 0;
        
        summary.salesAmount92IC += item.salesAmount92IC || 0;
        summary.salesAmount92Cash += item.salesAmount92Cash || 0;
        summary.salesAmount92Total += item.salesAmount92Total || 0;
        summary.salesAmount95IC += item.salesAmount95IC || 0;
        summary.salesAmount95Cash += item.salesAmount95Cash || 0;
        summary.salesAmount95Total += item.salesAmount95Total || 0;
        summary.salesAmount0IC += item.salesAmount0IC || 0;
        summary.salesAmount0Cash += item.salesAmount0Cash || 0;
        summary.salesAmount0Total += item.salesAmount0Total || 0;
        summary.salesAmountUreaIC += item.salesAmountUreaIC || 0;
        summary.salesAmountUreaCash += item.salesAmountUreaCash || 0;
        summary.salesAmountUreaTotal += item.salesAmountUreaTotal || 0;
        summary.salesAmountTotalIC += item.salesAmountTotalIC || 0;
        summary.salesAmountTotalCash += item.salesAmountTotalCash || 0;
        summary.salesAmountTotalAll += item.salesAmountTotalAll || 0;
        
        summary.salesTon92 += item.salesTon92 || 0;
        summary.salesTon95 += item.salesTon95 || 0;
        summary.salesTon0 += item.salesTon0 || 0;
        summary.salesTonUrea += item.salesTonUrea || 0;
        summary.salesTonTotal += item.salesTonTotal || 0;
        
        summary.inventory92L += item.inventory92L || 0;
        summary.inventory95L += item.inventory95L || 0;
        summary.inventory0L += item.inventory0L || 0;
        summary.inventoryUreaL += item.inventoryUreaL || 0;
        summary.inventory92T += item.inventory92T || 0;
        summary.inventory95T += item.inventory95T || 0;
        summary.inventory0T += item.inventory0T || 0;
        summary.inventoryUreaT += item.inventoryUreaT || 0;
      });
      
      // 转换为数组并添加key字段
      const summaryData = Array.from(summaryMap.values()).map((item, index) => ({
        ...item,
        key: item.id || index.toString()
      }));
      
      setSummaryTableData(summaryData);
      setLoading(false);
      
      // 显示查询结果信息
      const selectedStationNames = getSelectedStationNames(stationIds);
      const stationInfo = selectedStationNames.length > 0 
        ? `，选中油站：${selectedStationNames.join('、')}` 
        : '';
      
      message.success(`汇总查询成功，共找到 ${summaryData.length} 条记录${stationInfo}`);
    }, 1000);
  };

  // 汇总查询重置处理
  const handleSummaryReset = () => {
    form.resetFields(['summaryDateRange', 'summaryStations']);
    setSummaryTableData([]);
    setSelectedSummaryStations([]);
    setSummaryDateRange([dayjs().subtract(7, 'day'), dayjs()]);
  };

  // 汇总查询导出处理
  const handleSummaryExport = () => {
    message.success('汇总数据导出功能开发中...');
  };

  // 初始化加载数据
  useEffect(() => {
    // 初始化显示前5条单站数据
    const initialData = inventoryData.singleStationData.slice(0, 5).map((item, index) => ({
      ...item,
      key: item.id || index.toString()
    }));
    setTableData(initialData);
    
    // 初始化汇总数据（按日期汇总前10条数据）
    const dataToSummarize = inventoryData.singleStationData.slice(0, 10);
    const summaryMap = new Map();
    
    dataToSummarize.forEach(item => {
      const key = item.date;
      
      if (!summaryMap.has(key)) {
        summaryMap.set(key, {
          id: key,
          date: item.date,
          purchase92L: 0,
          purchase95L: 0,
          purchase0L: 0,
          purchaseUreaL: 0,
          purchase92T: 0,
          purchase95T: 0,
          purchase0T: 0,
          purchaseUreaT: 0,
          sales92IC: 0,
          sales92Cash: 0,
          sales92Total: 0,
          sales95IC: 0,
          sales95Cash: 0,
          sales95Total: 0,
          sales0IC: 0,
          sales0Cash: 0,
          sales0Total: 0,
          salesUreaIC: 0,
          salesUreaCash: 0,
          salesUreaTotal: 0,
          salesAmount92IC: 0,
          salesAmount92Cash: 0,
          salesAmount92Total: 0,
          salesAmount95IC: 0,
          salesAmount95Cash: 0,
          salesAmount95Total: 0,
          salesAmount0IC: 0,
          salesAmount0Cash: 0,
          salesAmount0Total: 0,
          salesAmountUreaIC: 0,
          salesAmountUreaCash: 0,
          salesAmountUreaTotal: 0,
          salesAmountTotalIC: 0,
          salesAmountTotalCash: 0,
          salesAmountTotalAll: 0,
          salesTon92: 0,
          salesTon95: 0,
          salesTon0: 0,
          salesTonUrea: 0,
          salesTonTotal: 0,
          inventory92L: 0,
          inventory95L: 0,
          inventory0L: 0,
          inventoryUreaL: 0,
          inventory92T: 0,
          inventory95T: 0,
          inventory0T: 0,
          inventoryUreaT: 0
        });
      }
      
      const summary = summaryMap.get(key);
      
      // 汇总各项数据
      summary.purchase92L += item.purchase92L || 0;
      summary.purchase95L += item.purchase95L || 0;
      summary.purchase0L += item.purchase0L || 0;
      summary.purchaseUreaL += item.purchaseUreaL || 0;
      summary.purchase92T += item.purchase92T || 0;
      summary.purchase95T += item.purchase95T || 0;
      summary.purchase0T += item.purchase0T || 0;
      summary.purchaseUreaT += item.purchaseUreaT || 0;
      
      summary.sales92IC += item.sales92IC || 0;
      summary.sales92Cash += item.sales92Cash || 0;
      summary.sales92Total += item.sales92Total || 0;
      summary.sales95IC += item.sales95IC || 0;
      summary.sales95Cash += item.sales95Cash || 0;
      summary.sales95Total += item.sales95Total || 0;
      summary.sales0IC += item.sales0IC || 0;
      summary.sales0Cash += item.sales0Cash || 0;
      summary.sales0Total += item.sales0Total || 0;
      summary.salesUreaIC += item.salesUreaIC || 0;
      summary.salesUreaCash += item.salesUreaCash || 0;
      summary.salesUreaTotal += item.salesUreaTotal || 0;
      
      summary.salesAmount92IC += item.salesAmount92IC || 0;
      summary.salesAmount92Cash += item.salesAmount92Cash || 0;
      summary.salesAmount92Total += item.salesAmount92Total || 0;
      summary.salesAmount95IC += item.salesAmount95IC || 0;
      summary.salesAmount95Cash += item.salesAmount95Cash || 0;
      summary.salesAmount95Total += item.salesAmount95Total || 0;
      summary.salesAmount0IC += item.salesAmount0IC || 0;
      summary.salesAmount0Cash += item.salesAmount0Cash || 0;
      summary.salesAmount0Total += item.salesAmount0Total || 0;
      summary.salesAmountUreaIC += item.salesAmountUreaIC || 0;
      summary.salesAmountUreaCash += item.salesAmountUreaCash || 0;
      summary.salesAmountUreaTotal += item.salesAmountUreaTotal || 0;
      summary.salesAmountTotalIC += item.salesAmountTotalIC || 0;
      summary.salesAmountTotalCash += item.salesAmountTotalCash || 0;
      summary.salesAmountTotalAll += item.salesAmountTotalAll || 0;
      
      summary.salesTon92 += item.salesTon92 || 0;
      summary.salesTon95 += item.salesTon95 || 0;
      summary.salesTon0 += item.salesTon0 || 0;
      summary.salesTonUrea += item.salesTonUrea || 0;
      summary.salesTonTotal += item.salesTonTotal || 0;
      
      summary.inventory92L += item.inventory92L || 0;
      summary.inventory95L += item.inventory95L || 0;
      summary.inventory0L += item.inventory0L || 0;
      summary.inventoryUreaL += item.inventoryUreaL || 0;
      summary.inventory92T += item.inventory92T || 0;
      summary.inventory95T += item.inventory95T || 0;
      summary.inventory0T += item.inventory0T || 0;
      summary.inventoryUreaT += item.inventoryUreaT || 0;
    });
    
    const initialSummaryData = Array.from(summaryMap.values()).map((item, index) => ({
      ...item,
      key: item.id || index.toString()
    }));
    setSummaryTableData(initialSummaryData);
  }, []);

  return (
    <div className="station-inventory-report">
      <div className="page-header">
        <h2>9003油站进销存日报表</h2>
      </div>
      
      <Tabs defaultActiveKey="single" activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab="单站查询" key="single">
          {/* 筛选区域 */}
          <div className="filter-section">
            <Form
              form={form}
              layout="inline"
              onFinish={handleSearch}
              initialValues={{
                dateRange: dateRange,
                stations: undefined,
                oilTypes: []
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
                  multiple={false}
                  treeDefaultExpandAll={false}
                  treeDefaultExpandedKeys={['JXJTFS']}
                  showSearch={true}
                  treeNodeFilterProp="title"
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  allowClear={true}
                />
              </Form.Item>
              <Form.Item
                label="油品类型"
                name="oilTypes"
              >
                <Select
                  mode="multiple"
                  placeholder="请选择油品类型"
                  style={{ width: 200 }}
                  value={selectedOilTypes}
                  onChange={setSelectedOilTypes}
                  allowClear={true}
                >
                  {oilTypeOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
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
          <Card title="进销存数据">
            <Table
              columns={columns}
              dataSource={tableData}
              loading={loading}
              scroll={{ x: 'max-content', y: 600 }}
              pagination={{
                total: tableData.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
              }}
              size="small"
              bordered
            />
          </Card>
        </Tabs.TabPane>
        
        <Tabs.TabPane tab="汇总查询" key="summary">
          {/* 筛选区域 */}
          <div className="filter-section">
            <Form
              form={form}
              layout="inline"
              onFinish={handleSummarySearch}
              initialValues={{
                summaryDateRange: dateRange,
                summaryStations: []
              }}
            >
              <Form.Item
                label="日结日期"
                name="summaryDateRange"
                rules={[{ required: true, message: '请选择日结日期范围' }]}
              >
                <RangePicker
                  style={{ width: 280 }}
                  format="YYYY-MM-DD"
                  placeholder={['开始日期', '结束日期']}
                />
              </Form.Item>
              <Form.Item
                label="油站查询"
                name="summaryStations"
                rules={[{ required: true, message: '请选择油站' }]}
              >
                <TreeSelect
                  treeData={summaryTreeData}
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
                  onClick={handleSummaryReset}
                >
                  重置
                </Button>
                <Button 
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={handleSummaryExport}
                >
                  导出
                </Button>
              </Space>
            </div>
          </div>

          {/* 数据表格区 */}
          <Card title="进销存数据">
            <Table
              columns={summaryColumns}
              dataSource={summaryTableData}
              loading={loading}
              scroll={{ x: 'max-content', y: 600 }}
              pagination={{
                total: summaryTableData.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
              }}
              size="small"
              bordered
            />
          </Card>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default StationInventoryReport; 