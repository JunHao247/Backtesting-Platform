import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { Line } from 'react-chartjs-2';
import { createChart, CrosshairMode } from 'lightweight-charts';


import {
 Chart as ChartJS,
 CategoryScale,
 LinearScale,
 PointElement,
 LineElement,
 Title,
 Tooltip,
 Legend,
} from 'chart.js';


ChartJS.register(
 CategoryScale,
 LinearScale,
 PointElement,
 LineElement,
 Title,
 Tooltip,
 Legend
);


const CandlestickChart = ({ data, showShortMavg, showLongMavg, showBuySell }) => {
 const chartContainerRef = useRef();
 const chartRef = useRef();


 useEffect(() => {
   const chart = createChart(chartContainerRef.current, {
     width: chartContainerRef.current.clientWidth,
     height: chartContainerRef.current.clientHeight,
     layout: {
       backgroundColor: '#1e1e1e',
       textColor: '#d1d4dc',
     },
     grid: {
       vertLines: {
         color: '#2a2a2a',
       },
       horzLines: {
         color: '#2a2a2a',
       },
     },
     crosshair: {
       mode: CrosshairMode.Normal,
     },
   });


   chartRef.current = chart;


   const candlestickSeries = chart.addCandlestickSeries({
     upColor: '#4CAF50',
     downColor: '#FF5252',
     borderDownColor: '#FF5252',
     borderUpColor: '#4CAF50',
     wickDownColor: '#FF5252',
     wickUpColor: '#4CAF50',
   });


   const chartData = data.map(item => ({
     time: new Date(item.timestamp).getTime() / 1000,
     open: item.open,
     high: item.high,
     low: item.low,
     close: item.close,
   }));


   candlestickSeries.setData(chartData);


   if (showShortMavg && data.some(item => 'short_mavg' in item)) {
     const smaSeries = chart.addLineSeries({ color: '#FF1493' });
     const smaData = data.map(item => ({
       time: new Date(item.timestamp).getTime() / 1000,
       value: item.short_mavg,
     }));
     smaSeries.setData(smaData);
   }


   if (showLongMavg && data.some(item => 'long_mavg' in item)) {
     const lmaSeries = chart.addLineSeries({ color: '#1E90FF' });
     const lmaData = data.map(item => ({
       time: new Date(item.timestamp).getTime() / 1000,
       value: item.long_mavg,
     }));
     lmaSeries.setData(lmaData);
   }


   if (showBuySell) {
     const markers = data
       .filter(item => item.positions === 1 || item.positions === -1)
       .map(item => ({
         time: new Date(item.timestamp).getTime() / 1000,
         position: item.positions === 1 ? 'aboveBar' : 'belowBar',
         color: item.positions === 1 ? '#00FF00' : '#FF0000',
         shape: item.positions === 1 ? 'arrowUp' : 'arrowDown',
         text: item.positions === 1 ? 'BUY' : 'SELL',
       }));


     candlestickSeries.setMarkers(markers);
   }


   const resizeObserver = new ResizeObserver(() => {
     chart.applyOptions({
       width: chartContainerRef.current.clientWidth,
       height: chartContainerRef.current.clientHeight
     });
   });


   resizeObserver.observe(chartContainerRef.current);


   return () => {
     resizeObserver.disconnect();
     chart.remove();
   };
 }, [data, showShortMavg, showLongMavg, showBuySell]);


 return <div ref={chartContainerRef} className="chart-wrapper" />;
};


const ResultsDisplay = ({ results }) => {
 const [showShortMavg, setShowShortMavg] = useState(true);
 const [showLongMavg, setShowLongMavg] = useState(true);
 const [showBuySell, setShowBuySell] = useState(true);


 const hasShortMavg = results.some(result => 'short_mavg' in result);
 const hasLongMavg = results.some(result => 'long_mavg' in result);


 const formatDate = (timestamp) => moment(timestamp).format('MMM DD, YYYY');


 const portfolioChartData = results ? {
   labels: results.map(result => formatDate(result.timestamp)),
   datasets: [
     {
       label: 'Portfolio Value',
       data: results.map(result => result.portfolio_value),
       borderColor: '#9370DB', // Medium purple
       backgroundColor: 'rgba(147, 112, 219, 0.2)',
       borderWidth: 2,
       fill: false,
       pointRadius: 2,
     },
   ],
 } : null;


 if (!results || results.length === 0) {
   return null;
 }


 return (
   <div className="results-section">
     <div className="chart-container">
       <h2>Buy/Sell Signal Graph</h2>
       <div className="chart-options" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
         {hasShortMavg && (
           <label>
             <input type="checkbox" checked={showShortMavg} onChange={() => setShowShortMavg(!showShortMavg)} />
             Show Short Moving Average
           </label>
         )}
         {hasLongMavg && (
           <label>
             <input type="checkbox" checked={showLongMavg} onChange={() => setShowLongMavg(!showLongMavg)} />
             Show Long Moving Average
           </label>
         )}
         <label>
           <input type="checkbox" checked={showBuySell} onChange={() => setShowBuySell(!showBuySell)} />
           Show Buy/Sell Signals
         </label>
       </div>
       <CandlestickChart data={results} showShortMavg={showShortMavg} showLongMavg={showLongMavg} showBuySell={showBuySell} />
     </div>
     <div className="chart-container">
       <h2>Portfolio Graph</h2>
       <Line data={portfolioChartData} />
     </div>
     <div className="table-container">
       <table>
         <thead>
           <tr>
             <th>Timestamp</th>
             <th>Open</th>
             <th>High</th>
             <th>Low</th>
             <th>Close</th>
             <th>Volume</th>
             {results.some(result => 'short_mavg' in result) && <th>Short MAvg</th>}
             {results.some(result => 'long_mavg' in result) && <th>Long MAvg</th>}
             <th>Signal</th>
             <th>Positions</th>
             <th>Portfolio Value</th>
           </tr>
         </thead>
         <tbody>
           {results.map((result, index) => (
             <tr key={index}>
               <td>{formatDate(result.timestamp)}</td>
               <td>{Math.round(result.open)}</td>
               <td>{Math.round(result.high)}</td>
               <td>{Math.round(result.low)}</td>
               <td>{Math.round(result.close)}</td>
               <td>{Math.round(result.volume)}</td>
               {result.short_mavg && <td>{Math.round(result.short_mavg)}</td>}
               {result.long_mavg && <td>{Math.round(result.long_mavg)}</td>}
               <td>{result.signal}</td>
               <td>{result.positions}</td>
               <td>{Math.round(result.portfolio_value)}</td>
             </tr>
           ))}
         </tbody>
       </table>
     </div>
   </div>
 );
};


export default ResultsDisplay;