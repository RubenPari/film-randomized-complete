import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import AppIcon from '../../../../shared/components/AppIcon.jsx';
import FilterPanel from './FilterPanel.jsx';

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
}

const FilterDrawer = ({ open, onClose }: FilterDrawerProps) => {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const supportsModal =
    typeof HTMLDialogElement !== 'undefined' &&
    typeof HTMLDialogElement.prototype.showModal === 'function';

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      openerRef.current = document.activeElement as HTMLElement | null;
      if (supportsModal && !dialog.open) dialog.showModal();
      return;
    }

    if (dialog.open && supportsModal) dialog.close();
    openerRef.current?.focus();
  }, [open, supportsModal]);

  return (
    <dialog
      ref={dialogRef}
      open={supportsModal ? undefined : open}
      aria-labelledby="filter-drawer-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className="fixed bottom-0 left-0 top-auto z-[60] m-0 h-[85dvh] max-h-none w-full max-w-none overflow-hidden border-0 border-t-2 border-film-ink bg-transparent p-0 shadow-[0_0_0_100vmax_rgba(21,19,60,0.45)] backdrop:bg-film-ink/45 md:bottom-0 md:left-auto md:right-0 md:top-0 md:h-dvh md:w-[420px] md:max-w-[420px] md:border-l-2 md:border-t-0"
    >
      <div
        className="flex h-full flex-col bg-film-screen"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b-2 border-film-ink px-5 py-4">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-wider">
              {t('home.eyebrow')}
            </p>
            <h2 id="filter-drawer-title" className="font-display text-3xl font-bold uppercase">
              {t('filters.title')}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ui-icon-button"
            aria-label={t('filters.close')}
          >
            <AppIcon name="close" />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <FilterPanel />
        </div>
      </div>
    </dialog>
  );
};

export default FilterDrawer;
