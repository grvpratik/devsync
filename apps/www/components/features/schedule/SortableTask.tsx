import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "www/components/ui/button";
import { Badge } from "www/components/ui/badge";

interface Task {
  id: string;
  text: string;
  category: "home" | "work" | "personal";
}

const categoryColors: Record<Task["category"], string> = {
  home: "bg-blue-500/10 text-blue-500",
  work: "bg-purple-500/10 text-purple-500",
  personal: "bg-green-500/10 text-green-500",
};

const SortableTask = ({ task, onDelete }: { task: Task; onDelete: (id: string) => void }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <div className="relative">
        <div
          ref={setNodeRef}
          style={style}
          className="flex items-center gap-3 bg-card hover:bg-accent/50 rounded-lg p-3 cursor-move group border border-border transition-colors"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
          <input
            type="checkbox"
            className="w-4 h-4 rounded-full border-2 border-primary/50 checked:bg-primary checked:border-transparent focus:ring-0 focus:ring-offset-0"
          />
          <div className="flex-1 flex items-center gap-2">
            <span className="text-foreground">{task.text}</span>
            <Badge className={`${categoryColors[task.category]} font-medium`}>
              {task.category}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            className="text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      {/* 
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => onDelete(task.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> 
      */}
    </>
  );
};

export default SortableTask;