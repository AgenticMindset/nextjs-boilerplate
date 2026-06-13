import Image from "next/image";
import Link from "next/link";
import { articles } from "../../lib/articles";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Álvaro Tomás",
  description:
    "Writing on AI agents, agentic commerce, blockchain protocols, decentralized systems, and technology strategy.",
  openGraph: {
    title: "Blog | Álvaro Tomás",
    description:
      "Writing on AI agents, agentic commerce, blockchain protocols, decentralized systems, and technology strategy.",
    type: "website",
  },
};

export default function BlogPage() {
  const sortedArticles = [...articles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const topics = Array.from(new Set(articles.map((a) => a.topic)));

  return (
    <section className="work-wrapper">
      <Image
        src="/blog-bg.jpg"
        alt=""
        fill
        style={{ objectFit: "cover", objectPosition: "center" }}
        quality={75}
      />
      <div className="work-wrapper__overlay" />
      <div className="work-wrapper__content">
        {/* Header */}
        <div className="work-header">
          <p className="work-header__greeting animate-in">Blog</p>
          <h1 className="work-header__title animate-in animate-in--delay-1">
            Thinking in public
          </h1>
          <p className="work-header__subtitle animate-in animate-in--delay-2">
            On AI agents, agentic commerce, decentralized systems, and the
            decisions behind building at the edge of new technology.
          </p>
        </div>

        {/* Topic pills */}
        <div className="blog-topics animate-in animate-in--delay-3">
          {topics.map((topic) => (
            <span key={topic} className="blog-topic">
              {topic}
            </span>
          ))}
        </div>

        {/* Article grid */}
        <div className="blog-grid">
          {sortedArticles.map((article, index) => (
            <Link
              href={`/blog/${article.slug}`}
              key={article.slug}
              className="blog-card animate-in"
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              <div className="blog-card__image-wrapper">
                <Image
                  src={article.thumbnail}
                  alt={article.title}
                  fill
                  style={{ objectFit: "cover" }}
                  quality={75}
                />
                <div className="blog-card__image-overlay" />
              </div>
              <div className="blog-card__content">
                <div className="blog-card__meta">
                  <span className="blog-card__topic">{article.topic}</span>
                  <span className="blog-card__dot" />
                  <span className="blog-card__date">
                    {new Date(article.date).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="blog-card__dot" />
                  <span className="blog-card__reading-time">
                    {article.readingTime}
                  </span>
                </div>
                <h2 className="blog-card__title">{article.title}</h2>
                <p className="blog-card__description">{article.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <footer className="footer">
          <p className="footer__text">
            Álvaro Tomás · {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </section>
  );
}
