import React from 'react';
import ReactECharts from 'echarts-for-react';

const RoomOccupancyChart = ({ data }) => {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: data?.labels || [],
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          color: '#a1a1aa'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          color: '#a1a1aa'
        },
        splitLine: {
            lineStyle: {
                color: '#3f3f46'
            }
        }
      }
    ],
    series: [
      {
        name: 'Occupied',
        type: 'bar',
        barWidth: '60%',
        data: data?.values || [],
        itemStyle: {
          color: '#3b82f6'
        }
      }
    ],
    backgroundColor: 'transparent'
  };

  return <ReactECharts option={option} style={{ height: '300px' }} notMerge={true} lazyUpdate={true} />;
};

export default RoomOccupancyChart;
