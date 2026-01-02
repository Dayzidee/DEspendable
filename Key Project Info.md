
Comprehensive Analysis of the German Online Banking Ecosystem: Regulatory, Architectural, and User Experience Specifications
1. Introduction and Scope
The German financial sector is characterized by a distinct duality: it is one of the most technologically advanced markets in terms of backend standardization and interoperability, yet it remains culturally conservative regarding data privacy and security. For software architects and product developers intending to enter this market, understanding this dichotomy is paramount. A successful application must not only function technically but must also demonstrate a nuanced understanding of the "German Standard"—a blend of rigorous regulatory compliance, specific user interface expectations, and a deep-seated cultural emphasis on Sicherheit (security) and Datenschutz (data protection).

This report provides an exhaustive analysis of the German online banking landscape. It is designed to serve as a foundational document for building a market-compliant demo application. The analysis covers the regulatory hierarchy overseen by the Federal Financial Supervisory Authority (BaFin), the technical specifications of the Berlin Group NextGenPSD2 Application Programming Interfaces (APIs), the mandatory implementation of Strong Customer Authentication (SCA) via Transaction Authentication Numbers (TANs), and the granular details of User Interface (UI) and User Experience (UX) localization according to DIN 5008 standards. By synthesizing regulatory texts, technical documentation, and consumer research, this report offers a blueprint for developing a banking product that satisfies the rigorous demands of the German market.

2. Regulatory Governance and Supervisory Framework
The architecture of any German banking application is fundamentally defined by its regulatory environment. Unlike markets where "move fast and break things" is a viable strategy, the German financial ecosystem requires "safety by design" and "compliance by default." The governance structure is multi-layered, involving national supervisors, central banks, and European directives that have been transposed into strict national law.

2.1 The Federal Financial Supervisory Authority (BaFin)
The Bundesanstalt für Finanzdienstleistungsaufsicht (BaFin) acts as the primary gatekeeper and supervisor for the German financial market. Operating under the legal and technical oversight of the Federal Ministry of Finance, BaFin’s mandate is to ensure the proper functioning, stability, and integrity of the German financial system. For a developer, BaFin is the entity that defines the non-functional requirements of the application—specifically regarding security, availability, and risk management.   

BaFin’s supervision is proactive and granular. It does not merely react to failures but enforces standards that prevent them. The authority enforces the German Banking Act (Kreditwesengesetz - KWG), which governs credit institutions, and the Payment Services Supervision Act (Zahlungsdiensteaufsichtsgesetz - ZAG), which specifically regulates payment institutions and e-money institutions. If the proposed demo application involves processing payments or holding user funds, it falls directly under the scope of the ZAG. This classification brings with it a requirement for rigorous IT supervision, meaning the software architecture must be auditable and resilient from day one.   

2.1.1 The Role of the Deutsche Bundesbank
While BaFin is the primary supervisor, the Deutsche Bundesbank (Germany’s central bank) plays a critical operational and cooperative role. It works closely with BaFin in the ongoing supervision of institutions, particularly in analyzing the annual reports and audit reports of banks. Furthermore, the Bundesbank is integral to the payment systems infrastructure, ensuring the settlement of payments. In the context of the Payment Services Directive 2 (PSD2), the Bundesbank was involved in examining and adapting the supervisory requirements for IT, ensuring that the standardized requirements for the Single Market were effectively transposed into German supervisory practice.   

2.2 The Supervisory Requirements for IT (BAIT and ZAIT)
To operationalize the legal requirements of the KWG and ZAG, BaFin has issued specific circulars that serve as the "IT Bible" for German banks. These documents translate abstract legal obligations into concrete technical requirements. Ignoring these guidelines renders an application non-compliant and effectively unsellable in the German market.

2.2.1 BAIT: Banking Supervisory Requirements for IT
The Bankaufsichtliche Anforderungen an die IT (BAIT) clarifies what BaFin expects regarding technical security and operational stability. It mandates that the management board of a bank is responsible for the IT strategy, implying that IT security is a board-level concern, not just an IT department issue.   

Information Risk Management: The application must be built upon a risk management framework. Every data field and process flow must be assessed for its protection needs (confidentiality, integrity, availability, authenticity). This implies that the application backend must support granular data classification tags.

Identity and Access Management (IAM): BAIT requires a "need-to-know" principle for access rights. The application must enforce strict recertification of user rights and log all access to sensitive data. In a demo application, this necessitates a robust role-based access control (RBAC) system that is visible to the administrator.

Application Development and Operation: The circular requires that security is an integral part of the software development lifecycle. "State of the art" technology is a requirement, not a recommendation. Using deprecated encryption protocols (like TLS 1.0) or unpatched libraries is a direct violation of supervisory law.   

2.2.2 ZAIT: Payment Services Supervisory Requirements for IT
For Payment Service Providers (PSPs) and e-money institutions, BaFin issued the Zahlungsdiensteaufsichtliche Anforderungen an die IT (ZAIT). This document mirrors the BAIT but is tailored to the specific risks of payment processing.   

Operational Resilience: ZAIT emphasizes the ability to handle peak loads and recover from disruptions. The application architecture must demonstrate high availability (HA) and disaster recovery capabilities.

Cloud Outsourcing: If the application runs on cloud infrastructure (AWS, Azure, Google Cloud), ZAIT imposes strict rules on "outsourcing." The institution must retain inspection rights and have a clear "exit strategy" to migrate data away from the cloud provider if necessary. This impacts the architectural decision-making process, favoring containerized and portable microservices over vendor-locked serverless functions.   

2.3 The Payment Services Directive 2 (PSD2)
The Second Payment Services Directive (EU) 2015/2366, known as PSD2, is the overarching European framework that BaFin enforces. It fundamentally reshaped the banking landscape by mandating "Open Banking" and enhancing security.   

2.3.1 Access to Account (XS2A) and TPPs
PSD2 broke the monopoly banks held over their customer data. It introduced the requirement for banks (Account Servicing Payment Service Providers - ASPSPs) to provide a dedicated interface for Third-Party Providers (TPPs).

Payment Initiation Service Providers (PISP): These services initiate payments on behalf of the user (e.g., paying at an online shop directly from the bank account).

Account Information Service Providers (AISP): These services aggregate data (e.g., multi-banking apps that show balances from Deutsche Bank, Sparkasse, and Commerzbank in one view).   

Implication for Development: A modern German banking app is expected to be "multi-bank capable" (multibankfähig). The demo application should ideally demonstrate the ability to not only display its own accounts but also fetch data from external banks using the XS2A interface.   

2.3.2 Strong Customer Authentication (SCA)
PSD2 mandates SCA for all electronic payment transactions and remote channel access. This requirement effectively ended the era of static passwords and simple TAN lists (iTAN) in Germany. The application must implement authentication mechanisms that combine at least two of the three factors: Knowledge (password), Possession (device), and Inherence (biometrics).   

3. Security Architecture: The TAN Ecosystem and Fraud Prevention
In the German banking psyche, "friction" during the login or transaction process is often equated with "security." While other markets strive for invisible authentication, German users expect a visible, deliberate confirmation step for transactions. This is the domain of the Transaction Authentication Number (TAN).

3.1 The Evolution and Necessity of TANs
The TAN is a one-time password used to authorize a specific transaction. Under PSD2, Dynamic Linking is mandatory: the TAN must be cryptographically bound to the specific amount and the specific payee of the transaction. If the amount or payee changes (e.g., via a Man-in-the-Middle attack), the TAN becomes invalid.   

3.2 Technical Implementation of TAN Procedures
The demo application must support or simulate the prevailing TAN procedures to be considered realistic.

3.2.1 App-Based Procedures (pushTAN / BestSign)
This is the dominant method for smartphone users. It typically involves two logical components: the "Banking App" (for initiating) and the "Security App" (for signing), although they can be integrated if secure enclave technology is used.

Workflow: The user enters transfer details in the banking app. The app communicates with the bank server, which triggers a push notification to the registered security app (e.g., S-pushTAN, SecurePlus, BestSign).

User Interaction: The user opens the security app (authenticating via Biometrics or a separate PIN), reviews the transaction details (Amount, IBAN), and taps "Release" (Freigeben). The security app sends a signed token to the bank, which then executes the transaction.   

Security Architecture: The pushTAN app relies on a cryptographic key pair generated during enrollment. The private key is stored in the device's secure hardware (Keystore/Keychain) and is unlocked only by the user's biometric or PIN input. The app must perform rigorous integrity checks (root/jailbreak detection) and refuse to launch on compromised devices to meet BSI (Federal Office for Information Security) standards.   

3.2.2 PhotoTAN and QR-TAN
Favored by Deutsche Bank and Commerzbank, this method bridges the air gap between a PC and a smartphone, or a PC and a hardware reader.

Workflow: When a user initiates a transaction on a desktop browser, the bank generates a colorful mosaic code (photoTAN) or a specific QR code containing the transaction data.

Decoupling: The user scans this code with their smartphone app or a dedicated hardware reader. The device decodes the image locally (offline), extracts the transaction data (IBAN, Amount), and displays it for verification along with a generated TAN. The user types this TAN back into the browser.   

Visual Trust: This method is highly trusted because the data is verified on a "second channel" (the phone/reader) that is physically separate from the potentially infected PC.   

3.2.3 ChipTAN (Sm@rt-TAN)
This method is widespread among the Sparkassen (Savings Banks) and Volksbanken (Cooperative Banks) and is preferred by privacy-conscious users who do not wish to use a smartphone for banking.

Hardware: Requires the user's Girocard (Debit Card) and a standalone TAN generator.

Mechanism: The user inserts their card into the generator. The banking interface displays a flickering barcode (optical coupling). The user holds the generator against the screen. The generator's optical sensors read the data.

Verification: The generator displays the IBAN and Amount on its trusted LCD screen. The user confirms, and the generator calculates a TAN using the chip on the card.   

Implementation: Supporting this in a demo app involves simulating the "waiting" state where the user interacts with the hardware, acknowledging the time delay inherent in this secure process.

3.3 Incident Reporting and Management
BaFin imposes strict timelines for reporting security incidents. A "serious payment security incident" is defined as an event that impacts the integrity, availability, confidentiality, or authenticity of payment-related services.   

Incident Reporting Lifecycle:

Phase	Timeline	Requirement
Detection	T=0	Incident monitoring systems trigger an alert.
Classification	T+24 Hours	The PSP must determine if the incident meets the "serious" criteria (Impact Level High).
Initial Report	T+4 Hours	Within 4 hours of classification, BaFin must be notified via a standardized form.
Intermediate	Updates	Regular updates must be provided as the situation evolves.
Final Report	Post-Resolution	A conclusive analysis of the root cause and mitigation measures.
This regulatory requirement mandates that the application backend includes a sophisticated Security Information and Event Management (SIEM) system capable of assessing the "impact level" (e.g., number of affected users, financial volume at risk) in real-time.   

3.4 Fraud Prevention Strategies
German banks employ "Legitimate Interest" (GDPR Art. 6(1)(f)) as the legal basis for processing data to prevent fraud.   

Incoming Pressure: Systems monitor the rate of attempted fraudulent transactions relative to legitimate traffic. A spike in "Incoming Pressure" triggers automated defensive measures (e.g., blocking IPs or requiring step-up authentication).   

Geo-Blocking: A common feature in German apps is the ability for users to proactively block their cards for specific geographic regions (e.g., "Block usage in Asia and Africa"). This puts the control—and the sense of security—directly in the user's hands.   

4. The PSD2 & Open Banking Landscape: Technical Specifications
The backend communication of a German banking application is largely standardized by the Berlin Group, a pan-European interoperability initiative. While PSD2 set the legal requirement for APIs, the Berlin Group provided the technical "how-to."

4.1 The Berlin Group NextGenPSD2 Framework
The NextGenPSD2 XS2A Framework is the dominant API standard in Germany, adopted by the vast majority of banks (including the Sparkassen-Finanzgruppe, Deutsche Bank, Commerzbank, and the cooperative banks). It is a RESTful API specification that uses JSON for data exchange and relies on qualified certificates for security.   

4.2 Core API Services (XS2A)
The framework defines three primary service categories that the demo application should simulate:

Account Information Service (AIS):

Function: Retrieval of account data.

Endpoints: GET /accounts (list of accounts), GET /accounts/{account-id}/balances (current balance), GET /accounts/{account-id}/transactions (transaction history).

Constraint: Access to transaction history older than 90 days often requires a renewed SCA challenge, reflecting the "session" nature of banking access.   

Payment Initiation Service (PIS):

Function: Initiating a transfer directly from the bank account.

Endpoints: POST /payments/sepa-credit-transfers (standard transfer), POST /payments/instant-sepa-credit-transfers (real-time transfer).

Workflow: The TPP creates a payment resource, and the bank responds with an SCA link or challenge.   

Confirmation of Funds (PIIS):

Function: A simple Yes/No check on whether an account has sufficient funds for a specific transaction amount. Used primarily by card issuers.   

4.3 Consent Models and Authentication
Before any data is exchanged, a Consent resource must be created.

Endpoint: POST /consents

Validity: Consents typically have a lifespan of 90 days. The application UI must handle the "Consent Expiry" state gracefully, prompting the user to re-authenticate when the token expires. This is a recurring friction point in German open banking that users are accustomed to.   

SCA Approaches in API Flows: The Berlin Group standard supports multiple ways to handle the SCA challenge. In Germany, the Redirect and Decoupled approaches are most common.

Redirect Approach: The TPP application redirects the user to the bank's own app (or website). The user authenticates there, and is then redirected back to the TPP app with an authorization code. This is the most secure method as the TPP never sees the user's credentials.

Decoupled Approach: The TPP initiates the request. The bank pushes a notification to the user's separate SCA app (e.g., pushTAN). The user approves it there. The TPP polls the status or receives a callback. This provides a smoother UX on mobile devices.   

4.4 Technical Requirements for Developers
eIDAS Certificates: To interact with production APIs, a developer needs a Qualified Website Authentication Certificate (QWAC) and a Qualified Certificate for Electronic Seals (QSealC). These identify the TPP legally.   

Sandbox Environments: For the purpose of a demo application, one cannot easily get QWACs. Instead, developers should utilize the Sandbox environments provided by major German banks (e.g., Deutsche Bank API Program, Raiffeisen Developer Portal). These sandboxes mimic the production behavior (OAuth2 flows, Consent creation) but accept test certificates or provide API keys for simulation.   

5. Consumer Interface & Experience (UI/UX)
Designing for the German market requires navigating a spectrum of expectations. On one end is the "Traditional" archetype (represented by Sparkasse), which prioritizes information density, comprehensive menus, and a formal tone. On the other is the "Neobank" archetype (represented by N26), which prioritizes minimalism, lifestyle integration, and speed. A robust demo application should ideally bridge these worlds or consciously choose a specific persona.

5.1 Design Philosophies: Trust vs. Lifestyle
Table 1: Comparative Analysis of Banking Design Archetypes in Germany

Feature	Traditional (Sparkasse, Deutsche Bank)	Modern / Neobank (N26, C24)
Primary Color	
Red (#E2001A) for Sparkasse (Energy, Presence). Dark Blue (#0018A8) for Deutsche Bank (Authority, Trust, Stability).

Teal/Mint (#48A298) and White. Uses color to signify freshness, lack of stress, and "lifestyle" compatibility.

Navigation Structure	
Hierarchical/Deep. Menus categorize products (Accounts, Depots, Cards, Service). FABs are rare; actions are listed in menus.

Flat/Timeline. The Home screen is a feed. "Spaces" (sub-accounts) are drag-and-drop. Actions are often gesture-based or via a central button.

Information Density	High. Users expect to see IBANs, BIC codes, and "Last Login" timestamps prominently. Completeness = Trust.	
Low/Progressive. Details are hidden until requested. "Discreet Mode" allows blurring sensitive data.

Tone of Voice	Formal ("Sie"). "Bitte geben Sie Ihre TAN ein."	Casual ("Du"). "Dein Geld, deine Regeln."
Key Visual Metaphor	The Branch. The app is a digital extension of the physical bank branch.	The Wallet. The app is a lifestyle tool for managing daily liquidity.
  
5.2 Navigation Paradigms and Structural UI
For a comprehensive demo, the navigation should likely follow the standard Bottom Tab Bar pattern, which is familiar to the vast majority of users.

Overview (Finanzstatus): The landing page. Displays a summarized list of all Girokonten (Current Accounts), Tagesgeld (Savings), and Depots (Investments). It must show the total balance clearly.

Banking / Payments (Zahlungsverkehr): The functional core. Contains entry points for Überweisung (Transfer), Dauerauftrag (Standing Order), and Lastschrift (Direct Debit) management.

Postbox (Postfach): A uniquely German necessity. This tab is not just for "messages" but for legal documents. Bank statements (Kontoauszüge) are delivered here as PDFs. The UI must reflect that this is a secure archive.   

Service / Settings: Card blocking, limit changes, personal data, and app settings.

5.3 Accessibility and BITV 2.0 Compliance
In Germany, accessibility is a regulatory mandate for many institutions and a strong market standard for others. The Barrier-Free Information Technology Ordinance 2.0 (BITV 2.0) aligns German law with the European standard EN 301 549 and WCAG 2.1 Level AA.   

Contrast: UI colors must meet strict contrast ratios (4.5:1 for normal text). This favors the high-contrast "Dark Blue on White" aesthetic of Deutsche Bank.   

Scalability: Text must be resizable up to 200% without breaking the layout.

Assistive Tech: The app must be fully navigable via keyboard (for desktop web apps) and screen readers (TalkBack/VoiceOver). Form fields for IBANs must have correct aria-labels and input masking.

Easy Language: Public-facing banking websites often require a section in "Leichte Sprache" (Easy Language) and German Sign Language videos explaining the service.   

5.4 Specialized UI Features
Discreet Mode: Popularized by N26, this feature allows users to blur their account balances and transaction amounts with a gesture (e.g., waving a hand over the proximity sensor or a specific tap). This addresses the German cultural sensitivity regarding financial privacy in public spaces (e.g., on the U-Bahn).   

Photo Transfer (Fotoüberweisung): Germans still receive many paper invoices. A feature that allows users to photograph an invoice and automatically populate the transfer form using OCR is highly valued. The UI for this typically involves a camera overlay with a frame, followed by a verification screen where the parsed data (IBAN, Amount, Reference) is reviewed.   

6. Localization: Language, Currency, and DIN 5008
To be credible, the application must "speak German" not just in language, but in format. The German Institute for Standardization (DIN) publishes DIN 5008, which governs writing and layout standards. Deviating from these standards signals a lack of professionalism or a "foreign" origin, eroding trust.   

6.1 Numerical and Currency Formatting
Decimal Separator: The comma (,) is the only acceptable decimal separator.

Example: 12,50 (Twelve and a half).

Thousands Separator: The dot (.) is used to group thousands.

Example: 1.000.000 (One million).

Currency Symbol: The Euro symbol (€) is placed after the numeric value, separated by a non-breaking space.

Correct: 1.234,56 €

Incorrect: €1,234.56 or 1,234.56€.   

6.2 Date and Time Standards
Date: The standard format is DD.MM.YYYY.

Example: 31.12.2025.

Time: The 24-hour clock is mandatory in official and banking contexts.

Example: 14:30 Uhr (not 2:30 PM).

Implementation: Developers should use the locale de-DE in their formatting libraries (e.g., Intl.DateTimeFormat in JS, java.time.format in Java) to ensure compliance automatically.   

6.3 Banking Terminology Glossary
The use of precise terminology is critical. Vague translations (e.g., "Check Account" instead of "Girokonto") are immediate trust-killers.

Table 2: Essential German Banking Terminology

English Concept	German UI Term	Context & Nuance
Current Account	Girokonto	The primary account for salary and rent.
Transfer	Überweisung	A standard push payment.
Standing Order	Dauerauftrag	
Critical for rent (Miete) payments. Users expect a UI to manage these easily.

Direct Debit	Lastschrift	
A pull payment authorized by a mandate. The app must allow viewing active mandates.

Statement	Kontoauszug	A legal document, not just a list of transactions.
Debit Card	Girocard	
Specific national scheme. Distinct from Kreditkarte (Credit Card).

Reference	Verwendungszweck	
A 140-char field crucial for identifying payments (e.g., "Invoice 12345"). Users rely on this heavily.

Postbox	Postfach	The secure document archive.
  
7. Core Banking Features and Contents
Beyond the UI, the feature set must reflect German banking habits.

7.1 Multibanking
German users often hold accounts at multiple institutions (e.g., a Girokonto at Sparkasse, a Depot at ING, and a Credit Card at Barclays). A modern app is expected to support Multibanking, allowing the user to add external accounts via the XS2A interface. The app aggregates the balances into a "Total Financial Status" (Finanzstatus).   

7.2 The Digital Mailbox (Elektronisches Postfach)
In Germany, the delivery of bank statements has legal implications. If a statement is not objected to within a certain period (usually 6 weeks), it is considered accepted. Therefore, the "Postbox" is not just a notification center; it is a Durable Medium (Dauerhafter Datenträger).

Retention: Documents must be stored securely and often cannot be deleted by the user immediately.

Content: Includes monthly statements, credit card bills, and changes to Terms & Conditions (AGB).   

7.3 Card Control Features
Users expect granular control over their payment instruments directly within the app.

Geo-Control: Toggles to enable/disable card usage in specific regions (e.g., "World," "Europe only," "Germany only").   

Channel Control: Toggles for "Internet Payments," "ATM Withdrawals," and "In-Store Payments."

Temporary Block: A "Lock Card" toggle that instantly disables the card without permanently canceling it (useful for misplaced cards).

8. Data Protection, GDPR, and Telemetry
Data privacy (Datenschutz) is a cultural pillar in Germany. The implementation of General Data Protection Regulation (GDPR) in the banking sector is strict, particularly regarding the principle of Data Minimization (Datensparsamkeit).

8.1 Legitimate Interest vs. Consent
Fraud Prevention: Processing data for fraud detection (e.g., analyzing device location) is typically covered under "Legitimate Interest" (Art. 6(1)(f) GDPR).   

Analytics: Processing data for marketing analytics usually requires explicit, granular Consent (Opt-in). The "Cookie Banner" or "Tracking Consent" dialog is the first screen a user sees.

Telemetry Tools: Using US-based analytics tools (like Google Analytics) is legally complex due to data transfer restrictions (Schrems II). German banks often prefer self-hosted solutions like Matomo or Simple Analytics, which can be configured to be "cookie-less" and privacy-compliant.   

8.2 Usage Telemetry and Performance KPIs
To ensure the application performs well and remains secure, specific Key Performance Indicators (KPIs) must be tracked.

Table 3: Key Telemetry Metrics for German Banking Apps

Metric Category	KPI	Relevance in German Market
Security	Incoming Pressure	
The ratio of fraudulent transaction attempts to total traffic. Spikes indicate an attack.

Security	Precision	
The percentage of declined transactions that were actually fraudulent (avoiding false positives is key for user trust).

Performance	SCA Success Rate	The percentage of successful TAN challenges. A drop here indicates a critical failure in the 2FA infrastructure.
UX / Tech	First Input Delay (FID)	
Latency between user tap and app response. Should be <100ms. Germans have low tolerance for sluggish banking apps.

Engagement	Login Frequency	High frequency is common as users check balances often ("Check-in" behavior).
  
9. Technical Implementation Guide for the Demo Application
Based on the research, the following specifications should guide the development of the demo application to ensure it meets the "German Standard."

9.1 Technology Stack Recommendations
Frontend: Native (Kotlin/Swift) is preferred for performance and access to secure hardware enclaves. If using Cross-Platform (Flutter/React Native), ensure strict bridge security and use native modules for biometric authentication.

Backend: Java (Spring Boot) is the enterprise standard in German banking. Go is gaining traction for microservices.

API Interface: Strict adherence to the Berlin Group NextGenPSD2 YAML definition for all external-facing endpoints.

9.2 Step-by-Step Implementation Plan
Phase 1: Foundation & Compliance

Imprint & Privacy: Create the Impressum and Datenschutz views accessible from the login screen.

Consent Manager: Implement a GDPR-compliant consent dialog at first launch.

Secure Storage: Implement EncryptedSharedPreferences (Android) / Keychain (iOS) for storing tokens. NEVER store credentials in plain text.

Phase 2: Authentication & Home

Login Flow: Implement Biometric Login + Fallback to PIN. Display "Last successful login:" on the dashboard.   

Dashboard: Display the Finanzstatus (Total Balance). Use correct currency formatting (1.234,56 €). Implement "Discreet Mode" (blur effect).

Phase 3: Core Transactions

Transfer Screen: Create form with IBAN validation (Check checksum for DE IBANs). Include a mandatory Verwendungszweck field.

SCA Simulation: When the user clicks "Send", trigger a "Verify Transaction" flow.

Option A (Decoupled): Show a spinner "Waiting for approval in pushTAN app..."

Option B (Redirect): Simulate a redirect to a mock SCA provider.

Phase 4: Advanced Features

Photo Transfer: Integrate a camera view with an overlay frame for scanning invoices.

Postbox: Create a list view for PDF documents with a "Download/Share" intent.

By strictly following these specifications, the demo application will demonstrate a profound "know-how" of the German banking system, moving beyond a generic financial app to a product that fits seamlessly into the highly regulated, security-conscious, and standardized German market.