export const funcParams = 'data, theme, echartsInstance, echarts';

const funcBody = `
const series = data.series.map((s) => {
    console.log('s:',s);
    const sData = s.fields.find((f) => f.type === 'number' && f.values).values.buffer;
    const sTime = s.fields.find((f) => f.type === 'time' && f.values).values.buffer;
    
     return {
    name: s.name,
    type: 'parallel', 
    showSymbol: false,
    areaStyle: {
    opacity: 0.1,
    },
    lineStyle: {
    width: 1,
    },
    data: sData.map((d, i) => [sTime[i], d]), 
    };
    });


console.log('series:',series);
console.log('Datos:', series.map(item => item.name));

var dataBJ = [
  [1,55,9,"uno"],
  [2,25,1,"dos"],
  [3,56,7,"tres"],
  [4,33,7,"cuatro"],
  [5,42,24,"cinco"],
  [6,82,58,"seis"],
  [7,74,49,"siete"],
  [8,78,55,"ocho"],
  [9,267,216,"nueve"],
  [10,185,12,"diez"],
  [11,39,19,"once"],
  [12,41,11,"doce"],
  [13,64,38,"trece"],
  [14,108,79,"catorce"],
  [15,108,63,"quince"],
  [16,33,6,"uno"],
  [17,94,66,"dos"],
  [18,186,142,"tres"],
  [19,57,31,"cuatro"],
  [20,22,8,"cinco"],
  [21,39,15,"seis"],
  [22,94,69,"siete"],
  [23,99,73,"ocho"],
  [24,31,12,"nueve"],
  [25,42,27,"diez"],
  [26,154,117,"once"],
  [27,234,185,"doce"],
  [28,160,120,"trece"],
  [29,134,96,"catorce"],
  [30,52,24,"quince"],
  [31,46,5,"uno"]
];

var dataGZ = [
  [1,26,37,27,"uno"],
  [2,85,62,71,"dos"],
  [3,78,38,74,"tres"],
  [4,21,21,36,"cuatro"],
  [5,41,42,46,"cinco"],
  [6,56,52,69,"seis"],
  [7,64,30,28,"siete"],
  [8,55,48,74,"ocho"],
  [9,76,85,113,"nueve"],
  [10,91,81,104,"diez"],
  [11,84,39,60,"once"],
  [12,64,51,101,"doce"],
  [13,70,69,120,"trece"],
  [14,77,105,178,"catorce"],
  [15,109,68,87,"quince"],
  [16,73,68,97,"uno"],
  [17,54,27,47,"dos"],
  [18,51,61,97,"tres"],
  [19,91,71,121,"cuatro"],
  [20,73,102,182,"cinco"],
  [21,73,50,76,"seis"],
  [22,84,94,140,"siete"],
  [23,93,77,104,"ocho"],
  [24,99,130,227,"nueve"],
  [25,146,84,139,"diez"],
  [26,113,108,137,"once"],
  [27,81,48,62,"doce"],
  [28,56,48,68,"trece"],
  [29,82,92,174,"catorce"],
  [30,106,116,188,"quince"],
  [31,118,50,0,"uno"]
];

var dataSH = [
  [1,91,45,125,"uno"],
  [2,65,27,78,"dos"],
  [3,83,60,84,"tres"],
  [4,109,81,121,"cuatro"],
  [5,106,77,114,"cinco"],
  [6,109,81,121,"seis"],
  [7,106,77,114,"siete"],
  [8,89,65,78,"ocho"],
  [9,53,33,47,"nueve"],
  [10,80,55,80,"diez"],
  [11,117,81,124,"once"],
  [12,99,71,142,"doce"],
  [13,95,69,130,"trece"],
  [14,116,87,131,"catorce"],
  [15,108,80,121,"quince"],
  [16,134,83,167,"uno"],
  [17,79,43,107,"dos"],
  [18,71,46,89,"tres"],
  [19,97,71,113,"cuatro"],
  [20,84,57,91,"cinco"],
  [21,87,63,101,"seis"],
  [22,104,77,119,"siete"],
  [23,87,62,100,"ocho"],
  [24,168,128,172,"nueve"],
  [25,65,45,51,"diez"],
  [26,39,24,38,"once"],
  [27,39,24,39,"doce"],
  [28,93,68,96,"trece"],
  [29,188,143,197,"catorce"],
  [30,174,131,174,"quince"],
  [31,187,143,201,"uno"]
]; 
 
 let schema = series.map((s,index) => {
    return { 
        name: s.name, 
        index: index, 
        text: s.name
    }
 });
 console.log('Esquema:', schema);

//var schema = [
  //  {name: 'date', index: 0, text: '日期'},
  //  {name: 'AQIindex', index: 1, text: 'AQI'},
  //  {name: 'PM25', index: 2, text: 'PM2.5'},
  //  {name: 'PM10', index: 3, text: 'PM10'}
//];

var lineStyle = {
  normal: {
      width: 1,
      opacity: 0.5
  }
};

return {
  backgroundColor: '#000',
  legend: {
      bottom: 30,
      data: series.map(item => item.name),
      itemGap: 20,
      textStyle: {
          color: '#fff',
          fontSize: 14
      }
  },
  tooltip: {
      padding: 10,
      backgroundColor: '#222',
      borderColor: '#777',
      borderWidth: 1,
      formatter: function (obj) {
          var value = obj[0].value;
          return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">'
              + obj[0].seriesName + ' ' + value[0] + 'date：'
              + value[3]
              + '</div>'
              + schema[1].text + '：' + value[1] + '<br>'
              + schema[2].text + '：' + value[2] + '<br>'
              + schema[3].text + '：' + value[3] + '<br>';
      }
  },
  // dataZoom: {
  //     show: true,
  //     orient: 'vertical',
  //     parallelAxisIndex: [0]
  // },

  parallelAxis: schema.map((element,index) => {
        return {
            dim: index,
            name: element.text
      }
   }),
 // parallelAxis: [
 //     {dim: 0, name: schema[0].text, inverse: true, max: 31, nameLocation: 'start'},
 //     {dim: 1, name: schema[1].text},
 //     {dim: 2, name: schema[2].text},
 //     {dim: 3, name: schema[3].text}
 // ],
  visualMap: {
      show: true,
      right: 10,
      min: 0,
      max: 100000,
      dimension: 2,
      inRange: {
          color: ['#d94e5d','#eac736','#50a3ba'].reverse(),
          // colorAlpha: [0, 1]
      }
  },
  parallel: {
      left: '5%',
      right: '18%',
      bottom: 100,
      parallelAxisDefault: {
          type: 'value',
          name: 'AQI指数',
          nameLocation: 'end',
          nameGap: 20,
          nameTextStyle: {
              color: '#fff',
              fontSize: 12
          },
          axisLine: {
              lineStyle: {
                  color: '#aaa'
              }
          },
          axisTick: {
              lineStyle: {
                  color: '#777'
              }
          },
          splitLine: {
              show: false
          },
          axisLabel: {
              color: '#fff'
          },
      }
},
series: series,
};
`;

// const getOption = `function (${funcParams}) {
//   ${funcBody}
// }`
// const funcBodyReg = /{\n([\S\s]*)\n}/;
// const matchResult = getOption.match(funcBodyReg);
// const funcBody = matchResult ? matchResult[1] : '';

export interface SimpleOptions {
  followTheme: boolean;
  getOption: string;
}

export const defaults: SimpleOptions = {
  followTheme: false,
  getOption: funcBody,
};
