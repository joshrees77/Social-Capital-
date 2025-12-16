async function loadPools() {
  const response = await fetch('data/pools.json');
  if (!response.ok) {
    throw new Error('Unable to load pool data');
  }
  return response.json();
}

function formatNumber(value) {
  return Number(value).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });
}

function formatRange(range) {
  return `${range.lower} → ${range.upper}`;
}

function aggregateLiquidity(pools) {
  return pools.reduce((sum, pool) => sum + pool.totalLiquidity, 0);
}

function buildRangeTable(ranges) {
  const table = document.createElement('table');
  table.innerHTML = `
    <thead>
      <tr>
        <th>Range</th>
        <th>Liquidity</th>
        <th>Share</th>
      </tr>
    </thead>
    <tbody>
      ${ranges
        .map(
          (range) => `
            <tr>
              <td>${formatRange(range)}</td>
              <td>${formatNumber(range.liquidity)}</td>
              <td>${range.share}%</td>
            </tr>`
        )
        .join('')}
    </tbody>
  `;
  return table;
}

function buildRangeChart(ranges) {
  const minBoundary = Math.min(...ranges.map((r) => r.lower));
  const maxBoundary = Math.max(...ranges.map((r) => r.upper));
  const maxLiquidity = Math.max(...ranges.map((r) => r.liquidity));
  const span = maxBoundary - minBoundary || 1;

  const chart = document.createElement('div');
  chart.className = 'stacked-range-chart';

  const canvas = document.createElement('div');
  canvas.className = 'chart-canvas';

  const tooltip = document.createElement('div');
  tooltip.className = 'chart-tooltip hidden';

  ranges.forEach((range) => {
    const bar = document.createElement('div');
    bar.className = 'liquidity-bar';
    bar.style.left = `${((range.lower - minBoundary) / span) * 100}%`;
    bar.style.width = `${((range.upper - range.lower) / span) * 100}%`;
    bar.style.height = `${(range.liquidity / maxLiquidity) * 100}%`;
    bar.dataset.range = formatRange(range);
    bar.dataset.share = range.share;
    bar.dataset.liquidity = formatNumber(range.liquidity);

    bar.addEventListener('mouseenter', () => {
      bar.classList.add('active');
      tooltip.classList.remove('hidden');
      tooltip.innerHTML = `
        <div><strong>Range:</strong> ${bar.dataset.range}</div>
        <div><strong>Liquidity:</strong> ${bar.dataset.liquidity}</div>
        <div><strong>Share:</strong> ${bar.dataset.share}%</div>
      `;
    });

    bar.addEventListener('mouseleave', () => {
      bar.classList.remove('active');
      tooltip.classList.add('hidden');
    });

    bar.addEventListener('mousemove', (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      tooltip.style.left = `${x}px`;
    });

    canvas.appendChild(bar);
  });

  const axis = document.createElement('div');
  axis.className = 'x-axis';
  axis.innerHTML = `
    <span>${minBoundary}</span>
    <span>Price</span>
    <span>${maxBoundary}</span>
  `;

  chart.append(canvas, tooltip, axis);
  return chart;
}

function renderPools(pools) {
  const poolList = document.getElementById('poolList');
  poolList.innerHTML = '';

  pools.forEach((pool) => {
    const template = document.getElementById('pool-template');
    const card = template.content.cloneNode(true);

    card.querySelector('.pool-name').textContent = pool.name;
    card.querySelector('.pool-meta').textContent = `${pool.pair} • ${pool.feeTier}`;
    card.querySelector('.pool-liquidity').textContent = `${pool.baseSymbol} liquidity: ${formatNumber(
      pool.totalLiquidity
    )}`;

    const rangesWithShare = pool.liquidityRanges.map((range) => ({
      ...range,
      share: ((range.liquidity / pool.totalLiquidity) * 100).toFixed(1),
    }));

    const chart = card.querySelector('.range-chart');
    chart.appendChild(buildRangeChart(rangesWithShare));

    const tableContainer = card.querySelector('.range-table');
    tableContainer.appendChild(buildRangeTable(rangesWithShare));

    poolList.appendChild(card);
  });
}

function renderSummary(pair, pools) {
  const summary = document.getElementById('summary');
  const totalLiquidity = aggregateLiquidity(pools);
  summary.innerHTML = `
    <h3>${pair}</h3>
    <span class="pill">${pools.length} pools</span>
    <span class="pill">${formatNumber(totalLiquidity)} total base liquidity</span>
  `;
}

function applySearchFilter(pools, query) {
  if (!query) return pools;
  const lowerQuery = query.toLowerCase();
  return pools.filter(
    (pool) =>
      pool.name.toLowerCase().includes(lowerQuery) || pool.feeTier.toLowerCase().includes(lowerQuery)
  );
}

async function init() {
  const pools = await loadPools();
  const pairSelect = document.getElementById('pairSelect');
  const searchInput = document.getElementById('poolSearch');

  const pairs = Array.from(new Set(pools.map((p) => p.pair)));
  pairs.forEach((pair) => {
    const option = document.createElement('option');
    option.value = pair;
    option.textContent = pair;
    pairSelect.appendChild(option);
  });

  function updateView() {
    const selectedPair = pairSelect.value;
    const filteredByPair = pools.filter((pool) => pool.pair === selectedPair);
    const searchFiltered = applySearchFilter(filteredByPair, searchInput.value);
    renderSummary(selectedPair, searchFiltered);
    renderPools(searchFiltered);
  }

  pairSelect.addEventListener('change', updateView);
  searchInput.addEventListener('input', updateView);

  pairSelect.value = pairs[0];
  updateView();
}

init().catch((error) => {
  const poolList = document.getElementById('poolList');
  poolList.innerHTML = `<div class="pool-card">${error.message}</div>`;
});

