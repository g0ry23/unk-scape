/**
 * UNK-SCAPE 3D Procedural Texture & Geometry Factory
 * Path: client/render/textures.js
 * Namespace: window.UnkScape.TextureEngine (US.TextureEngine)US.
 */
(function() {
  const US = window.UnkScape = window.UnkScape || {};

  US.TextureEngine = {};

  // Internal cache to prevent memory leaks and duplicate texture allocations
  const textureCache = {};

  /**
   * Generates a retro, pixelated, noise-mapped texture on the fly
   * @param {string} type - The material type ('grass', 'stonepath', 'wood', 'bark')
   * @param {string} baseColorHex - Base background color string
   * @param {number} noiseIntensity - Amount of grit/grain variance (0 to 255)
   * @returns {THREE.CanvasTexture} High-performance, low-poly optimized texture map
   */
  US.TextureEngine.getProceduralTexture = function(type, baseColorHex, noiseIntensity) {
    noiseIntensity = noiseIntensity !== undefined ? noiseIntensity : 25;

    // THREE may not be loaded yet at parse time — guard here
    if (typeof THREE === 'undefined') {
      console.warn("TextureEngine: THREE not loaded yet, skipping texture: " + type);
      return null;
    }

    var cacheKey = type + '_' + baseColorHex + '_' + noiseIntensity;
    if (textureCache[cacheKey]) return textureCache[cacheKey];

    // Create a micro-canvas for the texture tile (64x64 is perfect for retro crispness)
    var canvas = document.createElement('canvas');
    canvas.width  = 64;
    canvas.height = 64;
    var ctx = canvas.getContext('2d');

    // Fill base color
    ctx.fillStyle = baseColorHex;
    ctx.fillRect(0, 0, 64, 64);

    // Inject procedural retro grain/grit
    var imgData = ctx.getImageData(0, 0, 64, 64);
    var data = imgData.data;

    for (var i = 0; i < data.length; i += 4) {
      // Apply unique noise distributions based on tile nature
      var noise = (Math.random() - 0.5) * noiseIntensity;

      if (type === 'stonepath') {
        // Add harsh, blocky stone tile borders/grain
        var pixelIndex = i / 4;
        var x = pixelIndex % 64;
        var y = Math.floor(pixelIndex / 64);
        if (x === 0 || y === 0 || x === 63 || y === 63 || x % 16 === 0 || y % 16 === 0) {
          noise -= 40; // Dark grid lines for pavers
        }
      } else if (type === 'grass') {
        // Clustered organic noise pattern
        if (Math.random() > 0.85) noise += 20;
      }

      data[i]     = Math.min(255, Math.max(0, data[i]     + noise)); // R
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise)); // G
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise)); // B
    }

    ctx.putImageData(imgData, 0, 0);

    // Convert canvas into a high-performance WebGL asset texture
    var texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter; // Preserves pixel-art crispness, no blurring!
    texture.minFilter = THREE.NearestFilter;
    texture.wrapS     = THREE.RepeatWrapping;
    texture.wrapT     = THREE.RepeatWrapping;

    textureCache[cacheKey] = texture;
    return texture;
  };

  /**
   * Alters standard box geometries to create asymmetrical, organic, low-poly variations
   * Used to make rocks look fractured and trees look uniquely handmade instead of perfect squares
   * @param {THREE.BufferGeometry} geometry - Target geometric mesh primitive
   * @param {number} jitterAmount - Vertices dispersion factor
   */
  US.TextureEngine.applyLowPolyJitter = function(geometry, jitterAmount) {
    jitterAmount = jitterAmount !== undefined ? jitterAmount : 0.08;

    var position = geometry.attributes.position;
    for (var i = 0; i < position.count; i++) {
      var x = position.getX(i);
      var y = position.getY(i);
      var z = position.getZ(i);

      // Jitter internal vertices without ruining the flat basal foundations
      if (y > 0.01) {
        x += (Math.random() - 0.5) * jitterAmount;
        y += (Math.random() - 0.5) * jitterAmount;
        z += (Math.random() - 0.5) * jitterAmount;
      }

      position.setXYZ(i, x, y, z);
    }

    // Recompute light angles over newly jittered faces
    geometry.computeVertexNormals();
  };

  console.log("Module Loaded: TextureEngine (Procedural Low-Poly Skins initialized)");
})();
