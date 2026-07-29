// Shapes for the button hover morph (arrow -> robot mascot, the same character as the favicon).
//
// BOTH paths must be authored in the SAME coordinate space — viewBox="0 0 1000 1000" — or
// MorphSVG interpolates between mismatched coordinates and the shape flies across the canvas.
//
// Note the subpath counts differ: the arrow is 1 closed subpath, the robot is 8 (body outline,
// two eyes, mouth, two arm blocks, two legs). MorphSVG handles the mismatch, but the extra
// subpaths grow from points. If that reads badly, tune `shapeIndex` on the tween before
// considering a rewrite of the arrow into 8 matching subpaths.

/**
 * An "↳" arrow — down, turn right, arrowhead — as a single closed subpath.
 *
 * Traced as a FILLED outline rather than drawn with `stroke`, because it morphs into the filled
 * robot below; a stroked path would leave the robot rendering as a hairline outline mid-tween.
 * Stroke thickness is 100 units so it still resolves to >1px at the 14px display size.
 */
export const ARROW_PATH =
    'M 210 190 L 310 190 L 310 530 L 640 530 L 640 450 L 810 580 L 640 710 L 640 630 L 210 630 Z'

/**
 * The robot mascot. Relies on fill-rule="evenodd" — the eyes and mouth are holes cut out of the
 * body outline, so without it the shape fills solid and reads as a blob.
 */
export const ROBOT_PATH =
    'M 357 189.982 L 357 213.964 L 333.250 214.232 L 309.500 214.500 L 309.232 238.250 L 308.964 262 L 285.482 262 L 262 262 L 262 381 L 262 500 L 285.482 500 L 308.964 500 L 309.232 523.750 L 309.500 547.500 L 333.250 547.768 L 357 548.036 L 357 571.518 L 357 595 L 500 595 L 643 595 L 643 571.518 L 643 548.036 L 666.750 547.768 L 690.500 547.500 L 690.768 523.750 L 691.036 500 L 714.518 500 L 738 500 L 738 381 L 738 262 L 714.518 262 L 691.036 262 L 690.768 238.250 L 690.500 214.500 L 666.750 214.232 L 643 213.964 L 643 189.982 L 643 166 L 500 166 L 357 166 L 357 189.982 M 405 333.500 L 405 358.036 L 428.750 357.768 L 452.500 357.500 L 452.500 333.500 L 452.500 309.500 L 428.750 309.232 L 405 308.964 L 405 333.500 M 547.456 310.253 C 547.184 310.963, 547.082 321.884, 547.231 334.522 L 547.500 357.500 L 571.500 357.500 L 595.500 357.500 L 595.500 333.500 L 595.500 309.500 L 571.726 309.232 C 553.042 309.021, 547.845 309.240, 547.456 310.253 M 166 500 L 166 595 L 190.500 595 L 215 595 L 215 500 L 215 405 L 190.500 405 L 166 405 L 166 500 M 357 429 L 357 453 L 381 453 L 405 453 L 405 476.992 L 405 500.985 L 500.250 500.742 L 595.500 500.500 L 595.768 476.750 L 596.036 453 L 619.518 453 L 643 453 L 643 429 L 643 405 L 619 405 L 595 405 L 595 428.500 L 595 452 L 500 452 L 405 452 L 405 428.500 L 405 405 L 381 405 L 357 405 L 357 429 M 785 500 L 785 595 L 809.500 595 L 834 595 L 834 500 L 834 405 L 809.500 405 L 785 405 L 785 500 M 405 762 L 405 881 L 429 881 L 453 881 L 453 762 L 453 643 L 429 643 L 405 643 L 405 762 M 547 762 L 547 881 L 571 881 L 595 881 L 595 762 L 595 643 L 571 643 L 547 643 L 547 762'
