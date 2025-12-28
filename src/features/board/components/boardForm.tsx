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
import { Textarea } from "@/components/ui/textarea";
import { Database } from "@/shared/utils/constants";
import { toast } from "sonner";
import { useDb } from "@/shared/context/dbProvider";
import { Check } from "lucide-react";

const formSchema = z.object({
  boardName: z.string().min(2, {
    message: "Board name must be at least 2 characters.",
  }),
  boardDescription: z.string().optional(),
});

export default function BoardForm({ onHide }: { onHide: () => void }) {
  const { putValue } = useDb();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      boardName: "",
      boardDescription: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    putValue(Database.boardTable, values);
    toast.success("Board is created successfully");
    onHide();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="boardName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Board Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Work Tasks, Personal Goals"
                  className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-emerald-500/50 focus:ring-emerald-500/20 rounded-lg h-10"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-rose-400 text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="boardDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Description
                <span className="text-slate-600 font-normal normal-case ml-1">(optional)</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="What's this board for?"
                  className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-emerald-500/50 focus:ring-emerald-500/20 rounded-lg min-h-[80px] resize-none"
                />
              </FormControl>
              <FormMessage className="text-rose-400 text-xs" />
            </FormItem>
          )}
        />
        <div className="pt-2">
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-lg shadow-emerald-500/25 h-10 rounded-lg font-medium"
          >
            <Check className="w-4 h-4 mr-2" />
            Create Board
          </Button>
        </div>
      </form>
    </Form>
  );
}
