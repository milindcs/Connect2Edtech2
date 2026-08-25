import FutureSkillsSection from "../sections/FutureSkillsSection.jsx";
import HowWeWorkSection from "../sections/HowWeWorkSection.jsx";
import WhyChooseSection from "../sections/WhyChooseSection.jsx";
import MentorsSection from "../sections/MentorsSection.jsx";
import SuccessStoriesSection from "../sections/SuccessStoriesSection.jsx";
import HiringPartnersSection from "../sections/HiringPartnersSection.jsx";
import ImpactImagesSection from "../sections/ImpactImagesSection.jsx";

import SectionShell from "./SectionShell.jsx";


/* ====================================================================== */
/* BOTTOM CONTENT                                                         */
/* ====================================================================== */

function BottomContent() {
  return (
    <main className="bottom-content">

      {/* Future Skills */}
      <SectionShell tone="grey">
        <FutureSkillsSection />
      </SectionShell>


      {/* How We Work */}
      <SectionShell tone="white">
        <HowWeWorkSection />
      </SectionShell>


      {/* Why Choose Us */}
      <SectionShell tone="grey">
        <WhyChooseSection />
      </SectionShell>


      {/* Mentors */}
      <SectionShell tone="white">
        <MentorsSection />
      </SectionShell>


      {/* Success Stories */}
      <SectionShell tone="grey">
        <SuccessStoriesSection />
      </SectionShell>


      {/* Hiring Partners */}
      <SectionShell tone="white">
        <HiringPartnersSection />
      </SectionShell>


      {/* Impact Images */}
      <SectionShell tone="white">
        <ImpactImagesSection />
      </SectionShell>

    </main>
  );
}


export default BottomContent;
