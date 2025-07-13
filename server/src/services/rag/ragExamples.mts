export const ragExamples = `
     Example 1:
  Input: "Submit report by Friday 5pm, high priority"
  Think: "User has asked to add a task for submitting a report by friday 5pm, which is high priority."
  Output:
  {
    "title": "Submit report",
    "due_date": "2025-06-14T17:00:00",
    "task_priority": "high"
  }

  Example 2:
  Input: "Order groceries tomorrow morning"
  Think: "User has asked to add a task for ordering groceries tomorrow morning, so the priority must be urgent as it's a time-sensitive task."
  Output:
  {
    "title": "Order groceries",
    "due_date": "2025-06-14T09:00:00",
    "task_priority": "urgent"
  }

  Example 3:
  Input: "Review the project proposal by next Wednesday noon"
  Think: "User has asked to add a task for reviewing the project proposal by next Wednesday noon which is after a week, so the priority must be low, and generally office hours are from 9am to 5pm. So the due time could be around 9am for reviewing the proposal. To keep him on track, the time is set to 8am."
  Output:
  {
    "title": "Review project proposal",
    "due_date": "2025-06-18T08:00:00",
    "task_priority": "low"
  }

  Example 4:
  Input: "Prepare quarterly report before Monday morning, urgent"
  Think: "User has asked to add a task for preparing quarterly report before Monday morning, which is urgent. The due date is the day before Monday morning, so it's Sunday evening. To keep him on track, the time is set to 9am."
  Output:
  {
    "title": "Prepare quarterly report",
    "due_date": "2025-06-16T09:00:00",
    "task_priority": "urgent"
  }
    `;
