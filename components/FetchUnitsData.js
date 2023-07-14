import { useState, useEffect } from 'react';
import { db } from '../firebase';

const useFetchUnitsData = (armyId) => {
    const [isLoading, setIsLoading] = useState(true);
    const [unitsData, setUnitsData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const armySnapshot = await db.collection('Armies').doc(armyId).get();
                const armyData = armySnapshot.data();

                if(armyData){
                    const squads = armyData.units;
                    setUnitsData(squads);
                    //console.log(unitsData)
                    setIsLoading(false);
                }else{
                    setIsLoading(false);
                    throw new Error("No data found for this armyId.");
                }
            } catch (err) {
                console.error('Error while fetching units:', err);
                setError(err);
                setIsLoading(false);
            }
        };
        fetchUnits();
    }, [armyId]);


    return { isLoading, unitsData, error };
};

export default useFetchUnitsData;

//EXAMPLE OUTPUT:


// Array [
//     Object {
//       "faction": "Space Marines",
//       "id": "qn6fKvtD823KptBaPMWN",
//       "units": Array [
//         Object {
//           "abilities": Array [
//             "And They Shall Know No Fear",
//             "Combat Squads",
//             "Combat Tactics",
//           ],
//           "description": "Tactical Squads are the backbone of any Space Marine army. They hold ground; provide fire support; and even attack enemy lines.",
//           "gameData": Object {
//             "attacks": 1,
//             "ballisticSkill": 3,
//             "leadership": 7,
//             "movement": "6\"",
//             "points": 100,
//             "save": "3+",
//             "strength": 4,
//             "toughness": 4,
//             "weaponSkill": 3,
//             "wounds": 1,
//           },
//           "name": "Tactical Squad",
//           "wargear": Array [
//             Object {
//               "armorPenetration": 0,
//               "damage": 1,
//               "name": "Boltgun",
//               "range": "24\"",
//               "strength": 4,
//               "type": "Rapid Fire 1",
//             },
//             Object {
//               "armorPenetration": 0,
//               "damage": 1,
//               "name": "Bolt Pistol",
//               "range": "12\"",
//               "strength": 4,
//               "type": "Pistol 1",
//             },
//             Object {
//               "armorPenetration": 0,
//               "damage": 1,
//               "name": "Frag Grenades",
//               "range": "6\"",
//               "strength": 3,
//               "type": "Grenade D6",
//             },
//             Object {
//               "armorPenetration": -1,
//               "damage": "D3",
//               "name": "Krak Grenades",
//               "range": "6\"",
//               "strength": 6,
//               "type": "Grenade 1",
//             },
//           ],
//         },
//         Object {
//           "abilities": Array [
//             "And They Shall Know No Fear",
//             "Combat Squads",
//             "Combat Tactics",
//           ],
//           "description": "Tactical Squads are the backbone of any Space Marine army. They hold ground; provide fire support; and even attack enemy lines.",
//           "gameData": Object {
//             "attacks": 1,
//             "ballisticSkill": 3,
//             "leadership": 7,
//             "movement": "6\"",
//             "points": 100,
//             "save": "3+",
//             "strength": 4,
//             "toughness": 4,
//             "weaponSkill": 3,
//             "wounds": 1,
//           },
//           "name": "Tactical Squad",
//           "wargear": Array [
//             Object {
//               "armorPenetration": 0,
//               "damage": 1,
//               "name": "Boltgun",
//               "range": "24\"",
//               "strength": 4,
//               "type": "Rapid Fire 1",
//             },
//             Object {
//               "armorPenetration": 0,
//               "damage": 1,
//               "name": "Bolt Pistol",
//               "range": "12\"",
//               "strength": 4,
//               "type": "Pistol 1",
//             },
//             Object {
//               "armorPenetration": 0,
//               "damage": 1,
//               "name": "Frag Grenades",
//               "range": "6\"",
//               "strength": 3,
//               "type": "Grenade D6",
//             },
//             Object {
//               "armorPenetration": -1,
//               "damage": "D3",
//               "name": "Krak Grenades",
//               "range": "6\"",
//               "strength": 6,
//               "type": "Grenade 1",
//             },
//           ],
//         },
//       ],
//     },
//   ]
