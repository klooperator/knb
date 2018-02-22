import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { ChartCanvas, Chart } from 'react-stockcharts';
import { CandlestickSeries, LineSeries } from 'react-stockcharts/lib/series';
import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale';
import { sma } from 'react-stockcharts/lib/indicator';
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

const Charter = (props) => {
  const { data: initData } = props;

  if (!initData) return <div />;
  const _data = formatData(initData);
  const sma20 = sma()
    .options({ windowSize: 2, sourcePath: 'close' })
    // eslint-disable-next-line no-param-reassign
    .merge((d, c) => {
      d.sma20 = c;
    })
    .stroke('#4682B4')
    .fill('#4682B4')
    .accessor(d => d.sma20);

  const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(d => d.date);
  const {
    data, xScale, xAccessor, displayXAccessor,
  } = xScaleProvider(_data);
  const xExtents = [xAccessor(last(data)), 0];
  sma20(data);
  return (
    <ChartCanvas
      height={500}
      margin={{
        left: 70,
        right: 70,
        top: 10,
        bottom: 30,
      }}
      type="hybrid"
      width={500}
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
      <CrossHairCursor />
    </ChartCanvas>
  );
};
Charter.defaultProps = {
  data: undefined,
};
Charter.propTypes = {
  data: PropTypes.object,
};
export default Charter;
