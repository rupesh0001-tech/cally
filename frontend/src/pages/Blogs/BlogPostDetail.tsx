import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { SEO } from "../../components/seo/SEO";
import { getBaseUrl, getCurrentUrl } from "../../lib/config";
import {
  getPostBySlug,
  getRelatedPosts,
  BlogPost,
} from "../../data/blogs";

export default function BlogPostDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <div className="py-20 text-center max-w-[500px] mx-auto px-4">
        <div className="text-6xl mb-4">📄</div>
        <h1 className="text-3xl font-extrabold text-[#171614] uppercase">Article Not Found</h1>
        <p className="mt-2 text-sm text-[#2B2A27]/70">
          The article you are looking for might have been moved or removed.
        </p>
        <Link
          to="/blogs"
          className="mt-6 inline-block bg-[#F3E75B] text-[#171614] font-bold text-sm px-6 py-3 rounded-full border-2 border-[#171614] shadow-[4px_4px_0_#171614]"
        >
          ← Back to All Articles
        </Link>
      </div>
    );
  }

  const baseUrl = getBaseUrl();
  const relatedPosts = getRelatedPosts(post.slug, post.category);
  const currentUrl = getCurrentUrl(`/blogs/${post.slug}`);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Google Search Console / Schema.org Rich Result Schemas
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": [post.coverImage.startsWith("http") ? post.coverImage : `${baseUrl}${post.coverImage}`],
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt || post.publishedAt,
    "author": {
      "@type": "Person",
      "name": post.author.name,
      "jobTitle": post.author.role,
      "url": post.author.twitter ? `https://twitter.com/${post.author.twitter}` : undefined
    },
    "publisher": {
      "@type": "Organization",
      "name": "Cally",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.svg`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": currentUrl
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${baseUrl}/blogs`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": currentUrl
      }
    ]
  };

  return (
    <>
      <SEO
        title={post.seoTitle || `${post.title} | Cally Blog`}
        description={post.seoDescription || post.excerpt}
        canonicalUrl={currentUrl}
        ogType="article"
        ogImage={`https://cally.com${post.coverImage}`}
        publishedTime={post.publishedAt}
        author={post.author.name}
        keywords={post.keywords || post.tags}
        jsonLd={[articleSchema, breadcrumbSchema]}
      />

      <article className="py-10 px-4 md:px-8 max-w-[840px] mx-auto">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-semibold text-[#2B2A27]/70">
          <Link to="/" className="hover:text-[#171614] hover:underline">
            Home
          </Link>
          <span>/</span>
          <Link to="/blogs" className="hover:text-[#171614] hover:underline">
            Blog
          </Link>
          <span>/</span>
          <span className="text-[#171614] truncate max-w-[200px] md:max-w-[300px]">
            {post.category}
          </span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[#F3E75B] text-[#171614] font-extrabold text-xs px-3.5 py-1 rounded-full border-2 border-[#171614] shadow-[2px_2px_0_#171614]">
              {post.category}
            </span>
            <span className="text-xs font-medium text-[#2B2A27]/60">
              {post.publishedAt} • {post.readTime}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-[#171614] uppercase leading-tight tracking-tight">
            {post.title}
          </h1>

          <p className="mt-4 text-base md:text-xl text-[#2B2A27]/85 font-medium leading-relaxed">
            {post.subtitle}
          </p>

          {/* Author Meta + Share */}
          <div className="mt-6 pt-6 border-t border-[#171614]/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-12 h-12 rounded-full border-2 border-[#171614] object-cover"
              />
              <div>
                <div className="text-sm font-bold text-[#171614]">{post.author.name}</div>
                <div className="text-xs text-[#2B2A27]/70 font-medium">{post.author.role}</div>
              </div>
            </div>

            {/* Social Share Controls */}
            <div className="flex items-center gap-2">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-[#171614] border-2 border-[#171614] px-3 py-1.5 rounded-full text-xs font-bold hover:bg-[#F3E75B] transition-all flex items-center gap-1 shadow-[2px_2px_0_#171614]"
              >
                <span>🐦 Share</span>
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-[#171614] border-2 border-[#171614] px-3 py-1.5 rounded-full text-xs font-bold hover:bg-[#7CEFC0] transition-all flex items-center gap-1 shadow-[2px_2px_0_#171614]"
              >
                <span>💼 Post</span>
              </a>
              <button
                onClick={handleCopyLink}
                className="bg-white text-[#171614] border-2 border-[#171614] px-3 py-1.5 rounded-full text-xs font-bold hover:bg-[#FDFBF2] transition-all flex items-center gap-1 shadow-[2px_2px_0_#171614] cursor-pointer"
              >
                {copied ? "✓ Copied!" : "🔗 Copy Link"}
              </button>
            </div>
          </div>
        </header>

        {/* Featured Cover Banner */}
        <div className="mb-10 bg-white border-3 border-[#171614] rounded-2xl p-3 shadow-[8px_8px_0_#171614]">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full max-h-[380px] object-cover rounded-xl border border-[#171614]"
          />
        </div>

        {/* Body Content */}
        <div
          className="prose prose-lg max-w-none text-[#171614] space-y-6 text-sm md:text-base leading-relaxed font-normal
            [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-extrabold [&_h2]:uppercase [&_h2]:text-[#171614] [&_h2]:mt-10 [&_h2]:mb-4
            [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#171614] [&_h3]:mt-6 [&_h3]:mb-2
            [&_p]:leading-relaxed [&_p]:text-[#2B2A27]/90
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2
            [&_code]:bg-[#F3E75B]/40 [&_code]:px-2 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-xs [&_code]:border [&_code]:border-[#171614]/20"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        <div className="mt-10 pt-6 border-t-2 border-[#171614] flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#171614]">Tags:</span>
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="bg-white border border-[#171614] text-[#171614] text-[11px] font-bold px-3 py-1 rounded-full shadow-[2px_2px_0_#171614]"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Author Bio Box */}
        <div className="mt-12 bg-[#F3E75B] border-3 border-[#171614] rounded-2xl p-6 md:p-8 shadow-[6px_6px_0_#171614] flex flex-col md:flex-row items-start md:items-center gap-6">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-16 h-16 rounded-full border-2 border-[#171614] object-cover shrink-0"
          />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#171614]/70">
              Written by
            </div>
            <h3 className="text-lg font-extrabold text-[#171614]">{post.author.name}</h3>
            <p className="text-xs text-[#2B2A27]/80 mt-1 leading-relaxed">{post.author.bio}</p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-12 bg-[#171614] text-[#FDFBF2] rounded-2xl p-8 text-center border-3 border-[#171614] shadow-[8px_8px_0_#7CEFC0]">
          <h3 className="text-2xl font-extrabold text-white uppercase">
            Ready to end email back-and-forth?
          </h3>
          <p className="text-xs md:text-sm text-white/70 mt-2 max-w-[500px] mx-auto">
            Join thousands of professionals using Cally to automate meetings and manage their calendar effortlesly.
          </p>
          <Link
            to="/register"
            className="mt-5 inline-block bg-[#7CEFC0] text-[#171614] font-extrabold text-sm px-6 py-3 rounded-full border-2 border-white hover:bg-[#F3E75B] transition-all"
          >
            Create Your Free Link →
          </Link>
        </div>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-10 border-t-2 border-[#171614]">
            <h3 className="text-xl font-extrabold text-[#171614] uppercase mb-6">
              Related Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((rel) => (
                <div
                  key={rel.id}
                  className="bg-white border-2 border-[#171614] rounded-xl p-5 shadow-[4px_4px_0_#171614] flex flex-col justify-between"
                >
                  <div>
                    <span className="bg-[#F3E75B] text-[#171614] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#171614]">
                      {rel.category}
                    </span>
                    <h4 className="text-base font-extrabold text-[#171614] mt-2 leading-snug">
                      <Link to={`/blogs/${rel.slug}`} className="hover:underline">
                        {rel.title}
                      </Link>
                    </h4>
                    <p className="text-xs text-[#2B2A27]/70 mt-1 line-clamp-2">{rel.excerpt}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#171614]/10 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-medium text-[#2B2A27]/60">{rel.readTime}</span>
                    <Link to={`/blogs/${rel.slug}`} className="font-bold text-[#171614]">
                      Read Article →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
