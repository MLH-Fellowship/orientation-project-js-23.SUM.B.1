import { redirect } from "react-router-dom";

export async function action({ request, params }) {
  const formData = await request.formData();
  console.log(Object.fromEntries(formData));
  await new Promise((resolve) => setTimeout(() => resolve(0), 1000));
  return redirect("/");
}
