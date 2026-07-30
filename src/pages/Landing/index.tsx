import React from "react";
import { Hero } from "./components/Hero";
import { AppPurpose } from "./components/AppPurpose";
import { Features } from "./components/Features";
import { SocialProof } from "./components/SocialProof";
import { HowItWorks } from "./components/HowItWorks";
import { CTA } from "./components/CTA";
import { SEO } from "../../components/seo/SEO";

export default function LandingPage() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Cally",
    "operatingSystem": "Web, All",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "1280"
    },
    "description": "Cally is an open calendar scheduling platform that connects with Google Calendar to read availability, eliminate double bookings, and automatically create scheduled meeting events."
  };

  return (
    <>
      <SEO
        title="Cally - Open Calendar & Scheduling Application"
        description="Cally is an automated scheduling application that syncs with Google Calendar to manage availability, prevent double bookings, and schedule meeting invitations directly onto your Google Calendar."
        canonicalUrl="https://cally.rupeshhh.in"
        jsonLd={softwareSchema}
      />
      <Hero />
      <AppPurpose />
      <Features />
      <SocialProof />
      <HowItWorks />
      <CTA />
    </>
  );
}
