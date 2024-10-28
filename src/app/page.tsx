// home page of user
import BannerIndex from "@/modules/banner/views";
import VehicleCards from "@/modules/cardsDisplay/views/index";
import Header from "@/modules/header/components/header";

export default function Home() {
  return (
    <>
    <Header/>
    <BannerIndex/>
    <VehicleCards/> 
   </>
  );
}
