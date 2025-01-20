import RenderMarkdown from "@/components/ui/RenderMarkdown";
import { apiClient } from "@/utils/api/api-client";
import { redirect } from "next/navigation";

async function StaticPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const { error, data: fetchedPage } = await apiClient.fetchPage(page);
  if (error) {
    // console.log(error);
    return redirect("/404");
  }
  const pageContent = fetchedPage.data.body;
  return (
    <div className="w-full max-w-screen-laptop px-4 mb-10">
      <RenderMarkdown page={pageContent} />
    </div>
  );
}

export default StaticPage;
