import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import english from '../../locales/en/translation.json';
import italian from '../../locales/it/translation.json';

let activeLanguage = 'en';
const changeLanguage = vi.fn();

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: activeLanguage,
      resolvedLanguage: activeLanguage,
      changeLanguage,
    },
  }),
}));

const scalarPaths = (value: unknown, prefix = ''): string[] => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return [prefix];
  return Object.entries(value).flatMap(([key, child]) =>
    scalarPaths(child, prefix ? `${prefix}.${key}` : key)
  );
};

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    activeLanguage = 'en';
    changeLanguage.mockReset();
  });

  it('exposes current language, changes it, and synchronizes html lang', () => {
    const view = render(<LanguageSwitcher />);

    expect(screen.getByRole('button', { name: 'language.en' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    fireEvent.click(screen.getByRole('button', { name: 'language.it' }));
    expect(changeLanguage).toHaveBeenCalledWith('it');

    activeLanguage = 'it';
    view.rerender(<LanguageSwitcher />);
    expect(document.documentElement).toHaveAttribute('lang', 'it');
    expect(screen.getByRole('button', { name: 'language.it' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });

  it('keeps English and Italian resource keys identical', () => {
    expect(scalarPaths(english).sort()).toEqual(scalarPaths(italian).sort());
  });
});
