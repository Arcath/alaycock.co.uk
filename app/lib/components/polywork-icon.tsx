import {useState} from 'react'

import {getSiteData} from '../utils'

export const PolyworkIcon: React.FC = () => {
  const [hover, setHover] = useState(false)
  const {social} = getSiteData()

  if (hover) {
    return (
      <a
        href={social.polywork.url}
        aria-label="Polywork"
        onMouseLeave={() => setHover(false)}
      >
        <svg
          className="w-16 m-auto"
          viewBox="0 0 250 250"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0)">
            <path
              d="M85.9375 243.75V168.75H164.062V199.218C164.062 223.437 144.531 243.75 119.531 243.75H85.9375Z"
              fill="#88CFB0"
            />
            <path
              d="M165.625 167.187V87.4998H243.75V122.656C243.75 146.875 224.219 167.187 199.219 167.187H165.625Z"
              fill="#F2C94C"
            />
            <path
              d="M164.062 87.4998H85.9375V166.406H164.062V87.4998Z"
              fill="#BD83CE"
            />
            <path
              d="M6.25 85.9375V50.7812C6.25 26.5625 25.7812 6.25 50.7813 6.25H84.375V85.9375H6.25Z"
              fill="#40BE88"
            />
            <path
              d="M165.625 85.9375V6.25H199.219C223.437 6.25 243.75 25.7812 243.75 50.7812V85.9375H165.625Z"
              fill="#FF7474"
            />
            <path
              d="M164.062 6.25H85.9375V85.1562H164.062V6.25Z"
              fill="#6776F9"
            />
            <path
              d="M6.25 199.218V168.75H84.375V243.75H50.7813C25.7812 243.75 6.25 224.218 6.25 199.218Z"
              fill="#37C2E2"
            />
            <path
              d="M84.375 87.4998H6.25V166.406H84.375V87.4998Z"
              fill="#F2994A"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0 199.219V50.7812C0 22.6562 22.6563 0 50.7813 0H199.219C227.344 0 250 22.6562 250 50.7812V122.656C250 150.781 227.344 173.437 199.219 173.437H170.312V199.219C170.312 227.344 147.656 250 119.531 250H50.7813C22.6563 250 0 227.344 0 199.219ZM78.125 78.9062H13.2813V50C13.2813 29.6875 29.6875 12.5 50.7813 12.5H78.125V78.9062ZM199.219 160.937H171.875V93.7497H236.719V123.437C236.719 143.75 220.313 160.937 199.219 160.937ZM119.531 237.5H92.1872V175.781H157.031V200C157.031 220.312 140.625 237.5 119.531 237.5ZM92.1872 160.937H157.031V93.7497H92.1872V160.937ZM171.875 78.9062H236.719V50.7812C236.719 29.6875 219.531 13.2812 199.219 13.2812H171.875V78.9062ZM157.031 78.9062H92.1872V12.5H157.031V78.9062ZM12.5 175V199.219C12.5 220.312 29.6875 236.719 50 236.719H78.125V175H12.5ZM78.125 160.937H12.5V93.7497H78.125V160.937Z"
              fill="#2F2F3A"
            />
          </g>
          <defs>
            <clipPath id="clip0">
              <rect width="250" height="250" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </a>
    )
  }

  return (
    <a
      href={social.polywork.url}
      className="fill-current text-white"
      aria-label="Polywork"
      onMouseEnter={() => setHover(true)}
    >
      <svg
        className="w-16 m-auto"
        viewBox="0 0 250 250"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0 199.219V50.7813C0 22.6563 22.6562 0 50.7812 0H199.219C227.344 0 250 22.6563 250 50.7813V122.656C250 150.781 227.344 173.437 199.219 173.437H170.312V199.219C170.312 227.344 147.656 250 119.531 250H50.7812C22.6562 250 0 227.344 0 199.219ZM78.1249 78.9063H13.2812V50C13.2812 29.6875 29.6875 12.5 50.7812 12.5H78.1249V78.9063ZM199.219 160.937H171.875V93.7498H236.719V123.437C236.719 143.75 220.312 160.937 199.219 160.937ZM119.531 237.5H92.1871V175.781H157.031V200C157.031 220.312 140.625 237.5 119.531 237.5ZM92.1871 160.937H157.031V93.7498H92.1871V160.937ZM171.875 78.9063H236.719V50.7813C236.719 29.6875 219.531 13.2813 199.219 13.2813H171.875V78.9063ZM157.031 78.9063H92.1871V12.5H157.031V78.9063ZM12.5 175V199.219C12.5 220.312 29.6875 236.719 50 236.719H78.1249V175H12.5ZM78.1249 160.937H12.5V93.7498H78.1249V160.937Z"
        />
      </svg>
    </a>
  )
}
