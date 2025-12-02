import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useIndexedDB } from "@/shared/hooks/useIndexedDB";
import { Database } from "@/shared/utils/constants";
import { toast } from "sonner";

const formSchema = z.object({
  boardName: z.string().min(2, {
    message: "Board name must be at least 2 characters.",
  }),
  boardDescription: z.string().optional(),
});

export default function BoardForm({ onHide }: { onHide: () => void }) {
  const { putValue } = useIndexedDB(Database.name, [Database.boardTable]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      boardName: "",
      boardDescription: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    putValue(Database.boardTable, values);
    toast.success("Board is created successfully")
    onHide();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="boardName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Board Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Board Name
                "
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This will be your board display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="boardDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Board Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Description here ..." />
              </FormControl>
              <FormDescription>
                This will be your board display description.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
