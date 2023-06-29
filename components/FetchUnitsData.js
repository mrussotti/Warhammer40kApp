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


// sample output:
// Array [
//     Object {
//       "description": "Heavy Weapons Squads provide fire support for Astra Militarum infantry units.",
//       "gameData": Object {
//         "attacks": 1,
//         "ballisticSkill": 4,
//         "leadership": 6,
//         "movement": "6\"",
//         "points": 60,
//         "save": "5+",
//         "strength": 3,
//         "toughness": 3,
//         "weaponSkill": 4,
//         "wounds": 1,
//       },
//       "name": "Heavy Weapons Squad",
//     },
//     Object {
//       "description": "Special Weapons Squads are part of the Astra Militarum's specialized infantry and are tasked with carrying the regiment's heavy weaponry.",     
//       "gameData": Object {
//         "attacks": 1,
//         "ballisticSkill": 4,
//         "leadership": 6,
//         "movement": "6\"",
//         "points": 70,
//         "save": "5+",
//         "strength": 3,
//         "toughness": 3,
//         "weaponSkill": 4,
//         "wounds": 1,
//       },
//       "name": "Special Weapons Squad",
//     },
//     Object {
//       "description": "The Infantry Squad is the backbone of the Astra Militarum, and is invariably the most commonly deployed type of soldier.",
//       "gameData": Object {
//         "attacks": 1,
//         "ballisticSkill": 4,
//         "leadership": 6,
//         "movement": "6\"",
//         "points": 40,
//         "save": "5+",
//         "strength": 3,
//         "toughness": 3,
//         "weaponSkill": 4,
//         "wounds": 1,
//       },
//       "name": "Infantry Squad",
//     },
//   ]
