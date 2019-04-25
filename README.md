# 8 best practices die we leerden op React Amsterdam 2019.

Bij Marlon is React ons frontend framework naar keuze. Sinds enkele jaren werken we ook met React Native om quality mobile apps af te leveren aan onze klanten.  Net zoals vorig jaar trokken enkele van onze Javascript developers naar Amsterdam om hun React & React Native skills bij te schaven.

In dit artikel leggen Thorr, Daniel & Nico in 8 puntjes uit wat ze precies bijgeleerd hebben in het React ecosysteem en waarom het voor ons en onze klanten van belang is.

## Les 1. Begrijp de abstracties die je dagelijks gebruikt.

In de eerste talk, getiteld ["Requisite React"](https://www.youtube.com/watch?v=tO8qHlr6Wqg), haalde [Kent C. Dodds](kentcdodds.com) aan hoe je een pak beter kan worden in het gebruiken van een tool of framework (in dit geval React) door een beter inzicht te krijgen in wat er precies voor jou geabstrageerd wordt.

Er zijn verschillende manieren om dit te doen. Zo kan je gemakkelijk een kijkje te nemen in de source code, of zien hoe compilers als [Babel](https://babeljs.io/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=MYewdgzgLgBAFgSwE4FMAmMC8MA8BDeVAM0wHI4ooAHCALgHp6B3FgOgFs8kAbcVgIxT0w3ALSD6AKxD8IUvADc8EYEgRUootCgUpeVFElIA-AOopSqeMgRgA5gEIc9PMaA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=true&targets=&version=7.4.3) bijvoorbeeld jsx code omzetten naar wat React under the hood voor jou doet:

```javascript
// JSX definitie
const jobs = <a href='https://www.marlon.be/nl-be/jobs/javascript-developer'>We're hiring!</a>;

// Vertaald door Babel:
var jobs = React.createElement(
  "a",
  {
    href: "https://www.marlon.be/nl-be/jobs/javascript-developer"
  },
  "We're hiring!"
);

// React.createElement geeft een Object terug:
console.log(jobs);
// {
//   type: "a",
//   key: null,
//   ref: null,
//   props: {
//      href: "https://www.marlon.be/nl-be/jobs/javascript-developer",
//      children: "We're hiring!"
//   },
//   _owner: null,
//   _store: {},
// }

// Conclusies:
// - 1e argument = DOM node type ('a')
// - 2e argument = alle props die je doorgeeft (href)
// - 3e argument = children ("We're hiring!")
// - children wordt uiteindelijk als prop toegevoegd aan het resulterend object
// - children kan dus in principe ook als prop gedefinieerd worden:

// Dus: 4 manieren om hetzelfde resultaat te krijgen:
ui = <div id="root">Hello world</div>;
ui = <div id="root" children="Hello world" />;
ui = React.createElement('div', {id: 'root', children: 'Hello world'});
ui = React.createElement('div', {id: 'root'}, 'Hello world');
```

Een andere tip die Kent aanhaalde was dat het belangrijk is de fundamenten te verstaan. Zo kan je beter afwegen of een bepaalde abstractie echt een meerwaarde biedt of niet. JQuery heeft bijvoorbeeld tegenwoordig ook weinig nut sinds de meeste features toch reeds door alle browser in vanilla Javascript ondersteund worden. Ook heeft het geen nut om Lodash / Underscore toe te voegen als je maar 1 of 2 functies ervan gebruikt.

Bij Marlon streven we er naar om indien mogelijk altijd zelf een utility te schrijven in plaats van een npm package te downloaden en die te gebruiken. Dat is ook hoe we als team en bedrijf beter worden in Javascript. Er zijn uiteraard gevallen waar dit niet evident is (Hier komen we ook later op terug in punt 5). In die gevallen krijgen we ook tijd om die abstractie verder te bestuderen. Een bezoek aan een React conferentie bijvoorbeeld.

Het resultaat? Code die zo veel mogelijk in eigen handen is en geschreven of gebruikt wordt door mensen met verstand van zaken. Developers die bijvoorbeeld makkelijker een eigen abstractielaag kunnen bedenken. Dankzij Kent's talk weten we dat we op deze manier goed bezig zijn en dit dus enkel maar moeten aanmoedigen.

## Les 2. Refactor waar nodig.

 In de opeenvolgende talk van [Siddharth Kshetrapal](), getiteld ["Refactoring React"](https://www.youtube.com/watch?v=2Dw8gA60d_k), leerden we hoe we "code smell" konden vermijden in React. Hoe Sid het uitlegde, betekent code smell niet persé dat er iets fout is met je React code, maar dat het lijkt alsof het wel zo kan zijn. Code smell kan op verschillende vlakken voorkomen.

Op DX (developer experience) niveau, kan code smell bijvoorbeeld betekenen dat een `<Toggle/>` component een `onToggle` of `onClick` handler heeft ipv de algemeen gekende `onChange` benaming. Een `onChange` wordt door veel developers gezien als de standaard voor zo'n zaken en is dus intuïtiever om te gebruiken als meest verwachte handler voor controls.

Op feature niveau is het eerder belangrijk dat je "feature envy" vermijdt. Dat wil zeggen dat je componenten best niet teveel bezig zijn met hoe de omringenge of child components werken. Zo vermijd je dat als je component in een andere context gebruikt wordt, het ineens niet meer werkt. Het omgekeerde kan ook: dat het component zelf moeilijk aan te passen is. Encapsuleer je componenten en optimaliseer ze voor mogelijke veranderingen van omgeving.

Een ander voorbeeld van code smell is het niet spreaden van props op single node componenten. Een single node component kan bijvoorbeeld zijn:

```javascript
const Form = (props) => {
  const { onSubmit, children } = props;
  // Enkel onSubmit en children worden doorgegeven aan <form>
  return (
      <form
        className='forms-apply' 
        onSubmit={onSubmit}
      >
        {children}
      </form>
  );
}
```

Het probleem met bovenstaand component is dat zaken die ingeburgerd zijn zoals het meegeven van een `id`, `className` of andere html attributen niet meer zal werken. Gelukkig kunnen we dit makkelijk oplossen door de resterende props wel toe te voegen aan het DOM element:

```javascript
const Form = (props) => {
  const { onSubmit, children, ...htmlAttributes } = props;
  // Optionele zaken als id, className, etc. worden nu ook toegepast
  return (
    <form
      className='forms-apply'
      onSubmit={onSubmit}
      {...htmlAttributes}
    >
      {children}
    </form> 
  );
}
```

In bovenstaande "oplossing" zittten we echter terug met een probleem. Er word al een standaard className toegekend, maar die wordt overschreven indien we ook een className aan `<Form/>` toevoegen. De oplossing is in dit geval om de standaard className te mergen met die uit de props:

```javascript
const Form = (props) => {
  const {
    onSubmit,
    children,
    className = '', // Default naar '' om optioneel te houden
    ...htmlAttributes, // Alle andere optionele attributes
  } = props;
  
  // Ken className prop pas toe na spreiden van de htmlAttributes om overschrijving te vermijden.
  // Uiteindelijke className bestaat nu uit de standaard klasse & optionele extra klasses.
  return (
    <form
      {...htmlAttributes}
      className={`forms-apply ${className}`}
      onSubmit={onSubmit}
    >
      {children}
    </form> 
  );
}
```

Daarbuiten werd vooral aangehaald dat veel van de ietwat hacky code smells tegenwoordig opgelost kunnen worden met React hooks. Het React team bij Facebook heeft met luisterend oor en wakende blik goed opgelet wat nu precies voor code smells kan zorgen in React apps en een api proberen zoeken die als alternatief kan dienen. React Hooks waren daarom ook de eindbestemming van Sid's voorbeeld component tijdens de talk.

Om te vermijden dat deze blogpost één grote wall of text & code wordt echter, hebben we al Sid's React refactoring tips hier voor je verzameld:

1. Vermijd lokale state wanneer je zaken uit props kan halen.
2. [Benoem je functies naar gedrag opv interactie, maar hou het intuïtief.](https://sid.studio/post/name-behaviors-not-interactions/)
3. Pas op met "Feature Envy".
4. [Rangschikking bij het doorgeven van props maakt een verschil.](https://sid.studio/post/order-of-props/)
5. Maak een keuze tussen `controlled` & `unconrolled` inputs
6. [Geef niet teveel verantwoordelijkheden aan je componenten.](https://sid.studio/post/apropcalypse/)
7. Higher Order Components kunnen voor naamconflicten zorgen.
8. [Gebruik `children` voor zaken als `message` / `title` props.](https://sid.studio/post/just-use-children/)
9. [Kies verstandig tussen `cloneElement` & `context`.](https://sid.studio/post/compound-components/)

Meer voorbeelden kan je vinden op [https://sid.studio/refactoring](https://sid.studio/refactoring).

## Les 3. React's kracht als design primitives.

Deze les is een mix tussen 2 talks. De eerste, getiteld ["A common design language"](https://www.youtube.com/watch?v=3ggoo6AH8Uo) door [Andrey Okonetchnikov](https://twitter.com/okonetchnikov), ging over de verschillende manieren van communicatie die we gebruiken om van concept tot design tot code te komen. Soms zijn er echter teveel manieren / tools of programmeertalen die deze communicatie moeilijk maken. De heilige graal van deze communicatie zou soms eerder gelimiteerd moeten worden, om te verzekeren dat iedereen in een team elkaar goed verstaat.

Een goed voorbeeld van zo'n limiet is volgens Andrey een "Design system". Zo'n systeem combineert regels omtrent typografie, witruimte, kleuren, enzoverder om die limieten op te leggen. Verder heb je nu een set van instructies om mee te geven aan alle betrokken partijen. Als UI de design taal voor digitale producten is, zijn componenten de ideale fit om als woorden te gebruiken in die taal.

Het probleem blijft echter dat designers en developers andere talen op zich spreken. Designers spreken met design tools & prototypes, waar developers praten in programmeertalen als html, css en javascript. Dit betekent uiteraard niet dat designers daarom moeten programmeren, of omgekeerd. De oplossing ligt hem eerder in de gelijkenissen te zoeken tussen de talen van designers en developers. En die overlap zijn UI primitives. De allerkleinste units / atomen die een UI kunnen opbouwen.

Binnen React denken we qua UI primitives voor tekst bijvoorbeeld aan `<Text>` jsx; Containers kunnen `<View>`'s zijn, afbeeldingen als `<Image>`, knoppen als `<Button>` & iconen als `<Icon>`. De props van deze primitieve componenten zorgen dan voor de nodige variaties zoals `<Text kind="danger">` & `<Button kind="primary">`. De eindoplossing zit hem volgens Andrey in het gebruiken van zo'n React componenten in design tools. Designers ontwerpen dan als het ware met componenten als universele design taal, en developers weten direct waarover het gaat.

### Ontwerpen met React

In de volgende talk, getiteld ["Designing with React"](https://www.youtube.com/watch?v=orPcyJMJh7Y), bouwde [Mark Dalgleish](https://twitter.com/markdalgleish) verder op wat Andrey vertelde over "Component driven design" en het ontwerpen in het finale medium. Hij haalde enkele react based  design tools als FramerX & React Sketch aan. Die laatste tool, ontwikkeld door AirBnB, biedt binnen Sketch de mogelijkheid om met React Native primitieven & componenten aan de slag te gaan.

Tien jaar geleden werd echter vermeden om direct met code te ontwerpen. Dit was vooral omdat code traag was. Als je een developer code liet typen op instructie van een designer die naast hun zit, zou deze laatste snel verveeld raken. Vandaag de dag is dit echter niet zo. Code voorbeelden kunnen tegenwoordig heel snel opgezet worden met tools als Codesandbox, en ook iteratie / variatie wordt heel makkelijk dankzij features als forking. Die variaties zijn op zich dan weer makkelijk deelbaar met andere betrokken partijen.

Hoe passen we echter diezelfde veranderingen toe op moderne design systemen? Hoe maken we component code vlugger beschikbaar voor designers, zonder eerst een resem aan libraries te moeten installeren en runnen in terminal? 

Seek, het bedrijf waar Mark voor werkt heeft met `Playroom` zelf ook zo'n React design tool ontworpen. De tool ziet er mischien uit als Sketch, maar de focus van Playroom ligt hem op jsx. Naast je preview van je design, zie je in een apart paneel ook live de code die het ontwerp opbouwt. Design kan binnen Playroom dus ook volledig in code gedaan worden binnen datzelfde paneel.

Het is zowel een code powered design tool als een design powered development tool. Belangrijker is dat het een formaat met zich meebrengt dat heel uitnodigend is voor zowel developers als non developers. Iets wat niet altijd even makkelijk is.

## Les 4. Pitfalls en performantie met serverside rendering.

Spreker [Håkon Gullord Krogh](https://www.youtube.com/watch?v=4KfAS3zrvX8&t=10991s) gaf een lightning talk over de mogelijke "Uncanny Valley" dat zich bij React server side rendered paginas voor kan doen. Eén van de voordelen van SSR React mag dan wel zijn dat de "time to first meaningful paint" sneller bereikt wordt, maar omdat de React bundle ingeladen moet zijn om interactie te voorzien, is er een timeframe waarbij zaken als buttons er wel staan, maar dus nog niet werken. Dit kan een groter probleem vormen dan langer wachten op je pagina. Gebruikers kunnen bijv. denken dat de pagina / website defect is en afhaken.

Een mogelijke oplossing is alvast om alles wat kan gebeuren aan de server kant, ook daar te laten gebeuren. Indien dit niet mogelijk is, kan code splitting per pagina er voor zorgen dat de tijd die in de "Uncanny valley" gespendeerd wordt verminderd. Maar best zorg je er voor dat buttons, etc. nog niet volledig interactief lijken tot die interacties effectief beschikbaar zijn.

[David Mark Clements](https://www.youtube.com/watch?v=FaJosYCMnRA) praatte dan over hoe je het server side renderen zelf kan versnellen. React SSR gebeurt uiteraard dankzij Node, wiens enige javascript thread geblokkeerd kan raken als er teveel requests / seconden zijn. Dit kan op zich voor andere problemen zorgen zoals een servercrash. Bijgevolg, hoe sneller je SSR afgehandeld wordt, hoe stabieler de server draait. Het versnellen van SSR kan volgens David gebeuren dankzij `esx`, een [tagged template literal](https://www.npmjs.com/package/esx) die tegengaat dat React de volledige object tree gaat opbouwen, wanneer we eigenlijk enkel maar de stringified html representatie van het component nodig hebben. Zo hou je de "tree" dus eigenlijk zo goed als plat ipv extreem genest in elkaar, wat een enorme performance boost kan betekenen.

`esx` kan voorlopig enkel gebruikt worden vanaf React versie 16.8 en Node v10. Het project staat ook nog wat in zijn kinderschoenen en wordt dus nog niet wijdgebruikt. Eens dit wel zo is, is dit dus zeker iets om te testen en eventueel te implementeren. 

## Les 5. Leer uit de fouten van anderen.

Spreker [Max Stoiber](https://mxstbr.com/) heeft op vrij jonge leeftijd al een interessant traject afgelegd in de React, JS en Open Source wereld. Zo was hij de core contributor van het veelgebruikte `styled-components` en verkocht hij recent zijn laatste startup aan Github. Maar desondanks is niet alles altijd van een leien dakje gelopen. De titel van zijn talk, ["Tech regrets at Spectrum"](https://www.youtube.com/watch?v=4KfAS3zrvX8&t=17600s), is dan ook niet geheel onverwacht. Max vertelde ons het verhaal van de initiële architecturale keuzes bij Spectrum, wat fout liep en welke lessen hij en zijn team daar uit geleerd hebben.

Max haalde als eerste puntje aan dat mobile first denken voor web, de vertaling naar de mobile app waar ze nu mee bezig zijn een pak makkelijker kon gemaakt hebben. Een ervaring geoptimaliseerd voor mobile op desktop gebruiken is verdraagbaar, maar omgekeerd niet. Als ze bovendien van in het begin `react-native-web` hadden gebruikt, zou het maken van een React Native app nu ook zoveel minder tijd in beslag nemen. Het is volgens Max daarom een goed idee om vooruit te denken en te optimaliseren voor aankomende veranderingen.

De initiële aanzet van Spectrum was opgesteld met Create React App. Echter hadden ze SSR nodig voor SEO optimalisatie, dus maakten ze de afweging tussen verdergaan met wat ze hadden (en dus het bouwen van hun eigen serverside renderer) of te gaan voor Next.js. Ze kozen voor hun eigen implementatie, maar om dat klaar genoeg te krijgen voor productie hebben ze veel tijd verloren. Dit komt omdat ze zelf alle logica en architectuur moesten voorzien om alles performant te houden. Next.js zou veel van deze zaken makkelijker gemaakt hebben en mochten ze opnieuw mogen kiezen was de keuze snel gemaakt. Je gebruikt dus best bestaande oplossingen voor problemen waar je zelf nog geen kennis van hebt.

De andere kant van het schoentje is dan weer dat bestaande oplossingen er misschien al zijn, maar dat de community size nog te klein is om de keuze te valideren. Zo kozen ze voor RethinkDB omdat deze changefeeds out of the box aanbood. Spectrum was een chat applicatie, dus voor hen betekende dit dat ze zelf geen PubSub systeem hoefden te schrijven. Diezelfde changefeeds blijken op een later stadium niet echt schaalbaar. Ze hadden veel database storingen en het debuggen ervan bleek moeilijk omdat er niet veel documentatie of mensen met dezelfde problemen waren. 

De keuzes voor React Native Web en Next.js voor SSR hielden dus steek dankzij de community size en omdat ze in grotere bedrijven ook gebruikt worden. Maar hadden ze eerder naar de community size van RethinkDB gekeken, zou het Spectrum team geweten hebben dat RethinkDB net geen ideale match was. Weeg daarom altijd je doorslaggevende architecturale keuzes goed af als het om core technologiën gaat.

## Les 6. Wat niet te delen bij cross platform React & React Native

[Ben Ellerby](https://twitter.com/benellerby), ["Sharing Code Between React and React-Native: What Not to Share"](https://www.youtube.com/watch?v=NCLkLCvpwm4&t=6291s)

(Kort ook: [Wouter van den Broek](https://github.com/wbroek), ["Building for a Bigger World Than Mobile"](https://www.youtube.com/watch?v=NCLkLCvpwm4&t=8150s))

## Les 7. Performance & Animaties in React Native.

[Anna Doubkova](https://twitter.com/lithinn), ["Practical Performance for React (Native)"](https://www.youtube.com/watch?v=jTdi9oTM22c)

[Vladimir Novick](https://twitter.com/vladimirnovick), ["Demystifying Complex Animations Creation Process in React Native"](https://www.youtube.com/watch?v=NCLkLCvpwm4&t=25644s)

## Les 8. Wat maakt een goeie Developer Experience?

Eén van de laatste talks werd gegeven door [Peggy Rayzis](https://twitter.com/peggyrayzis) van Apollo GraphQL. Haar talk, ["The GraphQL developer experience"](https://www.youtube.com/watch?v=qBla-jgNKZc), gaf een dieper inzicht in wat nu precies zorgt voor de positieve feedback van developers op het werken met GraphQL en alle tools daar rond. Voor Peggy naar Amsterdam vertrok, vroeg ze haar volgers op Twitter om op te sommen wat voor hun belangrijk is op DX vlak. Dit zijn de resultaten:

- Onopdringerig: Focus op code schrijven ipv tool pleasing.
- Voorspelbaarheid: Hints om je sneller op weg te helpen
- Onmiddelijke feedback: Waarschuwen als iets niet goed zit

Programmeurs houden van tools die problemen oplossen. Het probleem dat GraphQL oplost is dat data ophalen in React niet altijd de beste ervaring blijkt te zijn. De GraphQL tools zoals "The GraphQL Playground" (Graphiql) en VSCode plugins als `Apollo GraphQL`, zorgen er allemaal ervoor dat zo'n instant feedback loop mogelijk wordt. Ook het feit dat GraphQL op zich een beetje gezien kan worden als een contract tussen front-end en back-end, geeft meer vertrouwen als er changes gebeuren aan gelijk welk onderdeel van de app. Live previews en GraphQL code hinting / linting brengen je op tijd op de hoogte als iets niet meer klopt.

Ook bij Marlon proberen we deze tips & tricks toe te passen. Zo werken we voor sommige van onze laatste nieuwe projecten ook met GraphQL, automagisch gegenereerd component documentatie dankzij Storybook, Prettier voor automatisch je code te formatteren, ... Zowel eigen tools als andere DX-tools kunnen telkens voorgesteld worden. In team meetings bespreken we die tools en wordt ook de afweging gedaan of de DX en UX nog in balans zijn. Zo trachten we de Marlon Javascript Developer Experience steeds top te houden.

### Kom solliciteren en ervaar onze developer experience first-hand.

Heb je zelf een passie voor JS, een oog voor goede DX en UX en reeds kennis van React of React Native? Ben je bovendien op zoek naar een nieuwe uitdaging? Wij zijn vragende partij! Kom gerust eens langs voor een babbel in ons kantoor te Gent.

Meer info & vacature: [We're hiring! - Vacature JS Developer](https://www.marlon.be/nl-be/jobs/javascript-developer)
