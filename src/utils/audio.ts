// Sound and haptics were removed. These no-ops keep existing imports working.
export function setAudioEnabled(_enabled: boolean) {}
export function isAudioEnabled(): boolean { return false; }
export function triggerHaptic(_type: 'light' | 'medium' | 'success' | 'warning' = 'light') {}
export function playTapSound() {}
export function playTickSound(_frequency = 440) {}
export function playPRSound() {}
export function playUnlockSound() {}
