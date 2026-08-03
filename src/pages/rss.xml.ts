import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { blog } from "../lib/markdoc/frontmatter.schema";
import { readAll } from "../lib/markdoc/read";
import { SITE_TITLE, SITE_DESCRIPTION } from "../config";

export const GET: APIRoute = async (context) => {
  const posts = await readAll({
    directory: "blog",
    frontmatterSchema: blog,
  });

  const sortedPosts = posts
    .filter((p) => p.frontmatter.draft !== true)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).valueOf() -
        new Date(a.frontmatter.date).valueOf()
    );

  const baseUrl = context.site ? context.site.origin : "";

  const rssItems = sortedPosts.map(({ frontmatter, slug }) => {
    if (frontmatter.external) {
      return {
        title: frontmatter.title,
        pubDate: frontmatter.date,
        link: frontmatter.url,
      };
    }

    return {
      title: frontmatter.title,
      pubDate: frontmatter.date,
      description: frontmatter.description,
      link: `${baseUrl}/blog/${slug}`,
    };
  });

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: baseUrl,
    items: rssItems,
  });
};
