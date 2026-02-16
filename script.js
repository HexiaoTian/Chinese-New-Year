// Chinese New Year dates (first day of lunar new year) - approximate Gregorian dates
const CHINESE_NEW_YEAR_DATES = {
  2025: new Date('2025-01-29'),
  2026: new Date('2026-02-17'),
  2027: new Date('2027-02-06'),
  2028: new Date('2028-01-26'),
  2029: new Date('2029-02-13'),
  2030: new Date('2030-02-03'),
};

/**
 * Get the next Chinese New Year date from today.
 * @returns {Date} The next Chinese New Year date
 */
function getNextChineseNewYear() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const year in CHINESE_NEW_YEAR_DATES) {
    const cnyDate = new Date(CHINESE_NEW_YEAR_DATES[year]);
    cnyDate.setHours(0, 0, 0, 0);
    if (cnyDate >= today) {
      return cnyDate;
    }
  }
  // Fallback: next year's date if we're past the table
  const nextYear = today.getFullYear() + 1;
  return CHINESE_NEW_YEAR_DATES[nextYear] || new Date(nextYear, 0, 1);
}

/**
 * Get countdown (days, hours, minutes, seconds) until a date.
 * @param {Date} target
 * @returns {{ days: number, hours: number, minutes: number, seconds: number } | null } null if target is in the past
 */
function getCountdown(target) {
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

/**
 * Format countdown for display.
 * @param {{ days: number, hours: number, minutes: number, seconds: number }} c
 * @returns {string}
 */
function formatCountdown(c) {
  if (!c) return '—';
  return `${c.days} 天 ${String(c.hours).padStart(2, '0')} : ${String(c.minutes).padStart(2, '0')} : ${String(c.seconds).padStart(2, '0')}`;
}

/**
 * Update the countdown display on the page.
 */
function updateCountdown() {
  const nextCNY = getNextChineseNewYear();
  const countdown = getCountdown(nextCNY);

  const dateEl = document.getElementById('cny-date');
  const countdownEl = document.getElementById('cny-countdown');

  if (dateEl) {
    dateEl.textContent = nextCNY.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  if (countdownEl) {
    countdownEl.textContent = countdown ? formatCountdown(countdown) : '新年快乐！';
  }
}

// Run on load and update every second
function init() {
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}