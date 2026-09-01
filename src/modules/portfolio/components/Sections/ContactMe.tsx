'use client';

import React from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useMutation } from '@tanstack/react-query';
import { ArrowRight, AtSign, Loader, Send } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AutosizeTextarea } from '@/components/ui/auto-resize-textarea';
import { CalCom, Discord, LinkedIn, X } from '@/components/logos';
import SectionBorders from '@/components/shared/SectionBorders';
import { Panel, PanelContent, PanelHeader, PanelTitle } from '../panel';
import { SendMail } from '@/actions/sendMail';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(1, 'Message is required').max(500),
});

type FormValues = z.infer<typeof formSchema>;

const contactLinks = [
  {
    label: 'Email',
    href: 'mailto:harshalvkhobragade@gmail.com',
    icon: AtSign,
  },
  {
    label: 'Discord',
    href: 'https://discord.com/users/harsshal',
    icon: Discord,
  },
  {
    label: 'Twitter / X',
    href: 'https://x.com/Harshalvk_',
    icon: X,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/harshalvk/',
    icon: LinkedIn,
  },
  {
    label: 'Book a meeting',
    href: 'https://cal.com/harshalvk/15min',
    icon: CalCom,
  },
] as const;

const ContactMe = () => {
  const form = useForm<FormValues>({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: SendMail,

    onMutate: () => {
      toast.loading('Sending...', {
        id: 'send-email',
      });
    },

    onSuccess: () => {
      form.reset();

      toast.success('Thanks for reaching out!', {
        id: 'send-email',
      });
    },

    onError: () => {
      toast.error('Mail not sent. Please try again.', {
        id: 'send-email',
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    mutate(values);
  };

  const ID = 'contactme';

  return (
    <section className="relative border-t-0">
      <Panel id={ID}>
        <SectionBorders />

        <PanelHeader>
          <PanelTitle>
            <a href={`#${ID}`}>Contact Me.</a>
          </PanelTitle>
        </PanelHeader>

        <PanelContent>
          <div className="p-4">
            <p className="text-muted-foreground max-w-2xl leading-5">
              I&apos;m always eager to explore new opportunities and take on exciting projects. If
              you have a project in mind, or just want to say hi, feel free to send me a message.
            </p>

            <div className="py-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      disabled={isPending}
                      render={({ field }) => (
                        <FormItem className="min-w-0">
                          <FormLabel>Name</FormLabel>

                          <FormControl>
                            <Input
                              placeholder="Your Name"
                              className="rounded-sm text-sm"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      disabled={isPending}
                      render={({ field }) => (
                        <FormItem className="min-w-0">
                          <FormLabel>Email</FormLabel>

                          <FormControl>
                            <Input
                              type="email"
                              placeholder="harshal@xyz.com"
                              className="rounded-sm text-sm"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    disabled={isPending}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>

                        <FormControl>
                          <AutosizeTextarea
                            placeholder="Hello there, I would like to ask you about..."
                            className="min-h-36 resize-none rounded-sm text-sm"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isPending}
                    variant="secondary"
                    className="w-full rounded-sm border sm:w-fit"
                  >
                    {isPending ? <Loader className="animate-spin" /> : <Send />}

                    {isPending ? 'Sending' : 'Send'}
                  </Button>
                </form>
              </Form>
            </div>

            <div className="w-full border-b border-dashed" />

            <p className="text-muted-foreground my-5 text-sm">Or contact me with,</p>

            <OtherContacts />
          </div>
        </PanelContent>
      </Panel>
    </section>
  );
};

function OtherContacts() {
  return (
    <div className="flex flex-wrap gap-2">
      {contactLinks.map(({ label, href, icon: Icon }) => (
        <Button key={label} variant="outline" asChild className="group h-9 rounded-sm px-3">
          <Link
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="flex items-center gap-1.5"
          >
            <Icon className="size-4 shrink-0" />

            <span>{label}</span>

            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </Button>
      ))}
    </div>
  );
}

export default ContactMe;
