DEspendable: UI/UX Design & System Architecture Specification
1. Design Philosophy & Visual Identity
Objective: To create a banking interface that balances the "German Standard" of absolute security and trust with modern usability. The aesthetic is "Conservative Innovation"—familiar enough to be trusted, modern enough to be convenient.

1.1 Color Palette
The color system utilizes color psychology to convey stability (Blue) and action (Red), aligning with market leaders like Deutsche Bank and Sparkasse.   

Color Role	Hex Code	Visual Meaning & Usage
Primary Brand	#0018A8 (Dark Blue)	
Trust & Authority. Used for headers, primary buttons, and active tab states. Signals "Bank" to German users.

Secondary Brand	#E2001A (Signal Red)	
Alert & Action. Used delicately for "Logout," critical errors, and notification badges (e.g., unread Postbox messages).

Background	#F4F6F8 (Off-White)	Clarity. Reduces eye strain compared to pure white. Used for the main app background.
Surface	#FFFFFF (White)	Cleanliness. Used for cards, input fields, and modals.
Text Primary	#1C1C1C (Almost Black)	
Legibility. High contrast text for strict BITV 2.0 compliance.

Text Secondary	#666666 (Dark Grey)	Context. Used for labels, dates, and helper text.
  
1.2 Typography
Font Family: Roboto or Inter (Open Source, highly legible sans-serif).

Scale:

Heading 1: 24px, Bold (Page Titles).

Heading 2: 20px, Medium (Section Headers).

Body: 16px, Regular (Standard Text).

Caption: 12px, Regular (Timestamps, Footer legal text).

Numbers: Monospaced variant for tabular data (financial figures) to ensure alignment.

1.3 Formatting Standards (DIN 5008 Compliance)
All data presentation must strictly adhere to DIN 5008 to maintain credibility.   

Currency: 1.234,56 € (Comma separator, Point thousands, Space before symbol).

Date: DD.MM.YYYY (e.g., 31.12.2025).

Time: HH:MM Uhr (24-hour clock, e.g., 14:30 Uhr).

2. Information Architecture (Sitemap)
The application structure is shallow to reduce cognitive load, utilizing a standard Bottom Navigation Bar with four core distinct sections.

Code snippet
graph TD
    Login --> Dashboard
    
    subgraph "Bottom Navigation Bar"
        Dashboard[Overview (Finanzstatus)]
        Payments[Payments (Zahlungsverkehr)]
        Postbox[Postbox (Postfach)]
        Menu
    end

    Dashboard --> AccountDetail
    Dashboard --> TransactionList
    
    Payments --> Transfer
    Payments --> PhotoTransfer
    Payments --> StandingOrders
    
    Postbox --> DocumentView
    
    Menu --> CardControl
    Menu --> Profile
    Menu --> Legal[Impressum & Privacy]
3. UI Specifications: Page-by-Page
3.1 Login Screen (Anmeldung)
Layout: Clean, centered card on a blue background.

Elements:

Logo: Centered, top.

Input: Biometric Prompt (FaceID/Fingerprint) active by default.

Fallback: PIN field (5-6 digits, masked).

Footer links: "Impressum" (Legal Notice) and "Datenschutz" (Privacy) – Mandatory in Germany.   

UX Pattern: If the app detects a rooted/jailbroken device, it displays a blocking modal ("Device Insecure") and terminates, per BaFin security requirements.   

3.2 Dashboard (Finanzstatus)
The landing page after login.

Header:

User Greeting: "Guten Tag, [Name]".

Discreet Mode Toggle: An "Eye" icon in the top right. Tapping it blurs all monetary values on the screen (N26 style privacy).   

Total Balance Card:

Label: "Gesamtsaldo".

Value: XX.XXX,XX € (Large font).

Account List (Vertical Scroll):

Each account is a Card: "Girokonto", "Tagesgeld", "Credit Card".

Details: IBAN (masked: DEXX... 1234), Current Balance.

Interaction: Tapping an account card slides to 3.3 Transaction Details.

3.3 Transaction Details (Umsätze)
Header: Account Name & Available Balance.

Search Bar: Filter by Name, Amount, or Date.

List: Grouped by Month (e.g., "Januar 2025").

Row Item:

Left: Icon (Category/Merchant Logo).

Middle: Merchant Name & Date (DD.MM).

Right: Amount (Green for +, Black/Red for -).

Detail View (On Tap):

Shows full "Verwendungszweck" (Reference text) – highly important for German users to identify payments.   

Action Button: "Rücklastschrift" (Return Debit) for unauthorized direct debits (within 8 weeks).   

3.4 Payment Hub (Zahlungsverkehr)
Tabs: "Überweisung" (Transfer), "Dauerauftrag" (Standing Order), "Vorlagen" (Templates).

Floating Action Button (FAB) or Prominent Top Button:

Label: "Fotoüberweisung / QR-Code" (Photo Transfer).

Icon: Camera.

Function: Opens camera with an overlay frame to scan a paper invoice (GiroCode) or standard bill.   

Standard Transfer Form:

Recipient Name (Empfänger).

IBAN: Auto-formatting with spaces every 4 digits. Validates checksum immediately.

Amount (Betrag): EUR only.

Reference (Verwendungszweck): 140 chars max.

Execution Date: Default is "Sofort" (Instant).

Primary Action Button: "Weiter zur Freigabe" (Proceed to Authorization).

3.5 Postbox (Postfach)
Design: List view of unread documents.

Badges: Red dot on the tab icon if new legal documents (e.g., Monthly Statement) arrive.

Document Types: "Kontoauszug" (Statement), "Wertpapierabrechnung" (Securities).

UX Requirement: Users cannot delete legal documents; they can only "Archive" them. This reflects the "Durable Medium" requirement.   

4. UX Patterns & Interactions
4.1 Strong Customer Authentication (SCA) Simulation
Since this is a demo, we simulate the "2nd Factor" friction which builds trust.

User taps "Send Transfer".

App State: UI dims, a modal appears: "Bitte geben Sie den Auftrag frei." (Please release the order).

Interaction:

Scenario A (Same Device): "Opening pushTAN App..." -> Simulated switch -> "Biometric Check" -> Success -> Return to Banking App.

Scenario B (PhotoTAN): Display a color mosaic code. Prompt: "Scan with your other device."

4.2 Error Handling & Feedback
Tone: Formal, precise, non-alarmist.

Example (Invalid IBAN): "Die eingegebene IBAN ist ungültig. Bitte prüfen Sie die Eingabe." (The entered IBAN is invalid. Please check your input.)

Success Toast: "Überweisung erfolgreich ausgeführt." (Transfer successfully executed.)

4.3 Accessibility (BITV 2.0)
Contrast: All text/background ratios > 4.5:1.

Scaling: UI supports dynamic text sizing up to 200%.

Focus: All interactive elements have a visible focus state for keyboard navigation.   

5. System Design & Architecture
5.1 Technology Stack
Frontend (Mobile): Flutter or React Native (Codebase must be secure/obfuscated).

Reason: Cross-platform efficiency while maintaining native-like performance for list scrolling.

Frontend (Web): React.js.

Backend: Java (Spring Boot) or Go (Golang).

Reason: Java is the enterprise standard in German banking (consistency with legacy systems); Go is preferred for modern microservices.   

Database: PostgreSQL (Relational DB is mandatory for ACID compliance in financial transactions).

5.2 High-Level Architecture Diagram
Code snippet
graph LR
    User[User App] -- HTTPS/TLS 1.3 --> API_GW
    
    subgraph "Secure Zone (VPC)"
        API_GW --> Auth_Svc
        API_GW --> Core_Svc
        API_GW --> PSD2_Svc
        
        Core_Svc --> DB
        PSD2_Svc --> Ext_Bank
    end
    
    Auth_Svc --> HSM
5.3 Security & Compliance Layer
API Security: All external APIs (XS2A) must follow the Berlin Group NextGenPSD2 standard.   

Usage of QWACs (Qualified Website Authentication Certificates) for TPP identification.

Data Residency: All databases and backup servers must be physically located within the EU (ideally Frankfurt, Germany) to satisfy GDPR and Schrems II rulings.   

Telemetry:

Use self-hosted analytics (e.g., Matomo) to avoid US data transfer issues.

Implement "Incoming Pressure" monitoring to detect fraud spikes.   

5.4 Third-Party Integration
Map Service: OpenStreetMap (hosted) instead of Google Maps for ATM finder (Privacy preference).

OCR Engine: Tesseract (On-device) for scanning invoices in the "Photo Transfer" feature (Data minimization).

