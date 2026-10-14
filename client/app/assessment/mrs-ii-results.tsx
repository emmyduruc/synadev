import type { MrsIiAssessmentSubmission } from '@syna/shared-types';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { BackHandler } from 'react-native';

import { MascotLoadingGate } from '@/components/loading/MascotLoadingGate';
import { MrsIiResultsView } from '@/components/mrs/MrsIiResultsView';
import { useLatestMrsIiAssessment } from '@/hooks/useLatestMrsIiAssessment';
import { LOADING_VARIANT } from '@/lib/loading/loadingVariants';
import { MRS_II_ASSESSMENT_ID, MRS_II_TIMEPOINT } from '@/lib/mrs/mrsIiTypes';
import { HOME_OPEN } from '@/lib/navigation/homeOpenParams';
import { ROUTES } from '@/lib/routes';

/**
 * MRS-II results after completion (or when reopened from profile).
 * Optional `total` / `somatic` / `psychological` / `urogenital` params seed the
 * view immediately after submit before the latest query settles.
 */
const MrsIiResultsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    total?: string;
    somatic?: string;
    psychological?: string;
    urogenital?: string;
  }>();
  const { submission: latestSubmission, isLoading } = useLatestMrsIiAssessment();

  const seededSubmission = useMemo((): MrsIiAssessmentSubmission | null => {
    const total = Number(params.total);
    const somatic = Number(params.somatic);
    const psychological = Number(params.psychological);
    const urogenital = Number(params.urogenital);

    if (
      !Number.isFinite(total) ||
      !Number.isFinite(somatic) ||
      !Number.isFinite(psychological) ||
      !Number.isFinite(urogenital)
    ) {
      return null;
    }

    return {
      id: '00000000-0000-4000-8000-000000000000',
      assessmentId: MRS_II_ASSESSMENT_ID.baseline,
      timepoint: MRS_II_TIMEPOINT.t0,
      answers: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      total,
      subscores: { somatic, psychological, urogenital },
      completedAt: new Date().toISOString(),
    };
  }, [params.psychological, params.somatic, params.total, params.urogenital]);

  const submission = latestSubmission ?? seededSubmission;

  const leaveResults = useCallback((href: Parameters<typeof router.replace>[0]) => {
    if (router.canDismiss()) {
      router.dismissAll();
    }

    router.replace(href);
  }, [router]);

  const handleClose = useCallback(() => {
    leaveResults(ROUTES.tabs.start);
  }, [leaveResults]);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        handleClose();
        return true;
      });

      return () => subscription.remove();
    }, [handleClose]),
  );

  const openHomeSheet = useCallback(
    (open: (typeof HOME_OPEN)[keyof typeof HOME_OPEN]) => {
      leaveResults({
        pathname: ROUTES.tabs.start,
        params: { open },
      });
    },
    [leaveResults],
  );

  return (
    <MascotLoadingGate
      enabled
      variant={LOADING_VARIANT.symptoms}
      isReady={!isLoading || submission !== null}>
      {submission ? (
        <MrsIiResultsView
          submission={submission}
          onClose={handleClose}
          onAddEntry={() => {
            leaveResults(ROUTES.symptoms);
          }}
          onAddDoctorQuestion={() => {
            openHomeSheet(HOME_OPEN.doctorQuestions);
          }}
          onEnterAppointment={() => {
            openHomeSheet(HOME_OPEN.appointment);
          }}
        />
      ) : null}
    </MascotLoadingGate>
  );
};

export default MrsIiResultsScreen;
