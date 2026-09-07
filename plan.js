const AMBIOZ_PLANS = {
  free: {
    name: "Free",

    maxAmbis: 1,

    appearanceCustomization: false,

    primaryLanguages: 1,
    additionalLanguages: 0,
    totalLanguages: 1,

    contentGenerations: 5,
    photoGenerations: 3,
    videoGenerations: 0
  },

  pro: {
    name: "Pro",

    maxAmbis: 2,

    appearanceCustomization: true,

    primaryLanguages: 1,
    additionalLanguages: 3,
    totalLanguages: 4,

    contentGenerations: 50,
    photoGenerations: 30,
    videoGenerations: 5
  },

  business: {
    name: "Business",

    maxAmbis: 5,

    appearanceCustomization: true,

    primaryLanguages: 1,
    additionalLanguages: 5,
    totalLanguages: 6,

    contentGenerations: 200,
    photoGenerations: 100,
    videoGenerations: 20
  }
};


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


function canCustomizeAppearance() {

  const config =
    getAmbiozPlanConfig();

  return config.appearanceCustomization;
}


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


/*
 * ================================
 * GENERATION USAGE
 * ================================
 */


function getUsage() {

  const saved =
    localStorage.getItem(
      "ambiozUsage"
    );

  if (saved) {

    try {

      return JSON.parse(saved);

    } catch (error) {

      console.warn(
        "Invalid Ambioz usage data."
      );

    }
  }


  return {
    contentGenerations: 0,
    photoGenerations: 0,
    videoGenerations: 0
  };
}


function saveUsage(usage) {

  localStorage.setItem(
    "ambiozUsage",
    JSON.stringify(usage)
  );
}


function getGenerationLimit(type) {

  const config =
    getAmbiozPlanConfig();

  if (
    type === "content"
  ) {
    return config.contentGenerations;
  }

  if (
    type === "photo"
  ) {
    return config.photoGenerations;
  }

  if (
    type === "video"
  ) {
    return config.videoGenerations;
  }

  return 0;
}


function getGenerationUsage(type) {

  const usage =
    getUsage();

  if (
    type === "content"
  ) {
    return usage.contentGenerations;
  }

  if (
    type === "photo"
  ) {
    return usage.photoGenerations;
  }

  if (
    type === "video"
  ) {
    return usage.videoGenerations;
  }

  return 0;
}


function canGenerate(type) {

  const limit =
    getGenerationLimit(type);

  const used =
    getGenerationUsage(type);

  return used < limit;
}


function useGeneration(type) {

  if (!canGenerate(type)) {
    return false;
  }

  const usage =
    getUsage();


  if (
    type === "content"
  ) {
    usage.contentGenerations++;
  }


  if (
    type === "photo"
  ) {
    usage.photoGenerations++;
  }


  if (
    type === "video"
  ) {
    usage.videoGenerations++;
  }


  saveUsage(usage);

  return true;
}


function getRemainingGenerations(type) {

  const limit =
    getGenerationLimit(type);

  const used =
    getGenerationUsage(type);

  return Math.max(
    0,
    limit - used
  );
}
