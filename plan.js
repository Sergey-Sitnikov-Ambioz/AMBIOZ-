/*
 * ============================================================
 * AMBIOZ PLAN & USAGE SYSTEM
 * ============================================================
 *
 * FREE
 * - 1 Ambi
 * - 1 primary language
 * - 0 additional languages
 * - automatic appearance
 * - 5 AI content generations / month
 * - 10 photo generations / month
 * - 0 video generations
 *
 * PRO
 * - up to 2 Ambis
 * - 1 primary + 3 additional languages
 * - appearance customization
 * - 50 AI content generations / month
 * - unlimited photo generation*
 * - 5 video generations / month
 *
 * BUSINESS
 * - up to 5 Ambis
 * - 1 primary + 5 additional languages
 * - appearance customization
 * - 200 AI content generations / month
 * - unlimited photo generation*
 * - 20 video generations / month
 *
 * * subject to fair use and provider availability
 */


/* ============================================================
   PLANS
   ============================================================ */

const AMBIOZ_PLANS = {

  free: {
    name: "Free",

    maxAmbis: 1,

    primaryLanguages: 1,
    additionalLanguages: 0,
    totalLanguages: 1,

    appearanceCustomization: false,

    contentGenerations: 5,
    photoGenerations: 10,
    videoGenerations: 0,

    imageProvider: "free",
    videoProvider: "none"
  },


  pro: {
    name: "Pro",

    maxAmbis: 2,

    primaryLanguages: 1,
    additionalLanguages: 3,
    totalLanguages: 4,

    appearanceCustomization: true,

    contentGenerations: 50,
    photoGenerations: Infinity,
    videoGenerations: 5,

    imageProvider: "paid",
    videoProvider: "paid"
  },


  business: {
    name: "Business",

    maxAmbis: 5,

    primaryLanguages: 1,
    additionalLanguages: 5,
    totalLanguages: 6,

    appearanceCustomization: true,

    contentGenerations: 200,
    photoGenerations: Infinity,
    videoGenerations: 20,

    imageProvider: "paid",
    videoProvider: "paid"
  }

};


/* ============================================================
   CURRENT PLAN
   ============================================================ */

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


function setAmbiozPlan(plan) {

  if (
    !AMBIOZ_PLANS[plan]
  ) {
    return false;
  }

  localStorage.setItem(
    "ambiozPlan",
    plan
  );

  return true;
}


function getAmbiozPlanConfig() {

  return AMBIOZ_PLANS[
    getAmbiozPlan()
  ];

}


/* ============================================================
   PLAN HELPERS
   ============================================================ */

function canCustomizeAppearance() {

  return getAmbiozPlanConfig()
    .appearanceCustomization === true;

}


function canAddAdditionalLanguages() {

  return (
    getAmbiozPlanConfig()
      .additionalLanguages > 0
  );

}


function canCreateAnotherAmbi(
  currentCount
) {

  return (
    currentCount <
    getAmbiozPlanConfig()
      .maxAmbis
  );

}


/* ============================================================
   USAGE STORAGE
   ============================================================ */

function getUsageKey() {

  const now = new Date();

  return [
    now.getFullYear(),
    String(
      now.getMonth() + 1
    ).padStart(2, "0")
  ].join("-");

}


function getUsage() {

  const currentMonth =
    getUsageKey();

  let usage = null;

  try {

    usage =
      JSON.parse(
        localStorage.getItem(
          "ambiozUsage"
        )
      );

  } catch (error) {

    usage = null;

  }


  if (
    !usage ||
    usage.month !== currentMonth
  ) {

    usage = {

      month: currentMonth,

      content: 0,
      photo: 0,
      video: 0

    };


    localStorage.setItem(
      "ambiozUsage",
      JSON.stringify(usage)
    );

  }


  return usage;

}


function saveUsage(usage) {

  localStorage.setItem(
    "ambiozUsage",
    JSON.stringify(usage)
  );

}


/* ============================================================
   GENERATION LIMITS
   ============================================================ */

function getGenerationLimit(
  type
) {

  const plan =
    getAmbiozPlanConfig();


  if (type === "content") {

    return plan.contentGenerations;

  }


  if (type === "photo") {

    return plan.photoGenerations;

  }


  if (type === "video") {

    return plan.videoGenerations;

  }


  return 0;

}


/* ============================================================
   GENERATION USAGE
   ============================================================ */

function getGenerationUsage(
  type
) {

  const usage =
    getUsage();

  return usage[type] || 0;

}


/* ============================================================
   CAN GENERATE
   ============================================================ */

function canGenerate(
  type
) {

  const limit =
    getGenerationLimit(type);


  /*
   * Infinity = unlimited.
   */

  if (limit === Infinity) {

    return true;

  }


  const used =
    getGenerationUsage(type);


  return used < limit;

}


/* ============================================================
   USE GENERATION
   ============================================================ */

function useGeneration(
  type
) {

  /*
   * Never increase usage if the
   * plan has no available generation.
   */

  if (
    !canGenerate(type)
  ) {

    return false;

  }


  const usage =
    getUsage();


  usage[type] =
    (usage[type] || 0) + 1;


  saveUsage(usage);

  return true;

}


/* ============================================================
   REMAINING GENERATIONS
   ============================================================ */

function getRemainingGenerations(
  type
) {

  const limit =
    getGenerationLimit(type);


  if (limit === Infinity) {

    return Infinity;

  }


  const used =
    getGenerationUsage(type);


  return Math.max(
    0,
    limit - used
  );

}


/* ============================================================
   IMAGE PROVIDER
   ============================================================ */

function getImageProvider() {

  const plan =
    getAmbiozPlanConfig();


  /*
   * Free:
   * free ZeroGPU provider
   *
   * Pro / Business:
   * paid provider
   *
   * The paid provider will be
   * connected later.
   */

  return plan.imageProvider;

}


/* ============================================================
   VIDEO PROVIDER
   ============================================================ */

function getVideoProvider() {

  const plan =
    getAmbiozPlanConfig();

  return plan.videoProvider;

}


/* ============================================================
   VISUAL IDENTITY
   ============================================================ */

function chooseRandom(
  array
) {

  return array[
    Math.floor(
      Math.random() *
      array.length
    )
  ];

}


function createAutomaticAppearance() {

  return {

    gender:
      chooseRandom([
        "female",
        "male"
      ]),

    ageRange:
      chooseRandom([
        "20s",
        "30s",
        "30s",
        "30s",
        "40s"
      ]),

    skinTone:
      chooseRandom([
        "fair",
        "light",
        "medium",
        "tan",
        "deep"
      ]),

    hairColor:
      chooseRandom([
        "black",
        "dark brown",
        "brown",
        "light brown",
        "blonde"
      ]),

    hairStyle:
      chooseRandom([
        "long straight",
        "long wavy",
        "shoulder-length",
        "short",
        "short textured",
        "curly"
      ]),

    eyeColor:
      chooseRandom([
        "brown",
        "dark brown",
        "hazel",
        "green",
        "blue",
        "gray"
      ])

  };

}


function getAmbiVisualIdentity() {

  let identity = null;


  try {

    identity =
      JSON.parse(
        localStorage.getItem(
          "ambiVisualIdentity"
        )
      );

  } catch (error) {

    identity = null;

  }


  /*
   * Create the identity only once.
   * This makes Ambi visually consistent
   * across future generated images.
   */

  if (
    !identity ||
    typeof identity !== "object"
  ) {

    identity =
      createAutomaticAppearance();


    localStorage.setItem(
      "ambiVisualIdentity",
      JSON.stringify(identity)
    );

  }


  return identity;

}


function saveAmbiVisualIdentity(
  identity
) {

  if (
    !identity ||
    typeof identity !== "object"
  ) {

    return false;

  }


  localStorage.setItem(
    "ambiVisualIdentity",
    JSON.stringify(identity)
  );


  return true;

}


function resetAmbiVisualIdentity() {

  localStorage.removeItem(
    "ambiVisualIdentity"
  );

}


/* ============================================================
   VISUAL IDENTITY DESCRIPTION
   ============================================================ */

function getAmbiVisualDescription() {

  const identity =
    getAmbiVisualIdentity();


  return [
    identity.gender,
    identity.ageRange,
    `${identity.skinTone} skin`,
    `${identity.hairColor} hair`,
    `${identity.hairStyle} hairstyle`,
    `${identity.eyeColor} eyes`
  ].join(", ");

}


/* ============================================================
   FAIR USE
   ============================================================
 *
 * Paid plans display "Unlimited" to the customer,
 * but the system keeps the provider layer separate.
 *
 * This allows AMBIOZ to introduce fair-use protection
 * later without changing the public tariff structure.
 */

function isUnlimitedGeneration(
  type
) {

  return (
    getGenerationLimit(type) ===
    Infinity
  );

}


/* ============================================================
   EXPORT TO WINDOW
   ============================================================ */

window.AMBIOZ_PLANS =
  AMBIOZ_PLANS;

window.getAmbiozPlan =
  getAmbiozPlan;

window.setAmbiozPlan =
  setAmbiozPlan;

window.getAmbiozPlanConfig =
  getAmbiozPlanConfig;

window.canCustomizeAppearance =
  canCustomizeAppearance;

window.canAddAdditionalLanguages =
  canAddAdditionalLanguages;

window.canCreateAnotherAmbi =
  canCreateAnotherAmbi;

window.getGenerationLimit =
  getGenerationLimit;

window.getGenerationUsage =
  getGenerationUsage;

window.canGenerate =
  canGenerate;

window.useGeneration =
  useGeneration;

window.getRemainingGenerations =
  getRemainingGenerations;

window.getImageProvider =
  getImageProvider;

window.getVideoProvider =
  getVideoProvider;

window.chooseRandom =
  chooseRandom;

window.createAutomaticAppearance =
  createAutomaticAppearance;

window.getAmbiVisualIdentity =
  getAmbiVisualIdentity;

window.saveAmbiVisualIdentity =
  saveAmbiVisualIdentity;

window.resetAmbiVisualIdentity =
  resetAmbiVisualIdentity;

window.getAmbiVisualDescription =
  getAmbiVisualDescription;

window.isUnlimitedGeneration =
  isUnlimitedGeneration;
