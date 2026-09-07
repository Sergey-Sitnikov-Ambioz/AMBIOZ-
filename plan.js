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


/* =================================
   PLAN
   ================================= */

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

  return AMBIOZ_PLANS[
    getAmbiozPlan()
  ];
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

  return getAmbiozPlanConfig()
    .appearanceCustomization;
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


/* =================================
   GENERATION USAGE
   ================================= */

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


  if (type === "content") {
    return config.contentGenerations;
  }


  if (type === "photo") {
    return config.photoGenerations;
  }


  if (type === "video") {
    return config.videoGenerations;
  }


  return 0;
}


function getGenerationUsage(type) {

  const usage =
    getUsage();


  if (type === "content") {
    return usage.contentGenerations;
  }


  if (type === "photo") {
    return usage.photoGenerations;
  }


  if (type === "video") {
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


  if (type === "content") {
    usage.contentGenerations++;
  }


  if (type === "photo") {
    usage.photoGenerations++;
  }


  if (type === "video") {
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


/* =================================
   AMBI VISUAL IDENTITY
   ================================= */

/*
 * IMPORTANT:
 *
 * This profile is created ONCE
 * and then reused.
 *
 * This prevents:
 *
 * Photo 1 → different person
 * Photo 2 → different person
 * Photo 3 → different person
 *
 * Instead:
 *
 * Ambi → one visual identity
 *       ↓
 *       all photos
 *       ↓
 *       future video
 */


/* =================================
   RANDOM HELPER
   ================================= */

function chooseRandom(array) {

  return array[
    Math.floor(
      Math.random() *
      array.length
    )
  ];
}


/* =================================
   AUTO APPEARANCE
   ================================= */

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
        "long straight hair",
        "long wavy hair",
        "shoulder-length hair",
        "short hair",
        "short textured hair",
        "curly hair"
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


/* =================================
   GET VISUAL IDENTITY
   ================================= */

function getAmbiVisualIdentity() {

  const saved =
    localStorage.getItem(
      "ambiVisualIdentity"
    );


  if (saved) {

    try {

      return JSON.parse(saved);

    } catch (error) {

      console.warn(
        "Invalid visual identity."
      );

    }

  }


  /*
   * Create it once.
   */

  const identity =
    createAutomaticAppearance();


  localStorage.setItem(
    "ambiVisualIdentity",
    JSON.stringify(identity)
  );


  return identity;
}


/* =================================
   SAVE VISUAL IDENTITY
   ================================= */

function saveAmbiVisualIdentity(identity) {

  if (!identity) {
    return false;
  }


  localStorage.setItem(
    "ambiVisualIdentity",
    JSON.stringify(identity)
  );


  return true;
}


/* =================================
   RESET VISUAL IDENTITY
   ================================= */

function resetAmbiVisualIdentity() {

  localStorage.removeItem(
    "ambiVisualIdentity"
  );

}


/* =================================
   BUILD VISUAL DESCRIPTION
   ================================= */

function getAmbiVisualDescription() {

  const visual =
    getAmbiVisualIdentity();


  const parts = [];


  if (visual.gender) {

    parts.push(
      `gender: ${visual.gender}`
    );

  }


  if (visual.ageRange) {

    parts.push(
      `age range: ${visual.ageRange}`
    );

  }


  if (visual.skinTone) {

    parts.push(
      `skin tone: ${visual.skinTone}`
    );

  }


  if (visual.hairColor) {

    parts.push(
      `hair color: ${visual.hairColor}`
    );

  }


  if (visual.hairStyle) {

    parts.push(
      `hair style: ${visual.hairStyle}`
    );

  }


  if (visual.eyeColor) {

    parts.push(
      `eye color: ${visual.eyeColor}`
    );

  }


  return parts.join(", ");
}
