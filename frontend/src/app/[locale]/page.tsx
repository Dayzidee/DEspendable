"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Shield, Zap, TrendingUp, Award, HeadphonesIcon, CreditCard } from "lucide-react";
import { useTranslations } from 'next-intl';
import CountUp from "@/components/CountUp";
import FadeIn from "@/components/FadeIn";
import ScrollProgress from "@/components/animations/ScrollProgress";
import AnimatedBackground from "@/components/animations/AnimatedBackground";
import TextReveal from "@/components/animations/TextReveal";
import MagneticButton from "@/components/animations/MagneticButton";
import FloatingElements from "@/components/animations/FloatingElements";
import CascadingCards from "@/components/animations/CascadingCards";
import AnimatedCounter from "@/components/animations/AnimatedCounter";
import ScrollReveal from "@/components/animations/ScrollReveal";
import LandingHeader from "@/components/navigation/LandingHeader";

export default function Home() {
  const t = useTranslations();
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F6F8] via-white to-[#E3E7FF] relative overflow-hidden">
      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Animated Background */}
      <AnimatedBackground />
      {/* Navigation */}
      <LandingHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative z-10"
            >
              <div className="mb-8">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] tracking-tight">
                  <TextReveal type="words" stagger={0.08}>
                    <span className="text-[#1C1C1C] block">{t("landing.hero_title")}</span>
                  </TextReveal>
                  <TextReveal type="words" stagger={0.08} delay={0.3}>
                    <span className="gradient-text block mt-2">{t("landing.hero_subtitle")}</span>
                  </TextReveal>
                </h1>
              </div>
              <p className="text-xl text-[#666666] mb-8 leading-relaxed">
                {t("landing.hero_description")}
              </p>
              <div className="flex gap-4 mb-12">
                <MagneticButton
                  href="/signup"
                  strength={0.4}
                  className="group px-8 py-4 bg-gradient-to-r from-[#0018A8] to-[#0025D9] text-white font-bold rounded-xl shadow-xl flex items-center gap-2"
                >
                  {t("landing.cta_primary")}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </MagneticButton>
                <MagneticButton
                  href="#features"
                  strength={0.3}
                  className="px-8 py-4 border-2 border-[#0018A8] text-[#0018A8] font-bold rounded-xl hover:bg-[#0018A8] hover:text-white transition-all"
                >
                  {t("landing.cta_secondary")}
                </MagneticButton>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#0018A8] mb-1">
                    <AnimatedCounter end={50000} suffix="+" duration={2.5} />
                  </div>
                  <div className="text-sm text-[#666666]">{t("landing.stats_users")}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#0018A8] mb-1">
                    <AnimatedCounter end={2} suffix="M€+" duration={2.5} />
                  </div>
                  <div className="text-sm text-[#666666]">{t("landing.stats_transactions")}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#0018A8] mb-1">
                    <AnimatedCounter end={99.9} decimals={1} suffix="%" duration={2.5} />
                  </div>
                  <div className="text-sm text-[#666666]">{t("landing.stats_uptime")}</div>
                </div>
              </div>
            </motion.div>

            {/* Right: Cascading Cards with Floating Elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative z-10"
            >
              {/* Floating Banking Elements */}
              <FloatingElements />

              {/* Cascading Cards Animation */}
              <CascadingCards />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">{t("landing.features_title")}</h2>
              <p className="text-xl text-[#666666]">
                {t("landing.features_subtitle")}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal stagger={0.15} direction="scale">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Zap className="w-8 h-8" />,
                  title: t("landing.feature_transfers"),
                  description: t("landing.feature_transfers_desc"),
                  color: "from-yellow-400 to-orange-500",
                },
                {
                  icon: <TrendingUp className="w-8 h-8" />,
                  title: t("landing.feature_ai"),
                  description: t("landing.feature_ai_desc"),
                  color: "from-blue-400 to-blue-600",
                },
                {
                  icon: <CreditCard className="w-8 h-8" />,
                  title: t("landing.feature_cards"),
                  description: t("landing.feature_cards_desc"),
                  color: "from-purple-400 to-purple-600",
                },
                {
                  icon: <Award className="w-8 h-8" />,
                  title: t("landing.feature_rewards"),
                  description: t("landing.feature_rewards_desc"),
                  color: "from-green-400 to-green-600",
                },
                {
                  icon: <Shield className="w-8 h-8" />,
                  title: t("landing.feature_security"),
                  description: t("landing.feature_security_desc"),
                  color: "from-red-400 to-red-600",
                },
                {
                  icon: <HeadphonesIcon className="w-8 h-8" />,
                  title: t("landing.feature_support"),
                  description: t("landing.feature_support_desc"),
                  color: "from-indigo-400 to-indigo-600",
                },
              ].map((feature, index) => (
                <FadeIn key={index} delay={index * 0.1}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="card-hover bg-white border border-gray-100 rounded-2xl p-6 shadow-md"
                  >
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-[#666666]">{feature.description}</p>
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-gradient-to-br from-[#0018A8] to-[#0025D9] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <h2 className="text-4xl font-bold mb-6">{t("landing.about_title")}</h2>
              <p className="text-lg opacity-90 mb-6 leading-relaxed">
                {t("landing.about_text1")}
              </p>
              <p className="text-lg opacity-90 mb-8 leading-relaxed">
                {t("landing.about_text2")}
              </p>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">BaFin</div>
                  <div className="text-sm opacity-80">Reguliert</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">GDPR</div>
                  <div className="text-sm opacity-80">Konform</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">PCI-DSS</div>
                  <div className="text-sm opacity-80">{t("landing.pci_compliant") || "Certified"}</div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { year: "2020", text: t("landing.milestone_2020") || "Foundation" },
                  { year: "2021", text: t("landing.milestone_2021") || "10K Users" },
                  { year: "2023", text: t("landing.milestone_2023") || "€100M Volume" },
                  { year: "2025", text: t("landing.milestone_2025") || "50K+ Users" },
                ].map((milestone, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                  >
                    <div className="text-3xl font-bold mb-2">{milestone.year}</div>
                    <div className="text-sm opacity-90">{milestone.text}</div>
                  </motion.div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">{t("landing.contact_title")}</h2>
            <p className="text-xl text-[#666666]">
              {t("landing.contact_subtitle")}
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8">
            <FadeIn delay={0.1}>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold mb-6">{t("landing.contact_form_title") || "Send Message"}</h3>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder={t("landing.contact_name")}
                    className="w-full px-4 py-3 bg-[#F4F6F8] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0018A8]"
                  />
                  <input
                    type="email"
                    placeholder={t("landing.contact_email")}
                    className="w-full px-4 py-3 bg-[#F4F6F8] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0018A8]"
                  />
                  <textarea
                    placeholder={t("landing.contact_message")}
                    rows={4}
                    className="w-full px-4 py-3 bg-[#F4F6F8] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0018A8]"
                  />
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#0018A8] to-[#0025D9] text-white font-bold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    {t("landing.contact_submit")}
                  </button>
                </form>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h4 className="font-bold mb-2">{t("landing.contact_address")}</h4>
                  <p className="text-[#666666]">
                    Friedrichstraße 123<br />
                    10117 Berlin, Deutschland
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h4 className="font-bold mb-2">{t("landing.contact_info")}</h4>
                  <p className="text-[#666666]">
                    E-Mail: support@despendables.de<br />
                    {t("landing.phone") || "Phone"}: +49 30 1234 5678
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h4 className="font-bold mb-2">{t("landing.contact_hours")}</h4>
                  <p className="text-[#666666]">
                    {t("landing.hours_weekdays") || "Mon-Fri"}: 9:00 - 18:00 {t("landing.hours_suffix") || "o'clock"}<br />
                    {t("landing.hours_saturday") || "Sat"}: 10:00 - 14:00 {t("landing.hours_suffix") || "o'clock"}
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1C1C1C] text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">DEspendables</h3>
              <p className="text-gray-400 text-sm">
                {t("landing.footer_tagline") || "Modern banking for the digital generation."}
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t("landing.footer_products") || "Products"}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/dashboard" className="hover:text-white transition">{t("accounts.checking")}</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition">{t("accounts.savings")}</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition">{t("accounts.investment")}</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition">{t("landing.footer_loans") || "Loans"}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t("landing.footer_company") || "Company"}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#about" className="hover:text-white transition">{t("nav.about")}</Link></li>
                <li><Link href="#contact" className="hover:text-white transition">{t("common.contact_us")}</Link></li>
                <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t("landing.footer_legal") || "Legal"}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/impressum" className="hover:text-white transition">{t("legal.impressum")}</Link></li>
                <li><Link href="/datenschutz" className="hover:text-white transition">{t("legal.privacy")}</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">{t("legal.terms")}</Link></li>
                <li><Link href="/cookies" className="hover:text-white transition">{t("legal.cookies")}</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            © 2026 DEspendables Bank AG. {t("landing.footer_rights") || "All rights reserved."}
          </div>
        </div>
      </footer>
    </div>
  );
}
