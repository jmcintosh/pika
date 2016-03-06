import os
import json

files = [f for f in os.listdir('.') if os.path.isfile(f)]
scenes = []
for f in files:
    if f.endswith(".mp4"):
        scene = {}
        scene['title'] = f[:-4]
        scene['url'] = 'video/' + f
        scene['string'] = 'Placeholder string for ' + f
        scene['textIsShown'] = False
        scenes.append(scene)


scenesfile = open('scenes.js','w')
scenesfile.write('var scenes = ')
scenesfile.write(json.dumps(scenes, sort_keys=True, indent=4))
scenesfile.write(';')
scenesfile.close()