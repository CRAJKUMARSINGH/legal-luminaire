# Evidence Matrix (Electronic & Cyber Forensic) – FIN_04_DIGITAL_FRAUD_2026

| Ref ID | Document Description | Source | Status | Fact-Fit Gate / Holding Impact |
|--------|----------------------|--------|--------|--------------------------------|
| ELEC-01 | CFSL Device Image Report (Redmi Note 12) | CFSL Jaipur Laboratory | VERIFIED | Concludes NEGATIVE for APK malware, victim banking credentials, or spoofing software |
| ELEC-02 | Airtel ISP CGNAT Server Logs | ISP Nodal Officer | SECONDARY | Fails to match source port mapping; 1,200 subscribers shared single public IP simultaneously |
| ELEC-03 | Section 65B Certificate for Bank Logs | Canara Bank Nodal Officer | PENDING / DEFECTIVE | Signed by branch operations manager, not certified systems administrator |
| ELEC-04 | UPI Switch Transaction Records | NPCI Transaction Log | COURT_SAFE | IP assigned to payment session originated from offshore VPN exit node |
| ELEC-05 | IMEI / IMSI Tower Dump | Police Cyber Cell | SECONDARY | Accused tower location 42 km away from cell tower cited in SMS delivery log |

## Mandatory Legal Precedents
1. **Arjun Panditrao Khotkar v. Kailash Kushanrao Gorantyal (2020) 7 SCC 1**: Section 65B(4) certificate is a condition precedent to admissibility of electronic records. In absence of contemporaneous sysadmin certification, server logs cannot be read in evidence.
2. **State of Delhi v. Mohd. Afzal (2003)**: Dynamic IP addresses without source port translation (NAT logs) cannot link a specific terminal to an online cyber offence beyond reasonable doubt.
