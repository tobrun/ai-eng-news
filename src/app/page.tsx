import { FeedPage } from "@/components/FeedPage";
import { getFrontPage, getOlderArticles, pageCount, pageOf } from "@/lib/articles";

export default function Home() {
  const older = getOlderArticles();

  return (
    <FeedPage
      frontPage={getFrontPage()}
      rows={pageOf(older, 1)}
      page={1}
      pageCount={pageCount(older)}
      basePath="/"
    />
  );
}
