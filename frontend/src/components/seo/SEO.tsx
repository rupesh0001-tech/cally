import React, { useEffect } from "react";
import { getBaseUrl, getCurrentUrl } from "../../lib/config";

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogType?: "website" | "article" | "profile";
  ogImage?: string;
  twitterCard?: "summary" | "summary_large_image";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  googleSiteVerification?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
  noIndex?: boolean;
}

const DEFAULT_SITE_NAME = "Cally";
const DEFAULT_TITLE = "Cally - Open Scheduling Infrastructure & Calendar Automation";
const DEFAULT_DESCRIPTION =
  "Cally is the open-source scheduling platform that eliminates back-and-forth emails. Share customizable booking links, sync Google/Outlook calendars, and automate meetings effortlessly.";
const DEFAULT_DOMAIN = "https://cally.com";
const DEFAULT_OG_IMAGE = `${DEFAULT_DOMAIN}/dashboard-pc.png`;

/**
 * SEO Component that dynamically manages document head elements:
 * Meta tags, canonical links, OpenGraph, Twitter Cards, Google Search Console site verification,
 * and JSON-LD structured data for Google Search rich snippets.
 */
export const SEO: React.FC<SEOProps> = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords = [
    "scheduling tool",
    "calendly alternative",
    "open source calendar",
    "meeting planner",
    "booking link",
    "calendar sync",
    "google calendar integration",
    "outlook calendar sync",
    "free scheduling software",
  ],
  canonicalUrl,
  ogType = "website",
  ogImage = DEFAULT_OG_IMAGE,
  twitterCard = "summary_large_image",
  publishedTime,
  modifiedTime,
  author = "Cally Team",
  googleSiteVerification,
  jsonLd,
  noIndex = false,
}) => {
  useEffect(() => {
    // 1. Update Document Title
    const pageTitle = title.includes("Cally") ? title : `${title} | ${DEFAULT_SITE_NAME}`;
    document.title = pageTitle;

    // Helper function to update or create meta tags
    const updateMetaTag = (selector: string, attrName: string, attrVal: string, contentVal: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute("content", contentVal);
    };

    // Helper function to update or create link tags
    const updateLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
    };

    // Determine current domain & canonical URL dynamically
    const baseDomain = getBaseUrl();
    const currentUrl = canonicalUrl || getCurrentUrl();
    const resolvedOgImage = ogImage || `${baseDomain}/dashboard-pc.png`;

    // 2. Standard Meta Tags
    updateMetaTag('meta[name="description"]', "name", "description", description);
    updateMetaTag('meta[name="keywords"]', "name", "keywords", keywords.join(", "));
    updateMetaTag('meta[name="author"]', "name", "author", author);
    updateMetaTag('meta[name="robots"]', "name", "robots", noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");

    // Google Search Console Site Verification Meta Tag
    if (googleSiteVerification) {
      updateMetaTag('meta[name="google-site-verification"]', "name", "google-site-verification", googleSiteVerification);
    }

    // 3. Canonical Tag
    updateLinkTag("canonical", currentUrl);

    // 4. OpenGraph Tags for Facebook / LinkedIn / Slack / WhatsApp preview
    updateMetaTag('meta[property="og:title"]', "property", "og:title", pageTitle);
    updateMetaTag('meta[property="og:description"]', "property", "og:description", description);
    updateMetaTag('meta[property="og:type"]', "property", "og:type", ogType);
    updateMetaTag('meta[property="og:url"]', "property", "og:url", currentUrl);
    updateMetaTag('meta[property="og:image"]', "property", "og:image", resolvedOgImage);
    updateMetaTag('meta[property="og:site_name"]', "property", "og:site_name", DEFAULT_SITE_NAME);

    if (publishedTime) {
      updateMetaTag('meta[property="article:published_time"]', "property", "article:published_time", publishedTime);
    }
    if (modifiedTime) {
      updateMetaTag('meta[property="article:modified_time"]', "property", "article:modified_time", modifiedTime);
    }

    // 5. Twitter Card Tags
    updateMetaTag('meta[name="twitter:card"]', "name", "twitter:card", twitterCard);
    updateMetaTag('meta[name="twitter:title"]', "name", "twitter:title", pageTitle);
    updateMetaTag('meta[name="twitter:description"]', "name", "twitter:description", description);
    updateMetaTag('meta[name="twitter:image"]', "name", "twitter:image", resolvedOgImage);
    updateMetaTag('meta[name="twitter:site"]', "name", "twitter:site", "@callyhq");

    // 6. Inject / Update JSON-LD Script for Google Search Console Rich Results
    const SCRIPT_ID = "seo-json-ld";
    let scriptElement = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!scriptElement) {
      scriptElement = document.createElement("script");
      scriptElement.id = SCRIPT_ID;
      scriptElement.type = "application/ld+json";
      document.head.appendChild(scriptElement);
    }

    // Default Organization & Website Schema
    const defaultSchemas: Record<string, any>[] = [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": DEFAULT_SITE_NAME,
        "url": baseDomain,
        "logo": `${baseDomain}/logo.svg`,
        "sameAs": [
          "https://twitter.com/callyhq",
          "https://github.com/callyhq",
          "https://linkedin.com/company/cally"
        ],
        "description": DEFAULT_DESCRIPTION
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": DEFAULT_SITE_NAME,
        "url": baseDomain,
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${baseDomain}/blogs?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      }
    ];

    let finalJsonLd: any = defaultSchemas;
    if (jsonLd) {
      if (Array.isArray(jsonLd)) {
        finalJsonLd = [...defaultSchemas, ...jsonLd];
      } else {
        finalJsonLd = [...defaultSchemas, jsonLd];
      }
    }

    scriptElement.textContent = JSON.stringify(finalJsonLd, null, 2);

    return () => {
      // Clean up dynamic JSON-LD on unmount if needed
    };
  }, [
    title,
    description,
    keywords,
    canonicalUrl,
    ogType,
    ogImage,
    twitterCard,
    publishedTime,
    modifiedTime,
    author,
    googleSiteVerification,
    jsonLd,
    noIndex,
  ]);

  return null;
};

export default SEO;
