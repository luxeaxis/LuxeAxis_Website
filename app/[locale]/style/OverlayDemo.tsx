'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { Modal } from '@/components/Modal';
import { useToast } from '@/components/Toast';
import { Cluster, Stack } from '@/components/layout';

/**
 * The parts of the feedback set that cannot be documented statically.
 *
 * Modal and Toast are overlays: rendering either permanently open on a
 * reference page would trap focus and make the rest of the page unreachable,
 * so they get triggers a reviewer operates instead. Chip's selected/removable
 * states need handlers, which a Server Component cannot hold.
 *
 * This is the only client component on /style, and it is deliberately a leaf —
 * the page itself, and every other specimen on it, stays server-rendered.
 */
export function OverlayDemo() {
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState(['Chennai', 'Villa', '3BHK']);
  const [selected, setSelected] = useState('Villa');
  const toast = useToast();

  return (
    <Stack gap={5}>
      <Stack gap={3}>
        <h3 className="font-display text-xl">Chips — selectable and removable</h3>
        <Cluster gap={2}>
          {filters.map((filter) => (
            <Chip
              key={filter}
              selected={selected === filter}
              onSelect={() => setSelected(filter)}
              onRemove={() => setFilters((rest) => rest.filter((f) => f !== filter))}
              removeLabel={`Remove ${filter} filter`}
            >
              {filter}
            </Chip>
          ))}
          {filters.length === 0 && (
            <Button variant="tertiary" onClick={() => setFilters(['Chennai', 'Villa', '3BHK'])}>
              Reset the demo filters
            </Button>
          )}
        </Cluster>
      </Stack>

      <Stack gap={3}>
        <h3 className="font-display text-xl">Toast</h3>
        <p className="text-on-surface-2">
          Status tones announce politely; the error tone announces assertively. Neither is ever the
          only channel for information that matters.
        </p>
        <Cluster gap={3}>
          <Button
            variant="secondary"
            onClick={() => toast({ tone: 'success', title: 'Audit request received' })}
          >
            Fire a success toast
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast({ tone: 'error', title: 'We could not reach that number', durationMs: 8000 })
            }
          >
            Fire an error toast
          </Button>
        </Cluster>
      </Stack>

      <Stack gap={3}>
        <h3 className="font-display text-xl">Modal</h3>
        <Cluster gap={3}>
          <Button variant="secondary" onClick={() => setModalOpen(true)}>
            Open the modal
          </Button>
        </Cluster>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Confirm your preferred time"
        >
          <Stack gap={4}>
            <p className="text-on-surface-2">
              Focus is trapped here while it is open, <kbd>Esc</kbd> closes it, clicking the scrim
              closes it, and focus returns to the button that opened it. The scrim is frosted rather
              than opaque so the page stays faintly visible — that is orientation, not decoration.
            </p>
            <Cluster gap={3}>
              <Button variant="primary" onClick={() => setModalOpen(false)}>
                Confirm
              </Button>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
            </Cluster>
          </Stack>
        </Modal>
      </Stack>
    </Stack>
  );
}
