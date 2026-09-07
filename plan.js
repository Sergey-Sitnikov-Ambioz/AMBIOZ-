const AMBIOZ_PLANS = {
  free: {
    name: "Free",

    maxAmbis: 1,

    appearanceCustomization: false,

    primaryLanguages: 1,

    additionalLanguages: 0,

    totalLanguages: 1
  },

  pro: {
    name: "Pro",

    maxAmbis: 2,

    appearanceCustomization: true,

    primaryLanguages: 1,

    additionalLanguages: 3,

    totalLanguages: 4
  },

  business: {
    name: "Business",

    maxAmbis: 5,

    appearanceCustomization: true,

    primaryLanguages: 1,

    additionalLanguages: 5,

    totalLanguages: 6
  }
};


/*
  Current test plan.

  Change this value manually while testing:

  "free"
  "pro"
  "business"
*/

function getAmbiozPlan() {

  const savedPlan =
    localStorage.getItem("ambiozPlan");

  if (
    savedPlan &&
    AMBIOZ_PLANS[savedPlan]
  ) {
    return savedPlan;
  }

  return "free";
}


function getAmbiozPlanConfig() {

  const plan =
    getAmbiozPlan();

  return AMBIOZ_PLANS[plan];

}


function setAmbiozPlan(plan) {

  if (!AMBIOZ_PLANS[plan]) {
    return false;
  }

  localStorage.setItem(
    "ambiozPlan",
    plan
  );

  return true;
}


/*
  Check whether the current plan
  allows appearance customization.
*/

function canCustomizeAppearance() {

  const config =
    getAmbiozPlanConfig();

  return config.appearanceCustomization;

}


/*
  Check additional language limit.
*/

function canAddAdditionalLanguages(
  currentAdditionalLanguages
) {

  const config =
    getAmbiozPlanConfig();

  return (
    currentAdditionalLanguages <
    config.additionalLanguages
  );

}


/*
  Check Ambi limit.
*/

function canCreateAnotherAmbi(
  currentAmbiCount
) {

  const config =
    getAmbiozPlanConfig();

  return (
    currentAmbiCount <
    config.maxAmbis
  );

}
