'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { PlusIcon, Loader2 } from 'lucide-react';

type Props = {
  name?: string;
  loadMessage?: string;
};

export function SubmitButton({ name = 'Add Project', loadMessage = 'Adding...' }: Props) {
  const { pending } = useFormStatus();

  return (
    <div className="flex justify-end">
      <Button
        type="submit"
        disabled={pending}
        className="bg-[var(--forest-accent)] hover:bg-[var(--forest-muted)] text-white"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <PlusIcon className="h-4 w-4 mr-2" />
        )}
        {pending ? loadMessage : name}
      </Button>
    </div>
  );
}
