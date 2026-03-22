import { getPhilosophyItems } from "./actions";
import App from "../practice-builder";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const philosophyItems = await getPhilosophyItems();
  return <App initialPhilosophyItems={philosophyItems} />;
}
