import { Form as ReactRouterForm } from "react-router-dom"

export function Form() {
  return (
    <ReactRouterForm className="form-container" method="post">
      <div className="form-2-col">
        <label>
          Course:
          <input type="text" name="course" />
        </label>
        <label>
          School:
          <input type="text" name="school" />
        </label>
        <label>
          Start Date:
          <input type="date" name="start_date" />
        </label>
        <label>
          End Date:
          <input type="date" name="end_date" />
        </label>
        <label>
          Grade:
          <input type="text" name="grade" />
        </label>
        <label>
          Logo (URL):
          <input type="text" name="logo" />
        </label>
      </div>
      <button>Create</button>
    </ReactRouterForm>
  );
}
