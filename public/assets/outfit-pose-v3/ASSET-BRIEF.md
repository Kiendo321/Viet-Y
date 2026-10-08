# Pose asset brief — 08/10/2026

Scope: create natural full-body pose masters from the existing generated adult female
ivory áo dài model. No user photos, custom fit, size/body controls, runtime recoloring,
app source changes or deployment in this asset pass.

Pose set:
- relaxed_front: relaxed weight shift, open view of collar/front, arms naturally down.
- soft_three_quarter: small torso turn, face to camera, one forearm gently bent.
- gentle_step: short natural step, mild cloth motion, believable balance and feet.

Locked reference: ../viet-phuc-expansion-v2/aodai-female-ivory-master-draft.png.
Preserve identity, ivory outfit, white trousers, shoes, lighting and full-body framing.
All generated models are AI illustrations, not photographs of real museum artifacts.

Each master is a complete outfit. It is not an independently swappable áo/quần/tay
layer set. A new pose changes occlusion and garment folds: never combine old pose
layers with a new pose. Review masters before multiplying colors or extracting layers.

Target canvas 1024x1536, real alpha background, no matte/glow, full shoes visible.
Check actual output size/alpha before assuming the target was followed.

Review criteria:
1. Natural balance, plausible anatomy, fingers and feet.
2. Collar, panels, slits and trousers stay visually coherent.
3. Face, hair, light direction and outfit remain consistent across the series.
4. Transparent background without drawn checkerboard, halos or opaque floor.
5. Compare on campus/studio/stage backgrounds; CSS preview is not a regenerated photo.
6. Record any identity drift, occlusion or cultural questions; do not mark expert approval.

Suggested downstream asset key:
{ modelId, garmentId, poseId, colorwayId, backgroundId }
For independent parts, add pose-specific layerOrder and aligned layers. Unsupported
combinations must be disabled or explicitly mapped to a valid preset.
