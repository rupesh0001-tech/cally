import React from "react";
import { Hero } from "./components/Hero";
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
    "description": "Cally is an open-source calendar scheduling platform that ends back-and-forth emails. Share booking links and sync Google, Outlook, and iCloud calendars."
  };

  return (
    <>
      <SEO
        title="Cally - Open Scheduling Infrastructure for Everyone"
        description="Meet Cally — the open scheduling tool that ends back-and-forth emails. Share one customizable link, let clients book time that works, and sync calendars effortlessly."
        canonicalUrl="https://cally.com"
        jsonLd={softwareSchema}
      />
      <Hero />
      <Features />
      <SocialProof />
      <HowItWorks />
      <CTA />
    </>
  );
}
