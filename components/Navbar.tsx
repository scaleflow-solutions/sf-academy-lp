import Logo from "@/components/Logo";

const navLinks = [
  { href: "#curriculum", label: "المنهج" },
  { href: "#proof", label: "نتايج" },
  { href: "#pricing", label: "السعر" },
  { href: "#faq", label: "أسئلة" },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b-2 border-on-surface bg-surface">
      <div className="mx-auto flex max-w-container-max items-center justify-between px-margin-mobile py-4 md:px-margin-desktop">
        <Logo />

        <div className="hidden items-center gap-2 md:flex lg:gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="border-2 border-transparent px-4 py-2 font-headline-md text-base text-on-surface-variant transition-colors duration-200 hover:border-black hover:bg-primary-container hover:text-black"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="#pricing"
          className="neo-button border-2 border-black bg-primary-container px-5 py-3 font-label-md text-label-md font-bold text-black md:px-6"
        >
          احجز مكانك
        </a>
      </div>
    </nav>
  );
}
