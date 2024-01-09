"use client";

import { settings } from "@/actions/settings";
import { SettingsSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";

type FormInputs = z.infer<typeof SettingsSchema>;

export const SettingsForm = () => {
  const user = useCurrentUser();

  const [message, setMessage] =
    useState<Awaited<ReturnType<typeof settings>>>();
  const [isPending, startTransition] = useTransition();
  const { update } = useSession();
  const form = useForm<FormInputs>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user.name,
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    startTransition(() => {
      if (data.name === user.name) {
        return setMessage({ type: "error", message: "No changes made!" });
      }

      settings(data)
        .then((response) => {
          setMessage(response);
          if (response.type === "success") {
            update("a").catch((error) => {
              throw error;
            });
          }
        })
        .catch(() =>
          setMessage({ type: "error", message: "Something went wrong" }),
        );
    });
  });

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="John Doe" disabled={isPending} />
              </FormControl>
            </FormItem>
          )}
        />
        {user.provider === "credentials" && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="******"
                    disabled={isPending}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}
        {message?.type === "error" && <FormError message={message.message} />}
        {message?.type === "success" && (
          <FormSuccess message={message.message} />
        )}
        <Button disabled={isPending}>Update</Button>
      </form>
    </Form>
  );
};
