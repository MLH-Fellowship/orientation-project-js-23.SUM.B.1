import { redirect } from "react-router-dom";

const originUrl = process.env.REACT_APP_BACKEND_URL;

export async function postAction({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const startDate = new Date(data.start_date);
  const startMonth = startDate.toLocaleString("default", { month: "long" });
  const startYear = startDate.getFullYear();
  const endDate = new Date(data.end_date);
  const endMonth = endDate.toLocaleString("default", { month: "long" });
  const endYear = endDate.getFullYear();

  await fetch(`${originUrl}/resume/education`, {
    body: JSON.stringify({
      ...data,
      start_date: `${startMonth} ${startYear}`,
      end_date: `${endMonth} ${endYear}`,
    }),
    method: "POST",
  });
  return redirect("/");
}
