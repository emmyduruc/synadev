import { useCallback, useState } from 'react';

import { ProfileBodyEditForm } from '@/components/profile/ProfileBodyEditForm';
import { ProfileHeartRiskEditForm } from '@/components/profile/ProfileHeartRiskEditForm';
import { ProfileLifestyleEditForm } from '@/components/profile/ProfileLifestyleEditForm';
import { ProfileMenopauseEditForm } from '@/components/profile/ProfileMenopauseEditForm';
import { ProfilePersonalEditForm } from '@/components/profile/ProfilePersonalEditForm';
import { ProfilePersonalSectionCard } from '@/components/profile/ProfilePersonalSectionCard';
import { ProfileSettingsBodyCard } from '@/components/profile/ProfileSettingsBodyCard';
import { ProfileSettingsEditSheet } from '@/components/profile/ProfileSettingsEditSheet';
import { ProfileSettingsHeartRiskCard } from '@/components/profile/ProfileSettingsHeartRiskCard';
import { ProfileSettingsLifestyleCard } from '@/components/profile/ProfileSettingsLifestyleCard';
import { ProfileSettingsMenopauseCard } from '@/components/profile/ProfileSettingsMenopauseCard';
import { Box } from '@/components/ui/Box';
import { useBioData } from '@/hooks/useBioData';
import { useProfileSettings } from '@/hooks/useProfileSettings';
import { useTranslate } from '@/hooks/useTranslate';
import type { BioData } from '@/lib/profile/bioDataStorage';
import {
  PROFILE_SETTINGS_SECTION,
  type ProfileSettingsSectionId,
} from '@/lib/profile/profileSettingsCatalog';
import type {
  ProfileSettingsBodyData,
  ProfileSettingsHeartRiskData,
  ProfileSettingsLifestyleData,
  ProfileSettingsMenopauseData,
  ProfileSettingsPersonalExtras,
} from '@/lib/profile/profileSettingsTypes';
import { toast } from '@/lib/sonner';

const SECTION_TITLE_KEYS: Record<ProfileSettingsSectionId, string> = {
  [PROFILE_SETTINGS_SECTION.personal]: 'profile_personal_section_label',
  [PROFILE_SETTINGS_SECTION.menopause]: 'profile_settings_menopause_section_label',
  [PROFILE_SETTINGS_SECTION.body]: 'profile_settings_body_section_label',
  [PROFILE_SETTINGS_SECTION.heartRisk]: 'profile_settings_heart_risk_section_label',
  [PROFILE_SETTINGS_SECTION.lifestyle]: 'profile_settings_lifestyle_section_label',
};

export const ProfileSettingsContent = () => {
  const { t } = useTranslate();
  const { bioData, persist: persistBio } = useBioData();
  const {
    data,
    saveMenopause,
    saveBody,
    saveHeartRisk,
    saveLifestyle,
    savePersonalExtras,
  } = useProfileSettings();

  const [activeSection, setActiveSection] = useState<ProfileSettingsSectionId | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [menopauseDraft, setMenopauseDraft] = useState<ProfileSettingsMenopauseData>(data.menopause);
  const [bodyDraft, setBodyDraft] = useState<ProfileSettingsBodyData>(data.body);
  const [heartDraft, setHeartDraft] = useState<ProfileSettingsHeartRiskData>(data.heartRisk);
  const [lifestyleDraft, setLifestyleDraft] = useState<ProfileSettingsLifestyleData>(data.lifestyle);
  const [personalExtrasDraft, setPersonalExtrasDraft] = useState<ProfileSettingsPersonalExtras>(
    data.personal,
  );
  const [bioDraft, setBioDraft] = useState<Pick<BioData, 'firstName' | 'lastName' | 'dateOfBirth'>>({
    firstName: bioData.firstName,
    lastName: bioData.lastName,
    dateOfBirth: bioData.dateOfBirth,
  });

  const openSection = useCallback(
    (section: ProfileSettingsSectionId) => {
      setMenopauseDraft(data.menopause);
      setBodyDraft(data.body);
      setHeartDraft(data.heartRisk);
      setLifestyleDraft(data.lifestyle);
      setPersonalExtrasDraft(data.personal);
      setBioDraft({
        firstName: bioData.firstName,
        lastName: bioData.lastName,
        dateOfBirth: bioData.dateOfBirth,
      });
      setActiveSection(section);
    },
    [bioData.dateOfBirth, bioData.firstName, bioData.lastName, data],
  );

  const closeSheet = useCallback(() => {
    setActiveSection(null);
  }, []);

  const handleSave = useCallback(async () => {
    if (!activeSection) {
      return;
    }

    setIsSaving(true);

    try {
      if (activeSection === PROFILE_SETTINGS_SECTION.menopause) {
        await saveMenopause(menopauseDraft);
      } else if (activeSection === PROFILE_SETTINGS_SECTION.body) {
        await saveBody(bodyDraft);
      } else if (activeSection === PROFILE_SETTINGS_SECTION.heartRisk) {
        await saveHeartRisk(heartDraft);
      } else if (activeSection === PROFILE_SETTINGS_SECTION.lifestyle) {
        await saveLifestyle(lifestyleDraft);
      } else if (activeSection === PROFILE_SETTINGS_SECTION.personal) {
        await persistBio({
          ...bioData,
          firstName: bioDraft.firstName.trim(),
          lastName: bioDraft.lastName.trim(),
          dateOfBirth: bioDraft.dateOfBirth,
        });
        await savePersonalExtras(personalExtrasDraft);
      }

      toast.success(t('profile_settings_save_success'));
      closeSheet();
    } catch {
      toast.error(t('profile_settings_save_error'));
    } finally {
      setIsSaving(false);
    }
  }, [
    activeSection,
    bioData,
    bioDraft,
    bodyDraft,
    closeSheet,
    heartDraft,
    lifestyleDraft,
    menopauseDraft,
    persistBio,
    personalExtrasDraft,
    saveBody,
    saveHeartRisk,
    saveLifestyle,
    saveMenopause,
    savePersonalExtras,
    t,
  ]);

  const sectionLabel = activeSection
    ? t(SECTION_TITLE_KEYS[activeSection])
    : undefined;

  return (
    <>
      <Box gap="md">
        <ProfileSettingsMenopauseCard
          data={data.menopause}
          onEditPress={() => openSection(PROFILE_SETTINGS_SECTION.menopause)}
        />
        <ProfileSettingsBodyCard
          data={data.body}
          onEditPress={() => openSection(PROFILE_SETTINGS_SECTION.body)}
        />
        <ProfileSettingsHeartRiskCard
          data={data.heartRisk}
          onEditPress={() => openSection(PROFILE_SETTINGS_SECTION.heartRisk)}
        />
        <ProfileSettingsLifestyleCard
          data={data.lifestyle}
          onEditPress={() => openSection(PROFILE_SETTINGS_SECTION.lifestyle)}
        />
        <ProfilePersonalSectionCard
          origin={data.personal.origin}
          onEditPress={() => openSection(PROFILE_SETTINGS_SECTION.personal)}
        />
      </Box>

      <ProfileSettingsEditSheet
        visible={activeSection !== null}
        title={t('profile_settings_edit_title')}
        sectionLabel={sectionLabel}
        onCancel={closeSheet}
        onSave={() => {
          void handleSave();
        }}
        isSaving={isSaving}>
        {activeSection === PROFILE_SETTINGS_SECTION.menopause ? (
          <ProfileMenopauseEditForm value={menopauseDraft} onChange={setMenopauseDraft} />
        ) : null}
        {activeSection === PROFILE_SETTINGS_SECTION.body ? (
          <ProfileBodyEditForm value={bodyDraft} onChange={setBodyDraft} />
        ) : null}
        {activeSection === PROFILE_SETTINGS_SECTION.heartRisk ? (
          <ProfileHeartRiskEditForm value={heartDraft} onChange={setHeartDraft} />
        ) : null}
        {activeSection === PROFILE_SETTINGS_SECTION.lifestyle ? (
          <ProfileLifestyleEditForm value={lifestyleDraft} onChange={setLifestyleDraft} />
        ) : null}
        {activeSection === PROFILE_SETTINGS_SECTION.personal ? (
          <ProfilePersonalEditForm
            firstName={bioDraft.firstName}
            lastName={bioDraft.lastName}
            dateOfBirth={bioDraft.dateOfBirth}
            origin={personalExtrasDraft.origin}
            onChangeBio={(patch) => setBioDraft((previous) => ({ ...previous, ...patch }))}
            onChangeOrigin={(origin) =>
              setPersonalExtrasDraft((previous) => ({ ...previous, origin }))
            }
          />
        ) : null}
      </ProfileSettingsEditSheet>
    </>
  );
};
