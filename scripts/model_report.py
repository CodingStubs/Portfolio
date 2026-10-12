"""Print a compact JSON report for one or more GLB files in Blender.

Run with:
  blender --background --factory-startup --python scripts/model_report.py -- model.glb
"""

import json
import sys
from pathlib import Path

import bpy


def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def mesh_stats(obj):
    mesh = obj.data
    mesh.calc_loop_triangles()
    return {
        "name": obj.name,
        "vertices": len(mesh.vertices),
        "triangles": len(mesh.loop_triangles),
        "materials": len(mesh.materials),
    }


def image_stats(image):
    width, height = image.size
    return {
        "name": image.name,
        "width": width,
        "height": height,
        "channels": image.channels,
        "source": image.source,
        "estimated_rgba_bytes": width * height * 4,
    }


def report(path):
    reset_scene()
    bpy.ops.import_scene.gltf(filepath=str(path))

    meshes = [mesh_stats(obj) for obj in bpy.context.scene.objects if obj.type == "MESH"]
    images = [image_stats(image) for image in bpy.data.images if image.size[0] and image.size[1]]
    return {
        "path": str(path),
        "file_bytes": path.stat().st_size,
        "objects": len(bpy.context.scene.objects),
        "mesh_objects": len(meshes),
        "vertices": sum(mesh["vertices"] for mesh in meshes),
        "triangles": sum(mesh["triangles"] for mesh in meshes),
        "materials": len(bpy.data.materials),
        "images": images,
        "estimated_texture_rgba_bytes": sum(image["estimated_rgba_bytes"] for image in images),
        "animations": len(bpy.data.actions),
        "largest_meshes": sorted(meshes, key=lambda mesh: mesh["triangles"], reverse=True)[:15],
    }


args = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
for filename in args:
    print("MODEL_REPORT=" + json.dumps(report(Path(filename).resolve()), separators=(",", ":")))
