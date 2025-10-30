import React from 'react';
import ReactECharts from 'echarts-for-react';

const FeeStatusChart = ({ data }) => {
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center',
      textStyle: {
        color: '#a1a1aa'
      }
    },
    series: [
      {
        name: 'Fee Status',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '20',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: data?.paid || 0, name: 'Paid', itemStyle: { color: '#22c55e' } },
          { value: data?.pending || 0, name: 'Pending', itemStyle: { color: '#f97316' } },
        ]
      }
    ],
    backgroundColor: 'transparent'
  };

  return <ReactECharts option={option} style={{ height: '300px' }} notMerge={true} lazyUpdate={true} />;
};

export default FeeStatusChart;
