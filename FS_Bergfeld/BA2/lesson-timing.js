/*
  Lesson timing utilities for Beobachtungsassistent Tiefenstruktur.
  No UI: these functions only enrich observations with a relative time dimension.
*/

(function attachLessonTiming(root) {
  const LESSON_DURATION_PRESETS = [45, 60, 90];

  function createLessonTiming(config = {}) {
    const startTime = toDate(config.startTime ?? new Date());
    const durationMinutes = normalizeDuration(config.durationMinutes ?? config.duration ?? 45);
    return {
      id: config.id ?? `lesson-${startTime.getTime()}`,
      startTime: startTime.toISOString(),
      durationMinutes,
      createdAt: new Date().toISOString()
    };
  }

  function normalizeDuration(value) {
    const duration = Number(value);
    if (!Number.isFinite(duration) || duration <= 0) {
      return 45;
    }
    return Math.max(5, Math.min(240, Math.round(duration)));
  }

  function toDate(value) {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
      return new Date();
    }
    return date;
  }

  function getMinuteInLesson(timestamp, timing) {
    if (!timing?.startTime) {
      return null;
    }
    const start = toDate(timing.startTime).getTime();
    const current = toDate(timestamp ?? new Date()).getTime();
    return Math.round((current - start) / 60000);
  }

  function getLessonWindow(minuteInLesson, durationMinutes = 45) {
    if (minuteInLesson === null || minuteInLesson === undefined || minuteInLesson === "" || !Number.isFinite(Number(minuteInLesson))) {
      return "ohne Zeitbezug";
    }
    const minute = Number(minuteInLesson);
    const duration = normalizeDuration(durationMinutes);
    if (minute < 0) return "vor Stundenbeginn";
    if (minute > duration) return "nach Stundenende";
    const ratio = duration === 0 ? 0 : minute / duration;
    if (ratio <= 0.12) return "Anfang";
    if (ratio <= 0.35) return "frühe Erarbeitung";
    if (ratio <= 0.65) return "Mitte";
    if (ratio <= 0.85) return "späte Erarbeitung";
    return "Sicherung/Ende";
  }

  function enrichObservationWithTiming(observation, timing) {
    const timestamp = observation.timestamp ?? new Date().toISOString();
    const minuteInLesson = Number.isFinite(Number(observation.minuteInLesson))
      ? Number(observation.minuteInLesson)
      : getMinuteInLesson(timestamp, timing);
    return {
      ...observation,
      timestamp,
      minuteInLesson,
      lessonWindow: getLessonWindow(minuteInLesson, timing?.durationMinutes)
    };
  }

  function summarizeTiming(observations, timing) {
    const duration = timing?.durationMinutes ?? 45;
    const windows = new Map();
    const phases = new Map();
    observations.forEach((observation) => {
      const enriched = enrichObservationWithTiming(observation, timing);
      addCount(windows, enriched.lessonWindow);
      addCount(phases, enriched.phase ?? "ohne Phase");
    });
    return {
      durationMinutes: normalizeDuration(duration),
      windows: Array.from(windows, ([label, count]) => ({ label, count })),
      phases: Array.from(phases, ([label, count]) => ({ label, count }))
    };
  }

  function getTemporalPattern(observations, timing) {
    const enriched = observations
      .map((observation) => enrichObservationWithTiming(observation, timing))
      .filter((observation) => Number.isFinite(Number(observation.minuteInLesson)));
    if (!enriched.length) {
      return { label: "ohne Zeitmuster", spread: 0, windows: [] };
    }
    const minutes = enriched.map((observation) => observation.minuteInLesson).sort((a, b) => a - b);
    const spread = minutes[minutes.length - 1] - minutes[0];
    const windows = [...new Set(enriched.map((observation) => observation.lessonWindow))];
    if (windows.length >= 3 || spread >= Math.max(18, (timing?.durationMinutes ?? 45) * 0.35)) {
      return { label: "wiederkehrend über die Stunde", spread, windows };
    }
    if (windows.length === 1) {
      return { label: `gebündelt: ${windows[0]}`, spread, windows };
    }
    return { label: "in benachbarten Phasen", spread, windows };
  }

  function addCount(map, key) {
    map.set(key, (map.get(key) ?? 0) + 1);
  }

  function runLessonTimingTests() {
    const timing = createLessonTiming({ startTime: "2026-05-13T08:00:00.000Z", durationMinutes: 45 });
    const observations = [
      { timestamp: "2026-05-13T08:02:00.000Z", phase: "Einstieg" },
      { timestamp: "2026-05-13T08:16:00.000Z", phase: "Arbeitsphase" },
      { timestamp: "2026-05-13T08:39:00.000Z", phase: "Sicherung" }
    ].map((observation) => enrichObservationWithTiming(observation, timing));
    return {
      timing,
      observations,
      summary: summarizeTiming(observations, timing),
      temporalPattern: getTemporalPattern(observations, timing)
    };
  }

  root.LESSON_DURATION_PRESETS = LESSON_DURATION_PRESETS;
  root.createLessonTiming = createLessonTiming;
  root.getMinuteInLesson = getMinuteInLesson;
  root.getLessonWindow = getLessonWindow;
  root.enrichObservationWithTiming = enrichObservationWithTiming;
  root.summarizeTiming = summarizeTiming;
  root.getTemporalPattern = getTemporalPattern;
  root.runLessonTimingTests = runLessonTimingTests;

  if (typeof module !== "undefined") {
    module.exports = {
      LESSON_DURATION_PRESETS,
      createLessonTiming,
      getMinuteInLesson,
      getLessonWindow,
      enrichObservationWithTiming,
      summarizeTiming,
      getTemporalPattern,
      runLessonTimingTests
    };
  }
})(typeof window !== "undefined" ? window : globalThis);
