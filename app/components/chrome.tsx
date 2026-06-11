"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Globe, Close, Menu, Arrow,
  Linkedin, Facebook, Instagram, Youtube, Whatsapp,
} from "./icons";

function Bandeau({ onClose }: { onClose: () => void }) {
  return (
    <div className="bandeau">
      <div className="bandeau__inner">
        <span className="bandeau__globe"><Globe size={16} /></span>
        <span className="bandeau__text">
          Vous vivez à l&apos;étranger ? Umdeny Capital accompagne la diaspora africaine dans le développement, la sécurisation et la transmission de son patrimoine au Cameroun.
          {" "}<Link href="/diaspora" className="bandeau__link">Découvrir nos solutions diaspora →</Link>
        </span>
        <button className="bandeau__close" onClick={onClose} aria-label="Fermer">
          <Close size={14} />
        </button>
      </div>
    </div>
  );
}

function Header({ bandeauVisible, scrolled }: { bandeauVisible: boolean; scrolled: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { to: "/", label: "Accueil" },
    { to: "/qui-sommes-nous", label: "Qui sommes-nous" },
    { to: "/nos-vehicules", label: "Nos véhicules" },
    { to: "/diaspora", label: "Diaspora" },
    { to: "/blog", label: "Blog" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className={"header" + (!bandeauVisible ? " header--no-bandeau" : "") + (!scrolled ? " header--top" : "")}>
      <div className="header__inner">
        <Link href="/" className="brand" aria-label="Umdeny Capital — Accueil">
          <span className="brand__mark" />
          <span>
            <div className="brand__text">UMDENY CAPITAL</div>
            <div className="brand__sub">From Patrimony to Legacy</div>
          </span>
        </Link>
        <button className="menu-toggle" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {open ? <Close size={20} /> : <Menu size={22} />}
        </button>
        <nav className={"nav" + (open ? " open" : "")}>
          {links.map((l) => (
            <Link
              key={l.to}
              href={l.to}
              className={"nav__link" + (pathname === l.to ? " active" : "")}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/prendre-rdv" className="btn btn--gold nav__cta" onClick={() => setOpen(false)}>
            Prendre RDV <Arrow size={14} />
          </Link>
        </nav>
      </div>
    </header>
  );
}

function PreFooter() {
  return (
    <section className="prefooter">
      <div className="prefooter__inner">
        <div>
          <h3>Prêt à construire votre patrimoine ?</h3>
          <p>Faites le quiz patrimonial gratuit — recevez votre analyse personnalisée en 4 minutes.</p>
        </div>
        <div className="prefooter__ctas">
          <Link href="/prendre-rdv" className="btn btn--navy">Faire le quiz patrimonial <Arrow size={14} /></Link>
          <Link href="/prendre-rdv" className="btn btn--outline-navy">Prendre rendez-vous</Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <div className="footer__logo">
              <span className="footer__logo-mark" />
              <span className="footer__logo-text">UMDENY CAPITAL</span>
            </div>
            <div className="footer__slogan">From Patrimony to Legacy · Du Patrimoine à l&apos;Héritage</div>
            <p className="footer__about">
              Développez, sécurisez et transmettez votre patrimoine en Afrique. Une entité du groupe Umdeny Holdings, basée à Yaoundé, Cameroun. En activité depuis 2019.
            </p>
            <div className="footer__socials">
              <a className="footer__social" href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
              <a className="footer__social" href="#" aria-label="Facebook"><Facebook size={18} /></a>
              <a className="footer__social" href="#" aria-label="Instagram"><Instagram size={18} /></a>
              <a className="footer__social" href="#" aria-label="YouTube"><Youtube size={18} /></a>
              <a className="footer__social" href="#" aria-label="WhatsApp"><Whatsapp size={18} /></a>
            </div>
          </div>
          <div>
            <div className="footer__col-title">Newsletter — Patrimoine &amp; Afrique</div>
            <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.68)", lineHeight: 1.6, marginTop: 0 }}>
              Une analyse par mois sur l&apos;investissement en Afrique. Pas de spam, pas de promesses irréalistes.
            </p>
            <form style={{ display: "flex", flexDirection: "row", gap: 0, marginTop: 16 }} onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="votre@email.com"
                style={{
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(191,142,80,0.3)", color: "#fff",
                  padding: "14px 16px", flex: 1, fontSize: 14, outline: "none",
                }}
              />
              <button type="submit" className="btn btn--gold" style={{ padding: "14px 22px" }}>S&apos;inscrire</button>
            </form>
          </div>
        </div>

        <div className="footer__cols">
          <div className="footer__col">
            <h4 className="footer__col-title">Navigation</h4>
            <ul>
              <li><Link href="/">Accueil</Link></li>
              <li><Link href="/qui-sommes-nous">Qui sommes-nous ?</Link></li>
              <li><Link href="/nos-vehicules">Nos véhicules</Link></li>
              <li><Link href="/diaspora">Diaspora</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/prendre-rdv">Prendre RDV</Link></li>
              <li><Link href="/contact">Devenir apporteur d&apos;affaires</Link></li>
            </ul>
          </div>
          <div className="footer__col">
            <h4 className="footer__col-title">Secteurs</h4>
            <ul>
              <li><Link href="/nos-vehicules">Marché Boursier</Link></li>
              <li><Link href="/nos-vehicules">Télécom</Link></li>
              <li><Link href="/nos-vehicules">Mobile Money</Link></li>
              <li><Link href="/nos-vehicules">Immobilier <span className="soon">⏳ Bientôt</span></Link></li>
              <li><Link href="/nos-vehicules">Crowdfunding</Link></li>
              <li><Link href="/nos-vehicules">Crowdlending</Link></li>
              <li><Link href="/nos-vehicules">Transport <span className="soon">⏳ Bientôt</span></Link></li>
              <li><Link href="/nos-vehicules">Trading</Link></li>
            </ul>
          </div>
          <div className="footer__col">
            <h4 className="footer__col-title">Partenaires vérifiés</h4>
            <ul>
              <li>BEM Securities</li>
              <li>Wemonii</li>
              <li>Mobile Wallet Inc.</li>
              <li>Cherryz</li>
              <li>Exness · FBS</li>
              <li>Fusion Markets · HFM</li>
              <li style={{ color: "var(--gold-soft)", fontStyle: "italic" }}>+ D&apos;autres à venir</li>
            </ul>
          </div>
          <div className="footer__col">
            <h4 className="footer__col-title">Contact</h4>
            <ul>
              <li>
                Yaoundé, Fouda, Cameroun
                <span className="meta">Siège — Umdeny Holdings</span>
              </li>
              <li>
                <a href="mailto:direction@umdeny.com">direction@umdeny.com</a>
                <span className="meta">Réponse 24–48h ouvrées</span>
              </li>
              <li>
                <a href="tel:+237658602054">+237 658 602 054</a>
                <span className="meta">Lun–Ven · 8h–18h</span>
              </li>
              <li>www.umdeny.com</li>
            </ul>
          </div>
        </div>

        <div className="footer__disclaimer">
          Umdeny Capital est une entité du groupe Umdeny Holdings, basée à Yaoundé, Fouda, Cameroun. Les investissements proposés comportent des risques, y compris le risque de perte partielle ou totale du capital investi. Les rendements indiqués sont des estimations basées sur des projections et des données de marché observées — ils ne constituent pas une garantie de performance future. Toute décision d&apos;investissement doit être prise après analyse de votre situation personnelle et, si nécessaire, avec l&apos;accompagnement d&apos;un conseiller professionnel. D&apos;autres partenaires vérifiés pourront rejoindre progressivement l&apos;écosystème Umdeny Capital. Aucun partenaire n&apos;a l&apos;exclusivité d&apos;un secteur.
        </div>

        <div className="footer__bottom">
          <div>© 2019–2026 Umdeny Capital. Tous droits réservés. · <span style={{ color: "var(--gold-soft)", letterSpacing: "0.06em" }}>FROM PATRIMONY TO LEGACY</span></div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="#">Politique de confidentialité</a>
            <a href="#">Mentions légales</a>
            <a href="#">Conditions d&apos;utilisation</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function Chrome({ children }: { children: React.ReactNode }) {
  const [bandeauVisible, setBandeauVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {bandeauVisible && <Bandeau onClose={() => setBandeauVisible(false)} />}
      <Header bandeauVisible={bandeauVisible} scrolled={scrolled} />
      {children}
      <PreFooter />
      <Footer />
    </>
  );
}
