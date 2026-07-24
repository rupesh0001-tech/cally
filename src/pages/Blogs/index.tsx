import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SEO } from "../../components/seo/SEO";
import { getBaseUrl, getCurrentUrl } from "../../lib/config";
import {
  getAllPosts,
  getFeaturedPost,
  getCategories,
  searchPosts,
  BlogPost,
} from "../../data/blogs";

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const featuredPost = getFeaturedPost();
  const categories = ["All", ...getCategories()];
  const filteredPosts = searchPosts(searchQuery, selectedCategory);

  const baseUrl = getBaseUrl();
  const blogsUrl = getCurrentUrl("/blogs");

  // Schema.org structured data for Google Search Console rich results
  const blogListSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Cally Blog",
    "description": "Insights, guides, and engineering articles on scheduling infrastructure, calendar automation, and focus productivity.",
    "url": blogsUrl,
    "publisher": {
      "@type": "Organization",
      "name": "Cally",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.svg`
      }
    },
    "blogPost": filteredPosts.map((post) => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "url": `${baseUrl}/blogs/${post.slug}`,
      "datePublished": post.publishedAt,
      "author": {
        "@type": "Person",
        "name": post.author.name
      }
    }))
  };

  return (
    <>
      <SEO
        title="Cally Blog - Insights on Open Scheduling, Productivity & Engineering"
        description="Explore the official Cally Blog. Discover actionable guides on calendar automation, eliminating scheduling friction, open-source tools, and developer productivity."
        canonicalUrl={blogsUrl}
        keywords={[
          "cally blog",
          "scheduling blog",
          "calendar productivity guides",
          "open source calendar software",
          "developer time management",
        ]}
        jsonLd={blogListSchema}
      />

      <div className="py-12 px-4 md:px-8 max-w-[1180px] mx-auto">
        {/* Header Hero Section */}
        <div className="text-center max-w-[760px] mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider bg-[#171614] text-[#F3E75B] px-4 py-1.5 rounded-full mb-4 uppercase">
            ✦ Insights & Product Engineering
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase text-[#171614] tracking-tight leading-tight">
            The Cally{" "}
            <span className="bg-[#7CEFC0] px-3 py-1 rounded-lg border-2 border-[#171614] inline-block -rotate-1 shadow-[4px_4px_0_#171614]">
              Blog
            </span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-[#2B2A27]/80 font-medium">
            Guides, engineering deep dives, and time management hacks to help you eliminate back-and-forth emails and master your calendar.
          </p>

          {/* Search Bar */}
          <div className="mt-8 relative max-w-[540px] mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, tags, or topics..."
              className="w-full bg-white border-2 border-[#171614] rounded-full py-3.5 pl-12 pr-6 text-sm font-medium text-[#171614] placeholder-[#171614]/40 shadow-[4px_4px_0_#171614] focus:outline-none focus:ring-2 focus:ring-[#F3E75B] transition-all"
            />
            <svg
              className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#171614]/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs font-bold px-4 py-2 rounded-full border-2 border-[#171614] transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#F3E75B] text-[#171614] shadow-[3px_3px_0_#171614]"
                      : "bg-white text-[#171614]/80 hover:bg-[#FDFBF2]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Post Hero Banner (Only when no search filter active) */}
        {!searchQuery && selectedCategory === "All" && featuredPost && (
          <section className="mb-14">
            <div className="bg-[#F3E75B] border-3 border-[#171614] rounded-2xl p-6 md:p-10 shadow-[8px_8px_0_#171614] grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-[#171614] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    Featured Post
                  </span>
                  <span className="bg-white/80 text-[#171614] text-xs font-semibold px-3 py-1 rounded-full border border-[#171614]">
                    {featuredPost.category}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#171614] uppercase leading-tight">
                  <Link
                    to={`/blogs/${featuredPost.slug}`}
                    className="hover:underline transition-all"
                  >
                    {featuredPost.title}
                  </Link>
                </h2>
                <p className="mt-3 text-sm md:text-base text-[#2B2A27]/85 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      className="w-10 h-10 rounded-full border-2 border-[#171614] object-cover"
                    />
                    <div>
                      <div className="text-xs font-bold text-[#171614]">
                        {featuredPost.author.name}
                      </div>
                      <div className="text-[11px] font-medium text-[#2B2A27]/70">
                        {featuredPost.publishedAt} • {featuredPost.readTime}
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/blogs/${featuredPost.slug}`}
                    className="bg-[#171614] text-white text-xs font-bold px-5 py-2.5 rounded-full border-2 border-[#171614] hover:bg-[#7CEFC0] hover:text-[#171614] transition-all flex items-center gap-1.5"
                  >
                    Read Article →
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="bg-white p-3 rounded-xl border-3 border-[#171614] shadow-[6px_6px_0_#171614]">
                  <img
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    className="w-full h-[240px] md:h-[280px] object-cover rounded-lg border border-[#171614]"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Blog Posts Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#171614] uppercase tracking-wide">
              {selectedCategory === "All" ? "All Articles" : `${selectedCategory} Articles`}
            </h2>
            <span className="text-xs font-semibold text-[#2B2A27]/70">
              Showing {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""}
            </span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 bg-white border-2 border-[#171614] rounded-2xl p-8">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-lg font-bold text-[#171614]">No articles found</h3>
              <p className="text-xs text-[#2B2A27]/70 mt-1">
                Try searching for a different keyword or category.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="mt-4 text-xs font-bold bg-[#F3E75B] text-[#171614] px-4 py-2 rounded-full border-2 border-[#171614] shadow-[3px_3px_0_#171614]"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white border-3 border-[#171614] rounded-2xl overflow-hidden shadow-[6px_6px_0_#171614] hover:-translate-y-1 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Cover image preview */}
                    <div className="h-[180px] border-b-2 border-[#171614] overflow-hidden relative">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 bg-[#F3E75B] text-[#171614] text-[11px] font-extrabold px-3 py-1 rounded-full border border-[#171614]">
                        {post.category}
                      </span>
                    </div>

                    <div className="p-5">
                      <div className="text-[11px] font-semibold text-[#2B2A27]/60 mb-2">
                        {post.publishedAt} • {post.readTime}
                      </div>
                      <h3 className="text-lg font-extrabold text-[#171614] leading-snug hover:text-[#2B2A27] transition-colors">
                        <Link to={`/blogs/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="mt-2 text-xs text-[#2B2A27]/80 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-[#171614]/10 mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-8 h-8 rounded-full border border-[#171614] object-cover"
                      />
                      <span className="text-xs font-bold text-[#171614]">
                        {post.author.name}
                      </span>
                    </div>
                    <Link
                      to={`/blogs/${post.slug}`}
                      className="text-xs font-extrabold text-[#171614] hover:underline flex items-center gap-1"
                    >
                      Read →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
