// script.js
let layoutData = {};

const tileBoxData = {
  "1.25x0.83": 8,
  "1.5x1": 6,
  "2x1": 5,
  "1x1": 8,
  "1.3x1.3": 8,
  "2x2": 4,
  "4x2": 2,
  "5.6x2.9": 2
};

function toggleTileOptions() {
  const calcType = document.getElementById('calcType').value;
  document.getElementById('floorTileGroup').style.display = (calcType === 'floor') ? 'block' : 'none';
  document.getElementById('wallTileGroup').style.display = (calcType === 'wall') ? 'block' : 'none';
  document.getElementById('visualOutput').style.display = 'none';
}

function calculateTiles() {
  const width = parseFloat(document.getElementById('areaWidth').value);
  const height = parseFloat(document.getElementById('areaHeight').value);
  const price = parseFloat(document.getElementById('pricePerSqft').value) || 0;
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

  const tilesAlongWidth = Math.ceil(width / tileW);
  const tilesAlongHeight = Math.ceil(height / tileH);

  layoutData = {
    totalArea: totalArea.toFixed(2),
    tileW,
    tileH,
    tileArea: tileArea.toFixed(2),
    tileCount,
    suggestedTiles,
    tilesAlongWidth,
    tilesAlongHeight,
    tileKey: `${tileW}x${tileH}`,
    price
  };

  document.getElementById('output').innerHTML = `
    <h3>Calculation Result</h3>
    <p><strong>Total Area:</strong> ${layoutData.totalArea} sq.ft</p>
    <p><strong>Tile Size:</strong> ${tileW} ft x ${tileH} ft = ${layoutData.tileArea} sq.ft</p>
    <p><strong>Tiles Required:</strong> ${tileCount}</p>
    <hr>
    <p><strong>Tiles along Width:</strong> ${tilesAlongWidth}</p>
    <p><strong>Tiles along Height:</strong> ${tilesAlongHeight}</p>
  `;

  document.getElementById('visualOutput').style.display = 'none';
}

function showVisualLayout() {
  const {
    tilesAlongWidth, tilesAlongHeight, tileW, tileH, tileKey, price
  } = layoutData;

  if (!tilesAlongWidth || !tilesAlongHeight) {
    alert("Please click 'Calculate' first.");
    return;
  }

  let darkRows = parseInt(document.getElementById('darkRows').value);
  let highlightRows = parseInt(document.getElementById('highlightRows').value);
  let lightRows = parseInt(document.getElementById('lightRows').value);

  if (isNaN(darkRows)) darkRows = 0;
  if (isNaN(highlightRows)) highlightRows = 0;
  const totalRows = tilesAlongHeight;
  const remaining = totalRows - (darkRows + highlightRows);
  if (isNaN(lightRows)) lightRows = Math.max(0, remaining);

  const darkTiles = tilesAlongWidth * darkRows;
  const highlightTiles = tilesAlongWidth * highlightRows;
  const lightTiles = tilesAlongWidth * lightRows;
  const totalTiles = darkTiles + highlightTiles + lightTiles;
  const tileArea = tileW * tileH;
  const totalLayoutArea = totalTiles * tileArea;

  const tilesPerBox = tileBoxData[tileKey] || 1;
  const darkBoxes = Math.ceil(darkTiles / tilesPerBox);
  const highlightBoxes = Math.ceil(highlightTiles / tilesPerBox);
  const lightBoxes = Math.ceil(lightTiles / tilesPerBox);
  const totalBoxes = darkBoxes + highlightBoxes + lightBoxes;
  const totalAmount = (totalLayoutArea * price).toFixed(2);

  document.getElementById('visualOutput').style.display = 'block';
  document.getElementById('visualOutput').innerHTML = `
    <h4>Visual Tile Layout Plan</h4><br>
    <p><strong>Dark Tile Rows:</strong> ${darkRows} → <strong>Tiles:</strong> ${darkTiles} → <strong>Boxes:</strong> ${darkBoxes}</p>
    <p><strong>Highlight Tile Rows:</strong> ${highlightRows} → <strong>Tiles:</strong> ${highlightTiles} → <strong>Boxes:</strong> ${highlightBoxes}</p>
    <p><strong>Light Tile Rows:</strong> ${lightRows} → <strong>Tiles:</strong> ${lightTiles} → <strong>Boxes:</strong> ${lightBoxes}</p>
    <hr>
    <p><strong>Total Boxes:</strong> ${totalBoxes}</p>
    <p><strong>Each Box Contains:</strong> ${tilesPerBox} tiles</p>
    <p><strong>Total Tile Area (based on layout):</strong> ${totalLayoutArea.toFixed(2)} sq.ft</p>
    <p><strong>Price per Sq.ft:</strong> ₹${price.toFixed(2)}</p>
    <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
  `;
}
