// [PHASE 1] Client-Side Config for AHI Governance
// This file is loaded by legacy scripts and Next.js public assets

export const FIREBASE_CONFIG = {
    apiKey: "AIzaSyA9JntJ1iNOdC7jR9um8_6L1VYJOb1T3ns",
    authDomain: "cs-poc-aguy0wkzgf55jarewtxljk9.firebaseapp.com",
    projectId: "cs-poc-aguy0wkzgf55jarewtxljk9",
    storageBucket: "cs-poc-aguy0wkzgf55jarewtxljk9.firebasestorage.app",
    messagingSenderId: "831861990394",
    appId: "1:831861990394:web:a355c461539d163f96ba43",
    measurementId: "G-C6H6QR5KV1"
};

const region = 'us-central1';
export const ALPHA_ENDPOINT = `/api/${region}/ahi_governance_service`;
export const GEOMETRY_ENDPOINT = `/api/geometry`; // Rewritten via next.config.ts if needed

export const DEPLOYMENT_TIER = "production";
export const ARCHITECT_SIGNATURE = "0.842";
