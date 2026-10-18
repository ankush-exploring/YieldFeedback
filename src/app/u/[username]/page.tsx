'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useCompletion } from 'ai/react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

const specialChar = '||';
const parseStringMessages = (messageString: string): string[] =>
  messageString.split(specialChar);

const initialMessageString =
  'What do you think about my work?||How can I improve my communication?||Any feedback on my latest project?';

export default function SendMessagePage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error: suggestError,
  } = useCompletion({
    api: '/api/suggest-messages',
    initialCompletion: initialMessageString,
    onError: (err) => {
      toast({
        title: 'Suggestion Error',
        description:
          err.message || 'Failed to fetch AI suggestions. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const fetchSuggestedMessages = async () => {
    try {
      await complete('');
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });
      toast({
        title: response.data.message,
        variant: 'default',
      });
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto my-8 p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-1 text-center">
        Send Anonymous Feedback
      </h1>
      <p className="text-muted-foreground text-center mb-8 text-sm">
        Send a message to <span className="font-semibold">@{username}</span>.
        Your identity will never be revealed.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your honest feedback here…"
                    className="resize-none min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending…
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !messageContent}>
                Send message
              </Button>
            )}
          </div>
        </form>
      </Form>

      <Separator className="my-8" />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Need inspiration?</h2>
          <Button
            onClick={fetchSuggestedMessages}
            size="sm"
            variant="outline"
            disabled={isSuggestLoading}
          >
            {isSuggestLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Suggest messages'
            )}
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">
          Click a suggestion to use it as your message.
        </p>
        {suggestError ? (
          <p className="text-destructive text-sm">{suggestError.message}</p>
        ) : (
          <Card className="rounded-2xl">
            <CardHeader className="pb-1 text-sm font-medium text-muted-foreground">
              AI Suggestions
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {parseStringMessages(completion).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-left h-auto whitespace-normal py-2 px-3"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      <Separator className="my-8" />

      <div className="text-center text-sm text-muted-foreground">
        Want your own anonymous feedback link?{' '}
        <Link
          href="/sign-up"
          className="text-primary font-medium hover:underline"
        >
          Create your account
        </Link>
      </div>
    </div>
  );
}
