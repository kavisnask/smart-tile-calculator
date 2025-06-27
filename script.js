let layoutData = {};

function toggleTileOptions() {
  const calcType = document.getElementById('calcType').value;
  document.getElementById('floorTileGroup').style.display = (calcType === 'floor') ? 'block' : 'none';
  document.getElementById('wallTileGroup').style.display = (calcType === 'wall') ? 'block' : 'none';
  document.getElementById('visualOutput').style.display = 'none';
}

function calculateTiles() {
  const width = parseFloat(document.getElementById('areaWidth').value);
  const height = parseFloat(document.getElementById('areaHeight').value);
  const calcType = document.getElementById('calcType').value;

  if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
    alert("Please enter valid area dimensions.");
    return;
  }

  const tileSizeValue = (calcType === 'floor')
    ? document.getElementById('floorTileSize').value
    : document.getElementById('wallTileSize').value;

  const [tileW, tileH] = tileSizeValue.split('x').map(Number);
  const totalArea = width * height;
  const tileArea = tileW * tileH;
  const tileCount = Math.ceil(totalArea / tileArea);
  const suggestedTiles = Math.ceil(tileCount * 1.10);

  const tilesAlongWidth = Math.floor(width / tileW);
  const tilesAlongHeight = Math.floor(height / tileH);

  // Row inputs
  let darkRows = parseInt(document.getElementById('darkRows').value);
  let highlightRows = parseInt(document.getElementById('highlightRows').value);
  let lightRows = parseInt(document.getElementById('lightRows').value);

  if (isNaN(darkRows)) darkRows = 0;
  if (isNaN(highlightRows)) highlightRows = 0;

  const totalRows = tilesAlongHeight;
  const remaining = totalRows - (darkRows + highlightRows);
  if (isNaN(lightRows)) lightRows = Math.max(0, remaining);

  // Tile counts
  const darkTiles = tilesAlongWidth * darkRows;
  const highlightTiles = tilesAlongWidth * highlightRows;
  const lightTiles = tilesAlongWidth * lightRows;

  layoutData = {
    totalRows,
    tilesAlongWidth,
    darkRows,
    highlightRows,
    lightRows,
    darkTiles,
    highlightTiles,
    lightTiles
  };

  document.getElementById('output').innerHTML = `
    <h3>Calculation Result</h3>
    <p><strong>Total Area:</strong> ${totalArea.toFixed(2)} sq.ft</p>
    <p><strong>Tile Size:</strong> ${tileW} ft x ${tileH} ft = ${tileArea.toFixed(2)} sq.ft</p>
    <p><strong>Tiles Required:</strong> ${tileCount}</p>
    <p><strong>Suggested (10% extra):</strong> ${suggestedTiles}</p>
    <hr>
    <p><strong>Tiles along Width:</strong> ${tilesAlongWidth}</p>
    <p><strong>Tiles along Height:</strong> ${tilesAlongHeight}</p>
  `;

  document.getElementById('visualOutput').style.display = 'none';
}

function showVisualLayout() {
  if (!layoutData.tilesAlongWidth) {
    alert("Please click 'Calculate' first.");
    return;
  }

  document.getElementById('visualOutput').style.display = 'block';
  document.getElementById('visualOutput').innerHTML = `
    <h4>🎨 Visual Tile Layout Plan</h4>
    <p><strong>Total Rows:</strong> ${layoutData.totalRows}</p>
    <p><strong>Dark Tile Rows:</strong> ${layoutData.darkRows} → <strong>Tiles:</strong> ${layoutData.darkTiles}</p>
    <p><strong>Highlight Tile Rows:</strong> ${layoutData.highlightRows} → <strong>Tiles:</strong> ${layoutData.highlightTiles}</p>
    <p><strong>Light Tile Rows:</strong> ${layoutData.lightRows} → <strong>Tiles:</strong> ${layoutData.lightTiles}</p>
  `;
}
