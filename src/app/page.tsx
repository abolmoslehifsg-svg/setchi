import { HomeHero } from "@/components/HomeHero";
import { TodayStyle } from "@/components/TodayStyle";
import { HomeSections } from "@/components/HomeSections";

export default function HomePage() {
  return (
    <div>
      <HomeHero />
      <TodayStyle />
      <HomeSections />
    </div>
  );
}
