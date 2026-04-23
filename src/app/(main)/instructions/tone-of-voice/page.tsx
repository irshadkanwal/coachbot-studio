import ComingSoon from '@/shared/CoomingSoon';

export default async function StylesPage() {
  return (
    <>
      <ComingSoon />
      <p className="text-eventlty text-base text-light-gray">
        We are working on an upcoming update that will replicate the style and approach of a coach, enhancing the user
        experience and offering more personalized guidance.
      </p>
      {/* <StylesInstructions styles$={styles} /> */}
      {/* <Tips titleKey="Instructions.Styles.tipsTitle" tipsKey="Instructions.Styles.tipsGuide" t={t} /> */}
    </>
  );
}
