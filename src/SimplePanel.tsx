import React, { useRef, useState, useEffect } from 'react';
import { PanelProps, GrafanaTheme } from '@grafana/data';
import { withTheme } from '@grafana/ui';
import { debounce } from 'lodash';
import echarts from 'echarts';
import { css, cx } from 'emotion';
import { SimpleOptions, funcParams } from 'types'; //Import the function from types

// just comment it if don't need it
import 'echarts-wordcloud';
import 'echarts-liquidfill';
import 'echarts-gl';

// auto register map
const maps = (require as any).context('./map', false, /\.json/);
maps.keys().map((m: string) => {
  const matched = m.match(/\.\/([0-9a-zA-Z_]*)\.json/);
  if (matched) {
    echarts.registerMap(matched[1], maps(m));
  } else {
    console.warn(
      "Can't register map: JSON file Should be named according to the following rules: /([0-9a-zA-Z_]*).json/."
    );
  }
});

const getStyles = () => ({
  tips: css`
    padding: 0 10%;
    height: 100%;
    background: rgba(128, 128, 128, 0.1);
    overflow: auto;
  `,
  tipsTitle: css`
    margin: 48px 0 32px;
    text-align: center;
  `,
  wrapper: css`
    position: relative;
  `,
});

interface Props extends PanelProps<SimpleOptions> {
  theme: GrafanaTheme;
}

const PartialSimplePanel: React.FC<Props> = ({ options, data, width, height, theme }) => {
  const styles = getStyles();
  const echartRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<echarts.ECharts>();
  const [tips, setTips] = useState<Error | undefined>();

  const getOption = (data: any, theme: any, echartsInstance: any, echarts: any) => {
    const series = data.series.map((s: any) => {
      console.log('s:', s);
      const sData = s.fields.find((f: any) => f.type === 'number' && f.values).values.buffer;
      const sTime = s.fields.find((f: any) => f.type === 'time' && f.values).values.buffer;

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
        data: sData.map((d: any, i: any) => [sTime[i], d]),
      };
    });

    console.log('series:', series);
    console.log(
      'Datos:',
      series.map((item: any) => item.name)
    );

    let schema = series.map((s: any, index: any) => {
      return {
        name: s.name,
        index: index,
        text: s.name,
      };
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
        opacity: 0.5,
      },
    };

    return {
      backgroundColor: '#000',
      legend: {
        bottom: 0,
        data: series.map((item: any) => item.name),
        itemGap: 7,
        textStyle: {
          color: '#fff',
          fontSize: options.fontSize ? options.fontSize : 10,
        },
      },
      tooltip: { 
        padding: 10,
        backgroundColor: '#222',
        borderColor: '#777',
        borderWidth: 1,
        formatter: function(obj: any) {
          var value = obj[0].value;
          return (
            '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">' +
            obj[0].seriesName +
            ' ' +
            value[0] +
            'date：' +
            value[3] +
            '</div>' +
            schema[1].text +
            '：' +
            value[1] +
            '<br>' +
            schema[2].text +
            '：' +
            value[2] +
            '<br>' +
            schema[3].text +
            '：' +
            value[3] +
            '<br>'
          );
        },
      },
      // dataZoom: {
      //     show: true,
      //     orient: 'vertical',
      //     parallelAxisIndex: [0]
      // },

      parallelAxis: schema.map((element: any, index: any) => {
        return {
          dim: index,
          name: element.text,
        };
      }),
      // parallelAxis: [
      //     {dim: 0, name: schema[0].text, inverse: true, max: 31, nameLocation: 'start'},
      //     {dim: 1, name: schema[1].text},
      //     {dim: 2, name: schema[2].text},
      //     {dim: 3, name: schema[3].text}
      // ],
      visualMap: {
        show: true,
        right: 0,
        min: 0,
        height: 20,
        max: options.max ? options.max : 1000,
        dimension: 2,
        inRange: {
          color: ['#d94e5d', '#eac736', '#50a3ba'].reverse(),
          // colorAlpha: [0, 1]
        },
      },
      parallel: {
        left: '10%',
        right: '18%',
        bottom: 135,
        top: 35,
        parallelAxisDefault: {
          type: 'value',
          name: 'AQI指数',
          nameLocation: 'end',
          nameGap: 20,
          nameTextStyle: {
            color: '#fff',
            fontSize: 12,
          },
          axisLine: {
            lineStyle: {
              color: '#aaa',
            },
          },
          axisTick: {
            lineStyle: {
              color: '#777',
            },
          },
          splitLine: {
            show: false,      
          },
          axisLabel: {
            color: '#fff',
          },
        },
      },
      series: series,
    };
  };

  const resetOption = debounce(
    () => {
      if (!chart) {
        return;
      }
      if (data.state && data.state !== 'Done') {
        return;
      }
      try {
        setTips(undefined);
        chart.clear();
        // let getOption = new Function(funcParams, options.getOption);
        const o = getOption(data, theme, chart, echarts);
        o && chart.setOption(o);
      } catch (err) {
        console.error('Editor content error!', err);
        setTips(err);
      }
    },
    150,
    { leading: true }
  );

  useEffect(() => {
    if (echartRef.current) {
      chart?.clear();
      chart?.dispose();
      setChart(echarts.init(echartRef.current, options.followTheme ? theme.type : undefined));
    }

    return () => {
      chart?.clear();
      chart?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [echartRef.current, options.followTheme]);

  useEffect(() => {
    chart?.resize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);

  useEffect(() => {
    chart && resetOption();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart, options.getOption, data, options.max, options.fontSize]);

  // Insert logo
  //Create the element
  let image = new Image(80);
  // Import the image
  image.src = 'https://www.softtek.com/images/content/design2015/LogoCompleto-Website-20.png';
  // To fix the logo position in the panel
  image.style.opacity = '0.7';
  image.style.width = '7%';
  image.style.position = 'absolute';
  image.style.display = 'block';
  image.style.left = '1%';
  image.style.bottom = '2%';

  // Logo cinepolis.
  image.id = 'logo';
  image.onmouseover = () => {
    image.src = 'https://static.cinepolis.com/img/lg-cinepolis-new.png';
    image.style.opacity = '0.7';
    image.style.width = '7%';
    image.style.position = 'absolute';
    image.style.display = 'block';
    image.style.left = '1%';
    image.style.bottom = '2%';
  };
  image.onmouseleave = () => {
    image.src = 'https://www.softtek.com/images/content/design2015/LogoCompleto-Website-20.png';
    image.style.opacity = '0.7';
    image.style.width = '7%';
    image.style.position = 'absolute';
    image.style.display = 'block';
    image.style.left = '1%';
    image.style.bottom = '2%';
  };
  // Here we create the logo in the panel
  const panelContents = document.getElementsByClassName('panel-content');
  for (let i = 0; i < panelContents.length; i++) {
    if (document.getElementById('logo')) {
      document.getElementById('logo').parentElement.removeChild(document.getElementById('logo'));
    }
    // Here I change the background color and add the logo.
    panelContents.item(i).style.backgroundColor = '#000';
    panelContents.item(i).appendChild(image);
  }
  return (
    <>
      {tips && (
        <div className={styles.tips}>
          <h5 className={styles.tipsTitle}>Editor content error!</h5>
          {(tips.stack || tips.message).split('\n').map(s => (
            <p>{s}</p>
          ))}
        </div>
      )}
      <div
        ref={echartRef}
        className={cx(
          styles.wrapper,
          css`
            width: ${width}px;
            height: ${height}px;
          `
        )}
      />
    </>
  );
};

export const SimplePanel = withTheme(PartialSimplePanel);
