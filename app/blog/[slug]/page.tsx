import { articles } from "../../../lib/articles";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import ArticleContent from "./ArticleContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return {};

  return {
    title: `${article.title} | Álvaro Tomás`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.date,
      authors: ["Álvaro Tomás González"],
      images: [{ url: article.thumbnail }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

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
        <div className="article-container">
          {/* Back link */}
          <Link href="/blog" className="article-back">
            ← Back to blog
          </Link>

          {/* Article header */}
          <div className="article-header">
            <div className="blog-card__meta">
              <span className="blog-card__topic">{article.topic}</span>
              <span className="blog-card__dot" />
              <span className="blog-card__date">
                {new Date(article.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="blog-card__dot" />
              <span className="blog-card__reading-time">
                {article.readingTime}
              </span>
            </div>
            <h1 className="article-title">{article.title}</h1>
            <p className="article-description">{article.description}</p>
          </div>

          {/* Hero image */}
          <div className="article-hero">
            <Image
              src={article.thumbnail}
              alt={article.title}
              width={960}
              height={480}
              style={{ objectFit: "cover", borderRadius: "12px", width: "100%", height: "auto" }}
              quality={75}
            />
          </div>

          {/* Article body */}
          <div className="article-body">
            <ArticleContent slug={slug} />
          </div>

          {/* Footer */}
          <div className="article-footer">
            <Link href="/blog" className="article-back">
              ← Back to blog
            </Link>
          </div>
        </div>

        {/* Structured data for SEO/GEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: article.title,
              description: article.description,
              datePublished: article.date,
              author: {
                "@type": "Person",
                name: "Álvaro Tomás González",
                url: "https://alvarotomas.com",
              },
              publisher: {
                "@type": "Person",
                name: "Álvaro Tomás González",
              },
              image: `https://alvarotomas.com${article.thumbnail}`,
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `https://alvarotomas.com/blog/${article.slug}`,
              },
            }),
          }}
        />
      </div>
    </section>
  );
}