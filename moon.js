function updateMoonPhase() {
  const now = new Date();

  const knownNewMoon = new Date("2024-01-11T11:57:00Z");
  const lunarCycle = 29.53058867;

  const daysSince = (now - knownNewMoon) / (1000 * 60 * 60 * 24);

  const moonAge = daysSince % lunarCycle;

  let phase = "";
  let illumination = "";
  let energy = "";

  let shadow = document.getElementById("moon-shadow");

  if (moonAge < 1.84566) {
    phase = "New Moon";
    illumination = "0% Illuminated";
    energy = "Rest • Reflection";
    shadow.style.transform = "translateX(0%)";
  } else if (moonAge < 5.53699) {
    phase = "Waxing Crescent";
    illumination = "25% Illuminated";
    energy = "Intentions • Growth";
    shadow.style.transform = "translateX(-35%)";
  } else if (moonAge < 9.22831) {
    phase = "First Quarter";
    illumination = "50% Illuminated";
    energy = "Action • Momentum";
    shadow.style.transform = "translateX(-50%)";
  } else if (moonAge < 12.91963) {
    phase = "Waxing Gibbous";
    illumination = "75% Illuminated";
    energy = "Refinement • Preparation";
    shadow.style.transform = "translateX(-75%)";
  } else if (moonAge < 16.61096) {
    phase = "Full Moon";
    illumination = "100% Illuminated";
    energy = "Power • Manifestation";
    shadow.style.transform = "translateX(-100%)";
  } else if (moonAge < 20.30228) {
    phase = "Waning Gibbous";
    illumination = "75% Waning";
    energy = "Gratitude • Sharing";
    shadow.style.transform = "translateX(-75%)";
  } else if (moonAge < 23.99361) {
    phase = "Last Quarter";
    illumination = "50% Waning";
    energy = "Release • Letting Go";
    shadow.style.transform = "translateX(-50%)";
  } else if (moonAge < 27.68493) {
    phase = "Waning Crescent";
    illumination = "25% Waning";
    energy = "Healing • Surrender";
    shadow.style.transform = "translateX(-20%)";
  } else {
    phase = "New Moon";
    illumination = "0% Illuminated";
    energy = "Rest • Reflection";
    shadow.style.transform = "translateX(0%)";
  }

  const zodiacSigns = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ];

  const zodiacIndex = Math.floor((moonAge / lunarCycle) * 12);

  document.getElementById("today-moon-phase").textContent = phase;
  document.getElementById("moon-illumination").textContent = illumination;
  document.getElementById("moon-age").textContent =
    moonAge.toFixed(1) + " days";
  document.getElementById("moon-zodiac").textContent = zodiacSigns[zodiacIndex];
  document.getElementById("moon-energy").textContent = energy;
}

updateMoonPhase();