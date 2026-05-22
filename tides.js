/* Offline tidal approximation for Dublin Bay.
 *
 * Method: lunar-phase-based tidal prediction.
 * - Tidal period: 12h 25.24min (half a lunar day)
 * - Moon transit time at Dublin derived from lunar age
 * - Dublin port constant: ~+30 min after moon's upper transit
 * - Heights interpolated between spring and neap values
 *
 * Accuracy: typically ±45–90 min on time, ±0.3m on height.
 * Errors are larger during storms or unusual atmospheric pressure.
 */
(function () {
  var TIDAL_PERIOD_MS  = (12 * 60 + 25.24) * 60 * 1000;
  var SYNODIC_MONTH_MS = 29.530588853 * 24 * 3600 * 1000;
  var HALF_SYNODIC_MS  = SYNODIC_MONTH_MS / 2;

  // Reference new moon: 2000-01-06 18:14 UTC
  var REF_NEW_MOON_MS = Date.UTC(2000, 0, 6, 18, 14, 0);

  // Dublin Port mean tide levels (metres, Chart Datum)
  var MHWS = 4.1;
  var MHWN = 3.2;
  var MLWN = 1.1;
  var MLWS = 0.5;

  // HW occurs ~30 min after moon's upper transit at Dublin
  var PORT_CONSTANT_H = 0.5;

  function moonAgeMs(now) {
    var elapsed = now.getTime() - REF_NEW_MOON_MS;
    return (elapsed % SYNODIC_MONTH_MS + SYNODIC_MONTH_MS) % SYNODIC_MONTH_MS;
  }

  function calcTides(now) {
    var ageMs = moonAgeMs(now);
    var ageD  = ageMs / (24 * 3600 * 1000);

    // Spring/neap factor: +1 at new/full moon, -1 at quarter moons
    var sf = Math.cos(ageMs / HALF_SYNODIC_MS * Math.PI);

    var hwHeight = ((MHWS + MHWN) / 2 + sf * (MHWS - MHWN) / 2).toFixed(1);
    var lwHeight = ((MLWN + MLWS) / 2 - sf * (MLWN - MLWS) / 2).toFixed(1);

    // Moon upper transit at Dublin (UTC hours)
    // At new moon transits ~12:00 UTC at Greenwich; +50.47 min/day later
    // Dublin lon -6.26° = -25 min from Greenwich
    var transitH = ((12 + ageD * 50.47 / 60) % 24 - 6.26 / 15 + 24) % 24;

    var todayMidnightMs = Date.UTC(
      now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()
    );
    var hwAnchorMs = todayMidnightMs + (transitH + PORT_CONSTANT_H) * 3600000;

    var nowMs = now.getTime();
    var cyclesBefore = Math.floor((nowMs - hwAnchorMs) / TIDAL_PERIOD_MS);
    var lastHW_ms = hwAnchorMs + cyclesBefore * TIDAL_PERIOD_MS;

    var halfPeriod    = TIDAL_PERIOD_MS / 2;
    var lwAfterLastHW = lastHW_ms + halfPeriod;

    var isRising, nextEvent, afterNext;

    if (nowMs < lwAfterLastHW) {
      isRising  = false;
      nextEvent = { ms: lwAfterLastHW,                    type: 'LW', height: lwHeight };
      afterNext = { ms: lastHW_ms + TIDAL_PERIOD_MS,      type: 'HW', height: hwHeight };
    } else {
      isRising  = true;
      nextEvent = { ms: lastHW_ms + TIDAL_PERIOD_MS,      type: 'HW', height: hwHeight };
      afterNext = { ms: lastHW_ms + TIDAL_PERIOD_MS + halfPeriod, type: 'LW', height: lwHeight };
    }

    function fmtTime(ms) {
      return new Date(ms).toLocaleTimeString('en-IE', {
        hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Dublin',
      });
    }

    return {
      isRising:  isRising,
      tideLabel: sf > 0.5 ? ' · Spring' : sf < -0.5 ? ' · Neap' : '',
      nextHW:    nextEvent.type === 'HW' ? nextEvent : afterNext,
      nextLW:    nextEvent.type === 'LW' ? nextEvent : afterNext,
      fmtTime:   fmtTime,
    };
  }

  var now    = new Date();
  var result = calcTides(now);

  var highEl = document.getElementById('high-tides');
  var lowEl  = document.getElementById('low-tides');
  var locEl  = document.getElementById('tide-location');

  if (highEl) highEl.textContent = result.fmtTime(result.nextHW.ms) + ' ~' + result.nextHW.height + 'm';
  if (lowEl)  lowEl.textContent  = result.fmtTime(result.nextLW.ms) + ' ~' + result.nextLW.height + 'm';
  if (locEl)  locEl.textContent  = 'Dublin Bay' + result.tideLabel + ' ' + (result.isRising ? '↑' : '↓');
}());
