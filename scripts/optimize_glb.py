"""Create web-friendly GLB copies with resized WebP textures.

Geometry is intentionally left unchanged. These portfolio scenes are already
low-poly; their embedded 4K textures are the dominant download and GPU cost.

Run with:
  blender --background --factory-startup --python scripts/optimize_glb.py -- \
    --max-texture 1024 --quality 78 model.glb [model.glb ...]
"""

import argparse
import json
import sys
from pathlib import Path

import bpy


def parse_args():
    args = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    parser = argparse.ArgumentParser()
    parser.add_argument("inputs", nargs="+", type=Path)
    parser.add_argument("--max-texture", type=int, default=1024)
    parser.add_argument("--quality", type=int, default=78)
    return parser.parse_args(args)


def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def resize_image(image, max_texture):
    width, height = image.size
    largest = max(width, height)
    if not width or not height or largest <= max_texture:
        return None

    scale = max_texture / largest
    target = (max(1, round(width * scale)), max(1, round(height * scale)))
    image.scale(*target)
    return {"name": image.name, "from": [width, height], "to": list(target)}


def optimize(source, max_texture, quality):
    source = source.resolve()
    output = source.with_name(source.stem + "_optimized.glb")

    reset_scene()
    bpy.ops.import_scene.gltf(filepath=str(source))
    resized = [
        result
        for image in bpy.data.images
        if (result := resize_image(image, max_texture)) is not None
    ]

    bpy.ops.export_scene.gltf(
        filepath=str(output),
        export_format="GLB",
        export_image_format="WEBP",
        export_image_quality=quality,
        export_image_webp_fallback=False,
        export_unused_images=False,
        export_unused_textures=False,
        export_animations=True,
        export_cameras=True,
        export_lights=True,
        export_apply=False,
        export_use_gltfpack=False,
        export_draco_mesh_compression_enable=False,
    )

    print(
        "OPTIMIZE_RESULT="
        + json.dumps(
            {
                "source": str(source),
                "output": str(output),
                "source_bytes": source.stat().st_size,
                "output_bytes": output.stat().st_size,
                "resized": resized,
            },
            separators=(",", ":"),
        )
    )


options = parse_args()
for input_path in options.inputs:
    optimize(input_path, options.max_texture, options.quality)
