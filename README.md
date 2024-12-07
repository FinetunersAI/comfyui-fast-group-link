# Fast Group Link

A ComfyUI custom node that allows you to link two groups together, where one group (master) controls the state of another group (slave). Inspired by and based on the excellent work by [rgthree](https://github.com/rgthree/rgthree-comfy).

## Features

- Link two groups together
- Master group controls the enable/disable state of nodes in both groups
- Simple ON/OFF toggle to control group states
- Collapsible interface to hide/show group settings
- Starts in collapsed state for cleaner workflows
- Visual feedback through color-coded toggle (red/green)

## Installation

1. Navigate to your ComfyUI custom nodes directory
2. Clone this repository or copy the files into a new directory called `fast-group-link`
3. Restart ComfyUI

## Usage

1. Add the "Fast Group Link" node to your workflow
2. Click the triangle on the left to expand the node settings
3. Select the master and slave groups from the dropdown menus
4. Use the toggle switch to enable/disable nodes in both groups:
   - OFF (red): Nodes in both groups are disabled
   - ON (green): Nodes in both groups are enabled
5. Click the triangle again to collapse the node for a cleaner interface

## Credits

This node is based on the work by [rgthree](https://github.com/rgthree/rgthree-comfy), specifically their implementation of group control functionality. The original concept and base implementation have been adapted and modified to create this simplified version.

## License

MIT License
