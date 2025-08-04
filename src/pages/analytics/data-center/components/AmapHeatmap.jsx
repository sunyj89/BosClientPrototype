import React, { useEffect, useRef, useState } from 'react';
import { Button, message, Popover } from 'antd';
import { HeatMapOutlined, GlobalOutlined } from '@ant-design/icons';

const AmapHeatmap = ({ heatmapData, height = 400 }) => {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const heatmapInstance = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    // 检查是否在演示模式
    if (showDemo) {
      return;
    }

    // 初始化地图
    const initMap = () => {
      console.log('开始初始化地图，当前AMap状态:', !!window.AMap);
      // 检查AMap是否已加载
      if (window.AMap) {
        try {
          console.log('创建地图实例，容器:', mapContainer.current);
          // 创建地图实例
          mapInstance.current = new window.AMap.Map(mapContainer.current, {
            zoom: 7, // 适合江西省的缩放级别
            center: [115.816587, 28.637234], // 江西省中心坐标
            mapStyle: 'amap://styles/light',
            viewMode: '2D',
            resizeEnable: true
          });

          console.log('地图实例创建成功:', mapInstance.current);

          // 地图加载完成事件
          mapInstance.current.on('complete', () => {
            console.log('地图加载完成');
            // 加载热力图插件
            mapInstance.current.plugin(['AMap.Heatmap'], () => {
              console.log('热力图插件加载完成');
              // 准备热力图数据
              const heatData = generateHeatmapData();
              console.log('热力图数据:', heatData.length, '个点位');
              
              // 创建热力图图层 - 按照官方文档格式
              heatmapInstance.current = new window.AMap.Heatmap(mapInstance.current, {
                radius: 35, // 增加半径
                opacity: [0, 0.9], // 增加不透明度
                gradient: {
                  0.4: '#2A85B8',
                  0.6: '#4FC16A',
                  0.8: '#FFEA00',
                  1.0: '#F5222D'
                }
              });

              // 设置热力图数据集
              heatmapInstance.current.setDataSet({
                data: heatData,
                max: Math.max(...heatData.map(item => item.count))
              });

              setMapLoaded(true);
              message.success('服务区热力图加载完成');
            });

            // 添加服务区标记
            addServiceAreaMarkers();
          });

          // 监听地图加载错误
          mapInstance.current.on('error', (error) => {
            console.error('地图加载错误:', error);
            message.error('地图加载失败: ' + error.message);
            setShowDemo(true);
          });

        } catch (error) {
          console.error('地图初始化失败:', error);
          message.error('地图加载失败: ' + error.message);
          setShowDemo(true);
        }
      } else {
        console.log('高德地图API未加载，等待加载...');
        // 等待API加载
        setTimeout(initMap, 100);
      }
    };

    initMap();

    // 清理函数
    return () => {
      if (heatmapInstance.current) {
        heatmapInstance.current.setMap(null);
      }
      if (mapInstance.current) {
        mapInstance.current.destroy();
      }
    };
  }, [showDemo]);

  // 生成热力图数据（基于高速公路服务区）
  const generateHeatmapData = () => {
    const serviceAreaHeatData = [
      // 南昌市
      { lng: 115.892151, lat: 28.676493, count: 120, name: '南昌北服务区', gasoline: 8500, diesel: 6500 },
      { lng: 115.908, lat: 28.58, count: 95, name: '南昌南服务区', gasoline: 7200, diesel: 5800 },
      { lng: 116.23, lat: 28.68, count: 80, name: '进贤服务区', gasoline: 6100, diesel: 4900 },
      
      // 赣州市
      { lng: 114.940278, lat: 25.831829, count: 110, name: '南康服务区', gasoline: 8200, diesel: 7100 },
      { lng: 115.78, lat: 25.66, count: 85, name: '龙南服务区', gasoline: 6800, diesel: 5500 },
      { lng: 115.42, lat: 25.99, count: 70, name: '大余服务区', gasoline: 5800, diesel: 4700 },

      // 上饶市
      { lng: 117.943433, lat: 28.441189, count: 100, name: '上饶服务区', gasoline: 7800, diesel: 6200 },
      { lng: 118.25, lat: 28.75, count: 90, name: '三清山服务区', gasoline: 7500, diesel: 6000 },
      { lng: 117.57, lat: 28.29, count: 75, name: '弋阳服务区', gasoline: 6300, diesel: 5100 },

      // 九江市
      { lng: 116.001033, lat: 29.70477, count: 98, name: '九江服务区', gasoline: 7600, diesel: 6300 },
      { lng: 116.48, lat: 29.53, count: 82, name: '湖口服务区', gasoline: 6500, diesel: 5400 },
      { lng: 116.8, lat: 29.3, count: 68, name: '都昌服务区', gasoline: 5500, diesel: 4500 },

      // 抚州市
      { lng: 116.358054, lat: 27.948979, count: 88, name: '抚州服务区', gasoline: 7000, diesel: 5700 },
      { lng: 116.82, lat: 27.52, count: 72, name: '南城服务区', gasoline: 6000, diesel: 4800 },
      { lng: 115.79, lat: 27.79, count: 65, name: '临川服务区', gasoline: 5400, diesel: 4400 },
    ];
    return serviceAreaHeatData;
  };

  // 添加高速公路服务区标记
  const addServiceAreaMarkers = () => {
    if (!mapInstance.current) return;

    const serviceAreas = generateHeatmapData();

    serviceAreas.forEach(area => {
      const marker = new window.AMap.Marker({
        position: [area.lng, area.lat],
        title: area.name,
        content: `<div class="service-area-marker">${area.name}</div>`,
        offset: new window.AMap.Pixel(-40, -15)
      });
      
      const popoverContent = `
        <div class="popover-content">
          <h4>${area.name}</h4>
          <p>汽油销量: ${area.gasoline} 升</p>
          <p>柴油销量: ${area.diesel} 升</p>
        </div>
      `;

      marker.on('click', () => {
        const infoWindow = new window.AMap.InfoWindow({
          content: popoverContent,
          anchor: 'bottom-center',
          offset: new window.AMap.Pixel(0, -15)
        });
        infoWindow.open(mapInstance.current, [area.lng, area.lat]);
      });
      
      mapInstance.current.add(marker);
    });
  };

  const handleLoadRealMap = () => {
    setShowDemo(false);
    message.success('正在加载真实地图...');
  };

  const handleToggleHeatmap = () => {
    if (heatmapInstance.current) {
      if (mapLoaded) {
        heatmapInstance.current.hide();
        setMapLoaded(false);
        message.info('热力图已隐藏');
      } else {
        heatmapInstance.current.show();
        setMapLoaded(true);
        message.info('热力图已显示');
      }
    }
  };

  // 演示模式界面
  const renderDemoMode = () => (
    <div style={{ 
      height: height,
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '4px',
      color: 'white',
      position: 'relative'
    }}>
      <GlobalOutlined style={{ fontSize: '64px', marginBottom: '24px', opacity: 0.9 }} />
      <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
        江西省高速服务区消费热力图
      </div>
      <div style={{ fontSize: '14px', marginBottom: '24px', textAlign: 'center', lineHeight: '1.6' }}>
        <div>基于高德地图MCP工具和服务区销售数据</div>
        <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.8 }}>
          点击标记可查看当日汽油和柴油销量
        </div>
      </div>
      <Button 
        type="primary" 
        size="large" 
        icon={<HeatMapOutlined />}
        onClick={handleLoadRealMap}
        style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}
      >
        加载地图
      </Button>
    </div>
  );

  return (
    <div style={{ position: 'relative' }}>
      <style>{`
        .service-area-marker {
          background: #32AF50;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          border: 1px solid white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          white-space: nowrap;
        }
        .popover-content h4 {
          margin: 0 0 8px 0;
          color: #333;
        }
        .popover-content p {
          margin: 0;
          color: #666;
          font-size: 12px;
        }
      `}</style>
      {showDemo ? renderDemoMode() : (
        <>
          <div 
            ref={mapContainer} 
            style={{ 
              width: '100%', 
              height: height,
              borderRadius: '4px',
              border: '1px solid #d9d9d9'
            }} 
          />
          
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            display: 'flex',
            gap: '8px'
          }}>
            <Button 
              size="small" 
              onClick={handleToggleHeatmap}
              type={mapLoaded ? 'default' : 'primary'}
            >
              {mapLoaded ? '隐藏热力图' : '显示热力图'}
            </Button>
          </div>
          
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '12px',
            borderRadius: '4px',
            fontSize: '12px',
            border: '1px solid #d9d9d9',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>服务区热力图例</div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
              <div style={{ width: '16px', height: '8px', background: 'linear-gradient(to right, #F5222D, #FFEA00)', marginRight: '8px', borderRadius: '2px' }}></div>
              <span>高热度区域</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
              <div style={{ width: '16px', height: '8px', background: 'linear-gradient(to right, #FFEA00, #4FC16A)', marginRight: '8px', borderRadius: '2px' }}></div>
              <span>中等热度区域</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '16px', height: '8px', background: 'linear-gradient(to right, #4FC16A, #2A85B8)', marginRight: '8px', borderRadius: '2px' }}></div>
              <span>低热度区域</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AmapHeatmap; 