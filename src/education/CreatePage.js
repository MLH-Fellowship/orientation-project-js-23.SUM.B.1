import { Form } from "./Form";
import s from "./education.module.css";

export function CreatePage() {
  return (
    <main className="container">
      <h1 className={s.mainHeading}>Create Education</h1>
      <Form />
    </main>
  );
}
