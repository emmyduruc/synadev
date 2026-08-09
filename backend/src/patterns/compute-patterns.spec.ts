import {
  computePatterns,
  PATTERN_CONTEXT_ID,
  PATTERN_STATUS,
} from '@syna/shared-utils';

describe('computePatterns', () => {
  it('locks hydration context and marks insufficient data as needs_more_data', () => {
    const result = computePatterns({
      asOfDateKey: '2026-07-18',
      periodDateKeys: [],
      symptomsByDate: new Map(),
      moodsByDate: new Map(),
      healthByDate: new Map(),
    });

    expect(result.isDiagnostic).toBe(false);
    expect(result.contexts).toHaveLength(5);

    const hydration = result.contexts.find(
      (context) => context.id === PATTERN_CONTEXT_ID.hydrationBrainFog,
    );
    expect(hydration?.status).toBe(PATTERN_STATUS.locked);

    const sleepHeat = result.contexts.find(
      (context) => context.id === PATTERN_CONTEXT_ID.sleepHeat,
    );
    expect(sleepHeat?.status).toBe(PATTERN_STATUS.needsMoreData);
    expect(result.heatmap.isEmpty).toBe(true);
  });

  it('recognizes stress and energy inverse correlation with enough overlap', () => {
    const moodsByDate = new Map();

    for (let day = 1; day <= 14; day += 1) {
      const dateKey = `2026-07-${String(day).padStart(2, '0')}`;
      moodsByDate.set(dateKey, {
        dateKey,
        stress: day,
        energy: 15 - day,
        isChallenging: day > 10,
      });
    }

    const result = computePatterns({
      asOfDateKey: '2026-07-18',
      periodDateKeys: [],
      symptomsByDate: new Map(),
      moodsByDate,
      healthByDate: new Map(),
    });

    const stressEnergy = result.contexts.find(
      (context) => context.id === PATTERN_CONTEXT_ID.stressEnergy,
    );

    expect(stressEnergy).toBeDefined();
    expect(stressEnergy?.supportingDayCount).toBeGreaterThanOrEqual(7);
    expect(stressEnergy?.status).toBe(PATTERN_STATUS.recognized);
    expect(stressEnergy?.strength).toBeGreaterThan(0.5);
  });
});
