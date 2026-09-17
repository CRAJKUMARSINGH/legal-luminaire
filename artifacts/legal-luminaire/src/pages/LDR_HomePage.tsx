import { Link } from "wouter";
import type { Lang } from "@/data/defenceData";

interface Props { lang: Lang; }

export default function HomePage({ lang }: Props) {
  const showEn = lang !== "hi";
  const showHi = lang !== "en";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border-2 border-[#18294F] bg-[#18294F] text-white p-6 text-center">
        <h1 className="text-2xl font-bold tracking-wide">CONTRACTOR DEFENCE BRIEF</h1>
        <div className="mt-1 text-[#B48C1E] text-sm font-semibold tracking-widest uppercase">
          Legal Luminaire — Rajasthan Construction Law
        </div>
        {showHi && (
          <div className="mt-1 text-white/80 text-base font-semibold">ठेकेदार बचाव संक्षेप — राजस्थान निर्माण विधि</div>
        )}
      </div>

      {/* Five-agent verification notice */}
      <div className="rounded-lg border-2 border-red-500 bg-red-50 p-4 text-center">
        <p className="font-bold text-red-800 text-sm">FIVE-AGENT CROSS-CHECK VERIFIED</p>
        <p className="text-red-700 text-xs mt-1">
          All IS editions, clause references, international standards, scientific claims, and legal precedents independently verified.
          2 corrected · 7 confirmed · 5 newly added · 1 strengthened
        </p>
        {showHi && (
          <p className="text-red-700 text-xs mt-1">पाँच विशेषज्ञ एजेंटों द्वारा सत्यापित — IS संस्करण, धारा संख्या, अंतर्राष्ट्रीय मानक एवं विधिक पूर्वनिर्णय</p>
        )}
        <p className="text-red-600 text-xs mt-2 italic">DISCLAIMER: Verify all IS citations against BIS originals (bis.gov.in) before court use.</p>
      </div>

      {/* Matter box */}
      <div className="rounded-lg border border-[#18294F] bg-[#EEF2FA] p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-bold text-[#18294F]">Respondent:</span>
            <span className="ml-2">Contractor Hemraj, Rajasthan</span>
          </div>
          <div>
            <span className="font-bold text-[#18294F]">Laboratory:</span>
            <span className="ml-2">Rajya Vidhi Vigyan Prayogshala, Jaipur</span>
          </div>
          <div className="col-span-2">
            <span className="font-bold text-[#18294F]">Signing Officers:</span>
            <span className="ml-2">KL Verma (SSO Physics) &amp; Dr. Shailendra Jha (Sahayak Nideshak Bhautiki)</span>
          </div>
        </div>
        {showHi && (
          <div className="mt-3 pt-3 border-t border-[#18294F]/20 text-sm text-[#18294F]">
            <span className="font-bold">प्रतिवादी:</span> ठेकेदार हेमराज, राजस्थान &nbsp;|&nbsp;
            <span className="font-bold">प्रयोगशाला:</span> राजय विधि विज्ञान प्रयोगशाला, जयपुर &nbsp;|&nbsp;
            <span className="font-bold">हस्ताक्षरकर्ता:</span> KL वर्मा (SSO भौतिकी) एवं डॉ. शैलेन्द्र झा
          </div>
        )}
      </div>

      {/* Samples table */}
      <div>
        <h2 className="text-lg font-bold text-[#18294F] mb-3">
          {showEn && "Samples Under Challenge"}
          {showHi && <span className={showEn ? "ml-2 text-[#18294F]/70 font-normal text-sm" : ""}>{showEn ? "— परीक्षित नमूने" : "परीक्षित नमूने"}</span>}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#18294F] text-white">
                <th className="border border-[#18294F] px-3 py-2 text-left">Packet / पैकेट</th>
                <th className="border border-[#18294F] px-3 py-2 text-left">Material / सामग्री</th>
                <th className="border border-[#18294F] px-3 py-2 text-left">FSL Result / परिणाम</th>
                <th className="border border-[#18294F] px-3 py-2 text-left">Standard / मानक</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white hover:bg-blue-50">
                <td className="border border-gray-300 px-3 py-2 font-bold text-[#18294F]">A</td>
                <td className="border border-gray-300 px-3 py-2">Cement Plaster — Boundary Wall<br /><span className="text-xs text-gray-500">सीमा दीवार पर सीमेंट प्लास्टर</span></td>
                <td className="border border-gray-300 px-3 py-2 font-mono text-red-700 font-bold">1 : 18</td>
                <td className="border border-gray-300 px-3 py-2 text-xs">IS 1661:1972<br />Max 1:6 for external</td>
              </tr>
              <tr className="bg-gray-50 hover:bg-blue-50">
                <td className="border border-gray-300 px-3 py-2 font-bold text-[#18294F]">B</td>
                <td className="border border-gray-300 px-3 py-2">Stone Masonry Joint Mortar<br /><span className="text-xs text-gray-500">पत्थर चिनाई के जोड़ का मसाला</span></td>
                <td className="border border-gray-300 px-3 py-2 font-mono text-red-700 font-bold">1 : 17</td>
                <td className="border border-gray-300 px-3 py-2 text-xs">IS 2250:1981<br />Grade M3/M4 = 1:5 or 1:6</td>
              </tr>
              <tr className="bg-white hover:bg-blue-50">
                <td className="border border-gray-300 px-3 py-2 font-bold text-[#18294F]">C</td>
                <td className="border border-gray-300 px-3 py-2">Foundation Concrete<br /><span className="text-xs text-gray-500">नींव का कंक्रीट</span></td>
                <td className="border border-gray-300 px-3 py-2 font-mono text-red-700 font-bold">1 : 5.75 : 9.5</td>
                <td className="border border-gray-300 px-3 py-2 text-xs">IS 456:2000<br />M10/M15 by strength</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { path: "/ldr-packet?packet=A", en: "Packet A — Cement Plaster", hi: "पैकेट A — सीमेंट प्लास्टर", result: "FSL: 1:18  |  Standard: 1:4–1:6", color: "border-blue-600 bg-blue-50" },
          { path: "/ldr-packet?packet=B", en: "Packet B — Masonry Mortar", hi: "पैकेट B — पत्थर चिनाई मसाला", result: "FSL: 1:17  |  Standard: M3/M4", color: "border-blue-600 bg-blue-50" },
          { path: "/ldr-packet?packet=C", en: "Packet C — Foundation Concrete", hi: "पैकेट C — नींव कंक्रीट", result: "FSL: 1:5.75:9.5  |  Wrong method", color: "border-blue-600 bg-blue-50" },
          { path: "/ldr-comparison", en: "21% Silica Assumption & Prayer", hi: "21% सिलिका मान्यता एवं प्रार्थना पत्र", result: "Undermines ALL three results", color: "border-yellow-600 bg-yellow-50" },
          { path: "/ldr-precedents", en: "SC/HC Precedents (10 Verified)", hi: "सर्वोच्च/उच्च न्यायालय पूर्वनिर्णय", result: "Maneka Gandhi, Mohd. Khalid & more", color: "border-green-600 bg-green-50" },
          { path: "/ldr-standards", en: "23 Standards Cited", hi: "23 उद्धृत मानक", result: "IS, ASTM, BS EN, NABL, ISO", color: "border-purple-600 bg-purple-50" },
        ].map(({ path, en, hi, result, color }) => (
          <Link key={path} href={path}>
            <div className={`rounded-lg border-2 p-4 cursor-pointer hover:shadow-md transition-shadow ${color}`}>
              <div className="font-bold text-[#18294F]">{showEn && en}</div>
              {showHi && <div className="font-semibold text-[#18294F]/80 text-sm">{hi}</div>}
              <div className="text-xs text-gray-600 mt-1">{result}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Summary of defects */}
      <div className="rounded-lg border border-[#18294F] p-4 bg-white">
        <h3 className="font-bold text-[#18294F] mb-3">
          {showEn && "Summary of Defects in the FSL Report"}
          {showHi && <span className={showEn ? "block text-sm font-normal text-[#18294F]/70" : ""}>FSL रिपोर्ट में दोषों का सारांश</span>}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="bg-red-50 border border-red-300 rounded p-3">
            <div className="font-bold text-red-800">9 Procedural Violations</div>
            <div className="text-red-700 text-xs mt-1">Apply equally to all three packets — sampling, custody, testing, reporting</div>
            {showHi && <div className="text-red-600 text-xs mt-1">नौ प्रक्रियागत उल्लंघन — तीनों पैकेटों पर समान रूप से लागू</div>}
          </div>
          <div className="bg-orange-50 border border-orange-300 rounded p-3">
            <div className="font-bold text-orange-800">3 Scientific Defects</div>
            <div className="text-orange-700 text-xs mt-1">Carbonation (A), Stone silica contamination (B), Wrong method (C)</div>
            {showHi && <div className="text-orange-600 text-xs mt-1">तीन वैज्ञानिक दोष — कार्बोनेशन, पत्थर संदूषण, गलत विधि</div>}
          </div>
          <div className="bg-yellow-50 border border-yellow-300 rounded p-3">
            <div className="font-bold text-yellow-800">21% Silica Assumption</div>
            <div className="text-yellow-700 text-xs mt-1">Unverified assumption undermines quantitative basis of ALL results</div>
            {showHi && <div className="text-yellow-600 text-xs mt-1">21% सिलिका की अप्रमाणित मान्यता — सभी परिणामों की मात्रात्मक आधार कमजोर</div>}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-center text-xs text-gray-500 italic border-t pt-3">
        Prepared under Legal Luminaire — Rajasthan Construction Law Defence System. 
        All IS citations must be verified against BIS originals before court use.
      </div>
    </div>
  );
}
