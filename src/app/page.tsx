import { FeedPage } from "@/components/FeedPage";
import { getArticles, getFrontPage, getLatestPostedAt, getOlderArticles, pageCount, pageOf } from "@/lib/articles";

export default function Home() {
  const articles = getArticles();
  const older = getOlderArticles();

  return (
    <FeedPage
      frontPage={getFrontPage()}
      rows={pageOf(older, 1)}
      page={1}
      pageCount={pageCount(older)}
      basePath="/"
      totalCount={articles.length}
      updatedAt={getLatestPostedAt(articles)}
    />
  );
}
