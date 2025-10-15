// Web-compatible haptic feedback fallback
const HapticFeedback = {
  trigger: (type = 'impactLight', options = {}) => {
    // Web fallback - use vibration API if available
    if (navigator.vibrate) {
      switch (type) {
        case 'impactLight':
          navigator.vibrate(10);
          break;
        case 'impactMedium':
          navigator.vibrate(20);
          break;
        case 'impactHeavy':
          navigator.vibrate(30);
          break;
        case 'notificationSuccess':
          navigator.vibrate([10, 50, 10]);
          break;
        case 'notificationWarning':
          navigator.vibrate([10, 100, 10]);
          break;
        case 'notificationError':
          navigator.vibrate([10, 50, 10, 50, 10]);
          break;
        default:
          navigator.vibrate(15);
      }
    }
  },
};

export default HapticFeedback;