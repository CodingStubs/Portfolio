# 3D source assets

This directory holds the original and standalone model sources that should not
be copied into the production website build.

- `original-models/` contains the original 4K-texture city and Earth GLBs.
- `reference-models/` contains standalone source models that are not imported
  by the current React scene.
- Production-ready models remain in `public/assets/export_blender_work/`.

The production city and Earth models use 1024x1024 WebP textures. Their mesh
geometry is unchanged because both models were already low-poly.

To regenerate optimized copies with Blender 4.2 or newer:

```sh
/Applications/Blender.app/Contents/MacOS/Blender \
  --background --factory-startup \
  --python scripts/optimize_glb.py -- \
  --max-texture 1024 --quality 78 \
  source-assets/original-models/city_planet.glb \
  source-assets/original-models/earth_planet.glb
```
