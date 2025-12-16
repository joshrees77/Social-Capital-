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

function buildRangeBars(ranges, minBoundary, maxBoundary) {
  const fragment = document.createDocumentFragment();
  const span = maxBoundary - minBoundary || 1;

  ranges.forEach((range) => {
    const bar = document.createElement('div');
    bar.className = 'range-bar';

    const barFill = document.createElement('div');
    barFill.className = 'bar-fill';
    barFill.style.left = `${((range.lower - minBoundary) / span) * 100}%`;
    barFill.style.width = `${((range.upper - range.lower) / span) * 100}%`;

    const label = document.createElement('div');
    label.className = 'bar-label';
    label.innerHTML = `<span>${formatRange(range)}</span><strong>${range.share}%</strong>`;

    bar.append(barFill, label);
    fragment.appendChild(bar);
  });

  return fragment;
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

    const minBoundary = Math.min(...pool.liquidityRanges.map((r) => r.lower));
    const maxBoundary = Math.max(...pool.liquidityRanges.map((r) => r.upper));

    const rangesWithShare = pool.liquidityRanges.map((range) => ({
      ...range,
      share: ((range.liquidity / pool.totalLiquidity) * 100).toFixed(1),
    }));

    const chart = card.querySelector('.range-chart');
    chart.appendChild(buildRangeBars(rangesWithShare, minBoundary, maxBoundary));

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

