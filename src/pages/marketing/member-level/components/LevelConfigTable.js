import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Input, InputNumber, Upload, Select, Modal, Space, message, Tag, Popconfirm, Card, Row, Col, Divider } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, UploadOutlined, GiftOutlined, MinusCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

const LevelConfigTable = ({ data, onChange, consumptionMetric }) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [privilegeModalVisible, setPrivilegeModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [privilegeForm] = Form.useForm();
  const [editingIndex, setEditingIndex] = useState(null);
  const [couponOptions, setCouponOptions] = useState([]);
  const [priceRuleOptions, setPriceRuleOptions] = useState([]);

  useEffect(() => {
    loadOptionsData();
  }, []);

  const loadOptionsData = async () => {
    // 模拟加载优惠券选项
    const mockCoupons = [
      { id: 'C001', name: '10元油品优惠券', type: 'fuel', value: 10 },
      { id: 'C002', name: '20元通用优惠券', type: 'general', value: 20 },
      { id: 'C003', name: '免费洗车券', type: 'carwash', value: 0 },
      { id: 'C004', name: '5%折扣券', type: 'percentage', value: 5 },
    ];
    setCouponOptions(mockCoupons);

    // 模拟加载价格规则选项
    const mockPriceRules = [
      { id: 'PR001', name: '92#汽油9.5折', description: '92#汽油享受9.5折优惠' },
      { id: 'PR002', name: '95#汽油9.6折', description: '95#汽油享受9.6折优惠' },
      { id: 'PR003', name: '全品类9.8折', description: '所有商品享受9.8折优惠' },
    ];
    setPriceRuleOptions(mockPriceRules);
  };

  const addLevel = () => {
    const newLevel = {
      id: `LEVEL_${Date.now()}`,
      levelName: `Lv${data.length + 1}-新等级`,
      levelOrder: data.length + 1,
      levelIcon: null,
      consumptionThreshold: data.length === 0 ? 0 : (data[data.length - 1]?.consumptionThreshold || 0) + 1000,
      privileges: {
        coupons: [],
        priceRules: [],
        points: 0
      },
      isNew: true
    };
    
    setEditingIndex(data.length);
    editForm.setFieldsValue(newLevel);
    setEditModalVisible(true);
  };

  const editLevel = (record, index) => {
    setEditingIndex(index);
    editForm.setFieldsValue({
      ...record,
      levelIcon: record.levelIcon ? [{ uid: '1', name: 'icon.png', url: record.levelIcon }] : []
    });
    setEditModalVisible(true);
  };

  const deleteLevel = (index) => {
    const newData = [...data];
    newData.splice(index, 1);
    
    // 重新排序
    const reorderedData = newData.map((item, idx) => ({
      ...item,
      levelOrder: idx + 1
    }));
    
    onChange(reorderedData);
    message.success('等级删除成功');
  };

  const handleEditSave = async () => {
    try {
      const values = await editForm.validateFields();
      const newData = [...data];
      
      // 处理图标上传
      let iconUrl = null;
      if (values.levelIcon && values.levelIcon.length > 0) {
        iconUrl = values.levelIcon[0].url || values.levelIcon[0].response?.url;
      }

      const levelData = {
        ...values,
        levelIcon: iconUrl,
        id: editingIndex < data.length ? data[editingIndex].id : `LEVEL_${Date.now()}`
      };

      if (editingIndex < data.length) {
        newData[editingIndex] = levelData;
      } else {
        newData.push(levelData);
      }

      // 按消费门槛排序并重新分配levelOrder
      const sortedData = newData.sort((a, b) => a.consumptionThreshold - b.consumptionThreshold);
      const reorderedData = sortedData.map((item, index) => ({
        ...item,
        levelOrder: index + 1
      }));

      onChange(reorderedData);
      setEditModalVisible(false);
      message.success('等级保存成功');
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  const showPrivilegeConfig = (record, index) => {
    setEditingIndex(index);
    const privileges = record.privileges || {};
    
    // 转换优惠券数据格式为Form.List需要的格式
    const couponsData = (privileges.coupons || []).map(coupon => {
      if (typeof coupon === 'string') {
        return { couponId: coupon, quantity: 1 };
      }
      return coupon;
    });
    
    // 价格优惠改为单选，取第一个规则
    const priceRule = privileges.priceRule || 
      (privileges.priceRules && privileges.priceRules.length > 0 ? 
        (typeof privileges.priceRules[0] === 'string' ? privileges.priceRules[0] : privileges.priceRules[0].ruleId) : 
        null);
    
    privilegeForm.setFieldsValue({
      coupons: couponsData,
      priceRule: priceRule,
      points: privileges.points || 0
    });
    setPrivilegeModalVisible(true);
  };

  const handlePrivilegeSave = async () => {
    try {
      const values = await privilegeForm.validateFields();
      const newData = [...data];
      
      // 转换数据格式以适配新的结构
      const privileges = {
        coupons: values.coupons || [],
        priceRule: values.priceRule || null,
        points: values.points || 0
      };
      
      newData[editingIndex] = {
        ...newData[editingIndex],
        privileges: privileges
      };

      onChange(newData);
      setPrivilegeModalVisible(false);
      message.success('权益配置保存成功');
    } catch (error) {
      console.error('权益配置保存失败:', error);
    }
  };

  const uploadProps = {
    name: 'file',
    action: '/api/upload',
    listType: 'picture',
    maxCount: 1,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只能上传图片文件!');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('图片大小不能超过 2MB!');
        return false;
      }
      return true;
    },
    onChange: (info) => {
      if (info.file.status === 'done') {
        message.success('图标上传成功');
      } else if (info.file.status === 'error') {
        message.error('图标上传失败');
      }
    }
  };

  const getThresholdUnit = () => {
    return consumptionMetric === 'fuelVolume' ? '升' : '元';
  };

  const columns = [
    {
      title: '等级排序',
      dataIndex: 'levelOrder',
      key: 'levelOrder',
      width: 80,
      render: (order) => (
        <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '16px' }}>
          {order}
        </div>
      )
    },
    {
      title: '等级名称',
      dataIndex: 'levelName',
      key: 'levelName',
      width: 150,
      render: (name, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {record.levelIcon && (
            <img 
              src={record.levelIcon} 
              alt="等级图标" 
              style={{ width: 24, height: 24, marginRight: 8 }}
            />
          )}
          <strong>{name}</strong>
        </div>
      )
    },
    {
      title: `升级门槛(${getThresholdUnit()})`,
      dataIndex: 'consumptionThreshold',
      key: 'consumptionThreshold',
      width: 150,
      render: (threshold, record) => (
        <div>
          {threshold === 0 ? (
            <Tag color="green">无门槛</Tag>
          ) : (
            <strong style={{ color: '#1890ff' }}>
              ≥ {threshold.toLocaleString()}{getThresholdUnit()}
            </strong>
          )}
          {record.levelOrder === 1 && (
            <div style={{ fontSize: '12px', color: '#666' }}>默认等级</div>
          )}
        </div>
      )
    },
    {
      title: '会员权益',
      key: 'privileges',
      width: 250,
      render: (_, record) => {
        const { privileges = {} } = record;
        const { coupons = [], priceRule, priceRules = [], points = 0 } = privileges;
        
        // 计算优惠券总数量
        const totalCoupons = coupons.reduce((sum, coupon) => {
          if (typeof coupon === 'object' && coupon.quantity) {
            return sum + coupon.quantity;
          }
          return sum + 1;
        }, 0);
        
        // 兼容旧数据格式的价格优惠
        const hasPriceRule = priceRule || (priceRules && priceRules.length > 0);
        
        return (
          <div>
            {coupons.length > 0 && (
              <div>
                <Tag color="orange">赠送优惠券 {totalCoupons}张</Tag>
              </div>
            )}
            {hasPriceRule && (
              <div>
                <Tag color="blue">价格优惠 1项</Tag>
              </div>
            )}
            {points > 0 && (
              <div>
                <Tag color="purple">赠送积分 {points}分</Tag>
              </div>
            )}
            {coupons.length === 0 && !hasPriceRule && points === 0 && (
              <Tag color="default">暂无权益</Tag>
            )}
          </div>
        );
      }
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record, index) => (
        <Space size="small">
          <Button 
            type="primary" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => editLevel(record, index)}
          >
            编辑
          </Button>
          <Button 
            type="primary" 
            size="small" 
            icon={<GiftOutlined />}
            onClick={() => showPrivilegeConfig(record, index)}
          >
            权益
          </Button>
          {data.length > 3 && (
            <Popconfirm
              title="确定删除此等级吗？"
              onConfirm={() => deleteLevel(index)}
              okText="确定"
              cancelText="取消"
            >
              <Button 
                type="primary" 
                size="small" 
                danger 
                icon={<DeleteOutlined />}
              >
                删除
              </Button>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={addLevel}
          disabled={data.length >= 5}
        >
          添加等级 ({data.length}/5)
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={false}
        scroll={{ x: 'max-content' }}
        locale={{ emptyText: '暂无等级配置，请点击"添加等级"开始配置' }}
      />

      {/* 等级编辑弹窗 */}
      <Modal
        title="配置等级信息"
        open={editModalVisible}
        onOk={handleEditSave}
        onCancel={() => setEditModalVisible(false)}
        width={600}
        destroyOnClose
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="levelName"
            label="等级名称"
            rules={[{ required: true, message: '请输入等级名称' }]}
          >
            <Input placeholder="例如：Lv1-新晋会员" maxLength={20} />
          </Form.Item>
          
          <Form.Item
            name="levelIcon"
            label="等级图标"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) return e;
              return e && e.fileList;
            }}
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>上传图标</Button>
            </Upload>
          </Form.Item>
          
          <Form.Item
            name="consumptionThreshold"
            label={`升级门槛(${getThresholdUnit()})`}
            rules={[
              { required: true, message: '请输入升级门槛' },
              { type: 'number', min: 0, message: '门槛不能小于0' }
            ]}
          >
            <InputNumber 
              style={{ width: '100%' }} 
              min={0}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              placeholder={`请输入升级所需的${consumptionMetric === 'fuelVolume' ? '消费升数' : '消费金额'}`}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 权益配置弹窗 */}
      <Modal
        title="配置会员权益"
        open={privilegeModalVisible}
        onOk={handlePrivilegeSave}
        onCancel={() => setPrivilegeModalVisible(false)}
        width={800}
        destroyOnClose
      >
        <Form form={privilegeForm} layout="vertical">
          <Card title="优惠券配置" style={{ marginBottom: 16 }}>
            <Form.List name="coupons">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row key={key} gutter={16} style={{ marginBottom: 16 }}>
                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, 'couponId']}
                          label="优惠券类型"
                          rules={[{ required: true, message: '请选择优惠券' }]}
                        >
                          <Select placeholder="请选择优惠券">
                            {couponOptions.map(coupon => (
                              <Option key={coupon.id} value={coupon.id}>
                                {coupon.name} ({coupon.id})
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'quantity']}
                          label="发放数量"
                          rules={[{ required: true, message: '请输入数量' }]}
                        >
                          <InputNumber
                            min={1}
                            max={99}
                            placeholder="数量"
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item label=" ">
                          <Button
                            type="link"
                            danger
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(name)}
                          >
                            删除
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    添加优惠券
                  </Button>
                </>
              )}
            </Form.List>
          </Card>
          
          <Card title="价格优惠配置" style={{ marginBottom: 16 }}>
            <Form.Item
              name="priceRule"
              label="价格优惠规则"
              tooltip="该等级会员享受的价格优惠规则（单选）"
            >
              <Select
                placeholder="请选择价格优惠规则"
                style={{ width: '100%' }}
                allowClear
              >
                {priceRuleOptions.map(rule => (
                  <Option key={rule.id} value={rule.id}>
                    {rule.name} ({rule.id})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Card>
          
          <Form.Item
            name="points"
            label="赠送积分"
            tooltip="达到该等级时一次性赠送的积分数量"
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              max={99999}
              placeholder="请输入要赠送的积分数量"
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LevelConfigTable;