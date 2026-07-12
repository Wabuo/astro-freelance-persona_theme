# playwright-dependencies

A meta package that provides symlinks for Playwright browser dependencies on Arch Linux.

## Why?

Playwright's browser binaries are built against specific library versions (typically from Ubuntu/Debian). On Arch Linux, these libraries are often newer versions with different SONAME numbers. This package creates the necessary symlinks to satisfy Playwright's runtime checks.

## What it does

Creates symlinks for:

- **ICU libraries** (libicu*.so.74 → current version)
- **libxml2** (libxml2.so.2 → current version)
- **libflite** (various libflite_*.so.1 → libflite.so.1)

These symlinks are tracked by pacman and automatically removed when the package is uninstalled.

## Building and installing

```bash
chmod +x build.sh
./build.sh
```

Or manually:

```bash
makepkg -si
```

## Uninstalling

```bash
sudo pacman -R playwright-dependencies
```

## Notes

- This package depends on `icu`, `libxml2`, and `flite` being installed
- The symlinks are created dynamically based on your current library versions
- This is a workaround for Arch Linux not being officially supported by Playwright
- The flite symlinks point to dummy files since Firefox doesn't actually load them
