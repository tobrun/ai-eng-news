import { CONFIRM_PATH, addContact, errorMessage, newsletterEnabled, openToken, seeOther } from "@/lib/newsletter";

const EXPIRED_PATH = `${CONFIRM_PATH}?token=expired`;
const DONE_PATH = "/subscribe/done";
const ERROR_PATH = "/subscribe/error";

/** The address sealed in the posted token, or null when the token is missing, forged or expired. */
async function tokenEmail(request: Request): Promise<string | null> {
  const form = await request.formData().catch(() => null);
  const token = form?.get("token");
  return typeof token === "string" ? openToken(token, new Date(), process.env.SITE_SECRET ?? "") : null;
}

async function confirmContact(email: string): Promise<Response> {
  try {
    await addContact(email);
  } catch (error) {
    console.error(`contact not added: ${errorMessage(error)}`);
    return seeOther(ERROR_PATH);
  }
  return seeOther(DONE_PATH);
}

/** The confirm page's button: opens the token and only then creates the contact, so a link scanner's GET confirms nothing. */
export async function POST(request: Request): Promise<Response> {
  if (!newsletterEnabled()) return new Response(null, { status: 404 });

  const email = await tokenEmail(request);
  if (!email) return seeOther(EXPIRED_PATH);
  return confirmContact(email);
}
