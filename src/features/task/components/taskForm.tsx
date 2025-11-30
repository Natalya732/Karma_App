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
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string(),
  dueDate: z.date(),
  notes: z
    .array(
      z.object({
        id: z.string(),
        note: z.string(),
      })
    )
    .optional(),
});

export function TaskForm() {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: new Date(),
      notes: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="overflow-y-scroll max-h-96 space-y-4 w-3xl items-start"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Form Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild className="w-full">
                      <Button
                        variant="outline"
                        id="date"
                        className="justify-between font-normal"
                      >
                        {field.value
                          ? format(field.value, "PPP")
                          : "Select date"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-full overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        className="w-full"
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
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => {
            console.log("field", field);
            return (
              <FormItem>
                <FormLabel>Notes</FormLabel>

                {Array.isArray(field.value) && field.value.length
                  ? field.value.map(({ note, id }, index) => (
                      <div className="flex gap-2 items-center" key={index}>
                        <Input
                          value={note}
                          onChange={(e) => {
                            const updatedValue = [...(field?.value ?? [])];
                            updatedValue[index] = {
                              note: e.target.value,
                              id: Date.now().toString(),
                            };
                            field.onChange(updatedValue);
                          }}
                          className="mb-2"
                        />
                        <Trash2
                          size={20}
                          onClick={() => {
                            const updated = field.value?.filter(
                              (item) => item.id !== id
                            );
                            field.onChange(updated);
                          }}
                        />
                      </div>
                    ))
                  : ""}

                <Button
                  type="button"
                  className="cursor-pointer"
                  variant="outline"
                  onClick={() =>
                    field.onChange([
                      ...(field.value || [
                        {
                          note: "",
                          id: "",
                        },
                      ]),
                      "",
                    ])
                  }
                >
                  + Add Note
                </Button>

                <FormMessage />
              </FormItem>
            );
          }}
        />
      </form>
      <Button type="submit" className="mt-4">
        Submit
      </Button>
    </Form>
  );
}
