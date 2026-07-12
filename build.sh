#!/bin/bash
set -e

echo "Building playwright-dependencies package..."
makepkg -si

echo ""
echo "Package built and installed successfully!"
echo ""
echo "To uninstall: sudo pacman -R playwright-dependencies"
echo "To rebuild: ./build.sh"
