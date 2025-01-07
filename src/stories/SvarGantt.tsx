import React, { useEffect } from 'react';

import { Header } from './Header';
import './svar-gantt.css';
import './svar-gantt-icons.css';
import "wx-react-gantt/dist/gantt.css";

type User = {
  name: string;
};

export interface SvarGanttProps {
  /** INFO : This is compatible with React 18.3.1.*/
  Description?: void,
  /** Content - Populate timeline data */
  tasks?: {
    id: number;
    text: string;
    start: Date;
    end: Date;
    duration: number;
    progress: number;
    type: string;
    lazy?: boolean;
  }[]
  /** Header Part - Adjust Timeline Labelling */
  scales?: { unit: string, step: number, format: string }[],
  /** Content - Connect from certain id to another id tasks. **Must provide id for link itself */
  links?: { id: number, source: number, target: number, type: "e2e" | "e2s" | "s2s" }[]
}

export const SvarGantt: React.FC<SvarGanttProps> = ({
  tasks = [{
    id: 20,
    text: "New Task",
    start: new Date(2024, 5, 11),
    end: new Date(2024, 6, 12),
    duration: 1,
    progress: 2,
    type: "task",
    lazy: false 
  }],
  links = [{ id: 1, source: 20, target: 21, type: "e2e" }],
  scales = [{ unit: "day", step: 1, format: "d" }],
  ...props
}: SvarGanttProps) => {
  const [user, setUser] = React.useState<User>();
  const [ganttCmp, setGanttCmp] = React.useState<any>();

  const taskz = [
    {
      id: 20,
      text: "New Task",
      start: new Date(2024, 5, 11),
      end: new Date(2024, 6, 12),
      duration: 1,
      progress: 2,
      type: "task",
      lazy: false,
    },
    {
      id: 47,
      text: "[1] Master project",
      start: new Date(2024, 5, 12),
      end: new Date(2024, 7, 12),
      duration: 8,
      progress: 0,
      parent: 0,
      type: "summary",
    },
    {
      id: 22,
      text: "Task",
      start: new Date(2024, 7, 11),
      end: new Date(2024, 8, 12),
      duration: 8,
      progress: 0,
      parent: 47,
      type: "task",
    },
    {
      id: 21,
      text: "New Task 2",
      start: new Date(2024, 7, 10),
      end: new Date(2024, 8, 12),
      duration: 3,
      progress: 0,
      type: "task",
      lazy: false,
    },
  ];

  const linkz = [{ id: 1, source: 20, target: 21, type: "e2e" }];

  const scalez = [
    { unit: "month", step: 1, format: "MMMM yyy" },
    { unit: "day", step: 1, format: "d" },
  ];

  useEffect(() => {
    import("wx-react-gantt").then(x => {
      console.log("Gantt ref", x);
      setGanttCmp(x);
    })
  });


  return (
    <article>
      {ganttCmp ?
        <ganttCmp.Willow>
          <ganttCmp.Gantt tasks={taskz} links={linkz} scales={scalez} />
        </ganttCmp.Willow> :
        "Memuat..."
      }
    </article>
  );
};
