import type { JSX } from 'react';

export type AppIconName =
  | 'brand'
  | 'discover'
  | 'search'
  | 'watchlist'
  | 'seen'
  | 'profile'
  | 'logout'
  | 'language'
  | 'filter'
  | 'shuffle'
  | 'star'
  | 'play'
  | 'bookmark'
  | 'check'
  | 'close'
  | 'trash'
  | 'thumbUp'
  | 'thumbDown'
  | 'alert'
  | 'arrowLeft';

interface AppIconProps {
  name: AppIconName;
  size?: number;
  className?: string;
}

const AppIcon = ({ name, size = 20, className }: AppIconProps): JSX.Element => {
  const commonProps = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': true,
    focusable: false,
    className,
  } as const;

  if (name === 'brand') {
    return (
      <svg {...commonProps} viewBox="0 0 32 32">
        <rect width="32" height="32" rx="4" fill="#15133C" />
        <path
          d="M4 4h4v5H4zm0 9h4v6H4zm0 10h4v5H4zm20-19h4v5h-4zm0 9h4v6h-4zm0 10h4v5h-4z"
          fill="#FFD166"
        />
        <rect x="11" y="6" width="10" height="20" rx="1.5" fill="#4856E8" />
        <path d="M13 11h6v2h-6zm0 4h5v2h-5zm0 4h6v2h-6z" fill="#F7F3E8" />
      </svg>
    );
  }

  const paths: Record<Exclude<AppIconName, 'brand'>, JSX.Element> = {
    discover: (
      <path d="m14.2 9.8-2.9 5.8-5.5 2.6 2.6-5.5 5.8-2.9Zm0 0 4-4m-1.4-2.6 4 4M12 22a10 10 0 1 1 10-10" />
    ),
    search: <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-5.5-5.5" />,
    watchlist: <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />,
    seen: (
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    ),
    profile: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7 8a7 7 0 0 0-14 0" />,
    logout: <path d="M10 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h5m4-3 4-4-4-4m4 4H9" />,
    language: (
      <path d="M4 5h10M9 3v2m-3 0c.4 4 2.4 7 6 9m1-9c-.5 4-3.3 8-7 10m8 6 3-8 3 8m-5-3h4" />
    ),
    filter: <path d="M3 5h18M6 12h12m-9 7h6M8 3v4m8 3v4m-4 3v4" />,
    shuffle: (
      <path d="M16 3h5v5m0-5-6 6M4 7h3c5 0 5 10 10 10h4m-5 4h5v-5M4 17h3c1.7 0 2.8-1.1 3.8-2.5" />
    ),
    star: (
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
    ),
    play: <path d="m8 5 11 7-11 7V5Z" />,
    bookmark: <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />,
    check: <path d="m4 12 5 5L20 6" />,
    close: <path d="M5 5l14 14M19 5 5 19" />,
    trash: <path d="M4 7h16m-10 4v6m4-6v6M9 3h6l1 4H8l1-4Zm-3 4 1 14h10l1-14" />,
    thumbUp: (
      <path d="M7 10v11H3V10h4Zm0 9h10.5a2 2 0 0 0 2-1.7l1.2-7A2 2 0 0 0 18.8 8H14l.7-3.2A2.3 2.3 0 0 0 12.5 2L7 10" />
    ),
    thumbDown: (
      <path d="M7 14V3H3v11h4Zm0-9h10.5a2 2 0 0 1 2 1.7l1.2 7a2 2 0 0 1-1.9 2.3H14l.7 3.2a2.3 2.3 0 0 1-2.2 2.8L7 14" />
    ),
    alert: <path d="M12 3 2 21h20L12 3Zm0 6v5m0 3v.01" />,
    arrowLeft: <path d="m15 18-6-6 6-6M9 12h12" />,
  };

  return (
    <svg
      {...commonProps}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
};

export default AppIcon;
