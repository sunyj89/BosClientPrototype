## 高德接口
https://lbs.amap.com/api/javascript-api/reference/core


## 高德地图MCP
    "amap-maps-streamableHTTP": {
      "url": "https://mcp.amap.com/mcp?key=150cd2af30d85dcfe15abdc58b057dd9"
    }





## 热力图示例代码

```html
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no, width=device-width">
    <title>热力图</title>
    <link rel="stylesheet" href="https://a.amap.com/jsapi_demos/static/demo-center/css/demo-center.css"/>
    <style>
        html,
        body,
        #container {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
        }
    </style>
</head>
<body>
<div id="container"></div>
<div class="input-card" style="width: auto;">
    <div class="input-item">
        <button class="btn" onclick="heatmap.show()">显示热力图</button>
    </div>
    <div class="input-item">
        <button class="btn" onclick="heatmap.hide()">关闭热力图</button>
    </div>
</div>
<script src="//webapi.amap.com/maps?v=1.4.15&key=您申请的key值"></script>
<script src="//a.amap.com/jsapi_demos/static/resource/heatmapData.js"></script>
<script>
    var map = new AMap.Map("container", {
        resizeEnable: true,
        center: [116.418261, 39.921984],
        zoom: 11
    });

    if (!isSupportCanvas()) {
        alert('热力图仅对支持canvas的浏览器适用,您所使用的浏览器不能使用热力图功能,请换个浏览器试试~')
    }

    //详细的参数,可以查看heatmap.js的文档 http://www.patrick-wied.at/static/heatmapjs/docs.html
    //参数说明如下:
    /* visible 热力图是否显示,默认为true
     * opacity 热力图的透明度,分别对应heatmap.js的minOpacity和maxOpacity
     * radius 势力图的每个点的半径大小
     * gradient  {JSON} 热力图的渐变区间 . gradient如下所示
     *	{
     .2:'rgb(0, 255, 255)',
     .5:'rgb(0, 110, 255)',
     .8:'rgb(100, 0, 255)'
     }
     其中 key 表示插值的位置, 0-1
     value 为颜色值
     */
    var heatmap;
    map.plugin(["AMap.Heatmap"], function () {
        //初始化heatmap对象
        heatmap = new AMap.Heatmap(map, {
            radius: 25, //给定半径
            opacity: [0, 0.8]
            /*,
            gradient:{
                0.5: 'blue',
                0.65: 'rgb(117,211,248)',
                0.7: 'rgb(0, 255, 0)',
                0.9: '#ffea00',
                1.0: 'red'
            }
             */
        });
        //设置数据集：该数据为北京部分“公园”数据
        heatmap.setDataSet({
            data: heatmapData,
            max: 100
        });
    });

    //判断浏览区是否支持canvas
    function isSupportCanvas() {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    }
</script>
</body>
</html>
```

## 热力图接口文档

| 构造函数                                       | 说明                                                         |
| :--------------------------------------------- | :----------------------------------------------------------- |
| `AMap.Heatmap( map:Map , opts:HeatmapOptions)` | 构造一个热力图插件对象，map为要叠加热力图的地图对象，opts属性参考HeatmapOptions列表中的说明。 |

| HeatmapOptions | 类型     | 说明                                                         |
| :------------- | :------- | :----------------------------------------------------------- |
| `radius`       | `Number` | 热力图中单个点的半径，默认：30，单位：pixel                  |
| `gradient`     | `Object` | 热力图的渐变区间，热力图按照设置的颜色及间隔显示热力图，例： { 0.4:'rgb(0, 255, 255)', 0.65:'rgb(0, 110, 255)', 0.85:'rgb(100, 0, 255)', 1.0:'rgb(100, 0, 255)' } 其中 key 表示间隔位置，取值范围： [0,1]，value 为颜色值。默认：heatmap.js标准配色方案 |
| `opacity`      | `Array`  | 热力图透明度数组，取值范围[0,1]，0表示完全透明，1表示不透明，默认：[0,1] |
| `zooms`        | `Array`  | 支持的缩放级别范围，取值范围[3-18]，默认：[3,18]             |

| 方法                                           | 返回值   | 说明                                                         |
| :--------------------------------------------- | :------- | :----------------------------------------------------------- |
| `setMap(map:Map)`                              | ``       | 设置热力图要叠加的地图对象，也可以在Map中的layers属性中设置为默认显示的图层 |
| `setOptions(opts:HeatmapOptions)`              | ``       | 设置热力图属性，参考[HeatmapOptions](https://lbs.amap.com/api/javascript-api/reference/layer#m_HeatmapOptions)列表中的说明 |
| `addDataPoint(lng:Lng, lat:Lat, count:Number)` | ``       | 向热力图数据集中添加坐标点，count不填写时默认：1             |
| `setDataSet(dataset:Object)`                   | ``       | 设置热力图展现的数据集，dataset数据集格式为： {  max: Number 权重的最大值,  data: Array 坐标数据集 }， 其中max不填则取数据集count最大值 例： {  max: 100,  data: [{lng: 116.405285, lat: 39.904989, count: 65},{}, …]  } 也可以通过url来加载数据，格式为 {  data：jsonp格式数据的服务地址URL,  dataParser: 数据格式转换function //当jsonp返回结果和官方结构不一致的时候，用户可以传递一个函数用来进行数据格式转换； } 例： {  data:'http://abc.com/jsonp.js',  dataParser:function(data){   return doSomthing(data);//返回的对象结果应该与上面例子的data字段结构相同  } } |
| `hide( )`                                      | ``       | 隐藏热力图                                                   |
| `show( )`                                      | ``       | 显示热力图                                                   |
| `getMap( )`                                    | `Map`    | 获取热力图叠加地图对象                                       |
| `getOptions( )`                                | `Object` | 获取热力图的属性信息                                         |
| `getDataSet( )`                                | `Object` | 输出热力图的数据集，数据结构同setDataSet中的数据集           |
