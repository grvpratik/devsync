export interface Task {
	id: string;
	title: string;
	desc: string;
	completed: boolean;
	priority:string;
}

export interface Phase {
  name: string
  start_date: string
  end_date: string
  tasks:Task[]
}

