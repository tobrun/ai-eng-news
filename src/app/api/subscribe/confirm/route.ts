import { CONFIRM_PATH, addContact, newsletterEnabled, openToken, seeOther } from "@/lib/newsletter";

const EXPIRED_PATH = `${CONFIRM_PATH}?token=expired`;
const DONE_PATH = "/subscribe/done";
const ERROR_PATH = "/subscribe/error";

/** The confirm page's button: opens the token and only then creates the contact, so a link scanner's GET confirms nothing. */
export async function POST(request: Request): Promise<Response> {
  if (!newsletterEnabled()) return new Response(null, { status: 404 });

  const form = await request.formData().catch(() => null);
  const token = form?.get("token");
  const email = typeof token === "string" ? openToken(token, new Date(), process.env.SITE_SECRET ?? "") : null;
  if (!email) return seeOther(EXPIRED_PATH);

  try {
    await addContact(email);
  } catch (error) {
    console.error(`contact not added: ${error instanceof Error ? error.message : "unknown error"}`);
    return seeOther(ERROR_PATH);
  }
  return seeOther(DONE_PATH);
}
