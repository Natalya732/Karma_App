import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon, Trash2, Plus, Check, CalendarDays, StickyNote } from "lucide-react";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { Database } from "@/shared/utils/constants";
import { toast } from "sonner";
import { useDb } from "@/shared/context/dbProvider";

export const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string(),
  dueDate: z.date(),
  boards: z.array(
    z.object({
      id: z.number(),
      boardName: z.string(),
      boardDescription: z.string(),
    })
  ),
  selectedBoardId: z.string().min(1, {
    message: "Please select a board.",
  }),
  notes: z
    .array(
      z.object({
        id: z.string(),
        note: z.string(),
      })
    )
    .optional(),
  status: z.enum(["pending", "done", "failed"]),
});

export function TaskForm({ onHide }: { onHide: () => void }) {
  const [open, setOpen] = useState(false);
  const { getAllValue, isDbConnecting, putValue } = useDb();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      boards: [],
      dueDate: new Date(),
      notes: [],
      selectedBoardId: "",
      status: "pending",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await putValue(Database.taskTable, values);
    toast.success("Task is created successfully");
    onHide();
  }

  async function getBoardsValue() {
    const allBoards = await getAllValue(Database.boardTable);
    form.setValue("boards", allBoards);
  }

  useEffect(() => {
    if (!isDbConnecting) {
      getBoardsValue();
    }
  }, [isDbConnecting]);

  const inputStyles = "bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20 rounded-lg";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 w-full"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Title
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="What needs to be done?"
                  className={`${inputStyles} h-10`}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-rose-400 text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Description
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add more details..."
                  className={`${inputStyles} min-h-[60px] resize-none`}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-rose-400 text-xs" />
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <FormField
            control={form.control}
            name="selectedBoardId"
            render={({ field }) => {
              const boardOptions = form.watch("boards");

              return (
                <FormItem className="flex-1">
                  <FormLabel className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Board
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className={`w-full cursor-pointer ${inputStyles} h-10`}>
                        <SelectValue placeholder="Select board" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        {Array.isArray(boardOptions) &&
                          boardOptions.map((item) => (
                            <SelectItem
                              key={item.id}
                              className="cursor-pointer focus:bg-slate-700 focus:text-white"
                              value={String(item.id)}
                            >
                              {item.boardName}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-rose-400 text-xs" />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => {
              return (
                <FormItem className="flex-1">
                  <FormLabel className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Due Date
                  </FormLabel>
                  <FormControl>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild className="w-full">
                        <Button
                          variant="outline"
                          id="date"
                          className={`justify-between font-normal ${inputStyles} h-10 hover:bg-slate-700/50 hover:text-white`}
                        >
                          <span className="flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-slate-400" />
                            {field.value
                              ? format(field.value, "MMM d, yyyy")
                              : "Select date"}
                          </span>
                          <ChevronDownIcon className="w-4 h-4 text-slate-400" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-full overflow-hidden p-0 bg-slate-800 border-slate-700"
                        align="start"
                      >
                        <Calendar
                          className="w-full bg-slate-800 text-white"
                          mode="single"
                          selected={field.value || new Date()}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            field.onChange(date);
                            setOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage className="text-rose-400 text-xs" />
                </FormItem>
              );
            }}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <StickyNote className="w-3.5 h-3.5" />
                  Notes
                  <span className="text-slate-600 font-normal normal-case">(optional)</span>
                </FormLabel>

                <div className="space-y-2">
                  {Array.isArray(field.value) && field.value.length
                    ? field.value.map(({ note, id }, index) => (
                        <div className="flex gap-2 items-center" key={index}>
                          <Input
                            value={note}
                            placeholder="Add a note..."
                            onChange={(e) => {
                              const updatedValue = [...(field?.value ?? [])];
                              updatedValue[index] = {
                                note: e.target.value,
                                id: Date.now().toString(),
                              };
                              field.onChange(updatedValue);
                            }}
                            className={`${inputStyles} h-9`}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = field.value?.filter(
                                (item) => item.id !== id
                              );
                              field.onChange(updated);
                            }}
                            className="w-9 h-9 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 hover:bg-rose-500/30 hover:text-rose-300 transition-all cursor-pointer flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    : null}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="cursor-pointer bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-700/50 hover:text-white hover:border-slate-600 mt-2"
                  onClick={() =>
                    field.onChange([
                      ...(field.value || []),
                      {
                        note: "",
                        id: Date.now().toString(),
                      },
                    ])
                  }
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Note
                </Button>
                <FormMessage className="text-rose-400 text-xs" />
              </FormItem>
            );
          }}
        />

        <div className="pt-3">
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-indigo-500/25 h-10 rounded-lg font-medium"
          >
            <Check className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        </div>
      </form>
    </Form>
  );
}
