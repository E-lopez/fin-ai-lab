const sortSection = (section: any) => {
  const r = Object.entries(section).sort((a, b) => {
    return Number(a[0].split(' ',1)[0]) - Number(b[0].split(' ',1)[0]);
  });
  return Object.fromEntries(r);
};

const sortAgreements = (agreements: any) => {
  return Object.keys(agreements).map((key) => {
    if (key!== 'summary' && key !== 'termsConditions' && key !== 'agreement') return null;
    const agreement = agreements[key];
    return { [key]: sortSection(agreement) };
  })
  .reduce((acc, curr) => {
    if (curr) {
      return { ...acc, ...curr };
    }
    return acc;
  }, {});
};

export default sortAgreements;