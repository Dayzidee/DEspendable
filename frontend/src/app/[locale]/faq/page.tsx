export default function FAQ() {
    const faqs = [
        {
            question: "Wie eröffne ich ein Konto?",
            answer: "Klicken Sie auf 'Konto eröffnen', füllen Sie das Formular aus und verifizieren Sie Ihre Identität. Der gesamte Prozess dauert nur wenige Minuten."
        },
        {
            question: "Ist DEspendables sicher?",
            answer: "Ja, wir verwenden Verschlüsselung auf Bankniveau, Zwei-Faktor-Authentifizierung und sind von der BaFin reguliert."
        },
        {
            question: "Gibt es Kontoführungsgebühren?",
            answer: "Nein, die Kontoführung ist komplett kostenlos. Nur für bestimmte Sonderleistungen können Gebühren anfallen."
        },
        {
            question: "Wie funktionieren Peer-to-Peer Überweisungen?",
            answer: "Geben Sie einfach die E-Mail-Adresse des Empfängers ein, wählen Sie den Betrag und bestätigen Sie die Überweisung. Das Geld wird sofort übertragen."
        },
        {
            question: "Was ist das Belohnungsprogramm?",
            answer: "Bei jeder Transaktion sammeln Sie Punkte, die Sie gegen Cashback, Prämien oder höhere Kontostufen eintauschen können."
        },
        {
            question: "Kann ich mein Konto jederzeit kündigen?",
            answer: "Ja, Sie können Ihr Konto jederzeit ohne Kündigungsfrist schließen. Ihr Restguthaben wird auf ein von Ihnen angegebenes Konto überwiesen."
        },
        {
            question: "Wie kontaktiere ich den Support?",
            answer: "Sie erreichen uns per Live-Chat (24/7), E-Mail (support@despendables.de) oder Telefon (+49 30 1234 5678)."
        },
        {
            question: "Gibt es eine mobile App?",
            answer: "Ja, unsere App ist für iOS und Android verfügbar und bietet alle Funktionen der Web-Version."
        }
    ];

    return (
        <div className="min-h-screen bg-[#F4F6F8] py-20 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-[#0018A8] mb-4 text-center">Häufig gestellte Fragen</h1>
                <p className="text-xl text-[#666666] text-center mb-12">
                    Finden Sie schnell Antworten auf die wichtigsten Fragen
                </p>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <details key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 group">
                            <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center">
                                {faq.question}
                                <span className="text-[#0018A8] group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="text-[#666666] mt-4 leading-relaxed">{faq.answer}</p>
                        </details>
                    ))}
                </div>

                <div className="mt-12 bg-gradient-to-r from-[#0018A8] to-[#0025D9] rounded-2xl p-8 text-white text-center">
                    <h3 className="text-2xl font-bold mb-4">Weitere Fragen?</h3>
                    <p className="mb-6">Unser Support-Team hilft Ihnen gerne weiter!</p>
                    <a href="mailto:support@despendables.de" className="inline-block px-8 py-3 bg-white text-[#0018A8] font-bold rounded-lg hover:shadow-lg transition">
                        Kontakt aufnehmen
                    </a>
                </div>
            </div>
        </div>
    );
}
