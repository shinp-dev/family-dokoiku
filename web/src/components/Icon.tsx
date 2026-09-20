import type { ReactNode, SVGProps } from 'react'

type IconName =
  | 'arrow' | 'back' | 'calendar' | 'clock' | 'external' | 'family'
  | 'filter' | 'list' | 'map' | 'pin' | 'sparkles' | 'ticket'

const paths: Record<IconName, ReactNode> = {
  arrow: <path d="m9 18 6-6-6-6" />,
  back: <path d="m15 18-6-6 6-6" />,
  calendar: <><path d="M8 2v4M16 2v4M3 10h18"/><rect x="3" y="4" width="18" height="18" rx="3"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  external: <><path d="M15 4h5v5M20 4l-9 9"/><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"/></>,
  family: <><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3.5 20c.5-4 2.3-6 5.5-6s5 2 5.5 6M14 15c3.4-.7 5.5 1 6.2 4"/></>,
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
  list: <><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r=".8" fill="currentColor"/><circle cx="4.5" cy="12" r=".8" fill="currentColor"/><circle cx="4.5" cy="18" r=".8" fill="currentColor"/></>,
  map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15M15 6v15"/></>,
  pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
  sparkles: <><path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3ZM5 14l.8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14ZM19 13l.7 1.8 1.8.7-1.8.7L19 18l-.7-1.8-1.8-.7 1.8-.7L19 13Z"/></>,
  ticket: <><path d="M3 8a2 2 0 0 0 0 4v5h18v-5a2 2 0 0 0 0-4V3H3v5Z"/><path d="M13 3v14"/></>,
}

export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {paths[name]}
    </svg>
  )
}
