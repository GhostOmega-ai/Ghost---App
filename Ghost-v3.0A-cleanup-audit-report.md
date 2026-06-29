# Ghost v3.0A Cleanup Audit Report

Source: `index (29).html`  
Audit type: **read-only / no app changes**  
File size: 195,174 bytes

## Quick Verdict

The file has many layered update blocks and old hotfixes. That is very likely why the favourite-star and viewer-hint fixes keep clashing. I recommend a staged cleanup, not a deep one-shot rewrite.

## Version / Update Blocks Found

- CSS: `Ghost v0.6.3 Album Cover Cards`
- CSS: `v0.6.3.2 cleaner album cards`
- CSS: `Ghost v0.7A Viewer Core final polish`
- CSS: `Ghost v0.7B Gallery Essentials`
- CSS: `Ghost v0.7C Photos Identity Pass`
- CSS: `Ghost v2.1B Fit One Page — compact no-scroll dashboard`
- CSS: `Ghost v2.2 Video Vault — matches photo vault theme`
- CSS: `Ghost v2.4A Video Phase A`
- CSS: `Ghost v2.4B Album Buttons`
- CSS: `Ghost v2.4B3 Photo Vault + Photo/+Album Fix`
- CSS: `Ghost v2.5A Album Refactor`
- CSS: `Ghost v2.5B Recovery Safe Patch`
- CSS: `Ghost v2.5E Private Folder Security`
- CSS: `Ghost v2.5F Photo Vault Hotfix`
- CSS: `Ghost v2.5G Photo Vault Force Fix`
- CSS: `Ghost v2.6A Browser + Contact Chat`
- CSS: `Ghost v2.6B Dashboard Layout`
- CSS: `Ghost v2.6C Contact Add Hotfix`
- CSS: `Ghost v2.7 Contact & Chat Polish`
- CSS: `Ghost v2.7A Chat UX Fix`
- CSS: `Ghost v2.7B Premium Composer + Working Attachments`
- CSS: `Ghost v2.7C Premium Composer Polish — UI only`
- CSS: `Ghost v2.9A Premium Photo Viewer`
- CSS: `Ghost v2.9A Hotfix 1`
- CSS: `Ghost v2.9C Photo Favourite + Hint Polish`
- CSS: `Ghost v2.9C.1 Hint Hotfix`
- JS: `Ghost v0.7B Gallery Essentials overrides`
- JS: `Ghost v0.7B.1 Stability + Rename Photo patch`
- JS: `Ghost v2.2 Video Vault — clean album system`
- JS: `Ghost v2.1 safe boot`
- JS: `Ghost v2.5G Photo Vault Force Fix This deliberately overrides the photo album home renderer at the END of the script, so older duplicated render blocks cannot win.`
- JS: `Ghost v2.6C Contact Add Hotfix`
- JS: `Ghost v2.9A Premium Photo Viewer`
- JS: `Ghost v2.9A Hotfix 1`
- JS: `Ghost v2.9C Photo Favourite + Hint Polish`
- JS: `Ghost v2.9C.1 Hint Hotfix`

## Keyword Counts

- `v0.6`: 2
- `v0.7`: 8
- `v2.1`: 2
- `v2.4`: 3
- `v2.5`: 7
- `v2.6`: 4
- `v2.7`: 4
- `v2.9`: 10
- `Hotfix`: 8
- `Force Fix`: 2
- `Emergency`: 1
- `Cleanup`: 1

## Duplicate Selector Pressure

- `.photoFav`: 8 occurrence(s)
- `.viewerFav`: 2 occurrence(s)
- `.premiumViewerHint`: 5 occurrence(s)
- `.premiumChatComposer`: 11 occurrence(s)
- `.albumModal`: 5 occurrence(s)
- `.galleryHero`: 24 occurrence(s)
- `.photoHeroStack`: 8 occurrence(s)
- `.forcePhotoHero`: 3 occurrence(s)
- `.viewerClean`: 6 occurrence(s)
- `.videoVaultHero`: 22 occurrence(s)
- `.v21Grid`: 21 occurrence(s)
- `.v26BGrid`: 9 occurrence(s)
- `.ghostModalInput`: 3 occurrence(s)

## Duplicate JavaScript Function Names

- `addPhotos`: 3 definitions
- `albumCoverSrc`: 2 definitions
- `albumEmoji`: 2 definitions
- `albumList`: 2 definitions
- `albumPhotoIndexes`: 2 definitions
- `burnBrowser`: 2 definitions
- `deletePhoto`: 2 definitions
- `deleteSelectedPhotos`: 2 definitions
- `drawAlbumHome`: 2 definitions
- `drawAlbumPhotos`: 3 definitions
- `drawViewer`: 3 definitions
- `ensurePhotoStorage`: 2 definitions
- `filteredPhotoIndexes`: 2 definitions
- `formatBytes`: 2 definitions
- `ghostAddContactSafe`: 2 definitions
- `moveViewerPhotoToAlbum`: 2 definitions
- `normalizePhotos`: 2 definitions
- `openViewerByPosition`: 2 definitions
- `photoInfo`: 3 definitions
- `photoSettings`: 2 definitions
- `setPhotoSearch`: 2 definitions
- `setPhotoSort`: 2 definitions
- `showPhotoInfoPanel`: 2 definitions
- `toggleFav`: 2 definitions
- `toggleViewerFav`: 4 definitions
- `viewerDeletePhoto`: 2 definitions
- `viewerMenu`: 3 definitions
- `viewerMovePhoto`: 2 definitions

## Likely Safe To Clean First

1. Old `.photoFav` / `.viewerFav` styling blocks.
2. Old viewer-hint CSS/JS wrappers from v2.9C attempts.
3. Repeated photo hero layout CSS from v2.4/v2.5 hotfixes, after visual test.
4. Superseded dashboard grid CSS, after visual test.
5. Duplicate modal/input styling only if the latest style remains identical.

## Keep Untouched For Now

1. IndexedDB/photo storage functions.
2. Album functions and Private Vault PIN logic.
3. Contacts/chat functions.
4. Browser, files, notes and video vault.
5. Service worker and manifest.
6. Asset filenames and image references.

## Recommended v3.0B Plan

### Pass 1: CSS-only cleanup
Remove only obsolete visual blocks. Do not touch JS.

### Pass 2: Photo viewer controller cleanup
Replace the stacked hint/favourite patches with one clean controller.

### Pass 3: JS wrapper cleanup
Only after Pass 1 and Pass 2 test perfectly.

## Testing Checklist After Each Pass

- Dashboard opens.
- Photo vault opens.
- Upload photo works.
- Albums open.
- Private folder still asks PIN.
- Viewer opens.
- Swipe/zoom photo works.
- Contacts/chat opens.
- Browser opens.
- Files/notes/videos open.

## Recommendation

Do **v3.0B CSS-only cleanup first**, not a full deep clean.
