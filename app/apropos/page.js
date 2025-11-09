import '../style/apropos.css';
import { INFORMATIONS } from '../constantes/infos.js';

export default function AProposPage() {
    
  return (
    <section className="apropos">
        <h1>Notre Histoire</h1>
        <p>Fabrice et Isabelle, ont vu leur vie transformée il y a deux ans et demi avec l&apos;arrivée de Twister, leur premier Berger Malinois. Ce qui a commencé comme une simple adoption est rapidement devenu une véritable passion : dressage, alimentation maison, activités sportives... Ils se sont investis corps et âme dans le bien-être et l&apos;épanouissement de leur compagnon. Puis Tchad, leur second Malinois, est venu agrandir la famille.</p>
        <h1>Le Déclic</h1>
        <p>Au fil des mois, Fabrice et Isabelle ont rapidement constaté les difficultés rencontrées par les passionnés et professionnels du secteur canin : infrastructures inadaptées, espaces extérieurs inutilisables par mauvais temps, équipements dispersés aux quatre coins de la région... Les séances d&apos;agility annulées à cause de la pluie, les déplacements interminables pour accéder à un tapis de course ou à une piscine pour chiens – ils l&apos;ont vécu, comme tant d&apos;autres.</p>
        <p>C&apos;est en discutant avec des professionnels du milieu – éducateurs, physiothérapeutes, toiletteurs – que l&apos;idée a germé : et si tout était réuni au même endroit ?</p>
        <h1>Notre Vision : {`${INFORMATIONS.name}`}</h1>
        <p>Le {`${INFORMATIONS.name}`} (pour Twister & Tchad) est né de cette ambition : créer un espace multidisciplinaire où professionnels et particuliers trouvent tout ce dont ils ont besoin, sous un même toit, accessible toute l&apos;année, quelles que soient les conditions météorologiques.</p>
        <p>Un lieu pensé par des passionnés, pour des passionnés. Un centre où la qualité des infrastructures rime avec flexibilité et accessibilité. Parce que nos compagnons à quatre pattes méritent le meilleur, et que ceux qui travaillent avec eux méritent des conditions optimales.</p>
        <p>{`${INFORMATIONS.name}`} – là où chaque chien trouve son bonheur, par tous les temps. 🐾</p>
    </section>
  );
}