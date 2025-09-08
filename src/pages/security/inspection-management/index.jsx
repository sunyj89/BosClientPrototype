import React, { useState, useEffect } from 'react';
import { Card, Tabs, Spin, Form, Row, Col, Input, Select, Button, Space, Table, Modal, Tag, Descriptions, message, DatePicker, TreeSelect, Popconfirm, Progress, Statistic, Alert, Radio, Upload, Collapse, Typography, Switch, TimePicker, InputNumber, Checkbox, Divider } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, SafetyOutlined, ScanOutlined, EnvironmentOutlined, AlertOutlined, BarChartOutlined, HistoryOutlined, UploadOutlined, DownloadOutlined, MinusCircleOutlined, FileTextOutlined, CameraOutlined, VideoCameraOutlined, CheckOutlined, NumberOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import './index.css';
import inspectionData from '../../../mock/security/inspectionData.json';
import inspectionDetailData from '../../../mock/security/inspectionDetailData.json';
import stationData from '../../../mock/station/stationData.json';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;
const { TextArea } = Input;

const InspectionManagement = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks');
  const [form] = Form.useForm();
  const [taskForm] = Form.useForm();
  const [nfcForm] = Form.useForm();
  const [pointForm] = Form.useForm();
  const [workOrderForm] = Form.useForm();
  
  // 数据状态
  const [taskList, setTaskList] = useState([]);
  const [nfcTags, setNfcTags] = useState([]);
  const [inspectionPoints, setInspectionPoints] = useState([]);
  const [executionStats, setExecutionStats] = useState([]);
  const [changeRecords, setChangeRecords] = useState([]);
  const [taskExecutionHistory, setTaskExecutionHistory] = useState([]);
  const [stationExecutionHistory, setStationExecutionHistory] = useState([]);
  const [inspectionDetails, setInspectionDetails] = useState([]);
  
  // 搜索筛选状态
  const [searchForm] = Form.useForm();
  const [filteredStationDetails, setFilteredStationDetails] = useState([]);
  
  // 弹窗状态
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [nfcModalVisible, setNfcModalVisible] = useState(false);
  const [pointModalVisible, setPointModalVisible] = useState(false);
  const [pointViewModalVisible, setPointViewModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [taskDetailModalVisible, setTaskDetailModalVisible] = useState(false);
  const [changeModalVisible, setChangeModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [stationListModalVisible, setStationListModalVisible] = useState(false);
  const [stationHistoryModalVisible, setStationHistoryModalVisible] = useState(false);
  const [inspectionDetailModalVisible, setInspectionDetailModalVisible] = useState(false);
  const [workOrderModalVisible, setWorkOrderModalVisible] = useState(false);
  const [changeRecordModalVisible, setChangeRecordModalVisible] = useState(false);
  const [nfcDetailModalVisible, setNfcDetailModalVisible] = useState(false);
  const [pointDetailModalVisible, setPointDetailModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [currentStation, setCurrentStation] = useState(null);
  const [modalType, setModalType] = useState('add'); // add, edit, view
  
  // 任务详情查看页面的搜索状态
  const [taskDetailSearchForm] = Form.useForm();
  const [filteredTaskStations, setFilteredTaskStations] = useState([]);
  
  // 文件上传状态
  const [uploadFileList, setUploadFileList] = useState([]);
  const [nfcSearchValue, setNfcSearchValue] = useState('');
  const [filteredNfcTags, setFilteredNfcTags] = useState([]);
  
  // 工单关联巡检单状态
  const [selectedInspectionIds, setSelectedInspectionIds] = useState([]);
  const [inspectionIssues, setInspectionIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  
  // 重复事件相关状态
  const [frequencyMode, setFrequencyMode] = useState('preset'); // 'preset' 或 'custom'
  const [presetFrequency, setPresetFrequency] = useState(''); // 预设频率
  const [customFrequency, setCustomFrequency] = useState({
    interval: 1, // 间隔数值
    unit: 'day', // 间隔单位: day, week, month, quarter, year
    weekdays: [], // 周几（当unit为week时）
    monthDate: 1, // 每月的第几天
    quarterOffset: 1 // 季度的第几天
  });
  const [scheduleTime, setScheduleTime] = useState({
    startTime: '08:00',
    endTime: '09:00'
  });
  const [scheduleRule, setScheduleRule] = useState(''); // 动态生成的规则描述

  // 检查项管理相关状态
  const [inspectionItems, setInspectionItems] = useState([]);
  const [currentInspectionItem, setCurrentInspectionItem] = useState(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  // 初始化规则描述
  useEffect(() => {
    if (frequencyMode && (presetFrequency || customFrequency)) {
      setScheduleRule(generateScheduleRule());
    }
  }, [frequencyMode, presetFrequency, customFrequency, scheduleTime]);

  // 监听NFC标签数据变化，初始化过滤列表
  useEffect(() => {
    setFilteredNfcTags(nfcTags);
  }, [nfcTags]);

  // NFC标签搜索过滤
  useEffect(() => {
    if (!nfcSearchValue) {
      setFilteredNfcTags(nfcTags);
    } else {
      const filtered = nfcTags.filter(tag => 
        tag.tagName.toLowerCase().includes(nfcSearchValue.toLowerCase()) ||
        tag.tagCode.toLowerCase().includes(nfcSearchValue.toLowerCase())
      );
      setFilteredNfcTags(filtered);
    }
  }, [nfcSearchValue, nfcTags]);

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      // 处理巡检任务数据，支持单油站和多油站统计摘要显示
      const processedTasks = inspectionData.inspectionTasks.map(task => {
        let stationSummary = null;
        let relatedStations = [];
        let relatedBranches = [];

        // 判断任务类型并处理油站关联
        if (task.stationId === "ALL" || task.stationName?.includes("全省")) {
          // 全省级任务 - 关联所有油站
          relatedStations = stationData.stations;
          relatedBranches = stationData.branches;
        } else if (task.branchName === "全部") {
          // 多分公司任务 - 关联所有油站
          relatedStations = stationData.stations;
          relatedBranches = stationData.branches;
        } else if (task.branchName && task.branchName !== "全部" && task.stationId === task.stationId) {
          // 分公司级任务 - 关联该分公司下的所有油站
          const branch = stationData.branches.find(b => b.name === task.branchName);
          if (branch) {
            relatedStations = stationData.stations.filter(s => s.branchId === branch.id);
            relatedBranches = [branch];
          }
        } else if (task.stationId && task.stationId !== "ALL") {
          // 单油站任务
          const station = stationData.stations.find(s => s.id === task.stationId);
          if (station) {
            relatedStations = [station];
            const branch = stationData.branches.find(b => b.id === station.branchId);
            if (branch) {
              relatedBranches = [branch];
            }
          }
        }

        // 生成统计摘要
        if (relatedStations.length > 0) {
          const branchStats = relatedBranches.map(branch => {
            const branchStations = relatedStations.filter(s => s.branchId === branch.id);
            return {
              branchName: branch.name.replace('分公司', ''),
              stationCount: branchStations.length
            };
          });

          stationSummary = {
            totalBranches: relatedBranches.length,
            totalStations: relatedStations.length,
            branchStats: branchStats,
            stations: relatedStations
          };
        }

        // 关联巡检点位模板和NFC标签数据
        let relatedInspectionPoints = [];
        if (relatedStations.length > 0) {
          // 获取任务配置的巡检点位模板（从任务的inspectionPoints字段）
          const taskInspectionAreas = task.inspectionPoints || [];
          
          // 基于任务配置的区域，获取对应的点位模板
          relatedInspectionPoints = inspectionData.inspectionPointTemplates.filter(template => 
            taskInspectionAreas.includes(template.checkArea) && template.isActive
          );

          // 为每个点位模板关联相关油站的NFC标签
          relatedInspectionPoints = relatedInspectionPoints.map(template => {
            const stationIds = relatedStations.map(s => s.id);
            
            // 查找该区域在各个油站的NFC标签
            const relatedNfcTags = inspectionData.nfcTags.filter(nfc => 
              stationIds.includes(nfc.stationId) && 
              nfc.checkArea === template.checkArea
            );

            // 按油站分组NFC标签
            const nfcTagsByStation = relatedStations.map(station => {
              const stationNfcTags = relatedNfcTags.filter(nfc => nfc.stationId === station.id);
              return {
                stationId: station.id,
                stationName: station.name,
                nfcTags: stationNfcTags
              };
            }).filter(item => item.nfcTags.length > 0);

            return {
              ...template,
              relatedNfcTags,
              nfcTagsByStation,
              affectedStationCount: nfcTagsByStation.length
            };
          });
        }

        return {
          ...task,
          stationSummary,
          relatedInspectionPoints,
          // 保持向后兼容
          stationNames: relatedStations.length > 0 ? relatedStations.map(s => s.name) : []
        };
      }).filter(task => {
        // 只显示有关联油站的任务
        return task.stationSummary && task.stationSummary.totalStations > 0;
      });

      setTaskList(processedTasks);
      setNfcTags(inspectionData.nfcTags);
      setInspectionPoints(inspectionData.inspectionPointTemplates);
      setExecutionStats(inspectionData.executionStats);
      setChangeRecords(inspectionData.changeRecords);
      setTaskExecutionHistory(inspectionData.taskExecutionHistory);
      setStationExecutionHistory(inspectionData.stationExecutionHistory);
      setInspectionDetails(inspectionDetailData.inspectionDetails);
      setFilteredStationDetails([]);
      setLoading(false);
    }, 500);
  };

  // 处理搜索
  const handleSearch = (values) => {
    console.log('搜索条件:', values);
    message.success('搜索功能已触发');
  };

  // 重置搜索
  const handleReset = () => {
    form.resetFields();
    message.info('搜索条件已重置');
  };

  // 新增任务
  const handleAddTask = () => {
    setModalType('add');
    taskForm.resetFields();
    
    // 重置重复事件状态
    setFrequencyMode('preset');
    setPresetFrequency('');
    setCustomFrequency({
      interval: 1,
      unit: 'day',
      weekdays: [],
      monthMode: 'date',
      monthDate: 1,
      monthWeekday: { nth: 'first', day: 'monday' },
      quarterMode: 'first',
      quarterOffset: 1
    });
    setScheduleTime({ startTime: '08:00', endTime: '09:00' });
    setScheduleRule('');
    
    // 为新增模式生成临时ID
    const tempId = `TASK${String(Math.floor(Math.random() * 90000000) + 10000000)}`;
    const today = dayjs();
    const oneYearLater = today.add(1, 'year');
    taskForm.setFieldsValue({ 
      taskId: tempId,
      validityStartDate: today,
      validityEndDate: oneYearLater
    });
    setTaskModalVisible(true);
  };

  // 编辑任务
  const handleEditTask = (record) => {
    setModalType('edit');
    setCurrentRecord(record);
    taskForm.setFieldsValue({
      taskId: record.id,
      taskName: record.taskName,
      stationIds: record.stationIds || [],
      inspectionType: record.inspectionType,
      frequency: record.frequency,
      priority: record.priority,
      creator: record.creator,
      inspectionPointIds: record.inspectionPointIds || [],
      description: record.description,
      validityStartDate: record.validityStartDate ? dayjs(record.validityStartDate) : dayjs(),
      validityEndDate: record.validityEndDate ? dayjs(record.validityEndDate) : dayjs().add(1, 'year')
    });
    setTaskModalVisible(true);
  };

  // 查看详情
  const handleViewDetail = (record) => {
    // 为任务添加关联的油站数据
    const mockStations = [
      { id: 'ST001', name: '南昌高速服务区加油站', branchName: '赣中分公司', serviceAreaName: '南昌服务区', status: '已完成', progress: 100 },
      { id: 'ST002', name: '上饶高速服务区加油站', branchName: '赣东北分公司', serviceAreaName: '上饶服务区', status: '进行中', progress: 75 },
      { id: 'ST003', name: '赣州高速服务区加油站', branchName: '赣南分公司', serviceAreaName: '赣州服务区', status: '待执行', progress: 0 },
      { id: 'ST004', name: '九江高速服务区加油站', branchName: '赣北分公司', serviceAreaName: '九江服务区', status: '已完成', progress: 100 },
      { id: 'ST005', name: '鹰潭高速服务区加油站', branchName: '赣东分公司', serviceAreaName: '鹰潭服务区', status: '进行中', progress: 60 },
      { id: 'ST006', name: '宜春高速服务区加油站', branchName: '赣西分公司', serviceAreaName: '宜春服务区', status: '已完成', progress: 100 },
      { id: 'ST007', name: '吉安高速服务区加油站', branchName: '赣西南分公司', serviceAreaName: '吉安服务区', status: '待执行', progress: 0 },
      { id: 'ST008', name: '景德镇高速服务区加油站', branchName: '赣东北分公司', serviceAreaName: '景德镇服务区', status: '进行中', progress: 45 },
      { id: 'ST009', name: '萍乡高速服务区加油站', branchName: '赣西分公司', serviceAreaName: '萍乡服务区', status: '已完成', progress: 100 },
      { id: 'ST010', name: '新余高速服务区加油站', branchName: '赣中分公司', serviceAreaName: '新余服务区', status: '进行中', progress: 80 }
    ];
    
    const recordWithStations = {
      ...record,
      relatedStations: mockStations,
      validityStartDate: record.validityStartDate || '2025-01-01',
      validityEndDate: record.validityEndDate || '2025-12-31'
    };
    
    setCurrentRecord(recordWithStations);
    setFilteredTaskStations(mockStations);
    setViewModalVisible(true);
  };

  // 查看修改记录
  const handleViewChanges = () => {
    setChangeModalVisible(true);
  };

  // 删除记录
  const handleDelete = (record) => {
    message.success(`删除${record.taskName || record.tagName || record.pointName}成功`);
  };

  // 保存任务
  const handleSaveTask = async (values) => {
    try {
      // 处理多选油站数据
      const selectedStations = stationData.stations.filter(station => 
        values.stationIds.includes(station.id)
      );
      const selectedBranches = [...new Set(selectedStations.map(s => s.branchId))]
        .map(branchId => stationData.branches.find(b => b.id === branchId));
      
      // 处理多选巡检点位数据
      const selectedPoints = inspectionPoints.filter(point => 
        values.inspectionPointIds?.includes(point.id)
      );

      const taskData = {
        taskName: values.taskName,
        inspectionType: values.inspectionType,
        frequency: scheduleRule || values.frequency, // 使用生成的规则描述
        priority: values.priority,
        creator: values.creator,
        description: values.description,
        stationIds: values.stationIds,
        stationNames: selectedStations.map(s => s.name),
        branchNames: selectedBranches.map(b => b.name),
        inspectionPointIds: values.inspectionPointIds || [],
        inspectionPoints: selectedPoints,
        status: '待执行',
        createTime: new Date().toISOString().split('T')[0],
        validityStartDate: values.validityStartDate ? values.validityStartDate.format('YYYY-MM-DD') : null,
        validityEndDate: values.validityEndDate ? values.validityEndDate.format('YYYY-MM-DD') : null,
        // 重复事件数据
        scheduleData: {
          frequencyMode,
          presetFrequency: frequencyMode === 'preset' ? presetFrequency : null,
          customFrequency: frequencyMode === 'custom' ? customFrequency : null,
          scheduleTime,
          scheduleRule
        }
      };

      if (modalType === 'add') {
        // 系统自动生成任务ID：TASK+8位数字
        taskData.id = `TASK${String(Math.floor(Math.random() * 90000000) + 10000000)}`;
        console.log('新增巡检任务:', taskData);
        message.success(`任务创建成功！系统自动分配任务ID：${taskData.id}`);
      } else {
        taskData.id = currentRecord.id;
        console.log('更新巡检任务:', taskData);
        message.success('任务更新成功');
      }
      
      setTaskModalVisible(false);
      loadData();
    } catch (error) {
      message.error('保存失败');
    }
  };

  // 下载导入模板
  const handleDownloadTemplate = () => {
    // 创建模板数据
    const templateData = [
      {
        '检查区域': '油罐区',
        '检查点位': '卸油口、管道连接、围堰设施、防雷接地',
        '所属油站ID': 'ST001',
        '位置描述': '主要油品储存区域，包含4个储油罐'
      }
    ];
    
    // 转换为CSV格式
    const headers = ['检查区域', '检查点位', '所属油站ID', '位置描述'];
    const csvContent = [
      headers.join(','),
      ...templateData.map(row => headers.map(header => `\"${row[header] || ''}\"`).join(','))
    ].join('\n');
    
    // 下载文件
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', '巡检点位导入模板.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('模板下载成功');
  };

  // 批量导入点位
  const handleImportPoints = () => {
    setImportModalVisible(true);
    setUploadFileList([]);
  };

  // 处理文件上传
  const handleFileUpload = (info) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1); // 只保留最后一个文件
    setUploadFileList(fileList);
  };

  // 确认导入
  const handleConfirmImport = () => {
    if (uploadFileList.length === 0) {
      message.error('请选择要导入的文件');
      return;
    }
    
    const file = uploadFileList[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const csvData = e.target.result;
        const lines = csvData.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          message.error('文件内容为空或格式不正确');
          return;
        }
        
        // 解析CSV数据
        const headers = lines[0].split(',').map(h => h.replace(/\"/g, '').trim());
        const dataRows = lines.slice(1);
        
        let successCount = 0;
        let errorCount = 0;
        
        // 根据当前激活的tab决定导入类型
        if (activeTab === 'nfc') {
          // 导入NFC标签
          dataRows.forEach((row, index) => {
            try {
              const values = row.split(',').map(v => v.replace(/\"/g, '').trim());
              const rowData = {};
              
              headers.forEach((header, i) => {
                rowData[header] = values[i] || '';
              });
              
              // 验证必填字段
              if (!rowData['标签编码'] || !rowData['标签名称'] || !rowData['所属油站ID']) {
                errorCount++;
                return;
              }
              
              // 查找油站信息
              const station = stationData.stations.find(s => s.id === rowData['所属油站ID']);
              if (!station) {
                errorCount++;
                return;
              }
              
              // 查找关联点位信息
              let selectedPoint = null;
              if (rowData['关联点位ID']) {
                selectedPoint = inspectionData.inspectionPoints.find(p => p.id === rowData['关联点位ID']);
              }
              
              // 生成NFC标签数据
              const nfcData = {
                id: `NFC${String(Math.floor(Math.random() * 900000) + 100000)}`,
                tagCode: rowData['标签编码'],
                tagName: rowData['标签名称'],
                stationId: rowData['所属油站ID'],
                stationName: station.name,
                pointId: rowData['关联点位ID'] || null,
                pointName: selectedPoint ? selectedPoint.checkArea : null,
                checkArea: selectedPoint ? selectedPoint.checkArea : null,
                checkPoints: selectedPoint ? selectedPoint.checkPoints : null,
                maintainer: rowData['维护人'] || '',
                maintainTime: rowData['维护时间'] || new Date().toISOString().split('T')[0],
                installDate: new Date().toISOString().split('T')[0]
              };
              
              console.log('导入NFC标签数据:', nfcData);
              successCount++;
              
            } catch (error) {
              console.error(`第${index + 1}行数据处理失败:`, error);
              errorCount++;
            }
          });
        } else {
          // 导入巡检点位
          dataRows.forEach((row, index) => {
            try {
              const values = row.split(',').map(v => v.replace(/\"/g, '').trim());
              const rowData = {};
              
              headers.forEach((header, i) => {
                rowData[header] = values[i] || '';
              });
              
              // 验证必填字段
              if (!rowData['检查区域'] || !rowData['检查点位'] || !rowData['所属油站ID']) {
                errorCount++;
                return;
              }
              
              // 查找油站信息
              const station = stationData.stations.find(s => s.id === rowData['所属油站ID']);
              if (!station) {
                errorCount++;
                return;
              }
              
              // 生成点位数据
              const pointData = {
                id: `checkpoint${String(Math.floor(Math.random() * 900000) + 100000)}`,
                checkArea: rowData['检查区域'],
                checkPoints: rowData['检查点位'],
                stationId: rowData['所属油站ID'],
                stationName: station.name,
                groupId: station.branchId,
                locationDesc: rowData['位置描述'] || '',
                isDelete: 0,
                associatedLabels: []
              };
              
              console.log('导入点位数据:', pointData);
              successCount++;
              
            } catch (error) {
              console.error(`第${index + 1}行数据处理失败:`, error);
              errorCount++;
            }
          });
        }
        
        message.success(`导入完成！成功${successCount}条，失败${errorCount}条`);
        setImportModalVisible(false);
        setUploadFileList([]);
        loadData();
        
      } catch (error) {
        console.error('文件解析失败:', error);
        message.error('文件解析失败，请检查文件格式');
      }
    };
    
    reader.readAsText(file.originFileObj, 'UTF-8');
  };

  // 新增点位
  const handleAddPoint = () => {
    setModalType('add');
    pointForm.resetFields();
    
    // 初始化检查项数据
    setInspectionItems([]);
    
    // 为新增模式生成临时ID
    const tempId = `checkpoint${String(Math.floor(Math.random() * 900000) + 100000)}`;
    pointForm.setFieldsValue({ pointId: tempId });
    setPointModalVisible(true);
  };

  // 编辑点位
  const handleEditPoint = (record) => {
    setModalType('edit');
    setCurrentRecord(record);
    
    // 初始化检查项数据，兼容旧数据结构
    const items = (record.inspectionItems || []).map(item => {
      // 如果是旧数据结构，转换为新结构
      if (item.inspectionMethod && !item.inspectionMethods) {
        return {
          ...item,
          inspectionMethods: [{
            method: item.inspectionMethod
          }]
        };
      }
      return item;
    });
    setInspectionItems(items);
    
    pointForm.setFieldsValue({
      pointId: record.id,
      pointName: record.pointName,
      checkArea: record.checkArea,
      checkPoints: record.checkPoints,
      locationDesc: record.locationDesc,
      inspectionItems: items
    });
    setPointModalVisible(true);
  };

  // 检查项管理函数
  // 添加检查项
  const handleAddInspectionItem = () => {
    const newItem = {
      id: `item_${Date.now()}`,
      itemName: '',
      inspectionMethods: [{
        method: 'text'
      }], // 支持多个检查方式
      description: ''
    };
    setInspectionItems([...inspectionItems, newItem]);
  };

  // 删除检查项
  const handleRemoveInspectionItem = (itemId) => {
    setInspectionItems(inspectionItems.filter(item => item.id !== itemId));
  };

  // 更新检查项
  const handleUpdateInspectionItem = (itemId, field, value) => {
    setInspectionItems(inspectionItems.map(item => 
      item.id === itemId 
        ? { ...item, [field]: value }
        : item
    ));
  };

  // 切换检查方式
  const handleToggleInspectionMethod = (itemId, methodKey) => {
    setInspectionItems(inspectionItems.map(item => {
      if (item.id === itemId) {
        const currentMethods = item.inspectionMethods || [];
        const existingIndex = currentMethods.findIndex(m => m.method === methodKey);
        
        let newMethods;
        if (existingIndex >= 0) {
          // 如果已存在，则移除
          newMethods = currentMethods.filter(m => m.method !== methodKey);
        } else {
          // 如果不存在，则添加
          newMethods = [...currentMethods, { method: methodKey }];
        }
        
        return { ...item, inspectionMethods: newMethods };
      }
      return item;
    }));
  };

  // 更新检查方式的必填状态
  // 获取检查方式的展示名称
  const getInspectionMethodName = (method) => {
    const methodMap = {
      'text': '文字记录',
      'photo': '拍照记录',
      'video': '视频记录',
      'checkbox': '勾选检查',
      'number': '数值记录'
    };
    return methodMap[method] || method;
  };

  // 获取检查方式的图标
  const getInspectionMethodIcon = (method) => {
    const iconMap = {
      'text': <FileTextOutlined />,
      'photo': <CameraOutlined />,
      'video': <VideoCameraOutlined />,
      'checkbox': <CheckOutlined />,
      'number': <NumberOutlined />
    };
    return iconMap[method] || <FileTextOutlined />;
  };

  // 查看点位详情
  const handleViewPointDetail = (record) => {
    setCurrentRecord(record);
    setPointViewModalVisible(true);
  };

  // 删除点位
  const handleDeletePoint = (record) => {
    console.log('删除点位:', record);
    message.success(`删除点位"${record.name}"成功`);
    loadData();
  };

  // 保存点位
  const handleSavePoint = async (values) => {
    try {
      // 校验检查项数据
      if (inspectionItems.length === 0) {
        message.error('请至少添加一个检查项');
        return;
      }
      
      // 校验检查项必填字段
      const invalidItems = inspectionItems.filter(item => 
        !item.itemName.trim() || 
        !item.inspectionMethods || 
        item.inspectionMethods.length === 0
      );
      if (invalidItems.length > 0) {
        message.error('请填写所有检查项的名称并选择至少一种检查方式');
        return;
      }

      const pointData = {
        checkArea: values.checkArea,
        pointName: values.pointName,
        checkPoints: values.checkPoints,
        locationDesc: values.locationDesc,
        isDelete: 0,
        associatedLabels: [],
        inspectionItems: inspectionItems.map(item => ({
          ...item,
          id: item.id.startsWith('item_') ? `${values.pointId || currentRecord?.id}_${item.id}` : item.id
        })) // 保存检查项数据
      };

      if (modalType === 'add') {
        // 系统自动生成点位ID：checkpoint+6位数字
        pointData.id = `checkpoint${String(Math.floor(Math.random() * 900000) + 100000)}`;
        console.log('新增点位:', pointData);
        message.success(`点位创建成功！系统自动分配点位ID：${pointData.id}，已添加${inspectionItems.length}个检查项`);
      } else {
        pointData.id = currentRecord.id;
        console.log('更新点位:', pointData);
        message.success(`点位更新成功，已更新${inspectionItems.length}个检查项`);
      }
      
      setPointModalVisible(false);
      setInspectionItems([]); // 清空检查项状态
      loadData();
    } catch (error) {
      message.error('保存失败');
    }
  };

  // NFC标签相关处理函数
  // 新增NFC标签
  const handleAddNfc = () => {
    setModalType('add');
    nfcForm.resetFields();
    // 为新增模式生成临时ID
    const tempId = `NFC${String(Math.floor(Math.random() * 900000) + 100000)}`;
    nfcForm.setFieldsValue({ tagId: tempId });
    setNfcModalVisible(true);
  };

  // 编辑NFC标签
  const handleEditNfc = (record) => {
    setModalType('edit');
    setCurrentRecord(record);
    nfcForm.setFieldsValue({
      tagId: record.id,
      tagCode: record.tagCode,
      tagName: record.tagName,
      stationId: record.stationId,
      pointId: record.pointId || undefined,
      description: record.description
    });
    setNfcModalVisible(true);
  };

  // 查看NFC标签详情
  const handleViewNfcDetail = (record) => {
    setCurrentRecord(record);
    nfcForm.setFieldsValue({
      tagId: record.id,
      tagCode: record.tagCode,
      tagName: record.tagName,
      stationId: record.stationId,
      pointId: record.pointId || undefined,
      description: record.description
    });
    setNfcModalVisible(true);
    setModalType('view');
  };

  // 删除NFC标签
  const handleDeleteNfc = (record) => {
    console.log('删除NFC标签:', record);
    message.success(`删除NFC标签"${record.tagName}"成功`);
    loadData();
  };

  // 保存NFC标签
  const handleSaveNfc = async (values) => {
    try {
      // 根据选择的油站ID获取对应的油站信息
      const selectedStation = stationData.stations.find(s => s.id === values.stationId);
      if (!selectedStation) {
        message.error('请选择有效的油站');
        return;
      }

      // 如果选择了巡检点位，获取点位信息
      let selectedPoint = null;
      if (values.pointId) {
        selectedPoint = inspectionPoints.find(p => p.id === values.pointId);
        if (!selectedPoint) {
          message.error('选择的巡检点位不存在，请重新选择');
          return;
        }
      }

      const nfcData = {
        tagCode: values.tagCode,
        tagName: values.tagName,
        stationId: values.stationId,
        stationName: selectedStation.name,
        // 关联点位信息，只保存点位ID
        pointId: values.pointId || null,
        // 如果需要显示点位详情，可以在显示时动态获取
        checkArea: selectedPoint ? selectedPoint.checkArea : null,
        checkPoints: selectedPoint ? selectedPoint.checkPoints : null,
        description: values.description || null,
        installDate: new Date().toISOString().split('T')[0] // 自动记录安装日期
      };

      if (modalType === 'add') {
        // 系统自动生成NFC标签ID：NFC+6位数字
        nfcData.id = `NFC${String(Math.floor(Math.random() * 900000) + 100000)}`;
        console.log('新增NFC标签:', nfcData);
        message.success(`NFC标签创建成功！系统自动分配标签ID：${nfcData.id}${selectedPoint ? `，已关联巡检点位：${selectedPoint.checkArea}-${selectedPoint.checkPoints}` : ''}`);
      } else {
        nfcData.id = currentRecord.id;
        console.log('更新NFC标签:', nfcData);
        message.success(`NFC标签更新成功${selectedPoint ? `，已关联巡检点位：${selectedPoint.checkArea}-${selectedPoint.checkPoints}` : ''}`);
      }
      
      setNfcModalVisible(false);
      loadData();
    } catch (error) {
      message.error('保存失败');
    }
  };

  // 处理启用/禁用切换
  const handleToggleEnabled = (record, checked) => {
    try {
      // 更新任务的启用状态
      console.log(`${checked ? '启用' : '禁用'}任务: ${record.taskName}`);
      message.success(`任务"${record.taskName}"已${checked ? '启用' : '禁用'}`);
      
      // 这里可以调用API更新数据库
      // 为了演示，这里只是显示消息
      loadData();
    } catch (error) {
      message.error('操作失败，请重试');
    }
  };

  // 下载NFC标签导入模板
  const handleDownloadNfcTemplate = () => {
    // 创建模板数据
    const templateData = [
      {
        '标签编码': 'NFC-ST001-001',
        '标签名称': '南昌服务区油罐区NFC标签',
        '所属油站ID': 'ST001',
        '关联点位ID': 'checkpoint123456',
        '维护人': '张安全',
        '维护时间': '2024-12-01'
      }
    ];
    
    // 转换为CSV格式
    const headers = ['标签编码', '标签名称', '所属油站ID', '关联点位ID', '维护人', '维护时间'];
    const csvContent = [
      headers.join(','),
      ...templateData.map(row => headers.map(header => `\"${row[header] || ''}\"`).join(','))
    ].join('\n');
    
    // 下载文件
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'NFC标签导入模板.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('模板下载成功');
  };

  // 批量导入NFC标签
  const handleImportNfcTags = () => {
    setImportModalVisible(true);
    setUploadFileList([]);
  };

  // 查看任务执行详情
  const handleViewTaskDetail = (record) => {
    // 为统计详情添加新的数据字段
    const enhancedRecord = {
      ...record,
      stationDetails: record.stationDetails?.map(station => ({
        ...station,
        totalInspections: Math.floor(Math.random() * 20) + 10, // 应巡检次数 10-30
        completedInspections: Math.floor(Math.random() * 15) + 5, // 已巡检次数 5-20
        issueCount: Math.floor(Math.random() * 5), // 问题数 0-4
        workOrderCount: Math.floor(Math.random() * 3), // 工单数 0-2
        lastInspectionTime: `2025-01-${String(Math.floor(Math.random() * 25) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 12) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`
      })) || []
    };
    
    setCurrentRecord(enhancedRecord);
    setTaskDetailModalVisible(true);
  };

  // 查看油站历史执行记录
  const handleViewStationHistory = (station) => {
    // 为历史记录添加新的数据字段
    const enhancedStation = {
      ...station,
      historyRecords: [
        {
          inspectionId: `XJD${station.stationId || 'ST001'}202501270001`,
          status: '按时完成',
          totalItems: 25,
          completedItems: 25,
          issueCount: 0,
          workOrderCount: 0,
          completedTime: '2025-01-27 16:30:00',
          timestamp: '202501270001'
        },
        {
          inspectionId: `XJD${station.stationId || 'ST001'}202501200002`,
          status: '按时完成',
          totalItems: 25,
          completedItems: 24,
          issueCount: 1,
          workOrderCount: 1,
          completedTime: '2025-01-20 15:45:00',
          timestamp: '202501200002'
        },
        {
          inspectionId: `XJD${station.stationId || 'ST001'}202501130003`,
          status: '逾期完成',
          totalItems: 25,
          completedItems: 23,
          issueCount: 2,
          workOrderCount: 1,
          completedTime: '2025-01-14 09:20:00',
          timestamp: '202501130003'
        },
        {
          inspectionId: `XJD${station.stationId || 'ST001'}202501060004`,
          status: '按时完成',
          totalItems: 25,
          completedItems: 25,
          issueCount: 0,
          workOrderCount: 0,
          completedTime: '2025-01-06 17:10:00',
          timestamp: '202501060004'
        },
        {
          inspectionId: `XJD${station.stationId || 'ST001'}202412300005`,
          status: '进行中',
          totalItems: 25,
          completedItems: 18,
          issueCount: 1,
          workOrderCount: 0,
          completedTime: '-',
          timestamp: '202412300005'
        }
      ]
    };
    
    setCurrentStation(enhancedStation);
    setStationHistoryModalVisible(true);
  };

  // 查看任务执行历史记录
  const handleViewTaskHistory = (record) => {
    setCurrentRecord(record);
    setHistoryModalVisible(true);
  };

  // 查看油站执行历史记录
  const handleViewStationTaskHistory = (stationRecord, taskRecord) => {
    // 保持原来的 currentRecord 不变，只设置历史记录相关的信息
    setCurrentRecord({
      ...currentRecord,
      stationName: stationRecord.stationName,
      stationId: stationRecord.stationId,
      taskName: taskRecord.taskName,
      taskId: taskRecord.taskId
    });
    setHistoryModalVisible(true);
  };

  // 搜索油站执行状态
  const handleSearchStations = () => {
    const values = searchForm.getFieldsValue();
    let filtered = currentRecord?.stationDetails || [];
    
    // 组织筛选
    if (values.organization) {
      if (values.organization === 'central') {
        filtered = filtered.filter(station => station.branchName === '赣中分公司');
      } else if (values.organization === 'northeast') {
        filtered = filtered.filter(station => station.branchName === '赣东北分公司');
      } else if (values.organization === 'south') {
        filtered = filtered.filter(station => station.branchName === '赣南分公司');
      } else if (values.organization === 'west') {
        filtered = filtered.filter(station => station.branchName === '赣西分公司');
      }
    }
    
    // 状态筛选
    if (values.status) {
      filtered = filtered.filter(station => station.status === values.status);
    }
    
    // 时间范围筛选
    if (values.timeRange && values.timeRange.length === 2) {
      const startDate = values.timeRange[0].startOf('day');
      const endDate = values.timeRange[1].endOf('day');
      filtered = filtered.filter(station => {
        if (station.startTime) {
          const stationStartTime = dayjs(station.startTime);
          return stationStartTime.isBetween(startDate, endDate, null, '[]');
        }
        return false;
      });
    }
    
    setFilteredStationDetails(filtered);
  };

  // 重置搜索
  const handleResetSearch = () => {
    searchForm.resetFields();
    setFilteredStationDetails([]);
  };

  // 任务详情页面的油站搜索筛选
  const handleTaskDetailSearch = () => {
    const values = taskDetailSearchForm.getFieldsValue();
    let filtered = currentRecord?.relatedStations || [];
    
    // 分公司筛选
    if (values.branchName) {
      filtered = filtered.filter(station => station.branchName === values.branchName);
    }
    
    // 名称搜索
    if (values.stationName) {
      filtered = filtered.filter(station => 
        station.name.toLowerCase().includes(values.stationName.toLowerCase()) ||
        station.serviceAreaName.toLowerCase().includes(values.stationName.toLowerCase())
      );
    }
    
    setFilteredTaskStations(filtered);
  };

  // 任务详情页面重置搜索
  const handleTaskDetailReset = () => {
    taskDetailSearchForm.resetFields();
    setFilteredTaskStations(currentRecord?.relatedStations || []);
  };

  // 执行统计搜索
  const handleStatsSearch = () => {
    const values = form.getFieldsValue();
    console.log('执行统计搜索:', values);
    // 这里可以添加具体的筛选逻辑
  };

  // 执行统计重置
  const handleStatsReset = () => {
    form.resetFields();
    console.log('执行统计重置');
    // 这里可以添加具体的重置逻辑
  };

  // 查看巡检单详情
  const handleViewInspectionDetail = (record) => {
    setCurrentRecord(record);
    setInspectionDetailModalVisible(true);
  };

  // 巡检单明细搜索
  const handleInspectionDetailSearch = (values) => {
    console.log('巡检单明细搜索:', values);
    message.success('搜索功能已触发');
  };

  // 巡检单明细重置
  const handleInspectionDetailReset = () => {
    form.resetFields();
    message.info('搜索条件已重置');
  };

  // 查看工单详情
  const handleViewWorkOrder = (record) => {
    setModalType('view');
    setCurrentRecord(record);
    setWorkOrderModalVisible(true);
  };

  // 处理工单
  const handleProcessWorkOrder = (record) => {
    message.success(`开始处理工单：${record.title}`);
    console.log('处理工单:', record);
  };

  // 审核工单
  const handleAuditWorkOrder = (record) => {
    message.success(`开始审核工单：${record.title}`);
    console.log('审核工单:', record);
  };

  // 删除工单
  const handleDeleteWorkOrder = (record) => {
    message.success(`删除工单"${record.title}"成功`);
    console.log('删除工单:', record);
  };

  // 手工创建工单
  const handleCreateWorkOrder = () => {
    setModalType('add');
    workOrderForm.resetFields();
    
    // 重置巡检单相关状态
    setSelectedInspectionIds([]);
    setInspectionIssues([]);
    setSelectedIssue(null);
    
    // 生成工单编号
    const today = dayjs();
    const workOrderId = `WO-${today.format('YYYYMMDD')}-${String(Math.floor(Math.random() * 900) + 100)}`;
    workOrderForm.setFieldsValue({
      workOrderId: workOrderId,
      sourceType: '手动创建',
      urgency: '一般',
      status: '待处理',
      submitter: '当前用户', // 去掉系统自动名称
      createTime: today.format('YYYY-MM-DD HH:mm:ss')
    });
    setWorkOrderModalVisible(true);
  };

  // 保存工单
  const handleSaveWorkOrder = (values) => {
    console.log('保存工单数据:', values);
    
    // 处理日期格式
    const processedValues = {
      ...values,
      deadline: values.deadline ? dayjs(values.deadline).format('YYYY-MM-DD HH:mm:ss') : null
    };
    
    // 构造完整的工单数据
    const workOrderData = {
      id: `WO${String(Math.floor(Math.random() * 900) + 100)}`,
      ...processedValues,
      sourceId: selectedInspectionIds.length > 0 ? selectedInspectionIds.join(',') : null, // 关联的巡检单ID(多个用逗号分隔)
      sourceType: selectedInspectionIds.length > 0 ? '巡检异常' : '手动创建', // 根据是否关联巡检单设置来源类型
      handler: null, // 初始状态没有处理人
      relatedIssues: inspectionIssues, // 关联的所有问题信息
    };
    
    message.success(`工单创建成功！${selectedInspectionIds.length > 0 ? `（已关联${selectedInspectionIds.length}个巡检单）` : ''}`);
    setWorkOrderModalVisible(false);
    workOrderForm.resetFields();
    
    // 重置巡检单相关状态
    setSelectedInspectionIds([]);
    setInspectionIssues([]);
    setSelectedIssue(null);
    
    // 这里应该调用API保存数据，暂时只是模拟
    console.log('新建工单:', workOrderData);
  };

  // 生成重复事件规则描述
  const generateScheduleRule = () => {
    if (frequencyMode === 'preset') {
      // 预设模式的描述
      const timeStr = `${scheduleTime.startTime}-${scheduleTime.endTime}`;
      switch (presetFrequency) {
        case 'none':
          return '不重复，仅执行一次';
        case 'daily':
          return `每天 ${timeStr} 执行巡检任务`;
        case 'weekly':
          return `每周 ${timeStr} 执行巡检任务`;
        case 'monthly':
          return `每月 ${timeStr} 执行巡检任务`;
        case 'quarterly':
          return `每季度 ${timeStr} 执行巡检任务`;
        case 'yearly':
          return `每年 ${timeStr} 执行巡检任务`;
        default:
          return '请选择巡检频率';
      }
    } else {
      // 自定义模式的描述
      const { interval, unit, weekdays, monthDate, quarterOffset } = customFrequency;
      const timeStr = `${scheduleTime.startTime}-${scheduleTime.endTime}`;
      
      let baseText = '';
      if (interval === 1) {
        switch (unit) {
          case 'day':
            baseText = '每天';
            break;
          case 'week':
            baseText = '每周';
            break;
          case 'month':
            baseText = '每月';
            break;
          case 'quarter':
            baseText = '每季度';
            break;
          case 'year':
            baseText = '每年';
            break;
        }
      } else {
        const unitText = {
          day: '天',
          week: '周',
          month: '个月',
          quarter: '个季度',
          year: '年'
        };
        baseText = `每${interval}${unitText[unit]}`;
      }
      
      let detailText = '';
      if (unit === 'week' && weekdays.length > 0) {
        const dayNames = {
          1: '周一', 2: '周二', 3: '周三', 4: '周四',
          5: '周五', 6: '周六', 0: '周日'
        };
        const selectedDays = weekdays.map(day => dayNames[day]).join('、');
        detailText = `的${selectedDays}`;
      } else if (unit === 'month') {
        detailText = `的第${monthDate}天`;
      } else if (unit === 'quarter') {
        detailText = `的第${quarterOffset}天`;
      }
      
      return `${baseText}${detailText} ${timeStr} 执行巡检任务`;
    }
  };

  // 处理频率模式切换
  const handleFrequencyModeChange = (mode) => {
    setFrequencyMode(mode);
    if (mode === 'preset') {
      setPresetFrequency('');
    }
    // 重新生成规则描述
    setTimeout(() => {
      setScheduleRule(generateScheduleRule());
    }, 0);
  };

  // 处理预设频率选择
  const handlePresetFrequencyChange = (value) => {
    setPresetFrequency(value);
    setScheduleRule(generateScheduleRule());
  };

  // 处理自定义频率变更
  const handleCustomFrequencyChange = (field, value) => {
    setCustomFrequency(prev => ({ ...prev, [field]: value }));
    setTimeout(() => {
      setScheduleRule(generateScheduleRule());
    }, 0);
  };

  // 处理时间设置变更
  const handleScheduleTimeChange = (field, value) => {
    setScheduleTime(prev => ({ ...prev, [field]: value }));
    setTimeout(() => {
      setScheduleRule(generateScheduleRule());
    }, 0);
  };

  // 处理巡检单选择（支持多选）
  const handleInspectionSelect = (inspectionIds) => {
    setSelectedInspectionIds(inspectionIds || []);
    setSelectedIssue(null);
    
    if (inspectionIds && inspectionIds.length > 0) {
      // 查找选中的所有巡检单
      const selectedInspections = inspectionDetails.filter(detail => 
        inspectionIds.includes(detail.inspectionId)
      );
      
      if (selectedInspections.length > 0) {
        // 合并所有选中巡检单的异常项目
        let allIssues = [];
        selectedInspections.forEach(inspection => {
          const issues = inspection.inspectionItems.filter(item => item.result === '异常');
          // 为每个问题添加巡检单信息
          const issuesWithInspectionInfo = issues.map(issue => ({
            ...issue,
            inspectionId: inspection.inspectionId,
            stationName: inspection.stationName,
            inspectionDate: inspection.inspectionDate
          }));
          allIssues = allIssues.concat(issuesWithInspectionInfo);
        });
        
        setInspectionIssues(allIssues);
        
        // 如果只选了一个巡检单，自动填充油站信息
        if (selectedInspections.length === 1) {
          workOrderForm.setFieldsValue({
            stationId: selectedInspections[0].stationId,
            stationName: selectedInspections[0].stationName
          });
        } else {
          // 多个巡检单清空油站信息，由用户手动选择
          workOrderForm.setFieldsValue({
            stationId: null,
            stationName: null
          });
        }
      } else {
        setInspectionIssues([]);
      }
    } else {
      setInspectionIssues([]);
    }
  };



  // 查看修改记录详情
  const handleViewChangeRecord = (record) => {
    setCurrentRecord(record);
    setChangeRecordModalVisible(true);
  };

  // 查看NFC标签详情（独立查看，不是编辑）
  const handleViewNfcDetailOnly = (record) => {
    setCurrentRecord(record);
    setNfcDetailModalVisible(true);
  };

  // 查看巡检点位详情（独立查看，不是编辑）
  const handleViewPointDetailOnly = (record) => {
    setCurrentRecord(record);
    setPointDetailModalVisible(true);
  };

  // 巡检任务表格列
  const taskColumns = [
    {
      title: '任务ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (text) => <span style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{text}</span>
    },
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
      width: 200,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
    },
    {
      title: '所属油站',
      dataIndex: 'stationSummary',
      key: 'stationSummary',
      width: 250,
      render: (stationSummary) => {
        if (!stationSummary || stationSummary.totalStations === 0) {
          return <span style={{ color: '#999' }}>未关联</span>;
        }

        const { totalBranches, totalStations, branchStats } = stationSummary;

        if (totalStations === 1) {
          // 单油站显示
          return (
        <div>
              <div style={{ fontWeight: 'bold' }}>{branchStats[0]?.branchName}</div>
              <div style={{ fontSize: 12, color: '#666' }}>1个油站</div>
              </div>
          );
        } else {
          // 多油站统计摘要显示
          const mainInfo = `${totalBranches}个分公司 / ${totalStations}个油站`;
          const detailInfo = branchStats
            .slice(0, 3)
            .map(stat => `${stat.branchName}(${stat.stationCount})`)
            .join(' ');
          const hasMore = branchStats.length > 3;

          return (
        <div>
              <div style={{ fontWeight: 'bold', marginBottom: 2 }}>
                所属油站: {mainInfo}
              </div>
              <div style={{ fontSize: 12, color: '#666' }}>
                详情: {detailInfo}
                {hasMore && ` +${branchStats.length - 3}个分公司`}
        </div>
            </div>
          );
        }
      }
    },

    {
      title: '巡检类型',
      dataIndex: 'inspectionType',
      key: 'inspectionType',
      width: 100,
      render: (text) => {
        const colorMap = {
          '日常巡检': 'blue',
          '专项巡检': 'green',
          '消防巡检': 'red'
        };
        return <Tag color={colorMap[text]}>{text}</Tag>;
      }
    },
    {
      title: '巡检频率',
      dataIndex: 'frequency',
      key: 'frequency',
      width: 100
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      render: (text) => {
        const colorMap = {
          '高': 'red',
          '中': 'orange',
          '低': 'green'
        };
        return <Tag color={colorMap[text]}>{text}</Tag>;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text) => {
        const colorMap = {
          '进行中': 'processing',
          '未开始': 'warning',
          '已结束': 'success'
        };
        return <Tag color={colorMap[text]}>{text}</Tag>;
      }
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 160,
      render: (text) => text ? dayjs(text).format('YYYY-MM-DD HH:mm') : '-'
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 160,
      render: (text) => text ? dayjs(text).format('YYYY-MM-DD HH:mm') : '-'
    },
    {
      title: '启用状态',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 100,
      render: (text, record) => (
        <Switch
          checked={text}
          onChange={(checked) => handleToggleEnabled(record, checked)}
          checkedChildren="启用"
          unCheckedChildren="禁用"
        />
      )
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      width: 100
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>
            查看
          </Button>
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEditTask(record)}>
            编辑
          </Button>
          <Popconfirm title="确定要删除这个巡检任务吗？" onConfirm={() => handleDelete(record)}>
            <Button type="primary" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // NFC标签表格列
  const nfcColumns = [
    {
      title: '标签ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (text) => <span style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{text}</span>
    },
    {
      title: 'NFC标签编码',
      dataIndex: 'tagCode',
      key: 'tagCode',
      width: 150,
      render: (text) => <span style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{text}</span>
    },
    {
      title: '标签名称',
      dataIndex: 'tagName',
      key: 'tagName',
      width: 200
    },
    {
      title: '检查区域',
      dataIndex: 'checkArea',
      key: 'checkArea',
      width: 120,
      render: (text) => text || <span style={{ color: '#999' }}>未关联</span>
    },
    {
      title: '检查点位',
      dataIndex: 'checkPoints',
      key: 'checkPoints',
      width: 200,
      render: (text) => text || <span style={{ color: '#999' }}>未关联</span>
    },
    {
      title: '维护人',
      dataIndex: 'maintainer',
      key: 'maintainer',
      width: 100
    },
    {
      title: '维护时间',
      dataIndex: 'maintainTime',
      key: 'maintainTime',
      width: 150
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewNfcDetailOnly(record)}>
            查看
          </Button>
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEditNfc(record)}>
            编辑
          </Button>
          <Popconfirm title="确定要删除这个NFC标签吗？" onConfirm={() => handleDeleteNfc(record)}>
            <Button type="primary" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 巡检点位表格列
  const pointColumns = [
    {
      title: '点位ID',
      dataIndex: 'id',
      key: 'id',
      width: 140,
      render: (text) => <span style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{text}</span>
    },
    {
      title: '点位名称',
      dataIndex: 'pointName',
      key: 'pointName',
      width: 150,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text || '-'}</span>
    },
    {
      title: '检查区域',
      dataIndex: 'checkArea',
      key: 'checkArea',
      width: 120,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
    },
    {
      title: '检查点位',
      dataIndex: 'checkPoints',
      key: 'checkPoints',
      width: 200,
      render: (text) => (
        <div style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {text}
        </div>
      )
    },
    {
      title: '检查项数量',
      dataIndex: 'inspectionItems',
      key: 'inspectionItemsCount',
      width: 120,
      align: 'center',
      render: (items) => {
        const count = items ? items.length : 0;
        return (
          <span style={{ 
            fontWeight: 'bold',
            color: count > 0 ? '#1890ff' : '#999'
          }}>
            {count} 项
          </span>
        );
      }
    },
    {
      title: '位置描述',
      dataIndex: 'locationDesc',
      key: 'locationDesc',
      width: 200,
      render: (text) => (
        <div style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {text}
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewPointDetailOnly(record)}>
            查看
          </Button>
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEditPoint(record)}>
            编辑
          </Button>
          <Popconfirm title="确定要删除这个巡检点位吗？" onConfirm={() => handleDeletePoint(record)}>
            <Button type="primary" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 执行统计表格列
  const statsColumns = [
    {
      title: '任务ID',
      dataIndex: 'taskId',
      key: 'taskId',
      width: 120,
      render: (text) => <span style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{text}</span>
    },
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
      width: 200,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
    },
    {
      title: '巡检类型',
      dataIndex: 'inspectionType',
      key: 'inspectionType',
      width: 100,
      render: (text) => {
        const colorMap = {
          '日常巡检': 'blue',
          '专项巡检': 'green',
          '消防巡检': 'red'
        };
        return <Tag color={colorMap[text]}>{text}</Tag>;
      }
    },
    {
      title: '巡检频率',
      dataIndex: 'frequency',
      key: 'frequency',
      width: 100
    },
    {
      title: '关联油站数',
      dataIndex: 'totalStations',
      key: 'totalStations',
      width: 100,
      render: (num) => <span style={{ fontWeight: 'bold' }}>{num}</span>
    },
    {
      title: '近期完成率',
      dataIndex: 'recentStats',
      key: 'recentCompletionRate',
      width: 120,
      align: 'center',
      render: (recentStats, record) => {
        const rate = recentStats?.completionRate || record.completionRate;
        return (
          <div>
            <span style={{ 
              color: rate >= 90 ? '#52c41a' : rate >= 70 ? '#faad14' : '#ff4d4f',
              fontWeight: 'bold' 
            }}>
              {rate?.toFixed(1)}%
            </span>
            <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
              {recentStats?.period || '当前'}
            </div>
          </div>
        );
      }
    },
    {
      title: '近期逾期率',
      dataIndex: 'recentStats',
      key: 'recentOverdueRate',
      width: 120,
      align: 'center',
      render: (recentStats, record) => {
        const rate = recentStats?.overdueRate || record.overdueRate;
        return (
          <div>
            <span style={{ 
              color: rate === 0 ? '#52c41a' : rate <= 10 ? '#faad14' : '#ff4d4f',
              fontWeight: 'bold' 
            }}>
              {rate?.toFixed(1)}%
            </span>
            <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
              {recentStats?.period || '当前'}
            </div>
          </div>
        );
      }
    },
    {
      title: '近期问题数',
      dataIndex: 'recentStats',
      key: 'recentIssueCount',
      width: 110,
      align: 'center',
      render: (recentStats, record) => {
        const totalIssues = recentStats?.totalIssues || record.issueCount;
        return (
          <div>
            <span style={{ 
              color: totalIssues === 0 ? '#52c41a' : totalIssues <= 5 ? '#faad14' : '#ff4d4f',
              fontWeight: 'bold' 
            }}>
              {totalIssues}
            </span>
            <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
              {recentStats?.period || '累计'}
            </div>
          </div>
        );
      }
    },
    {
      title: '近期工单数',
      dataIndex: 'recentStats',
      key: 'recentWorkOrderCount',
      width: 110,
      align: 'center',
      render: (recentStats, record) => {
        const totalWorkOrders = recentStats?.totalWorkOrders || record.workOrderCount;
        return (
          <div>
            <span style={{ 
              color: totalWorkOrders === 0 ? '#52c41a' : totalWorkOrders <= 3 ? '#faad14' : '#ff4d4f',
              fontWeight: 'bold' 
            }}>
              {totalWorkOrders}
            </span>
            <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
              {recentStats?.period || '累计'}
            </div>
          </div>
        );
      }
    },
    {
      title: '最后执行',
      dataIndex: 'lastExecutionTime',
      key: 'lastExecutionTime',
      width: 150,
      align: 'center',
      render: (time) => (
        <span style={{ fontSize: '12px' }}>{time || '未执行'}</span>
      )
    },
    {
      title: '下次执行',
      dataIndex: 'nextExecutionTime',
      key: 'nextExecutionTime',
      width: 150,
      align: 'center',
      render: (time) => {
        const isOverdue = new Date(time) < new Date();
        return (
          <span style={{ 
            fontSize: '12px',
            color: isOverdue ? '#ff4d4f' : '#1890ff',
            fontWeight: isOverdue ? 'bold' : 'normal'
          }}>
            {time || '待定'}
          </span>
        );
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewTaskDetail(record)}>
            查看详情
          </Button>
        </Space>
      )
    }
  ];




  // 工单管理表格列
  const workOrderColumns = [
    {
      title: '工单编号',
      dataIndex: 'workOrderId',
      key: 'workOrderId',
      width: 150,
      render: (text) => <span style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{text}</span>
    },
    {
      title: '工单标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
    },
    {
      title: '所属油站',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 180,
      render: (text) => text || '-'
    },
    {
      title: '所属分公司',
      dataIndex: 'branchName',
      key: 'branchName',
      width: 120,
      render: (text, record) => {
        // 根据油站ID查找对应的分公司
        if (record.stationId) {
          const station = stationData.stations.find(s => s.id === record.stationId);
          return station ? station.branchName : '-';
        }
        return text || '-';
      }
    },
    {
      title: '来源',
      key: 'source',
      width: 120,
      render: (_, record) => (
        <div>
          <div>{record.sourceType}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.sourceId}</div>
        </div>
      )
    },
    {
      title: '紧急程度',
      dataIndex: 'urgency',
      key: 'urgency',
      width: 100,
      render: (text) => {
        const colorMap = {
          '紧急': 'red',
          '重要': 'orange',
          '一般': 'blue'
        };
        return <Tag color={colorMap[text]}>{text}</Tag>;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text) => {
        const colorMap = {
          '待处理': 'orange',
          '处理中': 'processing',
          '已完成': 'success',
          '已过期': 'error'
        };
        return <Tag color={colorMap[text]}>{text}</Tag>;
      }
    },
    {
      title: '提交人',
      dataIndex: 'submitter',
      key: 'submitter',
      width: 100,
      render: (text) => {
        // 去掉'系统自动'名称
        return text === '系统自动' ? '-' : (text || '-');
      }
    },
    {
      title: '处理人',
      dataIndex: 'handler',
      key: 'handler',
      width: 100,
      render: (text) => text || '-'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150
    },
    {
      title: '截止时间',
      dataIndex: 'deadline',
      key: 'deadline',
      width: 150,
      render: (text) => {
        if (!text) return '-';
        // 去掉逾期提示，只显示时间
        return <span>{text}</span>;
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewWorkOrder(record)}>
            查看
          </Button>
          {record.status === '待处理' && (
            <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleProcessWorkOrder(record)}>
              处理
            </Button>
          )}
          {(['待处理', '处理中'].includes(record.status)) && (
            <Popconfirm title="确定要删除这个工单吗？" onConfirm={() => handleDeleteWorkOrder(record)}>
              <Button type="primary" size="small" danger icon={<DeleteOutlined />}>
                删除
              </Button>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ];

  // 修改记录表格列
  const changeColumns = [
    {
      title: '变更时间',
      dataIndex: 'changeTime',
      key: 'changeTime',
      width: 150,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
    },
    {
      title: '变更类型',
      dataIndex: 'changeType',
      key: 'changeType',
      width: 100,
      render: (text) => {
        const colorMap = {
          '新增': 'success',
          '修改': 'warning',
          '删除': 'error'
        };
        const iconMap = {
          '新增': <PlusOutlined />,
          '修改': <EditOutlined />,
          '删除': <DeleteOutlined />
        };
        return <Tag color={colorMap[text]} icon={iconMap[text]}>{text}</Tag>;
      }
    },
    {
      title: '变更对象',
      dataIndex: 'changeObject',
      key: 'changeObject',
      width: 120
    },
    {
      title: '变更描述',
      dataIndex: 'changeDescription',
      key: 'changeDescription',
      width: 250
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      width: 100
    },
    {
      title: '审批状态',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      width: 100,
      render: (text) => {
        const colorMap = {
          '已审批': 'success',
          '审批中': 'processing',
          '已拒绝': 'error'
        };
        return <Tag color={colorMap[text]}>{text}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewChangeRecord(record)}>
          查看详情
        </Button>
      )
    }
  ];

  // 巡检单明细表格列
  const inspectionDetailColumns = [
    {
      title: '巡检单ID',
      dataIndex: 'inspectionId',
      key: 'inspectionId',
      width: 180,
      render: (text) => <span style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{text}</span>
    },
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
      width: 200,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
    },
    {
      title: '油站名称',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 180,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
    },
    {
      title: '所属分公司',
      dataIndex: 'branchName',
      key: 'branchName',
      width: 120
    },
    {
      title: '巡检类型',
      dataIndex: 'inspectionType',
      key: 'inspectionType',
      width: 100,
      render: (text) => {
        const colorMap = {
          '日常巡检': 'blue',
          '专项巡检': 'green',
          '消防巡检': 'red',
          '年度巡检': 'purple'
        };
        return <Tag color={colorMap[text]}>{text}</Tag>;
      }
    },
    {
      title: '巡检日期',
      dataIndex: 'inspectionDate',
      key: 'inspectionDate',
      width: 120
    },
    {
      title: '执行状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text) => {
        const colorMap = {
          '进行中': 'processing',
          '已完成': 'success',
          '逾期完成': 'warning'
        };
        return <Tag color={colorMap[text]}>{text}</Tag>;
      }
    },
    {
      title: '执行人员',
      dataIndex: 'executor',
      key: 'executor',
      width: 100
    },
    {
      title: '巡检项数',
      dataIndex: 'totalPoints',
      key: 'totalPoints',
      width: 100,
      render: (count) => <span style={{ fontWeight: 'bold' }}>{count} 项</span>
    },
    {
      title: '完成数',
      dataIndex: 'completedPoints',
      key: 'completedPoints',
      width: 80,
      render: (count) => <span style={{ color: '#52c41a', fontWeight: 'bold' }}>{count} 项</span>
    },
    {
      title: '问题数',
      dataIndex: 'issueCount',
      key: 'issueCount',
      width: 80,
      render: (count) => (
        <span style={{
          color: count === 0 ? '#52c41a' : count <= 2 ? '#faad14' : '#ff4d4f',
          fontWeight: 'bold'
        }}>
          {count}
        </span>
      )
    },
    {
      title: '工单数',
      dataIndex: 'workOrderCount',
      key: 'workOrderCount',
      width: 80,
      render: (count) => (
        <span style={{
          color: count === 0 ? '#52c41a' : count <= 1 ? '#faad14' : '#ff4d4f',
          fontWeight: 'bold'
        }}>
          {count}
        </span>
      )
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 140
    },
    {
      title: '完成时间',
      dataIndex: 'finishTime',
      key: 'finishTime',
      width: 140,
      render: (time, record) => (
        <span style={{
          color: record.status === '逾期完成' ? '#ff4d4f' : '#333'
        }}>
          {time || '-'}
        </span>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewInspectionDetail(record)}>
            查看
          </Button>
        </Space>
      )
    }
  ];

  const tabItems = [
    {
      key: 'tasks',
      label: (
        <span>
          <SafetyOutlined />
          巡检任务列表
        </span>
      ),
      children: (
        <div>
          {/* 筛选区域 */}
          <Card style={{ marginBottom: 16 }}>
            <Form form={form} layout="inline" onFinish={handleSearch}>
              <Row gutter={16} style={{ width: '100%', marginBottom: 16 }}>
                <Col span={4}>
                  <Form.Item name="stationName" label="油站名称">
                    <TreeSelect
                      placeholder="请选择油站"
                      treeData={[
                        {
                          title: '全部油站',
                          value: 'all',
                          children: stationData.branches.map(branch => ({
                            title: branch.name,
                            value: branch.id,
                            children: stationData.stations.filter(s => s.branchId === branch.id).map(station => ({
                              title: station.name,
                              value: station.id
                            }))
                          }))
                        }
                      ]}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="inspectionType" label="巡检类型">
                    <Select placeholder="请选择类型" allowClear>
                      <Option value="日常巡检">日常巡检</Option>
                      <Option value="专项巡检">专项巡检</Option>
                      <Option value="消防巡检">消防巡检</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="frequency" label="巡检频率">
                    <Select placeholder="请选择频率" allowClear>
                      <Option value="每日一次">每日一次</Option>
                      <Option value="每周一次">每周一次</Option>
                      <Option value="每月一次">每月一次</Option>
                      <Option value="每季度一次">每季度一次</Option>
                      <Option value="每年一次">每年一次</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item name="status" label="任务状态">
                    <Select placeholder="请选择状态" allowClear>
                      <Option value="进行中">进行中</Option>
                      <Option value="未开始">未开始</Option>
                      <Option value="已结束">已结束</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item name="priority" label="优先级">
                    <Select placeholder="请选择优先级" allowClear>
                      <Option value="高">高</Option>
                      <Option value="中">中</Option>
                      <Option value="低">低</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6} style={{ textAlign: 'right' }}>
                  <Space>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                      查询
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={handleReset}>
                      重置
                    </Button>
                  </Space>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddTask}>
                      新建任务
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </Card>

          {/* 任务列表 */}
          <Card>
            <Table
              columns={taskColumns}
              dataSource={taskList}
              rowKey="id"
              scroll={{ x: 1800 }}
              pagination={{
                total: taskList.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </Card>
        </div>
      ),
    },
    {
      key: 'inspection-details',
      label: (
        <span>
          <HistoryOutlined />
          巡检单明细
        </span>
      ),
      children: (
        <div>
          {/* 筛选区域 */}
          <Card style={{ marginBottom: 16 }}>
            <Form form={form} layout="inline" onFinish={handleInspectionDetailSearch}>
              <Row gutter={16} style={{ width: '100%', marginBottom: 16 }}>
                <Col span={5}>
                  <Form.Item name="inspectionId" label="巡检单ID">
                    <Input placeholder="请输入巡检单ID" />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="stationId" label="所属油站">
                    <TreeSelect
                      placeholder="请选择油站"
                      allowClear
                      treeData={[
                        {
                          title: '全部油站',
                          value: 'all',
                          children: stationData.branches.map(branch => ({
                            title: branch.name,
                            value: branch.id,
                            children: stationData.stations.filter(s => s.branchId === branch.id).map(station => ({
                              title: station.name,
                              value: station.id
                            }))
                          }))
                        }
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="inspectionType" label="巡检类型">
                    <Select placeholder="请选择类型" allowClear>
                      <Option value="日常巡检">日常巡检</Option>
                      <Option value="专项巡检">专项巡检</Option>
                      <Option value="消防巡检">消防巡检</Option>
                      <Option value="年度巡检">年度巡检</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="status" label="执行状态">
                    <Select placeholder="请选择状态" allowClear>
                      <Option value="进行中">进行中</Option>
                      <Option value="已完成">已完成</Option>
                      <Option value="逾期完成">逾期完成</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={7} style={{ textAlign: 'right' }}>
                  <Space>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                      查询
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={handleInspectionDetailReset}>
                      重置
                    </Button>
                  </Space>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item name="dateRange" label="巡检日期">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item name="executor" label="执行人员">
                    <Input placeholder="请输入执行人员" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>

          {/* 巡检单明细列表 */}
          <Card>
            <Table
              columns={inspectionDetailColumns}
              dataSource={inspectionDetails}
              rowKey="id"
              scroll={{ x: 1800 }}
              pagination={{
                total: inspectionDetails.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </Card>
        </div>
      ),
    },
    {
      key: 'statistics',
      label: (
        <span>
          <BarChartOutlined />
          巡检任务执行统计
        </span>
      ),
      children: (
        <div>
          {/* 筛选条件 */}
          <Card style={{ marginBottom: 16 }}>
            <Form form={form} layout="inline">
              <Form.Item label="组织筛选" name="organization">
                <TreeSelect
                  style={{ width: 200 }}
                  placeholder="请选择组织"
                  allowClear
                  treeData={[
                    {
                      title: '江西交投化石能源公司',
                      value: 'company',
                      key: 'company',
                      children: [
                        { title: '赣中分公司', value: 'central', key: 'central' },
                        { title: '赣东北分公司', value: 'northeast', key: 'northeast' },
                        { title: '赣南分公司', value: 'south', key: 'south' },
                        { title: '赣西分公司', value: 'west', key: 'west' },
                      ]
                    }
                  ]}
                />
              </Form.Item>
              <Form.Item label="任务名称" name="taskName">
                <Input placeholder="请输入任务名称" style={{ width: 200 }} />
              </Form.Item>
              <Form.Item label="统计周期" name="timePeriod">
                <Select style={{ width: 150 }} placeholder="请选择周期" defaultValue="recent7">
                  <Option value="recent7">近7天</Option>
                  <Option value="recent30">近30天</Option>
                  <Option value="recent90">近90天</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary" icon={<SearchOutlined />} onClick={handleStatsSearch}>
                    查询
                  </Button>
                  <Button icon={<ReloadOutlined />} onClick={handleStatsReset}>
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>



          {/* 执行统计表格 */}
          <Card>
            <Table
              columns={statsColumns}
              dataSource={executionStats}
              rowKey="id"
              scroll={{ x: 1000 }}
              pagination={{
                total: executionStats.length,
                pageSize: 15,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </Card>
        </div>
      ),
    },
    {
      key: 'nfc',
      label: (
        <span>
          <ScanOutlined />
          NFC标签管理
        </span>
      ),
      children: (
        <div>
          {/* 筛选区域 */}
          <Card style={{ marginBottom: 16 }}>
            <Form form={nfcForm} layout="inline" onFinish={handleSearch}>
              <Row gutter={16} style={{ width: '100%', marginBottom: 16 }}>
                <Col span={6}>
                  <Form.Item name="tagCode" label="标签编码">
                    <Input placeholder="请输入标签编码" />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item name="stationId" label="所属油站">
                    <Select placeholder="请选择油站" allowClear>
                      {stationData.stations.map(station => (
                        <Option key={station.id} value={station.id}>{station.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="status" label="标签状态">
                    <Select placeholder="请选择状态" allowClear>
                      <Option value="正常">正常</Option>
                      <Option value="低电量">低电量</Option>
                      <Option value="故障">故障</Option>
                      <Option value="离线">离线</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={9} style={{ textAlign: 'right' }}>
                  <Space>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                      查询
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={handleReset}>
                      重置
                    </Button>
                  </Space>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNfc}>
                      新增标签
                    </Button>
                    <Button icon={<DownloadOutlined />} onClick={handleDownloadNfcTemplate}>
                      下载模板
                    </Button>
                    <Button icon={<UploadOutlined />} onClick={handleImportNfcTags}>
                      批量导入
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </Card>

          {/* NFC标签列表 */}
          <Card>
            <Table
              columns={nfcColumns}
              dataSource={nfcTags}
              rowKey="id"
              scroll={{ x: 1300 }}
              pagination={{
                total: nfcTags.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </Card>
        </div>
      ),
    },
    {
      key: 'points',
      label: (
        <span>
          <EnvironmentOutlined />
          巡检点位维护
        </span>
      ),
      children: (
        <div>
          {/* 筛选区域 */}
          <Card style={{ marginBottom: 16 }}>
            <Form form={pointForm} layout="inline" onFinish={handleSearch}>
              <Row gutter={16} style={{ width: '100%', marginBottom: 16 }}>
                <Col span={6}>
                  <Form.Item name="checkArea" label="检查区域">
                    <Select placeholder="请选择检查区域" allowClear>
                      {inspectionData.checkAreaOptions?.map(area => (
                        <Option key={area} value={area}>{area}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="locationDesc" label="位置描述">
                    <Input placeholder="请输入位置描述" />
                  </Form.Item>
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                  <Space>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                      查询
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={handleReset}>
                      重置
                    </Button>
                  </Space>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPoint}>
                      新增点位
                    </Button>
                    <Button icon={<UploadOutlined />} onClick={handleImportPoints}>
                      批量导入
                    </Button>
                    <Button icon={<DownloadOutlined />} onClick={handleDownloadTemplate}>
                      下载模板
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </Card>

          {/* 巡检点位列表 */}
          <Card>
            <Table
              columns={pointColumns}
              dataSource={inspectionPoints}
              rowKey="id"
              scroll={{ x: 1200 }}
              pagination={{
                total: inspectionPoints.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </Card>
        </div>
      ),
    },

    {
      key: 'workorders',
      label: (
        <span>
          <AlertOutlined />
          工单管理
        </span>
      ),
      children: (
        <div>
          {/* 工单统计概览 */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="待处理工单"
                  value={inspectionData.workOrders?.filter(w => w.status === '待处理').length || 0}
                  suffix="个"
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="处理中工单"
                  value={inspectionData.workOrders?.filter(w => w.status === '处理中').length || 0}
                  suffix="个"
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="已完成工单"
                  value={inspectionData.workOrders?.filter(w => w.status === '已完成').length || 0}
                  suffix="个"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="逾期工单"
                  value={inspectionData.workOrders?.filter(w => w.status === '已逾期').length || 0}
                  suffix="个"
                  valueStyle={{ color: '#a0071b' }}
                />
              </Card>
            </Col>
          </Row>

          {/* 工单筛选区域 */}
          <Card style={{ marginBottom: 16 }}>
            <Form layout="inline" onFinish={handleSearch}>
              <Row gutter={16} style={{ width: '100%', marginBottom: 16 }}>
                <Col span={5}>
                  <Form.Item name="workOrderTitle" label="工单标题">
                    <Input placeholder="请输入工单标题" />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="workOrderStatus" label="工单状态">
                    <Select placeholder="请选择状态" allowClear>
                      <Option value="待处理">待处理</Option>
                      <Option value="处理中">处理中</Option>
                      <Option value="已完成">已完成</Option>
                      <Option value="已过期">已过期</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="urgency" label="紧急程度">
                    <Select placeholder="请选择紧急程度" allowClear>
                      <Option value="紧急">紧急</Option>
                      <Option value="重要">重要</Option>
                      <Option value="一般">一般</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item name="dateRange" label="创建时间">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={6} style={{ textAlign: 'right' }}>
                  <Space>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                      查询
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={handleReset}>
                      重置
                    </Button>
                  </Space>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item name="organizationTree" label="组织机构">
                    <TreeSelect
                      placeholder="请选择组织机构"
                      allowClear
                      treeData={[
                        {
                          title: '江西交投化石能源公司',
                          value: 'ALL',
                          key: 'root',
                          children: stationData.branches.map(branch => ({
                            title: branch.name,
                            value: branch.id,
                            key: branch.id,
                            children: stationData.stations
                              .filter(station => station.branchId === branch.id)
                              .map(station => ({
                                title: station.name,
                                value: station.id,
                                key: station.id
                              }))
                          }))
                        }
                      ]}
                      style={{ width: '200px' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={18}>
                  <Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateWorkOrder}>
                      手动创建工单
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </Card>

          {/* 工单列表 */}
          <Card>
            <Table
              columns={workOrderColumns}
              dataSource={inspectionData.workOrders || []}
              rowKey="id"
              scroll={{ x: 1600 }}
              pagination={{
                total: inspectionData.workOrders?.length || 0,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </Card>
        </div>
      ),
    },
    {
      key: 'changes',
      label: (
        <span>
          <HistoryOutlined />
          修改记录
        </span>
      ),
      children: (
        <div>
          <Card>
            <Table
              columns={changeColumns}
              dataSource={changeRecords}
              rowKey="id"
              scroll={{ x: 1200 }}
              pagination={{
                total: changeRecords.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div className="inspection-management-container">
      <Card>
        <Spin spinning={loading}>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            size="large"
            tabBarStyle={{ marginBottom: '16px' }}
            items={tabItems}
          />
        </Spin>
      </Card>

      {/* 任务表单弹窗 */}
      <Modal
        title={modalType === 'add' ? '新建巡检任务' : '编辑巡检任务'}
        open={taskModalVisible}
        onCancel={() => setTaskModalVisible(false)}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setTaskModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => taskForm.submit()}>
            保存
          </Button>
        ]}
      >
        <Form
          form={taskForm}
          layout="vertical"
          onFinish={handleSaveTask}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="taskId" 
                label="任务ID"
              >
                <Input 
                  disabled 
                  placeholder="系统自动生成" 
                  style={{ backgroundColor: '#f5f5f5', color: '#666' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="taskName" label="任务名称" rules={[{ required: true, message: '请输入任务名称' }]}>
                <Input placeholder="请输入任务名称" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="stationIds" label="关联油站" rules={[{ required: true, message: '请选择油站' }]}>
                <TreeSelect
                  multiple
                  placeholder="请选择油站（可多选）"
                  showCheckedStrategy={TreeSelect.SHOW_CHILD}
                  treeCheckable
                  treeData={[
                    {
                      title: '全部油站',
                      value: 'all',
                      children: stationData.branches.map(branch => ({
                        title: branch.name,
                        value: branch.id,
                        children: stationData.stations.filter(s => s.branchId === branch.id).map(station => ({
                          title: station.name,
                          value: station.id
                        }))
                      }))
                    }
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="inspectionType" label="巡检类型" rules={[{ required: true, message: '请选择巡检类型' }]}>
                <Select placeholder="请选择巡检类型">
                  <Option value="日常巡检">日常巡检</Option>
                  <Option value="专项巡检">专项巡检</Option>
                  <Option value="消防巡检">消防巡检</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="frequency" label="巡检频率" rules={[{ required: true, message: '请配置巡检频率' }]}>
                <div style={{ border: '1px solid #d9d9d9', borderRadius: '6px', padding: '12px' }}>
                  {/* 频率模式选择 */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '13px' }}>频率模式</div>
                    <Radio.Group
                      value={frequencyMode}
                      onChange={(e) => handleFrequencyModeChange(e.target.value)}
                      style={{ width: '100%' }}
                    >
                      <Radio value="preset">预设模式</Radio>
                      <Radio value="custom">自定义模式</Radio>
                    </Radio.Group>
                  </div>
                  
                  {/* 预设模式 */}
                  {frequencyMode === 'preset' && (
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '13px' }}>选择频率</div>
                      <Select
                        value={presetFrequency}
                        onChange={handlePresetFrequencyChange}
                        placeholder="请选择巡检频率"
                        style={{ width: '100%' }}
                      >
                        <Option value="none">不重复</Option>
                        <Option value="daily">每天</Option>
                        <Option value="weekly">每周</Option>
                        <Option value="monthly">每月</Option>
                        <Option value="quarterly">每季度</Option>
                        <Option value="yearly">每年</Option>
                      </Select>
                    </div>
                  )}
                  
                  {/* 自定义模式 */}
                  {frequencyMode === 'custom' && (
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '13px' }}>自定义设置</div>
                      
                      {/* 间隔设置 */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', gap: '8px' }}>
                        <span>每</span>
                        <InputNumber
                          value={customFrequency.interval}
                          onChange={(value) => handleCustomFrequencyChange('interval', value)}
                          min={1}
                          max={99}
                          style={{ width: '60px' }}
                        />
                        <Select
                          value={customFrequency.unit}
                          onChange={(value) => handleCustomFrequencyChange('unit', value)}
                          style={{ width: '80px' }}
                        >
                          <Option value="day">天</Option>
                          <Option value="week">周</Option>
                          <Option value="month">月</Option>
                          <Option value="quarter">季度</Option>
                        </Select>
                      </div>
                      
                      {/* 周设置 */}
                      {customFrequency.unit === 'week' && (
                        <div style={{ marginBottom: '8px' }}>
                          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>选择在周几执行</div>
                          <Checkbox.Group
                            value={customFrequency.weekdays}
                            onChange={(values) => handleCustomFrequencyChange('weekdays', values)}
                          >
                            <Checkbox value={1}>周一</Checkbox>
                            <Checkbox value={2}>周二</Checkbox>
                            <Checkbox value={3}>周三</Checkbox>
                            <Checkbox value={4}>周四</Checkbox>
                            <Checkbox value={5}>周五</Checkbox>
                            <Checkbox value={6}>周六</Checkbox>
                            <Checkbox value={0}>周日</Checkbox>
                          </Checkbox.Group>
                        </div>
                      )}
                      
                      {/* 月设置 */}
                      {customFrequency.unit === 'month' && (
                        <div style={{ marginBottom: '8px' }}>
                          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>每月的第几天执行</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>每月第</span>
                            <InputNumber
                              value={customFrequency.monthDate}
                              onChange={(value) => handleCustomFrequencyChange('monthDate', value)}
                              min={1}
                              max={31}
                              style={{ width: '60px' }}
                            />
                            <span>天</span>
                          </div>
                        </div>
                      )}
                      
                      {/* 季度设置 */}
                      {customFrequency.unit === 'quarter' && (
                        <div style={{ marginBottom: '8px' }}>
                          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>季度第几天执行</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>季度第</span>
                            <InputNumber
                              value={customFrequency.quarterOffset}
                              onChange={(value) => handleCustomFrequencyChange('quarterOffset', value)}
                              min={1}
                              max={90}
                              style={{ width: '60px' }}
                            />
                            <span>天</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* 执行时间设置 */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '13px' }}>执行时间段</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>从</span>
                      <TimePicker
                        value={scheduleTime.startTime ? dayjs(scheduleTime.startTime, 'HH:mm') : null}
                        onChange={(time) => handleScheduleTimeChange('startTime', time ? time.format('HH:mm') : '08:00')}
                        format="HH:mm"
                        style={{ width: '80px' }}
                      />
                      <span>到</span>
                      <TimePicker
                        value={scheduleTime.endTime ? dayjs(scheduleTime.endTime, 'HH:mm') : null}
                        onChange={(time) => handleScheduleTimeChange('endTime', time ? time.format('HH:mm') : '09:00')}
                        format="HH:mm"
                        style={{ width: '80px' }}
                      />
                    </div>
                  </div>
                  
                  {/* 规则描述 */}
                  {scheduleRule && (
                    <div style={{ 
                      background: '#f6ffed', 
                      border: '1px solid #b7eb8f', 
                      borderRadius: '4px', 
                      padding: '8px',
                      fontSize: '12px'
                    }}>
                      <div style={{ fontWeight: 'bold', color: '#389e0d', marginBottom: '4px' }}>规则描述：</div>
                      <div style={{ color: '#389e0d' }}>{scheduleRule}</div>
                    </div>
                  )}
                </div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="creator" label="创建人" rules={[{ required: true, message: '请输入创建人' }]}>
                <Input placeholder="请输入创建人" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="priority" label="优先级" rules={[{ required: true, message: '请选择优先级' }]}>
                <Select placeholder="请选择优先级">
                  <Option value="高">高</Option>
                  <Option value="中">中</Option>
                  <Option value="低">低</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="validityStartDate" 
                label="有效期开始时间" 
                rules={[{ required: true, message: '请选择有效期开始时间' }]}
              >
                <DatePicker 
                  placeholder="请选择开始时间"
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="validityEndDate" 
                label="有效期结束时间" 
                rules={[{ required: true, message: '请选择有效期结束时间' }]}
              >
                <DatePicker 
                  placeholder="请选择结束时间"
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="inspectionPointIds" label="关联巡检点位">
                <Select
                  mode="multiple"
                  placeholder="请选择巡检点位（可多选）"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {inspectionPoints.map(point => (
                    <Option key={point.id} value={point.id} label={`${point.checkArea} - ${point.checkPoints}`}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{point.checkArea}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>{point.checkPoints}</div>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="description" label="任务描述">
                <TextArea rows={3} placeholder="请输入任务描述" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

            {/* 任务列表查看详情弹窗 */}
      <Modal
        title="巡检任务详情"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={1000}
      >
        {currentRecord && (
          <div>
            {/* 任务基本信息 */}
            <Descriptions column={2} bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="任务ID">
                <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{currentRecord.taskId || currentRecord.id}</span>
                </Descriptions.Item>
              <Descriptions.Item label="任务名称">
                <span style={{ fontWeight: 'bold' }}>{currentRecord.taskName}</span>
              </Descriptions.Item>
              <Descriptions.Item label="巡检类型">
                <Tag color={
                  currentRecord.inspectionType === '日常巡检' ? 'blue' : 
                  currentRecord.inspectionType === '专项巡检' ? 'green' : 
                  currentRecord.inspectionType === '消防巡检' ? 'red' : 'purple'
                }>
                  {currentRecord.inspectionType}
                </Tag>
                </Descriptions.Item>
              <Descriptions.Item label="巡检频率">{currentRecord.frequency}</Descriptions.Item>
              <Descriptions.Item label="任务状态">
                <Tag color={
                  currentRecord.status === '已结束' ? '#52c41a' : 
                  currentRecord.status === '进行中' ? '#1890ff' : 
                  currentRecord.status === '未开始' ? '#faad14' : '#d9d9d9'
                }>
                  {currentRecord.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="优先级">
                <Tag color={
                  currentRecord.priority === '高' ? 'red' : 
                  currentRecord.priority === '中' ? 'orange' : 'blue'
                }>
                  {currentRecord.priority}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="创建人">{currentRecord.creator}</Descriptions.Item>
              <Descriptions.Item label="负责人">{currentRecord.assignee}</Descriptions.Item>
              <Descriptions.Item label="有效期开始时间">{currentRecord.validityStartDate}</Descriptions.Item>
              <Descriptions.Item label="有效期结束时间">{currentRecord.validityEndDate}</Descriptions.Item>
              <Descriptions.Item label="任务开始时间">
                {currentRecord.startTime ? dayjs(currentRecord.startTime).format('YYYY-MM-DD HH:mm') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="任务结束时间">
                {currentRecord.endTime ? dayjs(currentRecord.endTime).format('YYYY-MM-DD HH:mm') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="启用状态">
                <Tag color={currentRecord.enabled ? '#52c41a' : '#d9d9d9'}>
                  {currentRecord.enabled ? '已启用' : '已禁用'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {currentRecord.createTime ? dayjs(currentRecord.createTime).format('YYYY-MM-DD HH:mm') : '-'}
              </Descriptions.Item>
              {currentRecord.description && (
                <Descriptions.Item label="任务描述" span={2}>
                  {currentRecord.description}
                </Descriptions.Item>
              )}
              </Descriptions>

            {/* 关联油站信息 */}
            <div style={{ 
              fontSize: 16, 
              fontWeight: 'bold', 
              marginBottom: 16,
              borderBottom: '1px solid #f0f0f0',
              paddingBottom: 8
            }}>
              关联油站信息 ({filteredTaskStations.length} 个油站)
            </div>
            
            {/* 搜索筛选区域 */}
            <Form
              form={taskDetailSearchForm}
              layout="inline"
              style={{ 
                marginBottom: 16, 
                padding: 16, 
                background: '#fafafa', 
                borderRadius: 6 
              }}
            >
              <Form.Item name="stationName" label="油站名称">
                <Input 
                  placeholder="请输入油站名称或服务区"
                  style={{ width: 180 }}
                  allowClear
                />
              </Form.Item>
              <Form.Item name="branchName" label="所属分公司">
                <Select placeholder="请选择分公司" style={{ width: 150 }} allowClear>
                  <Option value="赣中分公司">赣中分公司</Option>
                  <Option value="赣东北分公司">赣东北分公司</Option>
                  <Option value="赣南分公司">赣南分公司</Option>
                  <Option value="赣北分公司">赣北分公司</Option>
                  <Option value="赣东分公司">赣东分公司</Option>
                  <Option value="赣西分公司">赣西分公司</Option>
                  <Option value="赣西南分公司">赣西南分公司</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button 
                    type="primary" 
                    icon={<SearchOutlined />}
                    onClick={handleTaskDetailSearch}
                  >
                    搜索
                  </Button>
                  <Button 
                    icon={<ReloadOutlined />}
                    onClick={handleTaskDetailReset}
                  >
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Form>

            {/* 关联油站表格 */}
            <Table
              dataSource={filteredTaskStations}
              columns={[
                {
                  title: '油站名称',
                  dataIndex: 'name',
                  key: 'name',
                  width: 300,
                  render: (text) => (
                    <span style={{ fontWeight: 'bold' }}>{text}</span>
                  )
                },
                {
                  title: '所属服务区',
                  dataIndex: 'serviceAreaName',
                  key: 'serviceAreaName',
                  width: 200
                },
                {
                  title: '所属分公司',
                  dataIndex: 'branchName',
                  key: 'branchName',
                  width: 200
                }
              ]}
              pagination={{
                pageSize: 8,
                showSizeChanger: false,
                showQuickJumper: true,
                showTotal: (total, range) => `显示 ${range[0]}-${range[1]} 条，共 ${total} 条`
              }}
              size="small"
              rowKey="id"
              style={{ marginBottom: 16 }}
            />

            {/* 关联巡检点位 */}
            <div style={{ 
              fontSize: 16, 
              fontWeight: 'bold', 
              marginBottom: 16,
              borderBottom: '1px solid #f0f0f0',
              paddingBottom: 8
            }}>
              关联巡检点位
            </div>
            {currentRecord.inspectionPoints && currentRecord.inspectionPoints.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {currentRecord.inspectionPoints.map((point, index) => (
                    <Tag key={index} color="blue" style={{ marginBottom: 8 }}>
                      {point}
                    </Tag>
                  ))}
                </div>
              </div>
            )}

            {/* 巡检项目 */}
            {currentRecord.inspectionItems && currentRecord.inspectionItems.length > 0 && (
              <>
                <div style={{ 
                  fontSize: 16, 
                  fontWeight: 'bold', 
                  marginBottom: 16,
                  borderBottom: '1px solid #f0f0f0',
                  paddingBottom: 8
                }}>
                  巡检项目
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {currentRecord.inspectionItems.map((item, index) => (
                      <Tag key={index} color="green" style={{ marginBottom: 8 }}>
                        {item}
                      </Tag>
                    ))}
                  </div>
                </div>
              </>
            )}


          </div>
        )}
      </Modal>

      {/* 巡检任务执行统计详情弹窗 */}
      <Modal
        title="巡检任务执行统计详情"
        open={taskDetailModalVisible}
        onCancel={() => setTaskDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setTaskDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={900}
      >
        {currentRecord && (
          <div>
            {/* 任务基本信息 */}
            <Descriptions column={2} bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="任务ID">
                <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{currentRecord.taskId}</span>
                </Descriptions.Item>
              <Descriptions.Item label="任务名称">
                <span style={{ fontWeight: 'bold' }}>{currentRecord.taskName}</span>
              </Descriptions.Item>
              <Descriptions.Item label="巡检类型">
                <Tag color={
                  currentRecord.inspectionType === '日常巡检' ? 'blue' : 
                  currentRecord.inspectionType === '专项巡检' ? 'green' : 'red'
                }>
                  {currentRecord.inspectionType}
                </Tag>
                </Descriptions.Item>
              <Descriptions.Item label="巡检频率">{currentRecord.frequency}</Descriptions.Item>
              </Descriptions>

            {/* 油站执行情况详情 */}
            {currentRecord.stationDetails && currentRecord.stationDetails.length > 0 && (
              <>
                <div style={{ 
                  fontSize: 16, 
                  fontWeight: 'bold', 
                  marginBottom: 16,
                  borderBottom: '1px solid #f0f0f0',
                  paddingBottom: 8
                }}>
                  油站任务执行情况
                </div>
              <Table
                  dataSource={currentRecord.stationDetails}
                columns={[
                  {
                    title: '油站名称',
                    dataIndex: 'stationName',
                    key: 'stationName',
                    width: 200,
                    render: (text, record) => (
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{text}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {record.serviceAreaName} | {record.branchName}
                        </div>
                      </div>
                    )
                  },
                  {
                    title: '应巡检次数',
                    dataIndex: 'totalInspections',
                    key: 'totalInspections',
                    width: 120,
                    render: (count) => (
                      <span style={{ fontWeight: 'bold' }}>{count || 0} 次</span>
                    )
                  },
                  {
                    title: '已巡检次数',
                    dataIndex: 'completedInspections',
                    key: 'completedInspections',
                    width: 120,
                    render: (count) => (
                      <span style={{ color: '#52c41a', fontWeight: 'bold' }}>{count || 0} 次</span>
                    )
                  },
                  {
                    title: '进度完成率',
                    dataIndex: 'completionRate',
                    key: 'completionRate',
                    width: 120,
                    render: (rate, record) => {
                      const percentage = record.totalInspections > 0 
                        ? Math.round((record.completedInspections / record.totalInspections) * 100)
                        : 0;
                      return (
                        <span style={{
                          color: percentage >= 90 ? '#52c41a' : 
                                percentage >= 60 ? '#faad14' : '#ff4d4f',
                          fontWeight: 'bold'
                        }}>
                          {percentage}%
                        </span>
                      );
                    }
                  },
                  {
                    title: '问题数',
                    dataIndex: 'issueCount',
                    key: 'issueCount',
                    width: 100,
                    render: (count) => (
                      <span style={{ color: count > 0 ? '#ff4d4f' : '#666' }}>
                        {count || 0}
                      </span>
                    )
                  },
                  {
                    title: '工单数',
                    dataIndex: 'workOrderCount',
                    key: 'workOrderCount',
                    width: 100,
                    render: (count) => (
                      <span style={{ color: count > 0 ? '#1890ff' : '#666' }}>
                        {count || 0}
                      </span>
                    )
                  },
                  {
                    title: '最近一次巡检时间',
                    dataIndex: 'lastInspectionTime',
                    key: 'lastInspectionTime',
                    width: 160,
                    render: (time) => time || '-'
                  },
                  {
                    title: '操作',
                    key: 'action',
                    width: 100,
                    fixed: 'right',
                    render: (_, record) => (
                      <Button
                        type="link"
                        size="small"
                        icon={<HistoryOutlined />}
                        onClick={() => handleViewStationHistory(record)}
                        style={{ padding: '0 4px' }}
                      >
                        巡检历史
                      </Button>
                    )
                  }
                ]}
                pagination={false}
                size="small"
                rowKey="stationId"
                scroll={{ x: 'max-content' }}
                style={{ marginBottom: 16 }}
              />
              </>
            )}

          </div>
        )}
      </Modal>

      {/* 油站巡检历史记录弹窗 */}
      <Modal
        title={currentStation ? `${currentStation.stationName} - 巡检历史记录` : '巡检历史记录'}
        open={stationHistoryModalVisible}
        onCancel={() => setStationHistoryModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setStationHistoryModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={1200}
      >
        {currentStation && (
          <div>
            {/* 油站基本信息 */}
            <Descriptions column={3} bordered size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="油站名称">{currentStation.stationName}</Descriptions.Item>
              <Descriptions.Item label="所属分公司">{currentStation.branchName}</Descriptions.Item>
              <Descriptions.Item label="服务区">{currentStation.serviceAreaName}</Descriptions.Item>
              <Descriptions.Item label="进度完成率">
                <span style={{
                  color: currentStation.progress >= 90 ? '#52c41a' : 
                        currentStation.progress >= 60 ? '#faad14' : '#ff4d4f',
                  fontWeight: 'bold'
                }}>
                  {currentStation.progress}%
                </span>
              </Descriptions.Item>
            </Descriptions>

            {/* 巡检历史记录表格 */}
            <div style={{ 
              fontSize: 16, 
              fontWeight: 'bold', 
              marginBottom: 16,
              borderBottom: '1px solid #f0f0f0',
              paddingBottom: 8
            }}>
              巡检历史记录 (最近10次)
            </div>
            {currentStation.historyRecords && currentStation.historyRecords.length > 0 ? (
              <Table
                dataSource={currentStation.historyRecords}
                columns={[
                  {
                    title: '巡检单ID',
                    dataIndex: 'inspectionId',
                    key: 'inspectionId',
                    width: 180,
                    render: (id, record) => (
                      <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                        {id || `XJD${record.stationId}${record.timestamp || '202501270001'}`}
                      </span>
                    )
                  },
                  {
                    title: '执行状态',
                    dataIndex: 'status',
                    key: 'status',
                    width: 120,
                    render: (status) => {
                      const statusConfig = {
                        '按时完成': { color: '#52c41a', text: '按时完成' },
                        '逾期完成': { color: '#faad14', text: '逾期完成' },
                        '进行中': { color: '#1890ff', text: '进行中' },
                        '未开始': { color: '#d9d9d9', text: '未开始' }
                      };
                      const config = statusConfig[status] || { color: '#d9d9d9', text: status };
                      return <Tag color={config.color}>{config.text}</Tag>;
                    }
                  },
                  {
                    title: '巡检项数量',
                    dataIndex: 'totalItems',
                    key: 'totalItems',
                    width: 120,
                    render: (count) => (
                      <span style={{ fontWeight: 'bold' }}>{count || 0} 项</span>
                    )
                  },
                  {
                    title: '完成数量',
                    dataIndex: 'completedItems',
                    key: 'completedItems',
                    width: 100,
                    render: (count) => (
                      <span style={{ color: '#52c41a', fontWeight: 'bold' }}>{count || 0} 项</span>
                    )
                  },
                  {
                    title: '完成率',
                    dataIndex: 'completionRate',
                    key: 'completionRate',
                    width: 100,
                    render: (rate, record) => {
                      const percentage = record.totalItems > 0 
                        ? Math.round((record.completedItems / record.totalItems) * 100)
                        : 0;
                      return (
                        <span style={{
                          color: percentage >= 90 ? '#52c41a' : 
                                percentage >= 60 ? '#faad14' : '#ff4d4f',
                          fontWeight: 'bold'
                        }}>
                          {percentage}%
                        </span>
                      );
                    }
                  },
                  {
                    title: '问题数',
                    dataIndex: 'issueCount',
                    key: 'issueCount',
                    width: 80,
                    render: (count) => (
                      <span style={{
                        color: count === 0 ? '#52c41a' : count <= 2 ? '#faad14' : '#ff4d4f',
                        fontWeight: 'bold'
                      }}>
                        {count || 0}
                      </span>
                    )
                  },
                  {
                    title: '工单数',
                    dataIndex: 'workOrderCount',
                    key: 'workOrderCount',
                    width: 80,
                    render: (count) => (
                      <span style={{
                        color: count === 0 ? '#52c41a' : count <= 1 ? '#faad14' : '#ff4d4f',
                        fontWeight: 'bold'
                      }}>
                        {count || 0}
                      </span>
                    )
                  },
                  {
                    title: '完成时间',
                    dataIndex: 'completedTime',
                    key: 'completedTime',
                    width: 140,
                    render: (time, record) => (
                      <span style={{
                        color: record.status === '逾期完成' ? '#ff4d4f' : '#333'
                      }}>
                        {time || '-'}
                      </span>
                    )
                  }
                ]}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: false,
                  showQuickJumper: true,
                  showTotal: (total) => `共 ${total} 条记录`
                }}
                size="small"
                rowKey="inspectionId"
                scroll={{ x: 'max-content' }}
              />
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 0', 
                color: '#999' 
              }}>
                暂无历史执行记录
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 巡检点位表单弹窗 */}
      <Modal
        title={modalType === 'add' ? '新增巡检点位' : '编辑巡检点位'}
        open={pointModalVisible}
        onCancel={() => {
          setPointModalVisible(false);
          setInspectionItems([]); // 清空检查项状态
        }}
        width={1200}
        footer={[
          <Button key="cancel" onClick={() => {
            setPointModalVisible(false);
            setInspectionItems([]);
          }}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => pointForm.submit()}>
            保存
          </Button>
        ]}
      >
        <Form
          form={pointForm}
          layout="vertical"
          onFinish={handleSavePoint}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="pointId" 
                label="点位ID"
              >
                <Input 
                  disabled 
                  placeholder="系统自动生成" 
                  style={{ backgroundColor: '#f5f5f5', color: '#666' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="pointName" 
                label="点位名称" 
                rules={[{ required: true, message: '请输入点位名称' }]}
              >
                <Input 
                  placeholder="请输入点位名称，如：主油罐区、一号加油机等" 
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item 
                name="checkArea" 
                label="检查区域" 
                rules={[{ required: true, message: '请选择检查区域' }]}
              >
                <Select placeholder="请选择检查区域">
                  <Option value="油罐区">油罐区</Option>
                  <Option value="加油区">加油区</Option>
                  <Option value="配电房">配电房</Option>
                  <Option value="便利店">便利店</Option>
                  <Option value="卡油区">卡油区</Option>
                  <Option value="环保设备">环保设备</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          

          
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item 
                name="checkPoints" 
                label="检查点位" 
                rules={[{ required: true, message: '请输入检查点位' }]}
              >
                <TextArea 
                  rows={2} 
                  placeholder="请输入具体检查点位，多个点位用、分隔，如：卸油口、管道连接、围堰设施" 
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item 
            name="locationDesc" 
            label="位置描述"
            rules={[{ required: true, message: '请输入位置描述' }]}
          >
            <TextArea rows={2} placeholder="请输入点位的详细位置描述" />
          </Form.Item>

          {/* 检查项管理区域 */}
          <Divider>检查项管理</Divider>
          
          <div style={{ marginBottom: '16px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '12px' 
            }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                检查项列表 ({inspectionItems.length}个)
              </div>
              <Button 
                type="primary" 
                size="small" 
                icon={<PlusOutlined />}
                onClick={handleAddInspectionItem}
              >
                添加检查项
              </Button>
            </div>
            
            {inspectionItems.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 0', 
                background: '#fafafa',
                border: '1px dashed #d9d9d9',
                borderRadius: '6px',
                color: '#999'
              }}>
                <div style={{ marginBottom: '8px' }}>暂无检查项</div>
                <div style={{ fontSize: '12px' }}>请点击上方“添加检查项”按钮添加巡检内容</div>
              </div>
            ) : (
              <div style={{ 
                maxHeight: '400px', 
                overflowY: 'auto',
                border: '1px solid #f0f0f0',
                borderRadius: '6px'
              }}>
                {inspectionItems.map((item, index) => (
                  <div key={item.id} style={{
                    padding: '16px',
                    borderBottom: index < inspectionItems.length - 1 ? '1px solid #f0f0f0' : 'none',
                    background: index % 2 === 0 ? '#fafafa' : '#fff'
                  }}>
                    <Row gutter={16} align="middle">
                      <Col span={1}>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: '#1890ff',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {index + 1}
                        </div>
                      </Col>
                      <Col span={5}>
                        <div style={{ marginBottom: '4px', fontSize: '12px', color: '#666' }}>检查项名称 *</div>
                        <Input
                          value={item.itemName}
                          onChange={(e) => handleUpdateInspectionItem(item.id, 'itemName', e.target.value)}
                          placeholder="请输入检查项名称"
                          size="small"
                        />
                      </Col>
                      <Col span={8}>
                        <div style={{ marginBottom: '4px', fontSize: '12px', color: '#666' }}>检查方式（可多选）</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {[
                            { key: 'text', label: '文字记录' },
                            { key: 'photo', label: '拍照记录' },
                            { key: 'video', label: '视频记录' },
                            { key: 'checkbox', label: '勾选检查' },
                            { key: 'number', label: '数值记录' }
                          ].map(method => {
                            const methodConfig = item.inspectionMethods?.find(m => m.method === method.key);
                            const isSelected = !!methodConfig;
                            
                            return (
                              <div key={method.key} style={{
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: '12px'
                              }}>
                                <Checkbox
                                  checked={isSelected}
                                  onChange={(e) => {
                                    handleToggleInspectionMethod(item.id, method.key);
                                  }}
                                >
                                  {method.label}
                                </Checkbox>
                              </div>
                            );
                          })}
                        </div>
                      </Col>
                      <Col span={8}>
                        <div style={{ marginBottom: '4px', fontSize: '12px', color: '#666' }}>检查说明</div>
                        <TextArea
                          value={item.description}
                          onChange={(e) => handleUpdateInspectionItem(item.id, 'description', e.target.value)}
                          placeholder="请输入检查说明或注意事项"
                          size="small"
                          rows={2}
                          style={{ resize: 'none' }}
                        />
                      </Col>
                      <Col span={2} style={{ textAlign: 'right' }}>
                        <Button
                          type="text"
                          danger
                          size="small"
                          icon={<MinusCircleOutlined />}
                          onClick={() => handleRemoveInspectionItem(item.id)}
                          title="删除检查项"
                        />
                      </Col>
                    </Row>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Form>
      </Modal>

      {/* 油站列表弹窗 */}
      <Modal
        title="关联油站列表"
        open={stationListModalVisible}
        onCancel={() => setStationListModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setStationListModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={1200}
      >
        {currentRecord && currentRecord.relatedStations && (
          <Table
            dataSource={currentRecord.relatedStations}
            columns={[
              {
                title: '油站编码',
                dataIndex: 'stationCode',
                key: 'stationCode',
                width: 120,
                render: (text) => <span style={{ fontFamily: 'monospace' }}>{text}</span>
              },
              {
                title: '油站名称',
                dataIndex: 'stationName',
                key: 'stationName',
                width: 200,
                render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
              },
              {
                title: '所属分公司',
                dataIndex: 'branchName',
                key: 'branchName',
                width: 150
              },
              {
                title: '服务区',
                dataIndex: 'serviceAreaName',
                key: 'serviceAreaName',
                width: 150
              },
              {
                title: '负责人',
                dataIndex: 'contactPerson',
                key: 'contactPerson',
                width: 100
              }
            ]}
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 个油站`
            }}
            scroll={{ x: 'max-content' }}
            size="small"
          />
        )}
      </Modal>

      {/* 巡检单详情查看弹窗 */}
      <Modal
        title="巡检单详情"
        open={inspectionDetailModalVisible}
        onCancel={() => setInspectionDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setInspectionDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={1000}
      >
        {currentRecord && (
          <div>
            {/* 巡检单基本信息 */}
            <Descriptions column={2} bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="巡检单ID">
                <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{currentRecord.inspectionId}</span>
              </Descriptions.Item>
              <Descriptions.Item label="任务名称">
                <span style={{ fontWeight: 'bold' }}>{currentRecord.taskName}</span>
              </Descriptions.Item>
              <Descriptions.Item label="油站名称">
                <span style={{ fontWeight: 'bold' }}>{currentRecord.stationName}</span>
              </Descriptions.Item>
              <Descriptions.Item label="所属分公司">{currentRecord.branchName}</Descriptions.Item>
              <Descriptions.Item label="巡检类型">
                <Tag color={
                  currentRecord.inspectionType === '日常巡检' ? 'blue' : 
                  currentRecord.inspectionType === '专项巡检' ? 'green' : 
                  currentRecord.inspectionType === '消防巡检' ? 'red' : 'purple'
                }>
                  {currentRecord.inspectionType}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="巡检日期">{currentRecord.inspectionDate}</Descriptions.Item>
              <Descriptions.Item label="执行状态">
                <Tag color={
                  currentRecord.status === '已完成' ? 'success' : 
                  currentRecord.status === '进行中' ? 'processing' : 
                  currentRecord.status === '逾期完成' ? 'warning' : 'default'
                }>
                  {currentRecord.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="执行人员">{currentRecord.executor}</Descriptions.Item>
              <Descriptions.Item label="开始时间">{currentRecord.startTime}</Descriptions.Item>
              <Descriptions.Item label="完成时间">{currentRecord.finishTime || '-'}</Descriptions.Item>
              <Descriptions.Item label="巡检项数">
                <span style={{ fontWeight: 'bold' }}>{currentRecord.totalPoints} 项</span>
              </Descriptions.Item>
              <Descriptions.Item label="完成数">
                <span style={{ color: '#52c41a', fontWeight: 'bold' }}>{currentRecord.completedPoints} 项</span>
              </Descriptions.Item>
              <Descriptions.Item label="问题数">
                <span style={{
                  color: currentRecord.issueCount === 0 ? '#52c41a' : 
                        currentRecord.issueCount <= 2 ? '#faad14' : '#ff4d4f',
                  fontWeight: 'bold'
                }}>
                  {currentRecord.issueCount}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="工单数">
                <span style={{
                  color: currentRecord.workOrderCount === 0 ? '#52c41a' : 
                        currentRecord.workOrderCount <= 1 ? '#faad14' : '#ff4d4f',
                  fontWeight: 'bold'
                }}>
                  {currentRecord.workOrderCount}
                </span>
              </Descriptions.Item>
              {currentRecord.remarks && (
                <Descriptions.Item label="备注信息" span={2}>
                  {currentRecord.remarks}
                </Descriptions.Item>
              )}
            </Descriptions>

            {/* 巡检项目详情 */}
            <div style={{ 
              fontSize: 16, 
              fontWeight: 'bold', 
              marginBottom: 16,
              borderBottom: '1px solid #f0f0f0',
              paddingBottom: 8
            }}>
              巡检项目详情
            </div>
            
            {currentRecord.inspectionItems && currentRecord.inspectionItems.length > 0 ? (
              <Table
                dataSource={currentRecord.inspectionItems}
                columns={[
                  {
                    title: '检查区域',
                    dataIndex: 'checkArea',
                    key: 'checkArea',
                    width: 120,
                    render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
                  },
                  {
                    title: '检查点位',
                    dataIndex: 'pointName',
                    key: 'pointName',
                    width: 120
                  },
                  {
                    title: '检查项目',
                    dataIndex: 'itemName',
                    key: 'itemName',
                    width: 200,
                    render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
                  },
                  {
                    title: '检查结果',
                    dataIndex: 'result',
                    key: 'result',
                    width: 100,
                    render: (result) => (
                      <Tag color={result === '正常' ? 'success' : 'error'}>
                        {result}
                      </Tag>
                    )
                  },
                  {
                    title: '检查时间',
                    dataIndex: 'checkTime',
                    key: 'checkTime',
                    width: 140
                  },
                  {
                    title: '照片数量',
                    dataIndex: 'photos',
                    key: 'photos',
                    width: 100,
                    render: (photos) => (
                      <span style={{ color: photos && photos.length > 0 ? '#1890ff' : '#999' }}>
                        {photos ? photos.length : 0} 张
                      </span>
                    )
                  },
                  {
                    title: '备注说明',
                    dataIndex: 'remark',
                    key: 'remark',
                    render: (text, record) => (
                      <div style={{ 
                        maxWidth: 300, 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap',
                        color: record.result === '异常' ? '#ff4d4f' : '#333'
                      }}>
                        {text || '-'}
                      </div>
                    )
                  }
                ]}
                pagination={false}
                size="small"
                rowKey={(record, index) => `${record.pointId}_${record.itemId}_${index}`}
                scroll={{ x: 'max-content' }}
                style={{ marginBottom: 16 }}
              />
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 0', 
                color: '#999' 
              }}>
                暂无巡检项目数据
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 工单创建/编辑弹窗 */}
      <Modal
        title={modalType === 'add' ? '手工创建工单' : '编辑工单'}
        open={workOrderModalVisible && modalType === 'add'}
        onCancel={() => {
          setWorkOrderModalVisible(false);
          workOrderForm.resetFields();
          // 重置巡检单相关状态
          setSelectedInspectionIds([]);
          setInspectionIssues([]);
          setSelectedIssue(null);
        }}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => {
            setWorkOrderModalVisible(false);
            workOrderForm.resetFields();
            // 重置巡检单相关状态
            setSelectedInspectionIds([]);
            setInspectionIssues([]);
            setSelectedIssue(null);
          }}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => workOrderForm.submit()}>
            保存
          </Button>
        ]}
      >
        <Form
          form={workOrderForm}
          layout="vertical"
          onFinish={handleSaveWorkOrder}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="workOrderId" 
                label="工单编号"
              >
                <Input disabled style={{ fontFamily: 'monospace', fontWeight: 'bold' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="sourceType" 
                label="来源类型"
              >
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item 
                name="title" 
                label="工单标题"
                rules={[{ required: true, message: '请输入工单标题' }]}
              >
                <Input placeholder="请输入工单标题" maxLength={100} />
              </Form.Item>
            </Col>
          </Row>

          {/* 巡检单关联区域 */}
          <div style={{ 
            margin: '16px 0', 
            padding: '16px', 
            background: '#f8f9fa', 
            border: '1px solid #e9ecef', 
            borderRadius: '6px' 
          }}>
            <div style={{ 
              fontWeight: 'bold', 
              marginBottom: '12px', 
              color: '#495057',
              fontSize: '14px'
            }}>
              🔗 关联巡检问题（可选）
            </div>
            
            <Row gutter={16}>
              <Col span={24}>
                <div style={{ marginBottom: '8px', fontSize: '13px', color: '#666' }}>选择巡检单ID（支持多选）</div>
                <Select
                  mode="multiple"
                  placeholder="请选择巡检单ID"
                  allowClear
                  value={selectedInspectionIds}
                  onChange={handleInspectionSelect}
                  style={{ width: '100%' }}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => 
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {inspectionDetails
                    .filter(detail => detail.issueCount > 0) // 只显示有问题的巡检单
                    .map(detail => (
                      <Option key={detail.inspectionId} value={detail.inspectionId}>
                        {detail.inspectionId}
                      </Option>
                    ))
                  }
                </Select>
              </Col>
            </Row>
              
            
            {/* 问题详情展示 */}
            {inspectionIssues.length > 0 && (
              <div style={{ 
                marginTop: '12px', 
                padding: '12px', 
                background: '#fff', 
                border: '1px solid #dee2e6', 
                borderRadius: '4px' 
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '12px', color: '#495057' }}>
                  📝 问题详情（共{inspectionIssues.length}个问题）
                </div>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {inspectionIssues.map((issue, index) => (
                    <div key={index} style={{
                      padding: '8px',
                      marginBottom: '8px',
                      background: '#f8f9fa',
                      border: '1px solid #e9ecef',
                      borderRadius: '4px',
                      borderLeft: '3px solid #007bff'
                    }}>
                      <Row gutter={16}>
                        <Col span={6}>
                          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>巡检单ID</div>
                          <div style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '11px' }}>
                            {issue.inspectionId}
                          </div>
                        </Col>
                        <Col span={6}>
                          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>油站</div>
                          <div style={{ fontSize: '12px' }}>{issue.stationName}</div>
                        </Col>
                        <Col span={6}>
                          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>检查点位</div>
                          <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{issue.pointName}</div>
                        </Col>
                        <Col span={6}>
                          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>检查时间</div>
                          <div style={{ fontSize: '11px' }}>{issue.checkTime}</div>
                        </Col>
                      </Row>
                      <Row gutter={16} style={{ marginTop: '8px' }}>
                        <Col span={12}>
                          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>检查项目</div>
                          <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{issue.itemName}</div>
                        </Col>
                        <Col span={12}>
                          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>检查结果</div>
                          <Tag color="red" size="small">{issue.result}</Tag>
                        </Col>
                      </Row>
                      <div style={{ marginTop: '8px' }}>
                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>问题描述</div>
                        <div style={{ 
                          padding: '6px', 
                          background: '#fff', 
                          borderRadius: '3px',
                          border: '1px solid #e9ecef',
                          fontSize: '12px'
                        }}>
                          {issue.remark}
                        </div>
                      </div>
                      {issue.photos && issue.photos.length > 0 && (
                        <div style={{ marginTop: '8px' }}>
                          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>相关照片</div>
                          <div>
                            {issue.photos.map((photo, photoIndex) => (
                              <Tag key={photoIndex} color="blue" size="small" style={{ marginBottom: '2px' }}>
                                📷 {photo}
                              </Tag>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item 
                name="urgency" 
                label="紧急程度"
                rules={[{ required: true, message: '请选择紧急程度' }]}
              >
                <Select placeholder="请选择紧急程度">
                  <Option value="紧急">紧急</Option>
                  <Option value="重要">重要</Option>
                  <Option value="一般">一般</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item 
                name="stationId" 
                label="所属油站"
              >
                <TreeSelect
                  placeholder="请选择油站"
                  allowClear
                  treeData={[
                    {
                      title: '江西交投化石能源公司',
                      value: 'ALL',
                      key: 'root',
                      children: stationData.branches.map(branch => ({
                        title: branch.name,
                        value: branch.id,
                        key: branch.id,
                        children: stationData.stations
                          .filter(station => station.branchId === branch.id)
                          .map(station => ({
                            title: station.name,
                            value: station.id,
                            key: station.id
                          }))
                      }))
                    }
                  ]}
                  onChange={(value, label, extra) => {
                    // 设置对应的油站名称
                    if (value && extra?.triggerNode) {
                      const station = stationData.stations.find(s => s.id === value);
                      if (station) {
                        workOrderForm.setFieldsValue({ stationName: station.name });
                      } else if (value === 'ALL') {
                        workOrderForm.setFieldsValue({ stationName: '全部油站' });
                      }
                    } else {
                      workOrderForm.setFieldsValue({ stationName: null });
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item 
                name="deadline" 
                label="截止时间"
                rules={[{ required: true, message: '请选择截止时间' }]}
              >
                <DatePicker 
                  showTime
                  placeholder="请选择截止时间"
                  style={{ width: '100%' }}
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item 
                name="description" 
                label="问题描述"
                rules={[{ required: true, message: '请输入问题描述' }]}
              >
                <TextArea 
                  rows={4} 
                  placeholder="请详细描述需要处理的问题或事项"
                  maxLength={500}
                  showCount
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="submitter" 
                label="提交人"
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="createTime" 
                label="创建时间"
              >
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>

          {/* 隐藏字段 */}
          <Form.Item name="status" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="stationName" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="relatedInspectionId" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="relatedIssueInfo" hidden>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* 工单详情查看弹窗 */}
      <Modal
        title="工单详情"
        open={workOrderModalVisible && modalType === 'view'}
        onCancel={() => setWorkOrderModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setWorkOrderModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {currentRecord && (
          <div>
            {/* 工单基本信息 */}
            <Descriptions column={2} bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="工单编号">
                <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{currentRecord.workOrderId}</span>
              </Descriptions.Item>
              <Descriptions.Item label="工单标题">
                <span style={{ fontWeight: 'bold' }}>{currentRecord.title}</span>
              </Descriptions.Item>
              <Descriptions.Item label="来源类型">{currentRecord.sourceType}</Descriptions.Item>
              <Descriptions.Item label="来源ID">
                {currentRecord.sourceId ? (
                  <span style={{ fontFamily: 'monospace' }}>{currentRecord.sourceId}</span>
                ) : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="紧急程度">
                <Tag color={
                  currentRecord.urgency === '紧急' ? 'red' :
                  currentRecord.urgency === '重要' ? 'orange' : 'blue'
                }>
                  {currentRecord.urgency}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="工单状态">
                <Tag color={
                  currentRecord.status === '已完成' ? 'success' :
                  currentRecord.status === '处理中' ? 'processing' :
                  currentRecord.status === '待处理' ? 'orange' :
                  currentRecord.status === '待审核' ? 'warning' :
                  currentRecord.status === '已逾期' ? 'error' : 'default'
                }>
                  {currentRecord.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="提交人">{currentRecord.submitter}</Descriptions.Item>
              <Descriptions.Item label="处理人">{currentRecord.handler || '-'}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{currentRecord.createTime}</Descriptions.Item>
              <Descriptions.Item label="截止时间">
                <span>
                  {currentRecord.deadline || '-'}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="所属油站">{currentRecord.stationName || '-'}</Descriptions.Item>
              <Descriptions.Item label="处理进度">
                {currentRecord.status === '已完成' ? '100%' :
                 currentRecord.status === '处理中' ? '50%' :
                 currentRecord.status === '待审核' ? '80%' : '0%'}
              </Descriptions.Item>
              {currentRecord.description && (
                <Descriptions.Item label="问题描述" span={2}>
                  <div style={{ 
                    padding: '8px 12px', 
                    background: '#fafafa', 
                    borderRadius: '4px',
                    border: '1px solid #f0f0f0'
                  }}>
                    {currentRecord.description}
                  </div>
                </Descriptions.Item>
              )}
            </Descriptions>

            {/* 处理记录 */}
            <div style={{ 
              fontSize: 16, 
              fontWeight: 'bold', 
              marginBottom: 16,
              borderBottom: '1px solid #f0f0f0',
              paddingBottom: 8
            }}>
              处理记录
            </div>
            
            <div style={{ 
              background: '#fafafa', 
              padding: '16px', 
              borderRadius: '6px',
              border: '1px solid #f0f0f0'
            }}>
              {currentRecord.status === '待分配' && (
                <div style={{ color: '#999' }}>工单尚未分配处理人员</div>
              )}
              {currentRecord.status === '待处理' && (
                <div>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ fontWeight: 'bold' }}>当前状态：</span>
                    <Tag color="orange">等待处理</Tag>
                  </div>
                  <div style={{ color: '#666' }}>
                    工单已分配给 <span style={{ fontWeight: 'bold' }}>{currentRecord.handler}</span>，等待开始处理
                  </div>
                </div>
              )}
              {currentRecord.status === '处理中' && (
                <div>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ fontWeight: 'bold' }}>当前状态：</span>
                    <Tag color="processing">处理中</Tag>
                  </div>
                  <div style={{ color: '#666' }}>
                    <span style={{ fontWeight: 'bold' }}>{currentRecord.handler}</span> 正在处理此工单
                  </div>
                </div>
              )}
              {currentRecord.status === '待审核' && (
                <div>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ fontWeight: 'bold' }}>当前状态：</span>
                    <Tag color="warning">待审核</Tag>
                  </div>
                  <div style={{ color: '#666' }}>
                    <span style={{ fontWeight: 'bold' }}>{currentRecord.handler}</span> 已完成处理，等待审核确认
                  </div>
                </div>
              )}
              {currentRecord.status === '已完成' && (
                <div>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ fontWeight: 'bold' }}>当前状态：</span>
                    <Tag color="success">已完成</Tag>
                  </div>
                  <div style={{ color: '#666' }}>
                    工单已由 <span style={{ fontWeight: 'bold' }}>{currentRecord.handler}</span> 完成处理
                  </div>
                </div>
              )}
              {currentRecord.status === '已逾期' && (
                <div>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ fontWeight: 'bold' }}>当前状态：</span>
                    <Tag color="error">已逾期</Tag>
                  </div>
                  <div style={{ color: '#ff4d4f' }}>
                    工单已超过截止时间，需要紧急处理
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* 修改记录详情查看弹窗 */}
      <Modal
        title="修改记录详情"
        open={changeRecordModalVisible}
        onCancel={() => setChangeRecordModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setChangeRecordModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {currentRecord && (
          <div>
            {/* 修改记录基本信息 */}
            <Descriptions column={2} bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="变更时间">
                <span style={{ fontWeight: 'bold' }}>{currentRecord.changeTime}</span>
              </Descriptions.Item>
              <Descriptions.Item label="变更类型">
                <Tag color={
                  currentRecord.changeType === '新增' ? 'success' :
                  currentRecord.changeType === '修改' ? 'warning' : 'error'
                } icon={
                  currentRecord.changeType === '新增' ? <PlusOutlined /> :
                  currentRecord.changeType === '修改' ? <EditOutlined /> : <DeleteOutlined />
                }>
                  {currentRecord.changeType}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="变更对象">{currentRecord.changeObject}</Descriptions.Item>
              <Descriptions.Item label="对象ID">
                {currentRecord.changeObjectId ? (
                  <span style={{ fontFamily: 'monospace' }}>{currentRecord.changeObjectId}</span>
                ) : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="操作人">{currentRecord.operator}</Descriptions.Item>
              <Descriptions.Item label="操作人ID">
                <span style={{ fontFamily: 'monospace' }}>{currentRecord.operatorId}</span>
              </Descriptions.Item>
              <Descriptions.Item label="审批状态">
                <Tag color={
                  currentRecord.approvalStatus === '已审批' ? 'success' :
                  currentRecord.approvalStatus === '审批中' ? 'processing' : 'error'
                }>
                  {currentRecord.approvalStatus}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="审批人">{currentRecord.approver || '-'}</Descriptions.Item>
              <Descriptions.Item label="审批时间">{currentRecord.approvalTime || '-'}</Descriptions.Item>
              <Descriptions.Item label="审批备注" span={1}>
                {currentRecord.approvalRemark || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="变更描述" span={2}>
                <div style={{ 
                  padding: '8px 12px', 
                  background: '#fafafa', 
                  borderRadius: '4px',
                  border: '1px solid #f0f0f0'
                }}>
                  {currentRecord.changeDescription}
                </div>
              </Descriptions.Item>
            </Descriptions>

            {/* 变更详情 */}
            <div style={{ 
              fontSize: 16, 
              fontWeight: 'bold', 
              marginBottom: 16,
              borderBottom: '1px solid #f0f0f0',
              paddingBottom: 8
            }}>
              变更详情
            </div>
            
            <Row gutter={16}>
              {currentRecord.oldValue && (
                <Col span={12}>
                  <div style={{ 
                    background: '#fff2f0', 
                    padding: '12px', 
                    borderRadius: '6px',
                    border: '1px solid #ffccc7'
                  }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#cf1322' }}>
                      变更前
                    </div>
                    <pre style={{ 
                      margin: 0, 
                      fontSize: '12px', 
                      background: 'transparent',
                      border: 'none',
                      color: '#666'
                    }}>
                      {JSON.stringify(currentRecord.oldValue, null, 2)}
                    </pre>
                  </div>
                </Col>
              )}
              <Col span={currentRecord.oldValue ? 12 : 24}>
                <div style={{ 
                  background: '#f6ffed', 
                  padding: '12px', 
                  borderRadius: '6px',
                  border: '1px solid #b7eb8f'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#389e0d' }}>
                    变更后
                  </div>
                  <pre style={{ 
                    margin: 0, 
                    fontSize: '12px', 
                    background: 'transparent',
                    border: 'none',
                    color: '#666'
                  }}>
                    {JSON.stringify(currentRecord.newValue, null, 2)}
                  </pre>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {/* NFC标签编辑/新增弹窗 */}
      <Modal
        title={modalType === 'add' ? '新增NFC标签' : modalType === 'edit' ? '编辑NFC标签' : '查看NFC标签'}
        open={nfcModalVisible}
        onCancel={() => setNfcModalVisible(false)}
        width={700}
        footer={modalType === 'view' ? [
          <Button key="close" onClick={() => setNfcModalVisible(false)}>
            关闭
          </Button>
        ] : [
          <Button key="cancel" onClick={() => setNfcModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => nfcForm.submit()}>
            保存
          </Button>
        ]}
      >
        <Form
          form={nfcForm}
          layout="vertical"
          onFinish={handleSaveNfc}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="tagId" 
                label="标签ID"
              >
                <Input 
                  disabled 
                  placeholder="系统自动生成" 
                  style={{ backgroundColor: '#f5f5f5', color: '#666' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="tagCode" 
                label="标签编码" 
                rules={[{ required: true, message: '请输入标签编码' }]}
              >
                <Input 
                  placeholder="请输入标签编码"
                  disabled={modalType === 'view'}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item 
                name="tagName" 
                label="标签名称" 
                rules={[{ required: true, message: '请输入标签名称' }]}
              >
                <Input 
                  placeholder="请输入标签名称"
                  disabled={modalType === 'view'}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item 
                name="stationId" 
                label="所属油站" 
                rules={[{ required: true, message: '请选择所属油站' }]}
              >
                <Select 
                  placeholder="请选择所属油站"
                  disabled={modalType === 'view'}
                >
                  {stationData.stations.map(station => (
                    <Option key={station.id} value={station.id}>{station.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item 
                name="pointId" 
                label="关联巡检点位"
                rules={[{ required: true, message: '请选择关联的巡检点位' }]}
              >
                <Select 
                  placeholder="请选择关联的巡检点位"
                  allowClear
                  showSearch
                  disabled={modalType === 'view'}
                  filterOption={(input, option) => {
                    // 根据点位名称、检查区域进行搜索
                    const point = inspectionPoints.find(p => p.id === option.value);
                    if (!point) return false;
                    const searchText = input.toLowerCase();
                    return (
                      (point.pointName && point.pointName.toLowerCase().includes(searchText)) ||
                      point.checkArea.toLowerCase().includes(searchText) ||
                      point.id.toLowerCase().includes(searchText)
                    );
                  }}
                  onChange={(pointId) => {
                    // 当选择点位时，不需要自动填充其他信息
                    // 只保存点位ID即可
                  }}
                >
                  {inspectionPoints.map(point => (
                    <Option key={point.id} value={point.id}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>
                          {point.pointName ? `${point.pointName} (${point.checkArea})` : point.checkArea}
                        </div>
                        <div style={{ fontSize: '11px', color: '#999' }}>点位ID: {point.id}</div>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item 
                name="description" 
                label="描述信息"
              >
                <TextArea 
                  rows={3} 
                  placeholder="请输入描述信息"
                  disabled={modalType === 'view'}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* NFC标签详情查看弹窗 */}
      <Modal
        title="NFC标签详情"
        open={nfcDetailModalVisible}
        onCancel={() => setNfcDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setNfcDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={700}
      >
        {currentRecord && (
          <div>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="标签ID">
                <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{currentRecord.id}</span>
              </Descriptions.Item>
              <Descriptions.Item label="标签编码">
                <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{currentRecord.tagCode}</span>
              </Descriptions.Item>
              <Descriptions.Item label="标签名称">
                <span style={{ fontWeight: 'bold' }}>{currentRecord.tagName}</span>
              </Descriptions.Item>
              <Descriptions.Item label="所属油站">{currentRecord.stationName || '-'}</Descriptions.Item>
              <Descriptions.Item label="检查区域">{currentRecord.checkArea || '-'}</Descriptions.Item>
              <Descriptions.Item label="检查点位">{currentRecord.checkPoints || '-'}</Descriptions.Item>
              <Descriptions.Item label="维护人">{currentRecord.maintainer || '-'}</Descriptions.Item>
              <Descriptions.Item label="维护时间">{currentRecord.maintainTime || '-'}</Descriptions.Item>
              <Descriptions.Item label="安装日期">{currentRecord.installDate || '-'}</Descriptions.Item>
              <Descriptions.Item label="关联点位ID">
                {currentRecord.pointId ? (
                  <span style={{ fontFamily: 'monospace' }}>{currentRecord.pointId}</span>
                ) : '-'}
              </Descriptions.Item>
              {currentRecord.description && (
                <Descriptions.Item label="描述信息" span={2}>
                  <div style={{ 
                    padding: '8px 12px', 
                    background: '#fafafa', 
                    borderRadius: '4px',
                    border: '1px solid #f0f0f0'
                  }}>
                    {currentRecord.description}
                  </div>
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* 巡检点位详情查看弹窗 */}
      <Modal
        title="巡检点位详情"
        open={pointDetailModalVisible}
        onCancel={() => setPointDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setPointDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={900}
      >
        {currentRecord && (
          <div>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="点位ID">
                <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{currentRecord.id}</span>
              </Descriptions.Item>
              <Descriptions.Item label="检查区域">
                <span style={{ fontWeight: 'bold' }}>{currentRecord.checkArea}</span>
              </Descriptions.Item>
              <Descriptions.Item label="检查点位" span={2}>
                <div style={{ 
                  padding: '8px 12px', 
                  background: '#fafafa', 
                  borderRadius: '4px',
                  border: '1px solid #f0f0f0'
                }}>
                  {currentRecord.checkPoints}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="位置描述" span={2}>
                <div style={{ 
                  padding: '8px 12px', 
                  background: '#fafafa', 
                  borderRadius: '4px',
                  border: '1px solid #f0f0f0'
                }}>
                  {currentRecord.locationDesc || '暂无描述'}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="创建人">{currentRecord.creator || '系统管理员'}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{currentRecord.createTime || new Date().toISOString().split('T')[0]}</Descriptions.Item>
            </Descriptions>
            
            {/* 检查项详情 */}
            <div style={{ 
              fontSize: 16, 
              fontWeight: 'bold', 
              marginTop: 24,
              marginBottom: 16,
              borderBottom: '1px solid #f0f0f0',
              paddingBottom: 8
            }}>
              检查项详情 ({currentRecord.inspectionItems?.length || 0}个)
            </div>
            
            {currentRecord.inspectionItems && currentRecord.inspectionItems.length > 0 ? (
              <div style={{ 
                maxHeight: '300px', 
                overflowY: 'auto',
                border: '1px solid #f0f0f0',
                borderRadius: '6px'
              }}>
                {currentRecord.inspectionItems.map((item, index) => (
                  <div key={item.id || index} style={{
                    padding: '12px 16px',
                    borderBottom: index < currentRecord.inspectionItems.length - 1 ? '1px solid #f0f0f0' : 'none',
                    background: index % 2 === 0 ? '#fafafa' : '#fff'
                  }}>
                    <Row gutter={16} align="top">
                      <Col span={1}>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: '#1890ff',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {index + 1}
                        </div>
                      </Col>
                      <Col span={6}>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                          {item.itemName}
                        </div>
                      </Col>
                      <Col span={8}>
                        <div style={{ marginBottom: '4px', fontSize: '12px', color: '#666' }}>检查方式</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {item.inspectionMethods && item.inspectionMethods.length > 0 ? (
                            item.inspectionMethods.map(method => (
                              <Tag key={method.method} color="blue" size="small">
                                {getInspectionMethodName(method.method)}
                              </Tag>
                            ))
                          ) : item.inspectionMethod ? (
                            // 兼容旧数据结构
                            <Tag color="blue" size="small">
                              {getInspectionMethodName(item.inspectionMethod)}
                            </Tag>
                          ) : (
                            <span style={{ color: '#999', fontSize: '12px' }}>暂无配置</span>
                          )}
                        </div>
                      </Col>
                      <Col span={9}>
                        <div style={{ marginBottom: '4px', fontSize: '12px', color: '#666' }}>检查说明</div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: '#666',
                          lineHeight: '1.4',
                          minHeight: '32px',
                          padding: '4px 0'
                        }}>
                          {item.description || '暂无说明'}
                        </div>
                      </Col>
                    </Row>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 0',
                background: '#fafafa',
                border: '1px dashed #d9d9d9',
                borderRadius: '6px',
                color: '#999'
              }}>
                <div style={{ marginBottom: '8px' }}>暂无检查项</div>
                <div style={{ fontSize: '12px' }}>此点位还没有配置检查项</div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 页面底部备注信息 */}
      <div style={{ 
        marginTop: 24, 
        padding: 16, 
        background: '#f8f9fa', 
        border: '1px solid #e9ecef', 
        borderRadius: 6,
        fontSize: 12,
        color: '#6c757d'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: 8, color: '#495057' }}>
          📋 功能说明
        </div>
        <div style={{ lineHeight: '1.6' }}>
          • <strong>独立查看功能：</strong> 任务列表和执行统计的查看功能现已完全独立，互不影响<br/>
          • <strong>任务有效期：</strong> 新建、编辑、查看页面均支持任务有效期设置（开始时间和结束时间）<br/>
          • <strong>执行统计详情优化：</strong> 去掉当前执行周期，油站执行情况增加应巡检次数、已巡检次数、进度完成率、问题数、工单数、最近一次巡检时间<br/>
          • <strong>巡检历史记录：</strong> 历史按钮改为"巡检历史"，巡检单ID采用全局唯一格式（XJD+油站ID+时间戳），执行状态包括未开始、进行中、按时完成、逾期完成<br/>
          • <strong>历史记录表格：</strong> 增加巡检项数量、完成数量、完成率字段，去掉评分和备注字段<br/>
          • <strong>关联油站搜索：</strong> 支持按油站名称、分公司进行筛选和搜索（模拟10个油站数据）<br/>
          • <strong>巡检单明细：</strong> 新增巡检单明细Tab页，支持按组织机构筛选查看各油站提交的巡检单据<br/>
          • <strong>巡检单查看：</strong> 点击查看按钮可查看巡检单详情，包含每个巡检项的检查结果、照片数量和备注说明<br/>
          • <strong>任务状态优化：</strong> 巡检任务状态已更新为：进行中、未开始、已结束，更符合实际业务流程<br/>
          • <strong>启用状态管理：</strong> 新增启用/禁用开关列，支持动态控制任务的激活状态<br/>
          • <strong>时间字段增强：</strong> 新增任务开始时间和结束时间列，便于时间范围管理<br/>
          • <strong>详情展示完善：</strong> 任务详情弹窗中新增启用状态、开始/结束时间等信息展示<br/>
          • <strong>功能模块独立：</strong> 所有功能模块已完全独立，各自拥有专用的查看、编辑、删除等功能，相互之间不冲突<br/>
          • <strong>NFC标签管理：</strong> 独立的NFC标签查看弹窗，显示完整的标签信息和关联关系<br/>
          • <strong>巡检点位维护：</strong> 独立的点位详情查看弹窗，显示点位信息和关联的NFC标签<br/>
          • <strong>修改记录管理：</strong> 独立的修改记录查看弹窗，显示变更前后的对比信息和审批流程<br/>
          • <strong>巡检闢率重复事件：</strong> 实现了预设模式和自定义模式的重复事件设置，支持复杂的巡检频率配置<br/>
          • <strong>频率预设模式：</strong> 支持不重复、每天、每周、每月、每季度、每年等常用频率快速设置<br/>
          • <strong>自定义频率模式：</strong> 支持灵活的间隔设置（每N天/周/月/季度），支持按周几、按每月日期、按季度日期等实用规则<br/>
          • <strong>执行时间设置：</strong> 支持设置巡检任务的执行时间段，明确巡检窗口期<br/>
          • <strong>动态规则描述：</strong> 实时生成可读性强的规则描述，方便用户理解和验证设置的重复规则<br/>
          • <strong>工单管理功能：</strong> 新增手工创建工单功能，支持工单标题、紧急程度、所属油站、截止时间、问题描述等完整信息录入<br/>
          • <strong>工单创建流程：</strong> 自动生成工单编号，默认状态为"待分配"，支持树形选择油站，表单验证完整<br/>
          • <strong>工单查看功能：</strong> 独立的工单详情查看弹窗，显示工单基本信息、处理记录和当前状态<br/>
          • <strong>巡检单关联功能：</strong> 支持选择巡检单ID关联具体问题，自动获取问题描述和照片链接，自动填充工单标题和内容<br/>
          • <strong>问题快速关联：</strong> 仅显示有异常问题的巡检单，支持搜索和选择具体问题，显示问题详情和相关照片<br/>
          • <strong>演示备注：</strong> 本页面已按照设计规范完善，所有功能模块相互独立，便于系统演示和测试
        </div>
      </div>
    </div>
  );
};

export default InspectionManagement; 
