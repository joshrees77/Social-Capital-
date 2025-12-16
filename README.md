# Uniswap v4 Pool Explorer (MVP)

This prototype visualizes concentrated liquidity ranges for Uniswap v4 pools. It ships with sample data for a couple of token pairs and lets you:

- Select a token pair
- Filter pools by name or fee tier
- Inspect per-range liquidity breakdowns via bars and a table

## Running locally
Because the page fetches a JSON file, open it with a local web server (serving the repository root):

```bash
python -m http.server 8000
```

Then open http://localhost:8000 in your browser.

## Data
Sample pool data lives in `data/pools.json`. Add additional pools or token pairs to this file to expand the view.
