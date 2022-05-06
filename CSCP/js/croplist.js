const croplist = ["Almonds-Commercial","Almonds-Environmental","Apples-Commercial","Apples-Environmental","Artichokes","Asparagus","Aubergine","Barley","Beans-field","Beansgreen-runner-broad","Beans-mung","Beans-soya","Beech-Commercial","Beech-Environmental","Beetroot","Beets-Mangolds","Bilberries","Blackberries","BlackMedicks","Borage","Broccoli","Brusselssprouts","Cabbages","Calendula","Camelina","Canaryseed-ReedCanary","Cannabissativa","Carrots","Cauliflower","Celeriac","Celery","Chard","Cherries-Commercial","Cherries-Environmental","Chestnut-Commercial","Chestnut-Environmental","Chicory","Comfrey","Courgette","Currants","Daffodils","DouglasFir-Commercial","DouglasFir-Environmental","Echium","EveningPrimrose","Fennel","Flax","ForageRape","Garlic","Grapes","Greengage-Cherry-Commercial","Greengage-Cherry-Environmental","Hazelnut-Commercial","Hazelnut-Environmental","Herbageseed","Hops","Horseradish","Kale","Komatsuna","Lavender","Leafradish","Leeks","Lentils","Lettuce","Linseed","Lucerne","Lupins-sweet","Maize","Melons","Mibuna","Millet","Mint","Miscanthus","Mizuna","Mustard","NakedOats","NorwaySpruce-Commercial","NorwaySpruce-Environmental","Nuts-walnuts-Commercial","Nuts-walnuts-Environmental","Oats","Oilseedrape","Olives","Onions","Osiers-Commercial","Osiers-Environmental","PakChoi","Parsley","Parsnips","Pears","Peas","Plums-Damsons-Commercial","Plums-Damsons-Environmental","Poppy","Potatoes","Pulses","Radish","Raspberries","Rhubarb","Rocket","Rosemary","Roses","Rye","Saffron","Sage","SainFoin","Seedpotatoes","SessileOak-Commercial","SessileOak-Environmental","SilverBirch-Commercial","SilverBirch-Environmental","SitkaSpruce-Commercial","SitkaSpruce-Environmental","SpeltWheat","Spinach","Squash","Strawberries","Sugarbeet","Sunflowers","Swedes","Sweetcorn","Tea","Thyme","Trefoils-CommonBirdsfoot","Triticale","Tulips","Turnips","Typhon-Colza","Vetches","WesternRedCedar-Commercial","WesternRedCedar-Environmental","Wheat","WildCherry-Commercial","WildCherry-Environmental","Willow-Commercial","Willow-Environmental"];


function croplist_create_path(crop, date, scenario){
    var tiff_filename = date === "current" ?
	`${crop}_${date}_WGS84_clip_b1.tif` :
	`${crop}_${date}-${scenario}_WGS84_clip_b1.tif`;
    return tiff_filename;
}

// helper function to generate a HTML <select> from an array of crops 
var croplist2select = function(){
    var select_options = "";
    for (const cr of croplist){
	select_options += `<option value="${cr}">${cr}</option>\n`;
    }
    return select_options;
};

// HTML <select>
const croplist_html = `
<select id="crops" placeholder="enter a crop...">
    <option value="" selected>type in a crop name</option>
    <option value="Almonds-Commercial">Almonds-Commercial</option>
    <option value="Almonds-Environmental">Almonds-Environmental</option>
    <option value="Apples-Commercial">Apples-Commercial</option>
    <option value="Apples-Environmental">Apples-Environmental</option>
    <option value="Artichokes">Artichokes</option>
    <option value="Asparagus">Asparagus</option>
    <option value="Aubergine">Aubergine</option>
    <option value="Barley">Barley</option>
    <option value="Beans-field">Beans-field</option>
    <option value="Beansgreen-runner-broad">Beansgreen-runner-broad</option>
    <option value="Beans-mung">Beans-mung</option>
    <option value="Beans-soya">Beans-soya</option>
    <option value="Beech-Commercial">Beech-Commercial</option>
    <option value="Beech-Environmental">Beech-Environmental</option>
    <option value="Beetroot">Beetroot</option>
    <option value="Beets-Mangolds">Beets-Mangolds</option>
    <option value="Bilberries">Bilberries</option>
    <option value="Blackberries">Blackberries</option>
    <option value="BlackMedicks">BlackMedicks</option>
    <option value="Borage">Borage</option>
    <option value="Broccoli">Broccoli</option>
    <option value="Brusselssprouts">Brusselssprouts</option>
    <option value="Cabbages">Cabbages</option>
    <option value="Calendula">Calendula</option>
    <option value="Camelina">Camelina</option>
    <option value="Canaryseed-ReedCanary">Canaryseed-ReedCanary</option>
    <option value="Cannabissativa">Cannabissativa</option>
    <option value="Carrots">Carrots</option>
    <option value="Cauliflower">Cauliflower</option>
    <option value="Celeriac">Celeriac</option>
    <option value="Celery">Celery</option>
    <option value="Chard">Chard</option>
    <option value="Cherries-Commercial">Cherries-Commercial</option>
    <option value="Cherries-Environmental">Cherries-Environmental</option>
    <option value="Chestnut-Commercial">Chestnut-Commercial</option>
    <option value="Chestnut-Environmental">Chestnut-Environmental</option>
    <option value="Chicory">Chicory</option>
    <option value="Comfrey">Comfrey</option>
    <option value="Courgette">Courgette</option>
    <option value="Currants">Currants</option>
    <option value="Daffodils">Daffodils</option>
    <option value="DouglasFir-Commercial">DouglasFir-Commercial</option>
    <option value="DouglasFir-Environmental">DouglasFir-Environmental</option>
    <option value="Echium">Echium</option>
    <option value="EveningPrimrose">EveningPrimrose</option>
    <option value="Fennel">Fennel</option>
    <option value="Flax">Flax</option>
    <option value="ForageRape">ForageRape</option>
    <option value="Garlic">Garlic</option>
    <option value="Grapes">Grapes</option>
    <option value="Greengage-Cherry-Commercial">Greengage-Cherry-Commercial</option>
    <option value="Greengage-Cherry-Environmental">Greengage-Cherry-Environmental</option>
    <option value="Hazelnut-Commercial">Hazelnut-Commercial</option>
    <option value="Hazelnut-Environmental">Hazelnut-Environmental</option>
    <option value="Herbageseed">Herbageseed</option>
    <option value="Hops">Hops</option>
    <option value="Horseradish">Horseradish</option>
    <option value="Kale">Kale</option>
    <option value="Komatsuna">Komatsuna</option>
    <option value="Lavender">Lavender</option>
    <option value="Leafradish">Leafradish</option>
    <option value="Leeks">Leeks</option>
    <option value="Lentils">Lentils</option>
    <option value="Lettuce">Lettuce</option>
    <option value="Linseed">Linseed</option>
    <option value="Lucerne">Lucerne</option>
    <option value="Lupins-sweet">Lupins-sweet</option>
    <option value="Maize">Maize</option>
    <option value="Melons">Melons</option>
    <option value="Mibuna">Mibuna</option>
    <option value="Millet">Millet</option>
    <option value="Mint">Mint</option>
    <option value="Miscanthus">Miscanthus</option>
    <option value="Mizuna">Mizuna</option>
    <option value="Mustard">Mustard</option>
    <option value="NakedOats">NakedOats</option>
    <option value="NorwaySpruce-Commercial">NorwaySpruce-Commercial</option>
    <option value="NorwaySpruce-Environmental">NorwaySpruce-Environmental</option>
    <option value="Nuts-walnuts-Commercial">Nuts-walnuts-Commercial</option>
    <option value="Nuts-walnuts-Environmental">Nuts-walnuts-Environmental</option>
    <option value="Oats">Oats</option>
    <option value="Oilseedrape">Oilseedrape</option>
    <option value="Olives">Olives</option>
    <option value="Onions">Onions</option>
    <option value="Osiers-Commercial">Osiers-Commercial</option>
    <option value="Osiers-Environmental">Osiers-Environmental</option>
    <option value="PakChoi">PakChoi</option>
    <option value="Parsley">Parsley</option>
    <option value="Parsnips">Parsnips</option>
    <option value="Pears">Pears</option>
    <option value="Peas">Peas</option>
    <option value="Plums-Damsons-Commercial">Plums-Damsons-Commercial</option>
    <option value="Plums-Damsons-Environmental">Plums-Damsons-Environmental</option>
    <option value="Poppy">Poppy</option>
    <option value="Potatoes">Potatoes</option>
    <option value="Pulses">Pulses</option>
    <option value="Radish">Radish</option>
    <option value="Raspberries">Raspberries</option>
    <option value="Rhubarb">Rhubarb</option>
    <option value="Rocket">Rocket</option>
    <option value="Rosemary">Rosemary</option>
    <option value="Roses">Roses</option>
    <option value="Rye">Rye</option>
    <option value="Saffron">Saffron</option>
    <option value="Sage">Sage</option>
    <option value="SainFoin">SainFoin</option>
    <option value="Seedpotatoes">Seedpotatoes</option>
    <option value="SessileOak-Commercial">SessileOak-Commercial</option>
    <option value="SessileOak-Environmental">SessileOak-Environmental</option>
    <option value="SilverBirch-Commercial">SilverBirch-Commercial</option>
    <option value="SilverBirch-Environmental">SilverBirch-Environmental</option>
    <option value="SitkaSpruce-Commercial">SitkaSpruce-Commercial</option>
    <option value="SitkaSpruce-Environmental">SitkaSpruce-Environmental</option>
    <option value="SpeltWheat">SpeltWheat</option>
    <option value="Spinach">Spinach</option>
    <option value="Squash">Squash</option>
    <option value="Strawberries">Strawberries</option>
    <option value="Sugarbeet">Sugarbeet</option>
    <option value="Sunflowers">Sunflowers</option>
    <option value="Swedes">Swedes</option>
    <option value="Sweetcorn">Sweetcorn</option>
    <option value="Tea">Tea</option>
    <option value="Thyme">Thyme</option>
    <option value="Trefoils-CommonBirdsfoot">Trefoils-CommonBirdsfoot</option>
    <option value="Triticale">Triticale</option>
    <option value="Tulips">Tulips</option>
    <option value="Turnips">Turnips</option>
    <option value="Typhon-Colza">Typhon-Colza</option>
    <option value="Vetches">Vetches</option>
    <option value="WesternRedCedar-Commercial">WesternRedCedar-Commercial</option>
    <option value="WesternRedCedar-Environmental">WesternRedCedar-Environmental</option>
    <option value="Wheat">Wheat</option>
    <option value="WildCherry-Commercial">WildCherry-Commercial</option>
    <option value="WildCherry-Environmental">WildCherry-Environmental</option>
    <option value="Willow-Commercial">Willow-Commercial</option>
    <option value="Willow-Environmental">Willow-Environmental</option>
</select>
`;

export {croplist, croplist2select, croplist_create_path, croplist_html};
