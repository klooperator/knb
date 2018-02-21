import React, { Component } from 'react';
import moment from 'moment';
import { ChartCanvas, Chart } from 'react-stockcharts';
import { BarSeries, CandlestickSeries, LineSeries } from 'react-stockcharts/lib/series';
import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale';
import { ema, wma, sma, tma } from 'react-stockcharts/lib/indicator';
import { fitWidth } from 'react-stockcharts/lib/helper';
import { last } from 'react-stockcharts/lib/utils';
import { CrossHairCursor } from 'react-stockcharts/lib/coordinates';

const formatData = (data) => {
  const out = [];
  data.forEach((e) => {
    const t = {};
    t.date = moment.unix(e.time).toDate();
    t.open = e.open;
    t.close = e.close;
    t.high = e.high;
    t.low = e.low;
    t.volume = e.volumeto - e.volumefrom;
    out.push(t);
  });
  return out;
};
const parseTime = (data) => {
  const out = [];
  out.push(moment.unix(data[0].time).toDate());
  out.push(moment.unix(data[data.length - 1].time).toDate());
  return out;
};
/* eslint-disable react/prefer-stateless-function */
class Charter extends Component {
  render() {
    console.log(this);
    const { data: initData } = this.props;

    if (!initData) return <div />;
    const xTime = parseTime(initData);
    const _data = formatData(initData);
    const sma20 = sma()
      .options({ windowSize: 20, sourcePath: 'close' })
      .merge((d, c) => {
        d.sma20 = c;
      })
      .stroke('#4682B4')
      .fill('#4682B4')
      .accessor(d => d.sma20);
    const smaVolume50 = sma()
      .options({ windowSize: initData.length, sourcePath: 'close' })
      .merge((d, c) => {
        d.smaVolume50 = c;
      })
      .accessor(d => d.smaVolume50)
      .stroke('#4682B4')
      .fill('#4682B4');
    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(d => d.date);
    const {
      data, xScale, xAccessor, displayXAccessor,
    } = xScaleProvider(_data);
    const xExtents = [xAccessor(last(data)), 1];
    console.log(xExtents);
    console.log(xAccessor);
    console.log(data);
    console.log(sma20(data));
    console.log(sma20);
    return (
      <ChartCanvas
        height={800}
        margin={{
          left: 70,
          right: 70,
          top: 10,
          bottom: 30,
        }}
        type="hybrid"
        width={700}
        ratio={1}
        seriesName="pppp"
        data={data}
        xAccessor={xAccessor}
        xScale={xScale}
        xExtents={xExtents}
        displayXAccessor={displayXAccessor}
      >
        <Chart
          id={1}
          yExtents={[d => [d.high, d.low], sma20.accessor()]}
          padding={{ top: 10, bottom: 20 }}
        >
          <LineSeries yAccessor={sma20.accessor()} stroke={sma20.stroke()} />
          <CandlestickSeries />
        </Chart>
        <Chart
          id={2}
          yExtents={[d => d.volume, smaVolume50.accessor()]}
          height={150}
          origin={(w, h) => [0, h - 150]}
        >
          <BarSeries yAccessor={d => d.volume} fill={d => (d.close > d.open ? '#6BA583' : 'red')} />
        </Chart>
        <CrossHairCursor />
      </ChartCanvas>
    );
  }
}

export default Charter;
