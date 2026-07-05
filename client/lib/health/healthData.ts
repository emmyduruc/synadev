import type * as HealthKit from '@kingstinct/react-native-healthkit';
import { Platform } from 'react-native';
import type * as HealthConnect from 'react-native-health-connect';

import type { HealthRawMetric, HealthRawSnapshot } from '@/lib/health/types';

const LOOKBACK_DAYS = 14;
const IOS_SAMPLE_LIMIT = 20;
const ANDROID_RECORD_LIMIT = 20;

type HealthKitQuantityMetric = {
  key: string;
  identifier: HealthKit.QuantityTypeIdentifier;
  unit?: string;
  statistics: HealthKit.StatisticsOptions[];
};

type HealthKitCategoryMetric = {
  key: string;
  identifier: HealthKit.CategoryTypeIdentifier;
};

type HealthConnectMetric = {
  key: string;
  recordType: HealthConnect.RecordType;
};

const healthKitQuantityMetrics = [
  {
    key: 'steps',
    identifier: 'HKQuantityTypeIdentifierStepCount',
    unit: 'count',
    statistics: ['cumulativeSum'],
  },
  {
    key: 'heart_rate',
    identifier: 'HKQuantityTypeIdentifierHeartRate',
    unit: 'count/min',
    statistics: ['discreteAverage', 'discreteMin', 'discreteMax'],
  },
  {
    key: 'resting_heart_rate',
    identifier: 'HKQuantityTypeIdentifierRestingHeartRate',
    unit: 'count/min',
    statistics: ['discreteAverage', 'mostRecent'],
  },
  {
    key: 'hrv_sdnn',
    identifier: 'HKQuantityTypeIdentifierHeartRateVariabilitySDNN',
    unit: 'ms',
    statistics: ['discreteAverage', 'mostRecent'],
  },
  {
    key: 'respiratory_rate',
    identifier: 'HKQuantityTypeIdentifierRespiratoryRate',
    unit: 'count/min',
    statistics: ['discreteAverage', 'mostRecent'],
  },
  {
    key: 'oxygen_saturation',
    identifier: 'HKQuantityTypeIdentifierOxygenSaturation',
    unit: '%',
    statistics: ['discreteAverage', 'mostRecent'],
  },
  {
    key: 'wrist_temperature',
    identifier: 'HKQuantityTypeIdentifierAppleSleepingWristTemperature',
    unit: 'degC',
    statistics: ['discreteAverage', 'mostRecent'],
  },
  {
    key: 'active_energy',
    identifier: 'HKQuantityTypeIdentifierActiveEnergyBurned',
    unit: 'kcal',
    statistics: ['cumulativeSum'],
  },
  {
    key: 'exercise_minutes',
    identifier: 'HKQuantityTypeIdentifierAppleExerciseTime',
    unit: 'min',
    statistics: ['cumulativeSum'],
  },
] as const satisfies readonly HealthKitQuantityMetric[];

const healthKitCategoryMetrics = [
  {
    key: 'sleep_analysis',
    identifier: 'HKCategoryTypeIdentifierSleepAnalysis',
  },
] as const satisfies readonly HealthKitCategoryMetric[];

const healthConnectMetrics = [
  { key: 'steps', recordType: 'Steps' },
  { key: 'heart_rate', recordType: 'HeartRate' },
  { key: 'resting_heart_rate', recordType: 'RestingHeartRate' },
  { key: 'hrv_rmssd', recordType: 'HeartRateVariabilityRmssd' },
  { key: 'sleep_sessions', recordType: 'SleepSession' },
  { key: 'respiratory_rate', recordType: 'RespiratoryRate' },
  { key: 'oxygen_saturation', recordType: 'OxygenSaturation' },
  { key: 'body_temperature', recordType: 'BodyTemperature' },
  { key: 'active_calories', recordType: 'ActiveCaloriesBurned' },
] as const satisfies readonly HealthConnectMetric[];

const getDateRange = () => {
  const end = new Date();
  const start = new Date(end);
  start.setDate(end.getDate() - LOOKBACK_DAYS);

  return { start, end };
};

const toErrorMessage = (error_: unknown): string => {
  if (error_ instanceof Error) {
    return error_.message;
  }

  if (typeof error_ === 'object' && error_ !== null) {
    return JSON.stringify(error_);
  }

  if (typeof error_ === 'string') {
    return error_;
  }

  return 'Unknown health data error';
};

const filterAvailableQuantityMetrics = (
  healthKit: typeof HealthKit,
): HealthKitQuantityMetric[] =>
  healthKitQuantityMetrics.filter((metric) =>
    healthKit.isObjectTypeAvailable(metric.identifier),
  );

const filterAvailableCategoryMetrics = (
  healthKit: typeof HealthKit,
): HealthKitCategoryMetric[] =>
  healthKitCategoryMetrics.filter((metric) =>
    healthKit.isObjectTypeAvailable(metric.identifier),
  );

const readHealthKitQuantityMetric = async (
  healthKit: typeof HealthKit,
  metric: HealthKitQuantityMetric,
  start: Date,
  end: Date,
): Promise<HealthRawMetric> => {
  try {
    const filter = { date: { startDate: start, endDate: end } };
    const statistics = await healthKit.queryStatisticsForQuantity(
      metric.identifier,
      metric.statistics,
      { filter, unit: metric.unit },
    );
    const records = await healthKit.queryQuantitySamples(metric.identifier, {
      ascending: false,
      filter,
      limit: IOS_SAMPLE_LIMIT,
      unit: metric.unit,
    });

    return {
      key: metric.key,
      source: 'healthkit',
      records,
      statistics,
    };
  } catch (error_) {
    return {
      key: metric.key,
      source: 'healthkit',
      error: toErrorMessage(error_),
    };
  }
};

const readHealthKitCategoryMetric = async (
  healthKit: typeof HealthKit,
  metric: HealthKitCategoryMetric,
  start: Date,
  end: Date,
): Promise<HealthRawMetric> => {
  try {
    const records = await healthKit.queryCategorySamples(metric.identifier, {
      ascending: false,
      filter: { date: { startDate: start, endDate: end } },
      limit: IOS_SAMPLE_LIMIT,
    });

    return {
      key: metric.key,
      source: 'healthkit',
      records,
    };
  } catch (error_) {
    return {
      key: metric.key,
      source: 'healthkit',
      error: toErrorMessage(error_),
    };
  }
};

const readAppleHealthSnapshot = async (): Promise<HealthRawSnapshot> => {
  const { start, end } = getDateRange();
  const requestedAt = new Date().toISOString();
  const range = { start: start.toISOString(), end: end.toISOString() };

  try {
    const healthKit = await import('@kingstinct/react-native-healthkit');
    const isAvailable = await healthKit.isHealthDataAvailableAsync();

    if (!isAvailable) {
      return {
        platform: 'ios-healthkit',
        status: 'unavailable',
        requestedAt,
        range,
        metrics: [],
      };
    }

    const quantityMetricsToRead = filterAvailableQuantityMetrics(healthKit);
    const categoryMetricsToRead = filterAvailableCategoryMetrics(healthKit);
    const readTypes = [
      ...quantityMetricsToRead.map((metric) => metric.identifier),
      ...categoryMetricsToRead.map((metric) => metric.identifier),
    ];

    if (readTypes.length === 0) {
      return {
        platform: 'ios-healthkit',
        status: 'unavailable',
        requestedAt,
        range,
        metrics: [],
      };
    }

    // HealthKit crashes if you read a type that was not included in requestAuthorization.
    const permissions = await healthKit.requestAuthorization({ toRead: readTypes });

    const metrics: HealthRawMetric[] = [];

    for (const metric of quantityMetricsToRead) {
      metrics.push(await readHealthKitQuantityMetric(healthKit, metric, start, end));
    }

    for (const metric of categoryMetricsToRead) {
      metrics.push(await readHealthKitCategoryMetric(healthKit, metric, start, end));
    }

    return {
      platform: 'ios-healthkit',
      status: 'connected',
      requestedAt,
      range,
      permissions,
      metrics,
    };
  } catch (error_) {
    return {
      platform: 'ios-healthkit',
      status: 'error',
      requestedAt,
      range,
      metrics: [
        {
          key: 'healthkit',
          source: 'healthkit',
          error: toErrorMessage(error_),
        },
      ],
    };
  }
};

const readHealthConnectMetric = async (
  healthConnect: typeof HealthConnect,
  metric: HealthConnectMetric,
  start: Date,
  end: Date,
): Promise<HealthRawMetric> => {
  try {
    const records = await healthConnect.readRecords(metric.recordType, {
      ascendingOrder: false,
      pageSize: ANDROID_RECORD_LIMIT,
      timeRangeFilter: {
        operator: 'between',
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      },
    });

    return {
      key: metric.key,
      source: 'health-connect',
      records,
    };
  } catch (error_) {
    return {
      key: metric.key,
      source: 'health-connect',
      error: toErrorMessage(error_),
    };
  }
};

const readHealthConnectSnapshot = async (): Promise<HealthRawSnapshot> => {
  const { start, end } = getDateRange();
  const requestedAt = new Date().toISOString();
  const range = { start: start.toISOString(), end: end.toISOString() };

  try {
    const healthConnect = await import('react-native-health-connect');
    const initialized = await healthConnect.initialize();

    if (!initialized) {
      return {
        platform: 'android-health-connect',
        status: 'unavailable',
        requestedAt,
        range,
        metrics: [],
      };
    }

    const permissions = healthConnectMetrics.map<HealthConnect.Permission>((metric) => ({
      accessType: 'read',
      recordType: metric.recordType,
    }));
    const grantedPermissions = await healthConnect.requestPermission(permissions);
    const metrics: HealthRawMetric[] = [];

    for (const metric of healthConnectMetrics) {
      metrics.push(await readHealthConnectMetric(healthConnect, metric, start, end));
    }

    return {
      platform: 'android-health-connect',
      status: 'connected',
      requestedAt,
      range,
      permissions: grantedPermissions,
      metrics,
    };
  } catch (error_) {
    return {
      platform: 'android-health-connect',
      status: 'error',
      requestedAt,
      range,
      metrics: [
        {
          key: 'health_connect',
          source: 'health-connect',
          error: toErrorMessage(error_),
        },
      ],
    };
  }
};

export const readHealthSnapshot = async (): Promise<HealthRawSnapshot> => {
  if (Platform.OS === 'ios') {
    return readAppleHealthSnapshot();
  }

  if (Platform.OS === 'android') {
    return readHealthConnectSnapshot();
  }

  const { start, end } = getDateRange();

  return {
    platform: 'unsupported',
    status: 'unavailable',
    requestedAt: new Date().toISOString(),
    range: { start: start.toISOString(), end: end.toISOString() },
    metrics: [],
  };
};
