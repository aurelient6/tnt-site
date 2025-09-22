'use client'
import '../style/footer.css';
// Composants d'icônes SVG simples
const ArrowUp = ({ color = "#fff", size = 22 }) => (
  <svg width={size} height={size} fill={color} viewBox="0 0 24 24">
    <path d="M7 14l5-5 5 5z"/>
  </svg>
);

const FacebookIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const EarthIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
  </svg>
);

const socialLinks = [
  {
    name: 'Facebook',
    link: 'https://facebook.com',
    icon: <FacebookIcon className="size-6" />,
  },
  {
    name: 'Website',
    link: 'https://twisterbedbug.com',
    icon: <EarthIcon className="size-6" />,
  },
]

const support = {
  title: 'Nos services',
  items: [
    { label: '', href: '' },
    { label: 'Toilettage', href: '/service/toilettage' },
    { label: 'Massage', href: '/service/massage' },
    { label: 'Physiothérapie', href: '/service/physiotherapie' },
    { label: 'Main training', href: '/service/main-training' },
  ],
}

const quickLinks = {
  title: '',
  items: [
    { label: 'Hooper', href: '/service/hooper' },
    { label: 'Agility', href: '/service/agility' },
    { label: 'Hydrothérapie', href: '/service/hydrotherapie' },
    { label: 'Tapis de course', href: '/service/tapis-de-course' },
    { label: 'Dressage', href: '/service/dressage' },
  ],
}

const category = {
  title: 'Liens rapides',
  items: [
    { label: 'Boutique', href: '/boutique' },
    { label: 'Contact', href: '/contact' },
    { label: 'Notre équipe', href: '/#equipe' },
    { label: 'Nos actualités', href: '/#actualites' },
  ],
}

const contact = {
  address: 'Rue de la Dîme 14, 4260 Braives',
  phone: '+32 478 40 38 90',
  email: 't&t@gmail.com',
}

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-[#191F33]">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-6 py-16 sm:grid-cols-[40fr_30fr_30fr] md:grid-cols-[40fr_30fr_30fr_30fr]">
          <div className="">
            <a href="/" className="mb-8 flex items-center gap-5 text-white">
              <img
                src="/images/logo/logo.png"
                className="h-8"
                alt="Logo"
              />
              <h6 className="text-3xl font-semibold tracking-wider">T&T</h6>
            </a>
            <address className="mt-3 text-base font-normal text-[#767E94]">
              <p className="mt-3 max-w-64">{contact.address}</p>
              <p className="mt-3">{contact.phone}</p>
              <p className="mt-3">{contact.email}</p>
            </address>
          </div>
          <div>
            <h6 className="mb-7 text-xl text-white">{support.title}</h6>
            <ul>
              {support.items.map(({ label, href }) => (
                <li
                  key={label}
                  className="mt-3 text-base font-normal text-[#767E94] transition-all duration-150 ease-in hover:text-white hover:underline hover:decoration-[#00AAFF] hover:underline-offset-8"
                >
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h6 className="mb-7 text-xl text-white">{quickLinks.title}</h6>
            <ul>
              {quickLinks.items.map(({ label, href }) => (
                <li
                  key={label}
                  className="mt-3 text-base font-normal text-[#767E94] transition-all duration-150 ease-in hover:text-white hover:underline hover:decoration-[#00AAFF] hover:underline-offset-8"
                >
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h6 className="mb-7 text-xl text-white">{category.title}</h6>
            <ul>
              {category.items.map(({ label, href }) => (
                <li
                  key={label}
                  className="mt-3 text-base font-normal text-[#767E94] transition-all duration-150 ease-in hover:text-white hover:underline hover:decoration-[#00AAFF] hover:underline-offset-8"
                >
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="relative bg-[#2E3447]">
        <button
          onClick={scrollToTop}
          className="absolute -top-7 right-8 flex size-14 items-center justify-center rounded-full border-[6px] border-[#191F33] bg-[#00AAFF] md:right-16"
        >
          <ArrowUp color="#fff" size={22} />
        </button>
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-[26px] md:flex-row md:justify-between">
          <p className="text-center text-[#767E94]">
            T&T © 2025. Tous droits réservés. Developed by <a className="text-white" href="https://linktr.ee/aurelienTaverniers" target="_blank" rel="noopener noreferrer">Aurélien Taverniers</a>
          </p>
          <ul className="flex items-center gap-6">
            {socialLinks.map(({ name, icon, link }) => (
              <li key={name}>
                <a
                  href={link}
                  title={name}
                  className="text-[#767E94] hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {icon}
                </a>
                <span className="sr-only">{name} account</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer