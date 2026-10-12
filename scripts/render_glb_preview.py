"""Render a consistent square preview of a GLB for visual QA."""

import sys
from pathlib import Path

import bpy
from mathutils import Vector


def look_at(camera, target):
    camera.rotation_euler = (target - camera.location).to_track_quat("-Z", "Y").to_euler()


source = Path(sys.argv[sys.argv.index("--") + 1]).resolve()
output = Path(sys.argv[sys.argv.index("--") + 2]).resolve()

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(source))

for obj in list(bpy.context.scene.objects):
    if obj.type in {"CAMERA", "LIGHT"}:
        bpy.data.objects.remove(obj, do_unlink=True)

corners = []
for obj in bpy.context.scene.objects:
    if obj.type == "MESH":
        corners.extend(obj.matrix_world @ Vector(corner) for corner in obj.bound_box)

minimum = Vector((min(v.x for v in corners), min(v.y for v in corners), min(v.z for v in corners)))
maximum = Vector((max(v.x for v in corners), max(v.y for v in corners), max(v.z for v in corners)))
center = (minimum + maximum) / 2
radius = max((corner - center).length for corner in corners)

camera_data = bpy.data.cameras.new("Preview Camera")
camera = bpy.data.objects.new("Preview Camera", camera_data)
bpy.context.scene.collection.objects.link(camera)
camera.location = center + Vector((1.55, -1.85, 1.15)).normalized() * radius * 3.1
camera.data.lens = 52
look_at(camera, center)
bpy.context.scene.camera = camera

key_data = bpy.data.lights.new("Key", "AREA")
key_data.energy = 1100
key_data.shape = "DISK"
key_data.size = radius * 2.2
key = bpy.data.objects.new("Key", key_data)
bpy.context.scene.collection.objects.link(key)
key.location = center + Vector((2.5, -3.0, 4.0)).normalized() * radius * 4
look_at(key, center)

fill_data = bpy.data.lights.new("Fill", "AREA")
fill_data.energy = 650
fill_data.size = radius * 2.6
fill = bpy.data.objects.new("Fill", fill_data)
bpy.context.scene.collection.objects.link(fill)
fill.location = center + Vector((-3.0, -1.0, 1.2)).normalized() * radius * 3
look_at(fill, center)

scene = bpy.context.scene
scene.render.engine = "BLENDER_EEVEE_NEXT"
scene.render.resolution_x = 640
scene.render.resolution_y = 640
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.filepath = str(output)
scene.render.film_transparent = False
if scene.world is None:
    scene.world = bpy.data.worlds.new("Preview World")
scene.world.color = (0.018, 0.022, 0.035)
scene.view_settings.look = "AgX - Medium High Contrast"
bpy.ops.render.render(write_still=True)
print("PREVIEW=" + str(output))
