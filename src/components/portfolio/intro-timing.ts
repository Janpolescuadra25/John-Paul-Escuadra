/**
 * Shared intro-curtain timing (seconds). The curtain holds for the
 * video runtime + a beat (INTRO_HOLD_S), then splits over ~0.95s —
 * content choreography (hero stagger, scroll line drop-in) should
 * begin at INTRO_DONE_S or later so nothing animates behind the veil.
 */
export const INTRO_HOLD_MS = 4450;
export const INTRO_SPLIT_MS = 950;
export const INTRO_DONE_S = (INTRO_HOLD_MS + INTRO_SPLIT_MS) / 1000; // 5.4
