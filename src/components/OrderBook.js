import React, { useState, useEffect } from 'react';
import './css/OrderBook.css';
import moment from 'moment';
import axios from 'axios';
import { select, arc, scaleLinear } from 'd3';

const OrderBook = () => {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [orderBook, setOrderBook] = useState([]);
  const [bids, setBids] = useState([]);
  const [asks, setAsks] = useState([]);
  const [liquidity, setLiquidity] = useState({ totalBidVolume: 0, totalAskVolume: 0, spread: 0, avgBidPrice: 0, avgAskPrice: 0, liquidityRatio: 0 });
  const [interval, setInterval] = useState(10); // Time interval in seconds
  const [historicalData, setHistoricalData] = useState([]);
  const [fearGreedIndex, setFearGreedIndex] = useState(50); // Default value for Fear and Greed Index
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistoricalData();
    fetchFearGreedIndex();
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth20`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const newBids = data.bids.map(([price, amount], index) => ({
        price: parseFloat(price),
        amount: parseFloat(amount),
        type: 'Bid',
        timestamp: moment().subtract(index, 'seconds').format('YYYY-MM-DD HH:mm:ss'),
      }));
      const newAsks = data.asks.map(([price, amount], index) => ({
        price: parseFloat(price),
        amount: parseFloat(amount),
        type: 'Ask',
        timestamp: moment().subtract(index, 'seconds').format('YYYY-MM-DD HH:mm:ss'),
      }));

      setBids(newBids);
      setAsks(newAsks);
      setOrderBook([...newBids, ...newAsks]);

      const totalBidVolume = newBids.reduce((acc, bid) => acc + bid.amount, 0);
      const totalAskVolume = newAsks.reduce((acc, ask) => acc + ask.amount, 0);
      const spread = newAsks[0].price - newBids[0].price;
      const avgBidPrice = newBids.reduce((acc, bid) => acc + bid.price * bid.amount, 0) / totalBidVolume;
      const avgAskPrice = newAsks.reduce((acc, ask) => acc + ask.price * ask.amount, 0) / totalAskVolume;
      const liquidityRatio = totalBidVolume / totalAskVolume;

      setLiquidity({ totalBidVolume, totalAskVolume, spread, avgBidPrice, avgAskPrice, liquidityRatio });
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close();
    };
  }, [symbol]);

  const fetchHistoricalData = async () => {
    try {
      const startTime = moment().subtract(1, 'days').startOf('day').unix() * 1000;
      const endTime = moment().subtract(1, 'days').endOf('day').unix() * 1000;

      const response = await axios.get('https://api.binance.com/api/v3/klines', {
        params: {
          symbol,
          interval: '1h',
          startTime,
          endTime,
        },
      });

      const historical = response.data.map((item) => ({
        timestamp: moment(item[0]).format('YYYY-MM-DD HH:mm:ss'),
        open: parseFloat(item[1]),
        high: parseFloat(item[2]),
        low: parseFloat(item[3]),
        close: parseFloat(item[4]),
        volume: parseFloat(item[5]),
      }));

      setHistoricalData(historical);
      setError(null); // Clear any previous error
    } catch (err) {
      setError('Failed to fetch historical data. Please try again.');
      console.error(err);
    }
  };

  const fetchFearGreedIndex = async () => {
    try {
      const response = await axios.get('https://api.alternative.me/fng/?limit=1'); // Assuming this endpoint returns the fear and greed index
      const index = response.data.data[0].value;
      setFearGreedIndex(index);
    } catch (err) {
      console.error('Failed to fetch Fear and Greed Index:', err);
    }
  };

  const handleSymbolChange = (e) => {
    setSymbol(e.target.value);
    setOrderBook([]); // Clear the order book data when symbol changes
    setHistoricalData([]); // Clear the historical data when symbol changes
    fetchHistoricalData(); // Fetch new historical data
    fetchFearGreedIndex(); // Fetch new Fear and Greed index
  };

  const handleIntervalChange = (e) => {
    setInterval(e.target.value);
  };

  const filteredOrderBook = orderBook.filter((order) => {
    const orderTime = moment(order.timestamp);
    return moment().diff(orderTime, 'seconds') <= interval;
  });

  useEffect(() => {
    const width = 400, height = 200, margin = 10; // Further increase the width and height
    const radius = Math.min(width, height) / 2 - margin;
  
    const svg = select('#fear-greed-gauge')
      .attr('width', width)
      .attr('height', height);
  
    svg.selectAll('*').remove(); // Clear previous content
  
    const arcGenerator = arc()
      .innerRadius(0)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);
  
    svg.append('path')
      .attr('d', arcGenerator())
      .attr('fill', 'url(#gradient)')  // Fill the arc with the gradient
      .attr('transform', `translate(${width / 2}, ${height / 1.2})`);
  
    const needleAngle = scaleLinear()
      .domain([0, 100])
      .range([-90, 90]);
  
    svg.append('defs')
      .append('linearGradient')
      .attr('id', 'gradient')
      .selectAll('stop')
      .data([
        { offset: '0%', color: 'red' },
        { offset: '50%', color: 'yellow' },
        { offset: '100%', color: 'green' },
      ])
      .enter()
      .append('stop')
      .attr('offset', d => d.offset)
      .attr('stop-color', d => d.color);
  
    svg.append('line')
      .attr('x1', width / 2)
      .attr('y1', height / 1.2)
      .attr('x2', width / 2)
      .attr('y2', height / 1.2 - radius) // Adjust the length of the needle to fit within the arc
      .attr('stroke', 'black')  
      .attr('stroke-width', 2)
      .attr('transform-origin', `${width / 2} ${height / 1.2}`)
      .attr('transform', `rotate(${needleAngle(fearGreedIndex)})`);
  }, [fearGreedIndex]);
  

  return (
    <div className="order-book">
      <h2>Real-Time Order Book</h2>
      <label>
        Cryptocurrency Ticker:
        <input className="ticker" type="text" value={symbol} onChange={handleSymbolChange} />
      </label>
      {/* <label>
        Time Interval (seconds):
        <input className="interval" type="number" value={interval} onChange={handleIntervalChange} />
      </label> */}
      
      {error && <div className="error">{error}</div>}
      <div className="liquidity-info-and-fear-greed">
        <div className="liquidity-info">
          <h3>Liquidity Information</h3>
          <p>Total Bid Volume: {liquidity.totalBidVolume.toFixed(2)}</p>
          <p>Total Ask Volume: {liquidity.totalAskVolume.toFixed(2)}</p>
          <p>Spread: {liquidity.spread.toFixed(2)}</p>
          <p>Average Bid Price: {liquidity.avgBidPrice.toFixed(2)}</p>
          <p>Average Ask Price: {liquidity.avgAskPrice.toFixed(2)}</p>
          <p>Liquidity Ratio: {liquidity.liquidityRatio.toFixed(2)}</p>
        </div>
        <div className="fear-greed-index">
          <h3>Fear and Greed Index</h3>
          <svg id="fear-greed-gauge"></svg>
          <p>Index: {fearGreedIndex}</p>
        </div>
      </div>
      <div className="order-book-table">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Type</th>
              <th>Amount Bought/Sold</th>
              <th>Price of Cryptocurrency</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrderBook.map((order, index) => (
              <tr key={index}>
                <td>{order.timestamp}</td>
                <td style={{ color: order.type === 'Bid' ? 'green' : 'red' }}>{order.type}</td>
                <td>{order.amount.toFixed(8)}</td>
                <td>{order.price.toFixed(8)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="historical-data">
        <h3>Historical Data (Last 24 Hours)</h3>
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Open</th>
              <th>High</th>
              <th>Low</th>
              <th>Close</th>
              <th>Volume</th>
            </tr>
          </thead>
          <tbody>
            {historicalData.map((data, index) => (
              <tr key={index}>
                <td>{data.timestamp}</td>
                <td>{data.open.toFixed(2)}</td>
                <td>{data.high.toFixed(2)}</td>
                <td>{data.low.toFixed(2)}</td>
                <td>{data.close.toFixed(2)}</td>
                <td>{data.volume.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderBook;
