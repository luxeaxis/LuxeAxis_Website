# public/videos

Empty, deliberately.

This directory held four 1080p MP4 loops for the hero carousel — 71 MB, which
was 99.9% of every asset in `public/` (the entire poster set is 37 KB). They
were removed when the hero became `three/scenes/HeroRoomScene.tsx`.

Three separate rules said they could not stay:

- `LuxeAxis_Performance_A11y_QA.md` §5 on video: "avoid on the hero", "prefer a
  poster still over autoplay video", "never the LCP".
- `LuxeAxis_Cinematic_Direction.md` §10.2 bans timed reveals in the main flow.
  The carousel advanced on a 10-second timer, which takes pacing away from the
  visitor.
- §10.1 requires content to be readable at every frame. A slide that changes
  under a reader mid-sentence is the opposite of that.

The files are still in git history, so this deletion did not shrink the clone.
Removing them from history needs `git filter-repo` or a move to Git LFS, and is
a repository-wide decision rather than something to do in passing.

## If video comes back

It should not come back on the hero. Anywhere else, the spec's terms are: AV1
or HEVC, muted, `preload="none"`, a poster image, and never the LCP element.
