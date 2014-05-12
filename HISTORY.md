# Release history

## v0.2.3

- Changed default ttl from 3s to 15s.

## v0.2.2

- Safer image loading: images with a wrong or missing source get a placeholder image (when used
  in a DOM context a missing image is not a big deal, but when trying to draw it on a canvas it crashes javascript).
- Final callback now provides the list of failed images keys.
- The error and loaded callback now provides the image key that have been loaded or erronous.
- Exhaustive documentation added.

## v0.2.1

- Switch to wizcorp/util

## v0.2.0

- Lowercase name

## v0.1.0

- First version